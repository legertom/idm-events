export interface GlossaryItem {
  term: string;
  def: string;
}

export const GLOSSARY: GlossaryItem[] = [
  { term: "IDM", def: "Clever's identity-management / sync product." },
  {
    term: "Destination",
    def: "An external system Clever writes to — Google or Active Directory.",
  },
  { term: "OU (organizational unit)", def: "The folder an account lives in." },
  {
    term: "*Restricted",
    def: "This example district's catch-all OU — where accounts land when no config_string rule matches. The name (and whether one exists) varies by district.",
  },
  { term: "config_string", def: "The template that drives OU placement." },
  {
    term: "Match",
    def: "idm-user-matched — Clever found a destination account and linked it to the Clever user.",
  },
  {
    term: "Update",
    def: "idm-user-updated — Clever pushed a change to an already-linked account.",
  },
  {
    term: "Account claim",
    def: "The flow to claim / activate a destination account.",
  },
  {
    term: "reverse_data",
    def: "The 'before' snapshot — the values that were in place prior to this change.",
  },
  {
    term: "SIS ID",
    def: "The user's ID in the district roster (the SIS) — the source of truth.",
  },
  {
    term: "needs_destination_update",
    def: "true means a change is still queued to write out to the destination.",
  },
];
