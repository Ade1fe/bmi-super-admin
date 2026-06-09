import { apiRequest, endpoints } from "./endpoints";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  saveAsDraft?: boolean;
}

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
const DEBUG = true;

function log(tag: string, data?: unknown) {
  if (!DEBUG) return;
  console.log(`[broadcast-api] ${tag}`, data ?? "");
}

function logError(tag: string, error: unknown) {
  console.error(`[broadcast-api ERROR] ${tag}`, error);
}

/** GET /admin/broadcasts */
export async function fetchAllBroadcasts(
  authToken?: string,
  params?: { page?: number; limit?: number }
): Promise<FetchBroadcastsResponse> {
  const url = new URL(endpoints.notifications.all);

  if (params?.page !== undefined)
    url.searchParams.set("page", String(params.page));

  if (params?.limit !== undefined)
    url.searchParams.set("limit", String(params.limit));

  log("fetchAllBroadcasts() called", {
    url: url.toString(),
    params,
  });

  try {
    const res = await apiRequest<FetchBroadcastsResponse>(url.toString(), {
      authToken,
    });

    log("fetchAllBroadcasts() response", res);
    log("fetchAllBroadcasts() count", res.data?.length);

    return res;
  } catch (err) {
    logError("fetchAllBroadcasts() failed", err);
    throw err;
  }
}
/** GET /admin/broadcasts/stats */
export async function fetchBroadcastStats(
  authToken?: string
): Promise<BroadcastStatsResponse> {
  log("fetchBroadcastStats() called");

  try {
    const res = await apiRequest<BroadcastStatsResponse>(
      endpoints.notifications.stats,
      { authToken }
    );

    log("fetchBroadcastStats() response", res);
    log("fetchBroadcastStats() data", res.data);

    return res;
  } catch (err) {
    logError("fetchBroadcastStats() failed", err);
    throw err;
  }
}

/** POST /admin/broadcasts */
export async function createBroadcast(
  payload: CreateBroadcastPayload,
  authToken?: string
): Promise<BroadcastResponse> {
  log("createBroadcast() called", {
    title: payload.title,
    targetAudience: payload.targetAudience,
    isUrgent: payload.isUrgent,
    saveAsDraft: payload.saveAsDraft,
  });

  try {
    const res = await apiRequest<BroadcastResponse>(
      endpoints.notifications.create,
      {
        method: "POST",
        body: payload,
        authToken,
      }
    );

    log("createBroadcast() response", res);
    log("createBroadcast() broadcastId", res.data?.id);

    return res;
  } catch (err) {
    logError("createBroadcast() failed", err);
    throw err;
  }
}

/** POST /admin/broadcasts/:broadcastId/resend */
export async function resendBroadcast(
  broadcastId: string,
  authToken?: string
): Promise<BroadcastResponse> {
  log("resendBroadcast() called", { broadcastId });

  try {
    const res = await apiRequest<BroadcastResponse>(
      endpoints.notifications.resend(broadcastId),
      {
        method: "POST",
        authToken,
      }
    );

    log("resendBroadcast() response", res);
    log("resendBroadcast() status", res.data?.status);

    return res;
  } catch (err) {
    logError("resendBroadcast() failed", err);
    throw err;
  }
}