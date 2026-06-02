import Link from "next/link";
import { Quiz } from "@/components/Quiz";

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <Link href="/" className="hover:text-brand-700">
            Course
          </Link>
          <span>/</span>
          <span>Final quiz</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          Final quiz
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ink-soft">
          Five questions — three recall, two real scenarios, and one short answer
          you grade yourself. Pick your answers, then submit to see your score and
          a full answer key. Retake it as many times as you like.
        </p>
      </div>

      <Quiz />

      <div className="border-t border-slate-200 pt-6 text-sm">
        <Link
          href="/cheat-sheet"
          className="focus-ring rounded-lg font-medium text-brand-700 hover:underline"
        >
          Keep the one-page cheat sheet handy →
        </Link>
      </div>
    </div>
  );
}
