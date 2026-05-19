export type GenesysRegion =
  | "us-east-1"    // mypurecloud.com
  | "us-west-2"    // usw2.pure.cloud
  | "eu-west-1"    // mypurecloud.ie
  | "eu-central-1" // mypurecloud.de
  | "eu-west-2"    // euw2.pure.cloud
  | "ap-southeast-2" // mypurecloud.com.au
  | "ap-northeast-1" // mypurecloud.jp
  | "ap-south-1"   // aps1.pure.cloud
  | "ca-central-1" // cac1.pure.cloud
  | "us-gov-west-1"; // use2.us-gov-pure.cloud

export const REGION_BASE_URLS: Record<GenesysRegion, string> = {
  "us-east-1":      "https://api.mypurecloud.com",
  "us-west-2":      "https://api.usw2.pure.cloud",
  "eu-west-1":      "https://api.mypurecloud.ie",
  "eu-central-1":   "https://api.mypurecloud.de",
  "eu-west-2":      "https://api.euw2.pure.cloud",
  "ap-southeast-2": "https://api.mypurecloud.com.au",
  "ap-northeast-1": "https://api.mypurecloud.jp",
  "ap-south-1":     "https://api.aps1.pure.cloud",
  "ca-central-1":   "https://api.cac1.pure.cloud",
  "us-gov-west-1":  "https://api.use2.us-gov-pure.cloud",
};

export const REGION_AUTH_URLS: Record<GenesysRegion, string> = {
  "us-east-1":      "https://login.mypurecloud.com",
  "us-west-2":      "https://login.usw2.pure.cloud",
  "eu-west-1":      "https://login.mypurecloud.ie",
  "eu-central-1":   "https://login.mypurecloud.de",
  "eu-west-2":      "https://login.euw2.pure.cloud",
  "ap-southeast-2": "https://login.mypurecloud.com.au",
  "ap-northeast-1": "https://login.mypurecloud.jp",
  "ap-south-1":     "https://login.aps1.pure.cloud",
  "ca-central-1":   "https://login.cac1.pure.cloud",
  "us-gov-west-1":  "https://login.use2.us-gov-pure.cloud",
};

export interface GenesysConfig {
  clientId: string;
  clientSecret: string;
  region: GenesysRegion;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ── User types ──────────────────────────────────────────────────────────────

export interface GenesysUser {
  id: string;
  name: string;
  email?: string;
  username?: string;
  department?: string;
  title?: string;
  state?: string;
  presence?: UserPresence;
  images?: Array<{ resolution: string; imageUri: string }>;
}

export interface UserPresence {
  presenceDefinition: { systemPresence: string; id: string };
  message?: string;
  modifiedDate?: string;
}

export interface UserListing {
  entities: GenesysUser[];
  pageSize: number;
  pageNumber: number;
  total: number;
}

// ── Conversation types ───────────────────────────────────────────────────────

export type MediaType = "voice" | "chat" | "email" | "message" | "callback" | "cobrowse" | "screenshare";

export interface ConversationParticipant {
  id: string;
  name?: string;
  purpose: string;
  state: string;
  direction?: string;
  queueId?: string;
  queueName?: string;
  userId?: string;
}

export interface Conversation {
  id: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  participants: ConversationParticipant[];
  divisions?: Array<{ id: string; name?: string }>;
}

export interface ConversationListing {
  entities: Conversation[];
  pageSize: number;
  pageNumber: number;
  total: number;
}

// ── Routing types ────────────────────────────────────────────────────────────

export interface Queue {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  userMemberCount?: number;
  skillBasedRouting?: boolean;
  state?: string;
}

export interface QueueListing {
  entities: Queue[];
  pageSize: number;
  pageNumber: number;
  total: number;
}

export interface QueueMember {
  id: string;
  name?: string;
  ringNumber?: number;
  joined?: boolean;
  user?: GenesysUser;
}

// ── Analytics types ──────────────────────────────────────────────────────────

export interface AnalyticsQueryPredicate {
  type: "dimension" | "metric" | "property";
  dimension?: string;
  operator: "matches" | "notMatches" | "lessThan" | "lessThanOrEqualTo" | "greaterThan" | "greaterThanOrEqualTo" | "notExists" | "exists";
  value?: string;
}

export interface AnalyticsQueryFilter {
  type: "and" | "or" | "not";
  predicates?: AnalyticsQueryPredicate[];
  clauses?: AnalyticsQueryFilter[];
}

export interface ConversationDetailsQuery {
  interval?: string;
  conversationFilters?: AnalyticsQueryFilter[];
  segmentFilters?: AnalyticsQueryFilter[];
  evaluationFilters?: AnalyticsQueryFilter[];
  mediaTypeFilters?: AnalyticsQueryFilter[];
  paging?: { pageSize: number; pageNumber: number };
  order?: "asc" | "desc";
  orderBy?: string;
}

export interface QueueObservationQuery {
  filter: AnalyticsQueryFilter;
  metrics?: string[];
  detailMetrics?: string[];
}

// ── Group types ──────────────────────────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  description?: string;
  type?: string;
  state?: string;
  memberCount?: number;
}

export interface GroupListing {
  entities: Group[];
  pageSize: number;
  pageNumber: number;
  total: number;
}

// ── Authorization types ──────────────────────────────────────────────────────

export interface AuthorizationRole {
  id: string;
  name: string;
  description?: string;
  default?: boolean;
  permissions?: string[];
  permissionPolicies?: Array<{ domain: string; entityName: string; actionSet: string[] }>;
}

export interface RoleListing {
  entities: AuthorizationRole[];
  pageSize: number;
  pageNumber: number;
  total: number;
}
