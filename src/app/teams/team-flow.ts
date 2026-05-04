export type TeamView = "administrative" | "audit";
export type MemberFilter = "all" | "active" | "deactivated";
export type TeamModal = "deactivate" | "reactivate" | null;
export type TeamRoleKey = "super-admin" | "content-manager" | "support" | "finance";
export type TeamMemberStatus = "Active" | "In-Active";
export type ClearanceLevel = "Level 2 - Standard Access" | "Level 3 - Elevated Access";

export type PermissionSet = {
  auditLogs: boolean;
  systemConfigurations: boolean;
  accessKeys: boolean;
};

export type TeamMember = {
  id: number;
  initials: string;
  name: string;
  email: string;
  roleKey: TeamRoleKey;
  lastLogin: string;
  status: TeamMemberStatus;
  permissions: PermissionSet;
  clearanceLevel: ClearanceLevel;
  department: string;
  deactivatedOn?: string;
};

export type AuditCategory =
  | "All Categories"
  | "Course Activity"
  | "School Activity"
  | "Billing Activity"
  | "User Activity"
  | "Authentication";

export type AuditRow = {
  id: number;
  timestamp: string;
  user: string;
  adminRole: TeamRoleKey;
  action: string;
  actionClassName: string;
  entity: string;
  ip: string;
  status: "Success" | "Alert";
  statusClassName: string;
  category: AuditCategory;
  avatarClassName: string;
};

export const defaultPermissions: PermissionSet = {
  auditLogs: true,
  systemConfigurations: false,
  accessKeys: false,
};

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
  "super-admin": {
    label: "Super Admin",
    groupLabel: "Super Admins",
    badgeClassName: "bg-[#f0e5ff] text-[#8037f2]",
    cardTone: "bg-[#f5ebff] text-[#8037f2]",
    cardCopy: "Full system access including payments and team management.",
    formCopy: "Full system access & management",
    department: "Executive Administration",
  },
  "content-manager": {
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

export const clearanceLevels: ClearanceLevel[] = [
  "Level 2 - Standard Access",
  "Level 3 - Elevated Access",
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    roleKey: "super-admin",
    lastLogin: "2 mins ago",
    status: "Active",
    permissions: { auditLogs: true, systemConfigurations: true, accessKeys: true },
    clearanceLevel: "Level 3 - Elevated Access",
    department: "Executive Administration",
  },
  {
    id: 2,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    roleKey: "content-manager",
    lastLogin: "2 mins ago",
    status: "Active",
    permissions: { auditLogs: true, systemConfigurations: false, accessKeys: false },
    clearanceLevel: "Level 2 - Standard Access",
    department: "Learning Experience",
  },
  {
    id: 3,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    roleKey: "support",
    lastLogin: "2 mins ago",
    status: "In-Active",
    permissions: { auditLogs: true, systemConfigurations: false, accessKeys: false },
    clearanceLevel: "Level 2 - Standard Access",
    department: "Student Operations",
    deactivatedOn: "Oct 12, 2023",
  },
  {
    id: 4,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    roleKey: "finance",
    lastLogin: "2 mins ago",
    status: "In-Active",
    permissions: { auditLogs: true, systemConfigurations: false, accessKeys: true },
    clearanceLevel: "Level 2 - Standard Access",
    department: "Audit & Compliance",
    deactivatedOn: "Oct 12, 2023",
  },
];

export const initialAuditRows: AuditRow[] = [
  {
    id: 1,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    adminRole: "content-manager",
    action: "Created Course",
    actionClassName: "bg-[#e7f8ef] text-[#0f8751]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
    category: "Course Activity",
    avatarClassName: "bg-[radial-gradient(circle_at_top,#f7d7b8_12%,#c19b74_42%,#58739b_100%)]",
  },
  {
    id: 2,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    adminRole: "super-admin",
    action: "Suspended School",
    actionClassName: "bg-[#fff2cf] text-[#cf7a07]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
    category: "School Activity",
    avatarClassName: "bg-[radial-gradient(circle_at_top,#f7d7b8_12%,#c19b74_42%,#58739b_100%)]",
  },
  {
    id: 3,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    adminRole: "finance",
    action: "Updated Subscription",
    actionClassName: "bg-[#eaf1ff] text-[#3567ff]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
    category: "Billing Activity",
    avatarClassName: "bg-[radial-gradient(circle_at_top,#f7d7b8_12%,#c19b74_42%,#58739b_100%)]",
  },
  {
    id: 4,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    adminRole: "support",
    action: "Deleted User",
    actionClassName: "bg-[#ffe9ea] text-[#ef4b4b]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
    category: "User Activity",
    avatarClassName: "bg-[radial-gradient(circle_at_top,#f7d7b8_12%,#c19b74_42%,#58739b_100%)]",
  },
  {
    id: 5,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    adminRole: "super-admin",
    action: "Admin Login",
    actionClassName: "bg-[#edf1f7] text-[#697a94]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Alert",
    statusClassName: "text-[#ef4b4b]",
    category: "Authentication",
    avatarClassName: "bg-[radial-gradient(circle_at_top,#f7d7b8_12%,#c19b74_42%,#58739b_100%)]",
  },
];

const teamMembersStorageKey = "bmi-super-admin-team-members";

export function getInitials(name: string) {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || "TM";
}

export function getRoleLabel(roleKey: TeamRoleKey) {
  return roleMeta[roleKey].label;
}

export function buildTeamsHref(view: TeamView = "administrative") {
  return view === "audit" ? "/teams?view=audit" : "/teams";
}

export function buildInviteHref(memberId?: number) {
  return memberId ? `/teams/invite?member=${memberId}` : "/teams/invite";
}

export function loadStoredTeamMembers() {
  if (typeof window === "undefined") {
    return initialTeamMembers;
  }

  const storedValue = window.localStorage.getItem(teamMembersStorageKey);

  if (!storedValue) {
    return initialTeamMembers;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return initialTeamMembers;
    }

    return parsedValue as TeamMember[];
  } catch {
    return initialTeamMembers;
  }
}

export function persistTeamMembers(members: TeamMember[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(teamMembersStorageKey, JSON.stringify(members));
}
