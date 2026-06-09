import { apiRequest, endpoints } from "./endpoints";

type JsonRecord = Record<string, unknown>;

const DEBUG = true; // turn off in production

function log(tag: string, data?: unknown) {
  if (!DEBUG) return;
  console.log(`[management-team] ${tag}`, data ?? "");
}

function logError(tag: string, error: unknown) {
  console.error(`[management-team] ${tag}`, error);
}


function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return "data" in payload ? payload.data : payload;
}

function unwrapCollection(payload: unknown): unknown[] {
  const data = unwrapData(payload);
  if (Array.isArray(data)) return data;
  if (isRecord(data)) {
    for (const key of ["data", "items", "team", "members", "logs"]) {
      const v = data[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TeamMemberRole =
  | "super_admin"
  | "content_manager"
  | "finance"
  | "support"
  | string;

export type TeamMemberPermission =
  | "manage_school"
  | "view_school"
  | "view_analytics"
  | "manage_subscriptions"
  | "view_subscriptions"
  | string;

export type TeamMemberStatus = "active" | "inactive" | string;

export type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: TeamMemberRole;
  permissions: TeamMemberPermission[];
  status: TeamMemberStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AuditLog = {
  id: string;
  action: string;
  performedBy?: string;
  performedByName?: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  ipAddress?: string;
  createdAt?: string;
};

export type AddTeamMemberPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: TeamMemberRole;
  password: string;
  permissions: TeamMemberPermission[];
};

export type UpdateTeamMemberPayload = {
  role?: TeamMemberRole;
  permissions?: TeamMemberPermission[];
};

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function parseTeamMember(value: unknown): TeamMember | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const email = readString(value.email);
  if (!id || !email) return null;

  const firstName = readString(value.firstName) || readString(value.first_name);
  const lastName = readString(value.lastName) || readString(value.last_name);

  const permissions = Array.isArray(value.permissions)
    ? (value.permissions as unknown[]).map((p) => String(p))
    : [];

  return {
    id,
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(" "),
    email,
    role: readString(value.role) || "support",
    permissions,
    status: readString(value.status) || "active",
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseAuditLog(value: unknown): AuditLog | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const action = readString(value.action) || readString(value.event);
  if (!id || !action) return null;

  return {
    id,
    action,
    performedBy: readString(value.performedBy) || readString(value.userId) || undefined,
    performedByName:
      readString(value.performedByName) ||
      readString(value.adminName) ||
      readString(value.userName) ||
      undefined,
    targetId: readString(value.targetId) || undefined,
    targetType: readString(value.targetType) || undefined,
    details:
      readString(value.details) ||
      readString(value.description) ||
      readString(value.metadata) ||
      undefined,
    ipAddress: readString(value.ipAddress) || readString(value.ip) || undefined,
    createdAt: readString(value.createdAt),
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * GET /admin/audit-logs
 * Fetch all audit logs.
 */
export async function getAuditLogs(authToken?: string): Promise<AuditLog[]> {
  console.log("[management-team] getAuditLogs() called");

  const response = await apiRequest<unknown>(endpoints.managementTeam.auditLogs, {
    authToken,
  });

  const items = unwrapCollection(response);

  const logs = items
    .map((item) => parseAuditLog(item))
    .filter((item): item is AuditLog => Boolean(item));

  console.log("[management-team] getAuditLogs() parsed:", logs.length);
  return logs;
}

/**
 * GET /admin/team
 * Fetch all team members.
 */
export async function getTeamMembers(authToken?: string): Promise<TeamMember[]> {
  log("getTeamMembers() called");

  try {
    const response = await apiRequest<unknown>(endpoints.managementTeam.all, {
      authToken,
    });

    log("getTeamMembers() raw response", response);

    const items = unwrapCollection(response);

    log("getTeamMembers() unwrapped items", items);

    const members = items
      .map(parseTeamMember)
      .filter((item): item is TeamMember => Boolean(item));

    log("getTeamMembers() parsed result count", members.length);
    log("getTeamMembers() parsed result", members);

    return members;
  } catch (error) {
    logError("getTeamMembers() failed", error);
    return [];
  }
}

/**
 * POST /admin/team
 * Add a new team member.
 *
 * Roles:    super_admin | content_manager | finance | support
 * Permissions: manage_school | view_school | view_analytics |
 *              manage_subscriptions | view_subscriptions
 */
export async function addTeamMember(
  payload: AddTeamMemberPayload,
  authToken?: string
): Promise<TeamMember | null> {
  log("addTeamMember() payload", {
    email: payload.email,
    role: payload.role,
  });

  try {
    const response = await apiRequest<unknown>(endpoints.managementTeam.add, {
      method: "POST",
      body: payload,
      authToken,
    });

    log("addTeamMember() raw response", response);

    const parsed = parseTeamMember(unwrapData(response));

    log("addTeamMember() parsed", parsed);

    return parsed;
  } catch (error) {
    logError("addTeamMember() failed", error);
    return null;
  }
}

/**
 * PUT /admin/team/:memberId
 * Update a team member's role and/or permissions.
 */
export async function updateTeamMember(
  memberId: string,
  payload: UpdateTeamMemberPayload,
  authToken?: string
): Promise<TeamMember | null> {
  console.log("[management-team] updateTeamMember() →", { memberId, payload });

  const response = await apiRequest<unknown>(
    endpoints.managementTeam.update(memberId),
    { method: "PUT", body: payload, authToken }
  );

  const data = unwrapData(response);
  const parsed = parseTeamMember(data);

  console.log("[management-team] updateTeamMember() parsed:", parsed);
  return parsed;
}

/**
 * PUT /admin/team/:memberId/deactivate
 * Deactivate a team member.
 */
export async function deactivateTeamMember(
  memberId: string,
  authToken?: string
): Promise<{ message: string }> {
  console.log("[management-team] deactivateTeamMember() →", { memberId });

  const response = await apiRequest<{ message: string }>(
    endpoints.managementTeam.deactivate(memberId),
    { method: "PUT", authToken }
  );

  console.log("[management-team] deactivateTeamMember() response:", response);
  return response;
}

/**
 * PUT /admin/team/:memberId/reactivate
 * Reactivate a team member.
 */
export async function reactivateTeamMember(
  memberId: string,
  authToken?: string
): Promise<{ message: string }> {
  console.log("[management-team] reactivateTeamMember() →", { memberId });

  const response = await apiRequest<{ message: string }>(
    endpoints.managementTeam.reactivate(memberId),
    { method: "PUT", authToken }
  );

  console.log("[management-team] reactivateTeamMember() response:", response);
  return response;
}