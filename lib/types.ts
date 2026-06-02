export type Destination = "google" | "activeDirectory";

export type EventType =
  | "idm-user-matched"
  | "idm-user-updated"
  | "idm-user-created"
  | "idm-user-deleted";

export interface ExternalId {
  type: string;
  customType: string;
  value: string;
}

export interface ReverseData {
  previous_org_unit?: string | null;
  previous_member_of?: string[] | null;
  custom_fields?: Record<string, unknown> | null;
}

/**
 * The parsed `content` object that lives inside the CSV `Data` column.
 * Every field that can appear is optional; Clever sends the full record
 * shape on every event, so most fields are present-but-null.
 */
export interface EventContent {
  clever_id?: string;
  completion_timestamp?: string;
  primary_email?: string | null;
  recovery_email?: string | null;
  recovery_phone?: string | null;
  user_type?: string;
  sis_id?: string;
  dest_id?: string | null;

  ad_dest_dn?: string | null;
  ad_sam_account_name?: string;
  ad_user_account_control?: string | null;

  org_unit?: string | null;
  member_of?: string[] | null;
  config_string?: string;

  password?: string | null;
  change_password_on_next_login?: boolean;
  change_password_on_next_clever_login?: boolean | null;
  change_password_on_next_external_login?: boolean | null;

  custom_fields?: Record<string, unknown> | null;
  external_ids?: ExternalId[] | null;
  organizations?: Array<Record<string, unknown>> | null;
  locations?: unknown[] | null;
  relations?: unknown[] | null;
  addresses?: unknown[] | null;
  phones?: unknown[] | null;

  account_claim_op?: {
    AccountClaim?: {
      cleverUserID?: string;
      districtID?: string;
      sourceID?: string;
      sourceType?: string;
      ttl?: number;
      createdAt?: string;
      updatedAt?: string;
    };
    AccountClaimAction?: number;
  } | null;

  needs_destination_update?: boolean;
  should_create_user_association?: boolean;
  should_overwrite_ad_sam_account_name?: boolean;

  reverse_data?: ReverseData | null;

  [key: string]: unknown;
}

export interface IdmEvent {
  id: string;
  timestamp: string;
  eventType: EventType;
  username: string;
  userType: string;
  destination: Destination;
  content: EventContent;
}
