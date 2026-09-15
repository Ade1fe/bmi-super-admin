/**
 * support-flow.ts
 *
 * Single source of truth for all Support-related types, API↔UI mappers,
 * local-storage helpers, and static display data.
 *
 * Backend types live in support-api.ts.
 * This file converts between them and the richer UI shape the pages consume.
 */

import type {
  SupportTicket as ApiTicket,
  TicketActivityRecord as ApiTicketActivity,
  SupportAgent as ApiAgent,
  ChatThread as ApiChatThread,
  ChatMessage as ApiChatMessage,
  SupportMetrics as ApiSupportMetrics,
} from "@/lib/support-api";

// ─────────────────────────────────────────────────────────────────
// Re-export API-level enums so pages can use a single import path
// ─────────────────────────────────────────────────────────────────

export type { ApiTicket, ApiTicketActivity, ApiAgent, ApiChatThread, ApiChatMessage };

// ─────────────────────────────────────────────────────────────────
// UI-side primitive types
// ─────────────────────────────────────────────────────────────────

/** Display-friendly ticket status (used in selects / badges). */
export type SupportStatus = "Open" | "In Progress" | "Resolved" | "On Hold";

/** Display-friendly ticket priority. */
export type SupportPriority = "Low" | "Medium" | "High" | "Urgent";

/** Category filter tabs shown across the tickets page. */
export type SupportCategory =
  | "All Tickets"
  | "Technical"
  | "Payment"
  | "Course Access"
  | "Onboarding";

/** Reply-editor mode on the ticket activity page. */
export type ReplyMode = "public" | "internal";

/** Tone drives the visual style of an activity card. */
export type ActivityTone = "requester" | "agent" | "internal";

// ─────────────────────────────────────────────────────────────────
// Rich UI-side ticket shape
// ─────────────────────────────────────────────────────────────────

export interface TicketAttachment {
  id: string;
  name: string;
  size?: string;
  type: "sheet" | "image";
}

export interface ExecutionStep {
  id: string;
  state: "done" | "current" | "pending";
  timestamp: string;
  title: string;
  description: string;
}

export interface TicketActivity {
  id: string;
  author: string;
  timestamp: string;
  badge: string;
  tone: ActivityTone;
  body: string[];
  attachment?: { name: string };
}

export interface TechnicalDetails {
  ipAddress: string;
  sessionId: string;
  orgCode: string;
  language: string;
}

export interface RequesterHealth {
  score: string;
  statement: string;
  relatedTo: string;
}

/**
 * The full UI ticket shape consumed by every support page.
 * Fields that the API does not yet return are given sensible fallbacks
 * inside `mapApiTicketToUi`.
 */
export interface SupportTicket {
  // ── identity ──────────────────────────────────────────────────
  id: string;           // UUID from API
  ticketNumber: string; // human-readable e.g. "TK-8942"
  from: string;         // requester display name
  category: string;     // TECHNICAL → mapped to display value

  // ── status / priority ─────────────────────────────────────────
  status: SupportStatus;
  priority: SupportPriority;
  lastUpdated: string;

  // ── list-view fields ──────────────────────────────────────────
  title: string;        // derived from subject

  // ── detail-view fields ────────────────────────────────────────
  caseCode: string;
  summary: string;
  assignedAgent: string;
  submittedBy: string;

  // ── requester display ─────────────────────────────────────────
  requesterName: string;
  requesterRole: string;
  requesterAvatar: string;   // 2-letter initials
  requesterTone: string;     // Tailwind class string for avatar bg/text

  // ── rich content ──────────────────────────────────────────────
  description: string[];     // paragraphs
  attachments: TicketAttachment[];
  executionTimeline: ExecutionStep[];
  activity: TicketActivity[];

  // ── metadata panels ───────────────────────────────────────────
  environment: string;
  environmentMeta: string;
  identity: string;
  identityMeta: string;
  slaDeadline: string;
  tags: string[];
  technicalDetails: TechnicalDetails;
  requesterHealth: RequesterHealth;
}

// ─────────────────────────────────────────────────────────────────
// API → UI mappers
// ─────────────────────────────────────────────────────────────────

const API_TO_UI_STATUS: Record<string, SupportStatus> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "On Hold",
  ON_HOLD: "On Hold",
};

const API_TO_UI_PRIORITY: Record<string, SupportPriority> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "High", // "Urgent" maps to "High" in the 3-button UI
};

