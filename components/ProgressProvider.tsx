"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "idm-course-progress-v1";

interface ProgressState {
  completed: string[];
  quizBest: number | null;
}

interface ProgressContextValue {
  completed: Set<string>;
  quizBest: number | null;
  isComplete: (id: string) => boolean;
  toggle: (id: string) => void;
  markComplete: (id: string) => void;
  recordQuiz: (score: number) => void;
  reset: () => void;
  hydrated: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function load(): ProgressState {
  if (typeof window === "undefined") return { completed: [], quizBest: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], quizBest: null };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      quizBest: typeof parsed.quizBest === "number" ? parsed.quizBest : null,
    };
  } catch {
    return { completed: [], quizBest: null };
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [quizBest, setQuizBest] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const state = load();
    setCompleted(new Set(state.completed));
    setQuizBest(state.quizBest);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: ProgressState = {
      completed: Array.from(completed),
      quizBest,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable; progress just won't persist */
    }
  }, [completed, quizBest, hydrated]);

  const isComplete = useCallback((id: string) => completed.has(id), [completed]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const recordQuiz = useCallback((score: number) => {
    setQuizBest((prev) => (prev === null ? score : Math.max(prev, score)));
  }, []);

  const reset = useCallback(() => {
    setCompleted(new Set());
    setQuizBest(null);
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed,
      quizBest,
      isComplete,
      toggle,
      markComplete,
      recordQuiz,
      reset,
      hydrated,
    }),
    [completed, quizBest, isComplete, toggle, markComplete, recordQuiz, reset, hydrated],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
