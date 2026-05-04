"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  Filter,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  buildInviteHref,
  buildTeamsHref,
  clearanceLevels,
  getRoleLabel,
  initialAuditRows,
  initialTeamMembers,
  loadStoredTeamMembers,
  persistTeamMembers,
  roleMeta,
  type AuditCategory,
  type AuditRow,
  type ClearanceLevel,
  type MemberFilter,
  type TeamMember,
  type TeamModal,
  type TeamRoleKey,
  type TeamView,
} from "@/app/teams/team-flow";

function TopTabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[12px] px-4 py-2.5 text-[18px] font-medium transition-colors ${
        active
          ? "border border-[#dbe3f1] bg-white font-bold text-[#4b8a60] shadow-[0_8px_24px_rgba(176,188,223,0.12)]"
          : "text-[#5f7290]"
      }`}
    >
      {label}
    </Link>
  );
}

function InlineFilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-[3px] pb-3 text-[18px] font-semibold ${
        active ? "border-[#0f8751] text-[#4b8a60]" : "border-transparent text-[#667892]"
      }`}
    >
      {label}
    </button>
  );
}

function Pager() {
  return (
    <div className="flex items-center gap-2 self-end lg:self-auto">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0f8751] text-[15px] font-bold text-white"
      >
        1
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]"
      >
        2
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]"
      >
        3
      </button>
      <span className="px-1 text-[#98a2b6]">...</span>
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center px-1 text-[15px] font-bold text-[#203552]"
      >
        256
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}

function TeamModalFrame({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[560px]">
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <article className="overflow-hidden rounded-[26px] bg-white p-8 shadow-[0_40px_120px_rgba(20,28,48,0.26)] sm:p-10">
            <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">{title}</h2>
            <p className="mt-3 text-[16px] leading-7 text-[#6b7d97]">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </article>
        </div>
      </div>
    </>
  );
}

