/**
 * The OU-mapping template that drives `org_unit` placement.
 *
 * The real export showed two Google syncs minutes apart: the first landed the
 * user in `*Restricted`, the second in `HighSchool`. The difference was the
 * template — the broken version was MISSING the rule for building code "340"
 * and had a syntax slip where the last value and the `*Restricted` fallback
 * ran together with no space. This file reproduces both so learners can watch
 * the same code resolve differently.
 */

export interface OuRule {
  code: string;
  name: string;
}

/** Google staff template, corrected version (note "340" → HighSchool). */
export const GOOGLE_RULES_FIXED: OuRule[] = [
  { code: "350", name: "ALC" },
  { code: "005", name: "Brookside" },
  { code: "111", name: "Brookside" },
  { code: "380", name: "Brookside" },
  { code: "006", name: "Community Education" },
  { code: "007", name: "DO-Office" },
  { code: "010", name: "Tech-Staff" },
  { code: "008", name: "Food Service" },
  { code: "110", name: "Maple" },
  { code: "120", name: "Oak" },
  { code: "310", name: "HighSchool" },
  { code: "130", name: "Cedar" },
  { code: "104", name: "School-Board-Members" },
  { code: "140", name: "Birch" },
  { code: "320", name: "SouthWest" },
  { code: "009", name: "Special Services" },
  { code: "998", name: "Subs" },
  { code: "999", name: "Misc Users" },
  { code: "340", name: "HighSchool" },
];

/** Same template BEFORE the fix — the "340" rule is missing. */
export const GOOGLE_RULES_BROKEN: OuRule[] = GOOGLE_RULES_FIXED.filter(
  (r) => r.code !== "340",
);

export const RESTRICTED = "*Restricted";
export const GOOGLE_OU_PREFIX = "/AllUsers/Staff/";

/** The building code on Jordan's roster record (resolves to HighSchool once fixed). */
export const JORDAN_OU_CODE = "340";

/**
 * Resolve a building code to an OU name the way the template does:
 * first matching `if equals` rule wins; otherwise fall through to *Restricted.
 */
export function resolveOu(code: string, rules: OuRule[]): string {
  const match = rules.find((r) => r.code === code.trim());
  return match ? match.name : RESTRICTED;
}

/** Render rules into the literal `config_string` text Clever stores. */
export function renderConfigString(
  rules: OuRule[],
  opts: { prefix?: string; broken?: boolean } = {},
): string {
  const prefix = opts.prefix ?? GOOGLE_OU_PREFIX;
  const body = rules
    .map((r) => `if equals teacher.ext.ou_account "${r.code}" "${r.name}"`)
    .join(" ");
  // The "broken" template runs the last value straight into the fallback.
  const tail = opts.broken ? `"${RESTRICTED}"` : ` "${RESTRICTED}"`;
  return `orgunit=${prefix}{{${body}${tail}}};`;
}

export const GOOGLE_CONFIG_FIXED = renderConfigString(GOOGLE_RULES_FIXED);
export const GOOGLE_CONFIG_BROKEN = renderConfigString(GOOGLE_RULES_BROKEN, {
  broken: true,
});

/** The Active Directory staff template (shown as-is on AD events). */
export const AD_CONFIG_STRING =
  'orgunit=/AL-Users/AL-Staff/{{if equals teacher.ext.ou_account "110" "Maple" ' +
  'if equals teacher.ext.ou_account "120" "Oak" if equals teacher.ext.ou_account "130" "Cedar" ' +
  'if equals teacher.ext.ou_account "140" "Birch" if equals teacher.ext.ou_account "320" "Southwest" ' +
  'if equals teacher.ext.ou_account "310" "High School" if equals teacher.ext.ou_account "350" "ALC" ' +
  'if equals teacher.ext.ou_account "005" "Brookside" if equals teacher.ext.ou_account "007" "District Office" ' +
  'if equals teacher.ext.ou_account "006" "Community Education" if equals teacher.ext.ou_account "111" "Brookside" ' +
  'if equals teacher.ext.ou_account "104" "School Board" if equals teacher.ext.ou_account "009" "Special Services" ' +
  'if equals teacher.ext.ou_account "008" "Food Service" if equals teacher.ext.ou_account "999" "Misc Users" ' +
  '"*Restricted"}};';