const UI_TO_API_STATUS: Record<SupportStatus, string> = {
  Open: "OPEN",
  "In Progress": "IN_PROGRESS",
  Resolved: "RESOLVED",
  "On Hold": "ON_HOLD",
};

const UI_TO_API_PRIORITY: Record<SupportPriority, string> = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
  Urgent: "URGENT",
};

export { UI_TO_API_STATUS, UI_TO_API_PRIORITY };

const CATEGORY_MAP: Record<string, string> = {
  TECHNICAL: "Technical",
  PAYMENT: "Payment",
  BILLING: "Payment",
  COURSE_ACCESS: "Course Access",
  ONBOARDING: "Onboarding",
  GENERAL: "Technical",
};

/** Avatar background + text colour pairs cycling through a palette. */
const AVATAR_TONES = [
  "bg-[#e4f7ee] text-[#0f8751]",
  "bg-[#efe4ff] text-[#6f44ff]",
  "bg-[#fff2dc] text-[#bd7700]",
  "bg-[#fde8e8] text-[#d94040]",
  "bg-[#e0f0ff] text-[#1a7ac8]",
];

function avatarTone(index: number): string {
  return AVATAR_TONES[index % AVATAR_TONES.length];
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Maps a raw API ticket to the rich UI shape.
 * Fields the API doesn't provide yet are filled with sensible placeholders
 * so every page renders without crashing while the backend catches up.
 */
export function mapApiTicketToUi(
  apiTicket: ApiTicket,
  index = 0
): SupportTicket {
  const displayName = apiTicket.requesterName;
  const category =
    CATEGORY_MAP[apiTicket.category?.toUpperCase?.()] ?? apiTicket.category;
  const agentName = apiTicket.assignedAgent
    ? `${apiTicket.assignedAgent.firstName} ${apiTicket.assignedAgent.lastName}`.trim()
    : apiTicket.assignedAgentId
      ? `Agent #${apiTicket.assignedAgentId.slice(0, 6)}`
      : "Unassigned";
  const activities = mapApiActivities(apiTicket.activities ?? []);
  const attachments = (apiTicket.activities ?? []).flatMap((a) =>
    (a.attachments ?? []).map((url, i) => attachmentFromUrl(url, `${a.id}-${i}`))
  );
  const resolved = apiTicket.status === "RESOLVED";

  return {
    // identity
    id: apiTicket.id,
    ticketNumber: apiTicket.ticketId ?? `TK-${apiTicket.id.slice(0, 4).toUpperCase()}`,
    from: displayName,
    category,

    // status / priority
    status: API_TO_UI_STATUS[apiTicket.status] ?? "Open",
    priority: API_TO_UI_PRIORITY[apiTicket.priority] ?? "Medium",
    lastUpdated: relativeTime(apiTicket.updatedAt),

    // list view
    title: apiTicket.subject,

    // detail header
    caseCode: apiTicket.ticketId ?? apiTicket.id.slice(0, 8).toUpperCase(),
    summary: apiTicket.description.slice(0, 160),
    assignedAgent: agentName,
    submittedBy: apiTicket.orgCode
      ? `${apiTicket.requesterEmail} · ${apiTicket.orgCode}`
      : apiTicket.requesterEmail,

    // requester display
    requesterName: displayName,
    requesterEmail: apiTicket.requesterEmail,
    requesterRole: requesterRole(apiTicket),
    requesterAvatar: initials(displayName),
    requesterTone: avatarTone(index),

    // rich content
    description: apiTicket.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    attachments,
    executionTimeline: [
      {
        id: "step-1",
        state: "done",
        timestamp: relativeTime(apiTicket.createdAt),
        title: "Ticket Created",
        description: `Support request submitted by ${displayName}.`,
      },
      {
        id: "step-2",
        state: apiTicket.assignedAgentId ? "done" : "current",
        timestamp: apiTicket.assignedAgentId
          ? relativeTime(apiTicket.updatedAt)
          : "",
        title: "Agent Assignment",
        description: apiTicket.assignedAgentId
          ? `Assigned to ${agentName}.`
          : "Awaiting agent assignment.",
      },
      {
        id: "step-3",
        state: resolved ? "done" : "pending",
        timestamp: resolved ? relativeTime(apiTicket.updatedAt) : "",
        title: "Resolution",
        description: resolved ? "Issue addressed and ticket resolved." : "Issue not yet resolved.",
      },
    ],
    activity: activities,

    // metadata panels — only orgCode is real today
    environment: "Production",
    environmentMeta: apiTicket.studentId ? "Student App" : apiTicket.schoolId ? "School Portal" : "Support Desk",
    identity: displayName,
    identityMeta: apiTicket.requesterEmail,
    slaDeadline: "Within 24 hours",
    tags: [category.toUpperCase(), apiTicket.priority, ...(apiTicket.ticketType ? [apiTicket.ticketType] : [])],
    technicalDetails: {
      ipAddress: "—",
      sessionId: "—",
      orgCode: apiTicket.orgCode ?? "—",
      language: "en-US",
    },
    requesterHealth: {
      score: "—",
      statement: "No historical data available.",
      relatedTo: category,
    },
  } as SupportTicket;
}

/** Who raised the ticket, from which owner column the backend set. */
export function requesterRole(apiTicket: Pick<ApiTicket, "studentId" | "schoolId">): string {
  if (apiTicket.studentId) return "Student";
  if (apiTicket.schoolId) return "School Admin";
  return "Requester";
}

function attachmentFromUrl(url: string, id: string): TicketAttachment {
  let name = url;
  try {
    name = decodeURIComponent(new URL(url).pathname.split("/").pop() || url);
  } catch {
    /* not a URL — show as-is */
  }
  return {
    id,
    name,
    type: /\.(csv|xlsx?|tsv)$/i.test(name) ? "sheet" : "image",
  };
}

/**
 * Maps the detail response's activities (oldest first) to the conversation
 * shape. Internal notes keep their own tone so an agent can tell at a glance
 * which lines the requester never saw.
 */
export function mapApiActivities(activities: ApiTicketActivity[]): TicketActivity[] {
  return activities.map((a) => {
    const tone: ActivityTone = a.isInternalNote
      ? "internal"
      : a.senderType === "SUPPORT_AGENT"
        ? "agent"
        : "requester";
    const badge = a.isInternalNote
      ? "Internal note"
      : a.senderType === "SUPPORT_AGENT"
        ? "Reply to requester"
        : a.senderType === "SYSTEM"
          ? "System"
          : "Requester";
    const firstAttachment = a.attachments?.[0];
    return {
      id: a.id,
      author: a.senderName,
      timestamp: relativeTime(a.createdAt),
      badge,
      tone,
      body: a.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
      attachment: firstAttachment ? { name: attachmentFromUrl(firstAttachment, a.id).name } : undefined,
    };
  });
}

/**
 * Maps a raw API ChatThread to the UI LiveChatThread shape.
 */
export function mapApiThreadToUi(
  apiThread: ApiChatThread,
  index = 0
): LiveChatThread {
  const linked = apiThread.ticket;

  return {
    id: apiThread.id,
    participant: apiThread.requesterName,
    lastSeen: relativeTime(apiThread.updatedAt),
    unread: apiThread.isNew,
    preview: linked?.subject ?? "New support thread",
    badge: linked
      ? CATEGORY_MAP[linked.category?.toUpperCase?.()] ?? linked.category
      : "General",
    avatarTone: avatarTone(index),
    messages: [],
  };
}

/**
 * Maps a raw API ChatMessage to the UI LiveChatMessage shape.
 */
export function mapApiMessageToUi(apiMessage: ApiChatMessage): LiveChatMessage {
  return {
    id: apiMessage.id,
    sender: apiMessage.senderType === "SUPPORT_AGENT" ? "assistant" : "user",
    body: apiMessage.content,
    timestamp: relativeTime(apiMessage.createdAt),
    attachment:
      apiMessage.attachments.length > 0
        ? { name: apiMessage.attachments[0], size: "" }
        : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────
// Live-chat UI types
// ─────────────────────────────────────────────────────────────────

export interface LiveChatMessage {
  id: string;
  sender: "assistant" | "user";
  body: string;
  timestamp: string;
  attachment?: { name: string; size: string };
}

export interface LiveChatThread {
  id: string;
  participant: string;
  lastSeen: string;
  unread: boolean;
  preview: string;
  badge: string;
  avatarTone: string;
  messages: LiveChatMessage[];
}

// ─────────────────────────────────────────────────────────────────
// Metric display data (driven by API response at runtime;
// these are static fallbacks used before the first fetch)
// ─────────────────────────────────────────────────────────────────

export type SupportMetricItem = {
  key: keyof ApiSupportMetrics;
  label: string;
  accentClassName: string;
  noteClassName: string;
  value: string | number;
  suffix?: string;
  note: string;
};

export function buildMetrics(data: ApiSupportMetrics): SupportMetricItem[] {
  return [
    {
      key: "openTickets",
      label: "Open Tickets",
      accentClassName: "bg-[#e9eeff] text-[#4b65e0]",
      noteClassName: "bg-[#eef8f2] text-[#2d8c5c]",
      value: data.openTickets.value,
      note: data.openTickets.trend,
    },
    {
      key: "pendingSchools",
      label: "Pending Schools",
      accentClassName: "bg-[#fff3e5] text-[#d97706]",
      noteClassName: "bg-[#fef9ec] text-[#b45309]",
      value: data.pendingSchools.value,
      note: data.pendingSchools.trend,
    },
    {
      key: "avgResponseTime",
      label: "Avg. Response Time",
      accentClassName: "bg-[#eef2f7] text-[#536781]",
      noteClassName: "bg-[#eef8f2] text-[#2d8c5c]",
      value: data.avgResponseTime.value,
      note: data.avgResponseTime.trend,
    },
    {
      key: "satisfactionScore",
      label: "Satisfaction Score",
      accentClassName: "bg-[#fffbeb] text-[#d97706]",
      noteClassName: "bg-[#eef8f2] text-[#2d8c5c]",
      value: String(data.satisfactionScore.value).split("/")[0],
      suffix: "/5",
      note: data.satisfactionScore.trend,
    },
  ];
}

/** Static fallback metrics rendered before the API responds. */
export const supportMetrics: SupportMetricItem[] = buildMetrics({
  openTickets: { value: "—", trend: "…" },
  pendingSchools: { value: "—", trend: "…" },
  avgResponseTime: { value: "—", trend: "…" },
  satisfactionScore: { value: "—/5", trend: "…" },
});

// ─────────────────────────────────────────────────────────────────
// Static agent list (used as fallback; replace with API response)
// ─────────────────────────────────────────────────────────────────

export const supportAgents: string[] = ["Unassigned"];

/** Merges real agents from the API into the agents list. */
export function buildAgentOptions(agents: ApiAgent[]): string[] {
  return [
    "Unassigned",
    ...agents.map((a) => `${a.firstName} ${a.lastName}`),
  ];
}

// ─────────────────────────────────────────────────────────────────
// Routing helpers
// ─────────────────────────────────────────────────────────────────

export function buildSupportHref(tab: "tickets" | "chat"): string {
  return tab === "tickets" ? "/support" : "/support/live-chat";
}

export function buildSupportTicketHref(ticket: SupportTicket): string {
  return `/support/${ticket.id}`;
}

// ─────────────────────────────────────────────────────────────────
// Tailwind class helpers
// ─────────────────────────────────────────────────────────────────

export function ticketPriorityClassName(priority: SupportPriority): string {
  switch (priority) {
    case "Urgent":
    case "High":
      return "text-[#e53e3e]";
    case "Medium":
      return "text-[#d97706]";
    case "Low":
      return "text-[#2d8c5c]";
  }
}

export function ticketStatusClassName(status: SupportStatus): string {
  switch (status) {
    case "Open":
      return "text-[#5a43ff]";
    case "In Progress":
      return "text-[#d97706]";
    case "Resolved":
      return "text-[#2d8c5c]";
    case "On Hold":
      return "text-[#8391a8]";
  }
}

// ─────────────────────────────────────────────────────────────────
// LocalStorage persistence
// (keeps the UI functional when the user navigates between pages
//  without re-fetching; overwritten by real API data on mount)
// ─────────────────────────────────────────────────────────────────

const TICKETS_KEY = "support:tickets:v2";
const THREADS_KEY = "support:threads:v2";

export const initialSupportTickets: SupportTicket[] = [];
export const initialLiveChatThreads: LiveChatThread[] = [];

export function persistSupportTickets(tickets: SupportTicket[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function loadStoredSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY);
    return raw ? (JSON.parse(raw) as SupportTicket[]) : [];
  } catch {
    return [];
  }
}

export function persistLiveChatThreads(threads: LiveChatThread[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  } catch {}
}

export function loadStoredLiveChatThreads(): LiveChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(THREADS_KEY);
    return raw ? (JSON.parse(raw) as LiveChatThread[]) : [];
  } catch {
    return [];
  }
}