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
    def: "The default catch-all OU used when no config_string rule matches the incoming code.",
  },
  { term: "config_string", def: "The template that drives OU placement." },
  {
    term: "Match vs. update",
    def: "Match links a user to a destination account; update pushes a change to a linked account.",
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
