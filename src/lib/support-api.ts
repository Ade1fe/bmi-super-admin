import { apiRequest, endpoints } from "./endpoints";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TicketCategory = "TECHNICAL" | "BILLING" | "GENERAL" | string;
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type AgentWorkload = "OFFLINE" | "MINIMAL" | "MODERATE" | "HEAVY";

export interface SupportMetricStat {
  value: number | string;
  trend: string;
}

export interface SupportMetrics {
  openTickets: SupportMetricStat;
  pendingSchools: SupportMetricStat;
  avgResponseTime: SupportMetricStat;
  satisfactionScore: SupportMetricStat;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  requesterName: string;
  requesterEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  activeTicketsCount: number;
  workload: AgentWorkload;
}

export interface ChatThread {
  id: string;
  requesterName: string;
  requesterEmail: string;
  isNew: boolean;
  ticketId?: string;
  ticket?: SupportTicket;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderName: string;
  senderType: "REQUESTER" | "SUPPORT_AGENT" | string;
  content: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Query Params
// ─────────────────────────────────────────────

export interface GetSupportTicketsParams {
  category?: TicketCategory;
  status?: TicketStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Payloads
// ─────────────────────────────────────────────

export interface AssignSupportAgentPayload {
  agentId: string;
}

export interface CreateChatThreadPayload {
  requesterName: string;
  requesterEmail: string;
  initialMessage: string;
}

export interface SendChatMessagePayload {
  content: string;
  attachments?: string[];
}

// ─────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────

export interface GetSupportTicketsResponse {
  message?: string;
  data: SupportTicket[];
}

export interface GetSupportTicketDetailsResponse {
  message?: string;
  data?: SupportTicket;
  // Some endpoints return the object directly (no wrapper)
  id?: string;
}

export interface CreateChatThreadResponse {
  message?: string;
  data?: ChatThread;
  // API may return the thread directly
  id?: string;
}

export interface SendChatMessageResponse {
  message?: string;
  data?: ChatMessage;
  // API may return the message directly
  id?: string;
}

// ─────────────────────────────────────────────
// Debug Helpers
// ─────────────────────────────────────────────

const DEBUG = true;

function log(tag: string, data?: unknown) {
  if (!DEBUG) return;
  console.log(`[support-api] ${tag}`, data ?? "");
}

function logError(tag: string, error: unknown) {
  console.error(`[support-api ERROR] ${tag}`, error);
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * GET /admin/support/metrics
 * Retrieve support dashboard metrics (open tickets, avg response time, etc.)
 */
export async function getSupportMetrics(authToken: string) {
  log("getSupportMetrics() called");
  try {
    const res = await apiRequest<SupportMetrics | { data: SupportMetrics }>(
      endpoints.admin.support.metrics,
      { method: "GET", authToken }
    );
    log("getSupportMetrics() response", res);
    // Unwrap { data: {...} } if present
    if (res && typeof res === "object" && "data" in res && !("openTickets" in res)) {
      return (res as { data: SupportMetrics }).data;
    }
    return res as SupportMetrics;
  } catch (err) {
    logError("getSupportMetrics() failed", err);
    throw err;
  }
}


/**
 * GET /admin/support/tickets?category=&status=&search=&page=&limit=
 * Fetch a paginated, filtered list of support tickets.
 */
export async function getSupportTickets(
  params: GetSupportTicketsParams = {},
  authToken: string
) {
  log("getSupportTickets() called", params);
  const { category, status, search = "", page = 1, limit = 10 } = params;

  const query = new URLSearchParams({
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    search,
    page: String(page),
    limit: String(limit),
  });

  const url = `${endpoints.admin.support.tickets}?${query.toString()}`;

  try {
    const res = await apiRequest<GetSupportTicketsResponse>(url, {
      method: "GET",
      authToken,
    });
    log("getSupportTickets() response", res);
    return res;
  } catch (err) {
    logError("getSupportTickets() failed", err);
    throw err;
  }
}

/**
 * GET /admin/support/tickets/:ticketId
 * Fetch the full details of a single support ticket.
 */
export async function getSupportTicketDetails(
  ticketId: string,
  authToken: string
) {
  log("getSupportTicketDetails() called", { ticketId });
  try {
    const res = await apiRequest<SupportTicket>(
      endpoints.admin.support.ticketById(ticketId),
      { method: "GET", authToken }
    );
    log("getSupportTicketDetails() response", res);
    return res;
  } catch (err) {
    logError("getSupportTicketDetails() failed", err);
    throw err;
  }
}

/**
 * PUT /admin/support/tickets/:ticketId/assign
 * Assign a support agent to a ticket.
 */
export async function assignSupportAgent(
  ticketId: string,
  payload: AssignSupportAgentPayload,
  authToken: string
) {
  log("assignSupportAgent() called", { ticketId, payload });
  try {
    const res = await apiRequest<SupportTicket>(
      endpoints.admin.support.assignAgent(ticketId),
      { method: "PUT", authToken, body: payload }
    );
    log("assignSupportAgent() response", res);
    return res;
  } catch (err) {
    logError("assignSupportAgent() failed", err);
    throw err;
  }
}

/**
 * GET /admin/support/agents
 * Retrieve the list of available support agents with workload info.
 */
export async function getAvailableSupportAgents(authToken: string) {
  log("getAvailableSupportAgents() called");
  try {
    const res = await apiRequest<SupportAgent[]>(
      endpoints.admin.support.agents,
      { method: "GET", authToken }
    );
    log("getAvailableSupportAgents() response", res);
    return res;
  } catch (err) {
    logError("getAvailableSupportAgents() failed", err);
    throw err;
  }
}


export interface UpdateTicketStatusPayload {
  status: TicketStatus;
  reason?: string;
  notify?: boolean;
}

export interface AddTicketActivityPayload {
  content: string;
  type?: "public" | "internal";
}

export async function updateTicketStatus(
  ticketId: string,
  payload: UpdateTicketStatusPayload,
  authToken: string
) {
  log("updateTicketStatus() called", { ticketId, payload });
  try {
    const res = await apiRequest<SupportTicket>(
      endpoints.admin.support.updateTicketStatus(ticketId),
      { method: "PUT", authToken, body: payload }
    );
    log("updateTicketStatus() response", res);
    return res;
  } catch (err) {
    logError("updateTicketStatus() failed", err);
    throw err;
  }
}

export async function addTicketActivity(
  ticketId: string,
  payload: AddTicketActivityPayload,
  authToken: string
) {
  log("addTicketActivity() called", { ticketId, payload });
  try {
    const res = await apiRequest<unknown>(
      endpoints.admin.support.addTicketActivity(ticketId),
      { method: "POST", authToken, body: payload }
    );
    log("addTicketActivity() response", res);
    return res;
  } catch (err) {
    logError("addTicketActivity() failed", err);
    throw err;
  }
}

/**
 * GET /admin/support/chats/threads
 * Fetch all live-chat threads.
 */
/**
 * GET /admin/support/chats/threads
 * Backend returns either ChatThread[] directly OR { data: ChatThread[] }
 */
export async function getChatThreads(authToken: string): Promise<ChatThread[]> {
  log("getChatThreads() called");
  try {
    const res = await apiRequest<ChatThread[] | { data: ChatThread[] }>(
      endpoints.admin.support.chatThreads,
      { method: "GET", authToken }
    );
    log("getChatThreads() response", res);
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && Array.isArray((res as { data: ChatThread[] }).data)) {
      return (res as { data: ChatThread[] }).data;
    }
    return [];
  } catch (err) {
    logError("getChatThreads() failed", err);
    throw err;
  }
}

/**
 * GET /admin/support/chats/threads/:threadId/messages
 * Backend returns either ChatMessage[] directly OR { data: ChatMessage[] }
 */
export async function getChatThreadMessages(
  threadId: string,
  authToken: string
): Promise<ChatMessage[]> {
  log("getChatThreadMessages() called", { threadId });
  try {
    const res = await apiRequest<ChatMessage[] | { data: ChatMessage[] }>(
      endpoints.admin.support.chatThreadMessages(threadId),
      { method: "GET", authToken }
    );
    log("getChatThreadMessages() response", res);
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && Array.isArray((res as { data: ChatMessage[] }).data)) {
      return (res as { data: ChatMessage[] }).data;
    }
    return [];
  } catch (err) {
    logError("getChatThreadMessages() failed", err);
    throw err;
  }
}
/**
 * POST /admin/support/chats/threads/:threadId/messages
 * Backend returns the message directly (no wrapper): { id, content, ... }
 */
export async function sendChatMessage(
  threadId: string,
  payload: SendChatMessagePayload,
  authToken: string
): Promise<SendChatMessageResponse> {
  log("sendChatMessage() called", { threadId, payload });
  try {
    const res = await apiRequest<SendChatMessageResponse>(
      endpoints.admin.support.sendMessage(threadId),
      {
        method: "POST",
        authToken,
        body: {
          content: payload.content,
          attachments: payload.attachments ?? [],
        },
      }
    );
    log("sendChatMessage() response", res);
    return res;
  } catch (err) {
    logError("sendChatMessage() failed", err);
    throw err;
  }
}

/**
 * POST /admin/support/chats/threads
 * Backend returns the thread directly (no wrapper): { id, requesterName, ... }
 */
export async function createChatThread(
  payload: CreateChatThreadPayload,
  authToken: string
): Promise<ChatThread> {
  log("createChatThread() called", payload);
  try {
    const res = await apiRequest<ChatThread | { data: ChatThread }>(
      endpoints.admin.support.createThread,
      { method: "POST", authToken, body: payload }
    );
    log("createChatThread() response", res);
    // Your API returns the thread directly (confirmed from Postman)
    if (res && (res as ChatThread).id) return res as ChatThread;
    if (res && (res as { data: ChatThread }).data?.id) return (res as { data: ChatThread }).data;
    return res as ChatThread;
  } catch (err) {
    logError("createChatThread() failed", err);
    throw err;
  }
}