function downloadCsv(fileName: string, lines: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const csv = lines.map((line) => line.replaceAll("\n", " ")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}

function formatDisplayCount(count: number, total: number, label: string) {
  if (count === 0) {
    return `Showing 0 of ${total} ${label}`;
  }

  return `Showing 1 to ${count} of ${total} ${label}`;
}

function AdministrativeTeamView({
  members,
  onMembersChange,
}: {
  members: TeamMember[];
  onMembersChange: (members: TeamMember[]) => void;
}) {
  const [memberFilter, setMemberFilter] = useState<MemberFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [modal, setModal] = useState<TeamModal>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedClearance, setSelectedClearance] = useState<ClearanceLevel>(clearanceLevels[0]);

  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? null;
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMembers = members.filter((member) => {
    if (memberFilter === "active" && member.status !== "Active") {
      return false;
    }

    if (memberFilter === "deactivated" && member.status !== "In-Active") {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableValue = [
      member.name,
      member.email,
      getRoleLabel(member.roleKey),
      member.department,
      member.clearanceLevel,
    ]
      .join(" ")
      .toLowerCase();

    return searchableValue.includes(normalizedSearch);
  });

  const handleDeactivate = () => {
    if (!selectedMember) {
      return;
    }

    const deactivatedOn = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date());

    onMembersChange(
      members.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              status: "In-Active",
              deactivatedOn,
            }
          : member,
      ),
    );
    setModal(null);
  };

  const handleReactivate = () => {
    if (!selectedMember) {
      return;
    }

    onMembersChange(
      members.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              status: "Active",
              clearanceLevel: selectedClearance,
              lastLogin: "Just reactivated",
              deactivatedOn: undefined,
            }
          : member,
      ),
    );
    setModal(null);
  };

  const roleCards = (Object.keys(roleMeta) as TeamRoleKey[]).map((roleKey) => ({
    roleKey,
    count: members.filter((member) => member.roleKey === roleKey).length,
  }));

  return (
    <>
      <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Administrative Team</h2>
          <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
            Manage your internal team members and their system-wide access levels.
          </p>
        </div>
        <Link
          href={buildInviteHref()}
          className="button-primary inline-flex h-12 items-center gap-3 rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white"
        >
          <Users className="h-4.5 w-4.5" strokeWidth={2} />
          Add New Team Member
        </Link>
      </section>

      <div className="mt-10 border-b border-[#e7ebf7]">
        <div className="flex flex-wrap items-center gap-8">
          <InlineFilterTab
            label="All Members"
            active={memberFilter === "all"}
            onClick={() => setMemberFilter("all")}
          />
          <InlineFilterTab
            label="Active"
            active={memberFilter === "active"}
            onClick={() => setMemberFilter("active")}
          />
          <InlineFilterTab
            label="Deactivated"
            active={memberFilter === "deactivated"}
            onClick={() => setMemberFilter("deactivated")}
          />
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex h-12 w-full max-w-[340px] items-center gap-3 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[#95a0b4]">
            <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
              placeholder="Search by name, email or role..."
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#f6f8fd] px-4 text-[16px] font-semibold text-[#5c6f8d]"
            >
              <Filter className="h-4.5 w-4.5" strokeWidth={2.1} />
              Filter
            </button>
            <button
              type="button"
              onClick={() =>
                downloadCsv("management-team.csv", [
                  "name,email,role,status,last_login",
                  ...filteredMembers.map(
                    (member) =>
                      `${member.name},${member.email},${getRoleLabel(member.roleKey)},${member.status},${member.lastLogin}`,
                  ),
                ])
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f6f8fd] text-[#5c6f8d]"
            >
              <Download className="h-4.5 w-4.5" strokeWidth={2.1} />
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[1.3fr_1.15fr_0.95fr_0.8fr_0.7fr_0.45fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
          <span>Admin Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Last Login</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filteredMembers.map((member) => {
          const isActive = member.status === "Active";
          const roleDetails = roleMeta[member.roleKey];

          return (
            <article
              key={member.id}
              className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.3fr_1.15fr_0.95fr_0.8fr_0.7fr_0.45fr] lg:items-center"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[14px] font-extrabold text-white">
                  {member.initials}
                </span>
                <p className="text-[17px] font-extrabold text-[#172f54]">{member.name}</p>
              </div>
              <p className="text-[16px] text-[#667892]">{member.email}</p>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold ${roleDetails.badgeClassName}`}
              >
                {roleDetails.label}
              </span>
              <p className="text-[16px] font-semibold text-[#536781]">{member.lastLogin}</p>
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${
                  isActive ? "bg-[#e5f7ef] text-[#0f8a4f]" : "bg-[#edf1f7] text-[#8a98b0]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {isActive ? "ACTIVE" : "IN-ACTIVE"}
              </span>
              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenRow((current) => (current === member.id ? null : member.id))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8fa0ba]"
                >
                  <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                </button>

                {openRow === member.id ? (
                  <div className="absolute right-0 top-11 z-10 w-[198px] rounded-[16px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                    <Link
                      href={buildInviteHref(member.id)}
                      className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                    >
                      Edit Permission
                    </Link>
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setOpenRow(null);
                          setModal("deactivate");
                        }}
                        className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                      >
                        Deactivate Account
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setSelectedClearance(member.clearanceLevel);
                          setOpenRow(null);
                          setModal("reactivate");
                        }}
                        className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                      >
                        Reactivate Account
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}

        <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <p>{formatDisplayCount(filteredMembers.length, members.length, "team members")}</p>
          <Pager />
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        {roleCards.map(({ roleKey, count }) => {
          const roleDetails = roleMeta[roleKey];

          return (
            <article
              key={roleKey}
              className="rounded-[22px] border border-[#dfe6f7] bg-white p-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] ${roleDetails.cardTone}`}>
                <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h3 className="mt-8 text-[17px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                {roleDetails.groupLabel}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-[#6b7d97]">{roleDetails.cardCopy}</p>
              <p className="mt-5 text-[16px] font-extrabold text-[#172f54]">
                {count} {count === 1 ? "Member" : "Members"}
              </p>
            </article>
          );
        })}
      </section>

      {modal === "deactivate" && selectedMember ? (
        <TeamModalFrame
          title="Deactivate Member Account"
          subtitle={
            <>
              You are about to suspend access for{" "}
              <span className="font-bold text-[#172f54]">{selectedMember.name}.</span>
            </>
          }
          onClose={() => setModal(null)}
        >
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-[18px] bg-[#effaf6] px-5 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#fff0f0] text-[#ff4a4a]">
                <AlertTriangle className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold text-[#172f54]">Immediate Access Termination</p>
                <p className="mt-2 text-[16px] leading-7 text-[#6b7d97]">
                  The user will be immediately logged out of all active sessions and restricted from the
                  Emerald Portal environment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[18px] bg-[#effaf6] px-5 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#fff0f0] text-[#ff4a4a]">
                <Download className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold text-[#172f54]">Audit Trail Preservation</p>
                <p className="mt-2 text-[16px] leading-7 text-[#6b7d97]">
                  Activity logs and historical records will remain intact for compliance purposes.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#dbe3f1] bg-white px-6 text-[17px] font-semibold text-[#485a76]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeactivate}
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#f22952] px-6 text-[17px] font-semibold text-white"
            >
              Confirm Deactivation
            </button>
          </div>
        </TeamModalFrame>
      ) : null}

      {modal === "reactivate" && selectedMember ? (
        <TeamModalFrame
          title="Reactivate Member Account"
          subtitle={
            <>
              Restore system access for <span className="font-bold text-[#172f54]">{selectedMember.name}.</span>
            </>
          }
          onClose={() => setModal(null)}
        >
          <div className="rounded-[18px] bg-[#effaf6] px-5 py-5">
            <p className="text-[18px] font-extrabold text-[#172f54]">Account Meta Data</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">
                  Original Role
                </p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">
                  {getRoleLabel(selectedMember.roleKey)}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">
                  Deactivated On
                </p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">
                  {selectedMember.deactivatedOn ?? "Oct 12, 2023"}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">
                  Department
                </p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">{selectedMember.department}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-[18px] font-semibold text-[#172f54]">Assigned Clearance Level</label>
            <div className="relative mt-3">
              <select
                value={selectedClearance}
                onChange={(event) => setSelectedClearance(event.target.value as ClearanceLevel)}
                className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-white px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none"
              >
                {clearanceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#dbe3f1] bg-white px-6 text-[17px] font-semibold text-[#485a76]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReactivate}
              className="button-primary inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[17px] font-semibold text-white"
            >
              Reactivation Account
            </button>
          </div>
        </TeamModalFrame>
      ) : null}
    </>
  );
}

function AuditLogsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | TeamRoleKey>("all");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory>("All Categories");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRows = initialAuditRows.filter((row) => {
    if (roleFilter !== "all" && row.adminRole !== roleFilter) {
      return false;
    }

    if (categoryFilter !== "All Categories" && row.category !== categoryFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableValue = [row.user, row.entity, row.action, row.ip].join(" ").toLowerCase();
    return searchableValue.includes(normalizedSearch);
  });

  return (
    <>
      <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Audit Logs</h2>
          <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
            Real-time tracking of all administrative activities and security events.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCsv("audit-logs.csv", [
              "timestamp,user,role,action,entity,ip,status",
              ...filteredRows.map(
                (row) =>
                  `${row.timestamp},${row.user},${getRoleLabel(row.adminRole)},${row.action},${row.entity},${row.ip},${row.status}`,
              ),
            ])
          }
          className="button-primary inline-flex h-12 items-center gap-3 rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white"
        >
          <Download className="h-4.5 w-4.5" strokeWidth={2} />
          Export Log
        </button>
      </section>

      <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
        <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:grid-cols-4 lg:items-end">
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Search Messages
            </span>
            <span className="mt-3 flex h-12 items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
              <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search by user or entity..."
              />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Admin Role
            </span>
            <span className="relative mt-3 block">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "all" | TeamRoleKey)}
                className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
              >
                <option value="all">All Roles</option>
                {(Object.keys(roleMeta) as TeamRoleKey[]).map((roleKey) => (
                  <option key={roleKey} value={roleKey}>
                    {getRoleLabel(roleKey)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]"
                strokeWidth={2.2}
              />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Date Range
            </span>
            <span className="relative mt-3 block">
              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
              >
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]"
                strokeWidth={2.2}
              />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Category
            </span>
            <span className="relative mt-3 block">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as AuditCategory)}
                className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
              >
                {[
                  "All Categories",
                  "Course Activity",
                  "School Activity",
                  "Billing Activity",
                  "User Activity",
                  "Authentication",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]"
                strokeWidth={2.2}
              />
            </span>
          </label>
        </div>

        <div className="hidden grid-cols-[1.25fr_1.1fr_1.1fr_1.15fr_1fr_0.7fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
          <span>Time Stamp</span>
          <span>Admin User</span>
          <span>Action Type Role</span>
          <span>Entity Affected</span>
          <span>IP Address</span>
          <span>Status</span>
        </div>

        {filteredRows.map((row: AuditRow) => (
          <article
            key={row.id}
            className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.25fr_1.1fr_1.1fr_1.15fr_1fr_0.7fr] lg:items-center"
          >
            <p className="text-[16px] font-medium text-[#536781]">{row.timestamp}</p>
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full ${row.avatarClassName}`} />
              <p className="text-[17px] font-extrabold text-[#172f54]">{row.user}</p>
            </div>
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold ${row.actionClassName}`}
            >
              {row.action}
            </span>
            <p className="text-[16px] font-semibold text-[#536781]">{row.entity}</p>
            <p className="text-[16px] font-medium text-[#536781]">{row.ip}</p>
            <p className={`text-[16px] font-extrabold uppercase ${row.statusClassName}`}>
              {row.status === "Alert" ? "SUCCESS" : row.status.toUpperCase()}
            </p>
          </article>
        ))}

        <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <p>{formatDisplayCount(filteredRows.length, initialAuditRows.length, "log entries")}</p>
          <Pager />
        </div>
      </section>
    </>
  );
}

function TeamsPageContent() {
  const searchParams = useSearchParams();
  const [members, setMembers] = useState(initialTeamMembers);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const hydrateMembers = window.setTimeout(() => {
      setMembers(loadStoredTeamMembers());
      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrateMembers);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    persistTeamMembers(members);
  }, [hasHydrated, members]);

  const view: TeamView = searchParams.get("view") === "audit" ? "audit" : "administrative";

  return (
    <AppShell
      title="Management Team"
      activeSection="teams"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-[#f5f6fd] px-4 py-2">
          <TopTabLink
            href={buildTeamsHref("administrative")}
            label="Administrative Team"
            active={view === "administrative"}
          />
          <TopTabLink href={buildTeamsHref("audit")} label="Audit Logs" active={view === "audit"} />
        </div>

        {view === "administrative" ? (
          <AdministrativeTeamView members={members} onMembersChange={setMembers} />
        ) : null}
        {view === "audit" ? <AuditLogsView /> : null}
      </div>
    </AppShell>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<AppShell title="Management Team" activeSection="teams"><div /></AppShell>}>
      <TeamsPageContent />
    </Suspense>
  );
}
