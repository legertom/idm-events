import type { EventContent, ExternalId, IdmEvent } from "./types";
import {
  AD_CONFIG_STRING,
  GOOGLE_CONFIG_BROKEN,
  GOOGLE_CONFIG_FIXED,
} from "./config-string";

/**
 * Anonymized worked example.
 *
 * This is a real Clever IDM events export with all identifying values
 * replaced: the teacher is the fictional "Jordan Avery", the district domain
 * is the reserved-for-documentation `maplewood.example.org`, and every
 * internal ID (Clever ID, dest IDs, SIS ID, district/source IDs, hashes) is a
 * fake but structurally valid stand-in. Timestamps, building codes, and OU
 * names are kept because the lesson depends on them and they are not
 * identifying once the person and district are scrubbed.
 */
const ANON = {
  cleverId: "64f9a1c2e8b7d3046a5f9e10",
  email: "jordan.avery@maplewood.example.org",
  emailMixed: "Jordan.Avery@maplewood.example.org",
  sam: "jordan.avery",
  sisId: "28471",
  districtId: "5c0a1b2d3e4f5a6b7c8d9e0f",
  googleDestId: "102938475610293847561",
  adDestId: "a1b2c3d4e5f60718293a4b5c6d7e8f90",
  adDnEarly:
    "CN=Jordan.Avery,OU=SouthWest,OU=Staff,OU=AllUsers,DC=maplewood,DC=example,DC=org",
  adDnLate:
    "CN=Jordan.Avery,OU=Southwest,OU=AL-Staff,OU=AL-Users,DC=maplewood,DC=example,DC=org",
  sourceId1: "7b3c1d2e-4f5a-4b6c-8d7e-9f0a1b2c3d4e",
  sourceId2: "2a9b8c7d-6e5f-4a3b-9c2d-1e0f3a4b5c6d",
};

const STAFF_GROUP_ALL =
  "CN=All-Staff,OU=*Staff Groups,OU=AL-Staff,OU=AL-Users,DC=maplewood,DC=example,DC=org";
const STAFF_GROUP_SW =
  "CN=SW-Staff,OU=*Staff Groups,OU=AL-Staff,OU=AL-Users,DC=maplewood,DC=example,DC=org";

const EXTERNAL_IDS: ExternalId[] = [
  { customType: "pk", type: "custom", value: "4021" },
  { customType: "UserType", type: "custom", value: "2" },
  { customType: "ImageHash", type: "custom", value: "" },
  { customType: "Updated", type: "custom", value: "9F2C7A11D4E8B6035CA19E72FD40B8AE" },
  { customType: "LastTouched", type: "custom", value: "9/1/2024 8:15:02 AM" },
];

/** Full record shape Clever sends every time — most fields present-but-null. */
function base(timestamp: string, destId: string | null): EventContent {
  return {
    ad_dest_dn: null,
    ad_user_account_control: null,
    addresses: null,
    clever_id: ANON.cleverId,
    completion_timestamp: timestamp,
    dest_id: destId,
    external_ids: null,
    locations: null,
    member_of: null,
    needs_destination_update: false,
    organizations: null,
    password: null,
    phones: null,
    primary_email: ANON.email,
    recovery_email: null,
    recovery_phone: null,
    relations: null,
    reverse_data: { previous_member_of: null },
    should_overwrite_ad_sam_account_name: false,
    sis_id: ANON.sisId,
    user_type: "teacher",
  };
}

