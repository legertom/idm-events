import type { IdmEvent } from "./types";
import { destinationLabel, getOrgUnit, shortOu } from "./events";

export interface DestStyle {
  label: string;
  chip: string;
  dot: string;
  rail: string;
}

export function destStyle(e: IdmEvent): DestStyle {
  if (e.destination === "google") {
    return {
      label: "Google",
      chip: "bg-sky-100 text-sky-800",
      dot: "bg-sky-500",
      rail: "bg-sky-200",
    };
  }
  return {
    label: "Active Directory",
    chip: "bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
    rail: "bg-violet-200",
  };
}

export function eventTypeChip(e: IdmEvent): string {
  return e.eventType === "idm-user-matched"
    ? "bg-slate-200 text-slate-700"
    : "bg-brand-100 text-brand-700";
}

export type OuTone = "bad" | "good" | "neutral";

export function ouTone(ou: string | null): OuTone {
  if (!ou) return "neutral";
  if (ou === "*Restricted") return "bad";
  return "neutral";
}

/** A short, human sentence describing what this event did. */
export function summarize(e: IdmEvent): string {
  if (e.eventType === "idm-user-matched") {
    return `Linked a ${destinationLabel(e.destination)} account`;
  }
  if (e.content.password === "redacted") return "Pushed a password";
  if (e.content.account_claim_op) {
    const action = e.content.account_claim_op.AccountClaimAction;
    return `Account-claim step (action ${action})`;
  }
  const ou = shortOu(getOrgUnit(e));
  if (ou) return `Placed in ${ou}`;
  return "Attribute update";
}
