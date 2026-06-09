// ---------------------------------------------------------------------------
// team-flow.ts  — shared types, role meta, and pure helpers
// No mock data. No localStorage. All state comes from the API.
// ---------------------------------------------------------------------------

export type TeamView = "administrative" | "audit";
export type MemberFilter = "all" | "active" | "deactivated";
export type TeamModal = "deactivate" | "reactivate" | null;

// Maps backend role strings → UI keys
export type TeamRoleKey = "super_admin" | "content_manager" | "support" | "finance";

// Maps backend permission strings
export type TeamPermissionKey =
  | "manage_school"
  | "view_school"
  | "view_analytics"
  | "manage_subscriptions"
  | "view_subscriptions";

export type TeamMemberStatus = "active" | "inactive";

export type AuditCategory =
  | "All Categories"
  | "Course Activity"
  | "School Activity"
  | "Billing Activity"
  | "User Activity"
  | "Authentication";

// ---------------------------------------------------------------------------
// Role display metadata
// ---------------------------------------------------------------------------
export const roleMeta: Record<
  TeamRoleKey,
  {
    label: string;
    groupLabel: string;
    badgeClassName: string;
    cardTone: string;
    cardCopy: string;
    formCopy: string;
    department: string;
  }
> = {
  super_admin: {
    label: "Super Admin",
    groupLabel: "Super Admins",
    badgeClassName: "bg-[#f0e5ff] text-[#8037f2]",
    cardTone: "bg-[#f5ebff] text-[#8037f2]",
    cardCopy: "Full system access including payments and team management.",
    formCopy: "Full system access & management",
    department: "Executive Administration",
  },
  content_manager: {
    label: "Content Manager",
    groupLabel: "Content Managers",
    badgeClassName: "bg-[#eaf1ff] text-[#3567ff]",
    cardTone: "bg-[#eef4ff] text-[#3567ff]",
    cardCopy: "Manage courses, catalogs, and certificates only.",
    formCopy: "Editorial and portal updates",
    department: "Learning Experience",
  },
  support: {
    label: "Support",
    groupLabel: "Support",
    badgeClassName: "bg-[#fff0dc] text-[#dc7a14]",
    cardTone: "bg-[#fff3e4] text-[#f08a18]",
    cardCopy: "Access to student data and support tickets.",
    formCopy: "Ticket management & resolution",
    department: "Student Operations",
  },
  finance: {
    label: "Finance",
    groupLabel: "Finance",
    badgeClassName: "bg-[#e9f8ef] text-[#0f8751]",
    cardTone: "bg-[#e8fbf0] text-[#0f8751]",
    cardCopy: "Access to subscriptions, payments, and financial reports.",
    formCopy: "Ledger auditing & billing access",
    department: "Audit & Compliance",
  },
};

// All valid backend permission strings shown in the invite form
export const allPermissions: { key: TeamPermissionKey; label: string }[] = [
  { key: "manage_school", label: "Manage School" },
  { key: "view_school", label: "View School" },
  { key: "view_analytics", label: "View Analytics" },
  { key: "manage_subscriptions", label: "Manage Subscriptions" },
  { key: "view_subscriptions", label: "View Subscriptions" },
];

// Default permissions for a new member
export const defaultPermissions: TeamPermissionKey[] = ["view_school", "view_analytics"];

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "TM";
}

export function getRoleLabel(role: string): string {
  return roleMeta[role as TeamRoleKey]?.label ?? role;
}

export function normalizeRole(role: string): TeamRoleKey {
  if (role in roleMeta) return role as TeamRoleKey;
  // handle legacy hyphenated keys just in case
  const mapped: Record<string, TeamRoleKey> = {
    "super-admin": "super_admin",
    "content-manager": "content_manager",
  };
  return mapped[role] ?? (role as TeamRoleKey);
}

export function buildTeamsHref(view: TeamView = "administrative") {
  return view === "audit" ? "/teams?view=audit" : "/teams";
}

export function buildInviteHref(memberId?: string) {
  return memberId ? `/teams/invite?member=${memberId}` : "/teams/invite";
}