/** Authored oldest → newest (the order the story actually happened). */
export const EVENTS_OLDEST_FIRST: IdmEvent[] = [
  {
    id: "ev01",
    timestamp: "2025-07-15T16:24:35.000Z",
    eventType: "idm-user-matched",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-07-15T16:24:35.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      should_create_user_association: true,
    },
  },
  {
    id: "ev02",
    timestamp: "2025-08-08T15:46:43.000Z",
    eventType: "idm-user-matched",
    username: ANON.emailMixed,
    userType: "teacher",
    destination: "activeDirectory",
    content: {
      ...base("2025-08-08T15:46:43.000Z", ANON.adDestId),
      ad_dest_dn: ANON.adDnEarly,
      primary_email: ANON.emailMixed,
      change_password_on_next_login: false,
      config_string: "claimAvailable=true;",
      should_create_user_association: true,
      account_claim_op: {
        AccountClaim: {
          cleverUserID: ANON.cleverId,
          createdAt: "0001-01-01T00:00:00.000Z",
          districtID: ANON.districtId,
          sourceID: ANON.sourceId1,
          sourceType: "IDM",
          ttl: 1755531994,
          updatedAt: "0001-01-01T00:00:00.000Z",
        },
        AccountClaimAction: 1,
      },
    },
  },
  {
    id: "ev03",
    timestamp: "2025-08-12T17:07:47.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-08-12T17:07:47.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      config_string: "password=[redacted];",
      password: "redacted",
      needs_destination_update: true,
    },
  },
  {
    id: "ev04",
    timestamp: "2025-08-12T17:17:53.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-08-12T17:17:53.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      config_string: "claimAvailable=true;",
      account_claim_op: {
        AccountClaim: {
          cleverUserID: ANON.cleverId,
          createdAt: "0001-01-01T00:00:00.000Z",
          districtID: ANON.districtId,
          sourceID: ANON.sourceId2,
          sourceType: "IDM",
          ttl: 1755883071,
          updatedAt: "0001-01-01T00:00:00.000Z",
        },
        AccountClaimAction: 0,
      },
    },
  },
  {
    id: "ev05",
    timestamp: "2025-08-13T01:21:14.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-08-13T01:21:14.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      config_string: "claimAvailable=true;",
      account_claim_op: {
        AccountClaim: {
          cleverUserID: ANON.cleverId,
          createdAt: "0001-01-01T00:00:00.000Z",
          districtID: ANON.districtId,
          sourceID: ANON.sourceId2,
          sourceType: "IDM",
          ttl: 1755912072,
          updatedAt: "0001-01-01T00:00:00.000Z",
        },
        AccountClaimAction: 0,
      },
    },
  },
  {
    id: "ev06",
    timestamp: "2025-08-18T23:33:03.000Z",
    eventType: "idm-user-matched",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-08-18T23:33:03.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      config_string: "claimAvailable=true;",
      should_create_user_association: true,
      account_claim_op: {
        AccountClaim: {
          cleverUserID: ANON.cleverId,
          createdAt: "0001-01-01T00:00:00.000Z",
          districtID: ANON.districtId,
          sourceID: ANON.sourceId2,
          sourceType: "IDM",
          ttl: 1756423981,
          updatedAt: "0001-01-01T00:00:00.000Z",
        },
        AccountClaimAction: 1,
      },
    },
  },
  {
    id: "ev07",
    timestamp: "2025-09-02T21:38:20.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2025-09-02T21:38:20.000Z", ANON.googleDestId),
      change_password_on_next_login: false,
      org_unit: "/AllUsers/Staff/SouthWest",
      external_ids: EXTERNAL_IDS,
      custom_fields: { department: ["User-(default)"] },
      organizations: [
        { customType: "CleverIDM", department: "User-(default)" },
        { customType: "", department: "User-(default)" },
      ],
      needs_destination_update: true,
      reverse_data: {
        custom_fields: { department: [] },
        previous_member_of: null,
        previous_org_unit: "/AllUsers/Staff/SouthWest",
      },
    },
  },
  {
    id: "ev08",
    timestamp: "2025-09-02T21:54:27.000Z",
    eventType: "idm-user-updated",
    username: ANON.emailMixed,
    userType: "teacher",
    destination: "activeDirectory",
    content: {
      ...base("2025-09-02T21:54:27.000Z", ANON.adDestId),
      ad_dest_dn: ANON.adDnLate,
      ad_sam_account_name: ANON.sam,
      primary_email: ANON.emailMixed,
      change_password_on_next_login: false,
      org_unit: "/AL-Users/AL-Staff/Southwest",
      config_string: AD_CONFIG_STRING,
      custom_fields: { homeDrive: ["Z"] },
      needs_destination_update: true,
      reverse_data: {
        custom_fields: { homeDrive: ["Z:"] },
        previous_member_of: null,
        previous_org_unit: "/AllUsers/Staff/SouthWest",
      },
    },
  },
  {
    id: "ev09",
    timestamp: "2026-05-28T15:22:10.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2026-05-28T15:22:10.000Z", ANON.googleDestId),
      change_password_on_next_clever_login: null,
      change_password_on_next_external_login: null,
      org_unit: "/AllUsers/Staff/*Restricted",
      config_string: GOOGLE_CONFIG_BROKEN,
      external_ids: EXTERNAL_IDS,
      needs_destination_update: true,
      reverse_data: {
        previous_member_of: null,
        previous_org_unit: "/AllUsers/Staff/SouthWest",
      },
    },
  },
  {
    id: "ev10",
    timestamp: "2026-05-28T15:30:51.000Z",
    eventType: "idm-user-updated",
    username: ANON.emailMixed,
    userType: "teacher",
    destination: "activeDirectory",
    content: {
      ...base("2026-05-28T15:30:51.000Z", ANON.adDestId),
      ad_dest_dn: ANON.adDnLate,
      ad_sam_account_name: ANON.sam,
      primary_email: ANON.emailMixed,
      change_password_on_next_clever_login: null,
      change_password_on_next_external_login: null,
      org_unit: "/AL-Users/AL-Staff/*Restricted",
      config_string: AD_CONFIG_STRING,
      member_of: [STAFF_GROUP_ALL],
      needs_destination_update: true,
      reverse_data: {
        previous_member_of: [STAFF_GROUP_ALL, STAFF_GROUP_SW],
        previous_org_unit: "/AL-Users/AL-Staff/Southwest",
      },
    },
  },
  {
    id: "ev11",
    timestamp: "2026-06-01T17:22:11.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2026-06-01T17:22:11.000Z", ANON.googleDestId),
      change_password_on_next_clever_login: null,
      change_password_on_next_external_login: null,
      org_unit: "/AllUsers/Staff/*Restricted",
      config_string: GOOGLE_CONFIG_BROKEN,
      external_ids: EXTERNAL_IDS,
      needs_destination_update: true,
      reverse_data: {
        previous_member_of: null,
        previous_org_unit: "/AllUsers/Staff/Brookside",
      },
    },
  },
  {
    id: "ev12",
    timestamp: "2026-06-01T19:59:13.000Z",
    eventType: "idm-user-updated",
    username: ANON.email,
    userType: "teacher",
    destination: "google",
    content: {
      ...base("2026-06-01T19:59:13.000Z", ANON.googleDestId),
      change_password_on_next_clever_login: null,
      change_password_on_next_external_login: null,
      org_unit: "/AllUsers/Staff/HighSchool",
      config_string: GOOGLE_CONFIG_FIXED,
      external_ids: EXTERNAL_IDS,
      needs_destination_update: true,
      reverse_data: {
        previous_member_of: null,
        previous_org_unit: "/AllUsers/Staff/Brookside",
      },
    },
  },
];

