

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

import { apiRequest, endpoints } from "./endpoints";

export type BroadcastTargetAudience =
  | "all_users"
  | "all_schools"
  | "faculty_only"
  | "parents";

export type BroadcastStatus = "sent" | "draft" | "scheduled" | "failed";

export interface CreateBroadcastPayload {
  title: string;
  content: string;
  targetAudience: BroadcastTargetAudience;
  isUrgent: boolean;
  /** When true the broadcast is saved as a draft instead of being sent immediately */
  saveAsDraft?: boolean;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface BroadcastData {
  id: string;
  title: string;
  content: string;
  targetAudience: BroadcastTargetAudience;
  isUrgent: boolean;
  type: string;
  status: BroadcastStatus;
  deliveredCount: number;
  openedCount: number;
  failedCount: number;
  sentAt: string | null;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
  admin?: unknown | null;
}

export interface BroadcastMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchBroadcastsResponse {
  message: string;
  data: BroadcastData[];
  meta: BroadcastMeta;
}

export interface BroadcastStatsData {
  totalSent: number;
  avgOpenRate: number;
  scheduled: number;
  draft: number;
}

export interface BroadcastStatsResponse {
  message: string;
  data: BroadcastStatsData;
}

export interface BroadcastResponse {
  message: string;
  data: BroadcastData;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetch all broadcasts (paginated).
 * GET /admin/broadcasts
 */
export async function fetchAllBroadcasts(
  authToken?: string,
  params?: { page?: number; limit?: number }
): Promise<FetchBroadcastsResponse> {
  const url = new URL(endpoints.notifications.all);

  if (params?.page !== undefined)
    url.searchParams.set("page", String(params.page));
  if (params?.limit !== undefined)
    url.searchParams.set("limit", String(params.limit));

  return apiRequest<FetchBroadcastsResponse>(url.toString(), {
    authToken,
  });
}

/**
 * Fetch broadcast statistics.
 * GET /admin/broadcasts/stats
 */
export async function fetchBroadcastStats(
  authToken?: string
): Promise<BroadcastStatsResponse> {
  return apiRequest<BroadcastStatsResponse>(endpoints.notifications.stats, {
    authToken,
  });
}

/**
 * Create and optionally send a broadcast.
 * POST /admin/broadcasts
 */
export async function createBroadcast(
  payload: CreateBroadcastPayload,
  authToken?: string
): Promise<BroadcastResponse> {
  return apiRequest<BroadcastResponse>(endpoints.notifications.create, {
    method: "POST",
    body: payload,
    authToken,
  });
}

/**
 * Resend an existing broadcast.
 * POST /admin/broadcasts/:broadcastId/resend
 */
export async function resendBroadcast(
  broadcastId: string,
  authToken?: string
): Promise<BroadcastResponse> {
  return apiRequest<BroadcastResponse>(
    endpoints.notifications.resend(broadcastId),
    {
      method: "POST",
      authToken,
    }
  );
}