export const EVENTS_NEWEST_FIRST: IdmEvent[] = [...EVENTS_OLDEST_FIRST].reverse();

export const ANON_IDENTITY = {
  name: "Jordan Avery",
  email: ANON.email,
  cleverId: ANON.cleverId,
  sisId: ANON.sisId,
  exportFileName: "events_export_2026-06-01T22_13_39Z.csv",
};

// ---- Small selectors the UI leans on -------------------------------------

export function getOrgUnit(e: IdmEvent): string | null {
  return (e.content.org_unit as string | null | undefined) ?? null;
}

export function getPreviousOrgUnit(e: IdmEvent): string | null {
  return e.content.reverse_data?.previous_org_unit ?? null;
}

export function shortOu(ou: string | null): string | null {
  if (!ou) return null;
  const parts = ou.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? ou;
}

export function destinationLabel(d: IdmEvent["destination"]): string {
  return d === "google" ? "Google" : "Active Directory";
}

export function eventTypeLabel(t: IdmEvent["eventType"]): string {
  switch (t) {
    case "idm-user-matched":
      return "Matched";
    case "idm-user-updated":
      return "Updated";
    case "idm-user-created":
      return "Created";
    case "idm-user-deleted":
      return "Deleted";
  }
}

export function prettyJson(content: EventContent): string {
  return JSON.stringify(content, null, 2);
}
