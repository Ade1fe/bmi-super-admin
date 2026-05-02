"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
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

type TeamView = "administrative" | "audit";
type MemberFilter = "all" | "active" | "deactivated";
type TeamModal = "deactivate" | "reactivate" | null;

type TeamMember = {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: string;
  roleClassName: string;
  lastLogin: string;
  status: "Active" | "In-Active";
};

type AuditRow = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  actionClassName: string;
  entity: string;
  ip: string;
  status: string;
  statusClassName: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    role: "Super Admin",
    roleClassName: "bg-[#f0e5ff] text-[#8037f2]",
    lastLogin: "2 mins ago",
    status: "Active",
  },
  {
    id: 2,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    role: "Content Manager",
    roleClassName: "bg-[#eaf1ff] text-[#3567ff]",
    lastLogin: "2 mins ago",
    status: "Active",
  },
  {
    id: 3,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    role: "Support",
    roleClassName: "bg-[#fff0dc] text-[#dc7a14]",
    lastLogin: "2 mins ago",
    status: "In-Active",
  },
  {
    id: 4,
    initials: "CH",
    name: "Courtney Henry",
    email: "courtney@lms.com",
    role: "Finance",
    roleClassName: "bg-[#e9f8ef] text-[#0f8751]",
    lastLogin: "2 mins ago",
    status: "In-Active",
  },
];

const auditRows: AuditRow[] = [
  {
    id: 1,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    action: "Created Course",
    actionClassName: "bg-[#e7f8ef] text-[#0f8751]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
  },
  {
    id: 2,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    action: "Suspended School",
    actionClassName: "bg-[#fff2cf] text-[#cf7a07]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
  },
  {
    id: 3,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    action: "Updated Subscription",
    actionClassName: "bg-[#eaf1ff] text-[#3567ff]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
  },
  {
    id: 4,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    action: "Deleted User",
    actionClassName: "bg-[#ffe9ea] text-[#ef4b4b]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#0f8751]",
  },
  {
    id: 5,
    timestamp: "Oct 27, 2023 · 10:15 AM",
    user: "Alex Johnson",
    action: "Admin Login",
    actionClassName: "bg-[#edf1f7] text-[#697a94]",
    entity: "Entrepreneurship 101",
    ip: "192.168.1.45",
    status: "Success",
    statusClassName: "text-[#ef4b4b]",
  },
];

function TopTab({
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
      className={`rounded-[12px] px-4 py-2.5 text-[18px] font-medium transition-colors ${
        active
          ? "border border-[#dbe3f1] bg-white font-bold text-[#4b8a60] shadow-[0_8px_24px_rgba(176,188,223,0.12)]"
          : "text-[#5f7290]"
      }`}
    >
      {label}
    </button>
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
      <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]">
        2
      </button>
      <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]">
        3
      </button>
      <span className="px-1 text-[#98a2b6]">...</span>
      <button type="button" className="inline-flex h-10 items-center justify-center px-1 text-[15px] font-bold text-[#203552]">
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

function AdministrativeTeamView() {
  const [memberFilter, setMemberFilter] = useState<MemberFilter>("all");
  const [openRow, setOpenRow] = useState<number | null>(2);
  const [modal, setModal] = useState<TeamModal>(null);

  const filteredMembers = teamMembers.filter((member) => {
    if (memberFilter === "active") return member.status === "Active";
    if (memberFilter === "deactivated") return member.status === "In-Active";
    return true;
  });

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
          href="/teams/invite"
          className="button-primary inline-flex h-12 items-center gap-3 rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white"
        >
          <Users className="h-4.5 w-4.5" strokeWidth={2} />
          Add New Team Member
        </Link>
      </section>

      <div className="mt-10 border-b border-[#e7ebf7]">
        <div className="flex flex-wrap items-center gap-8">
          <InlineFilterTab label="All Members" active={memberFilter === "all"} onClick={() => setMemberFilter("all")} />
          <InlineFilterTab label="Active" active={memberFilter === "active"} onClick={() => setMemberFilter("active")} />
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
              className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
              placeholder="Search by name, ID or course..."
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
          const active = member.status === "Active";

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
              <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold ${member.roleClassName}`}>
                {member.role}
              </span>
              <p className="text-[16px] font-semibold text-[#536781]">{member.lastLogin}</p>
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${
                  active ? "bg-[#e5f7ef] text-[#0f8a4f]" : "bg-[#edf1f7] text-[#8a98b0]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {member.status}
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
                  <div className="absolute right-0 top-11 z-10 w-[190px] rounded-[16px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                    <button
                      type="button"
                      className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                    >
                      Edit Permission
                    </button>
                    {active ? (
                      <button
                        type="button"
                        onClick={() => {
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
          <p>Showing 1 to 5 of 12,840 certificates</p>
          <Pager />
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        {[
          {
            title: "Super Admins",
            copy: "Full system access including payments and team management.",
            members: "2 Members",
            tone: "bg-[#f5ebff] text-[#8037f2]",
          },
          {
            title: "Content Managers",
            copy: "Manage courses, catalogs, and certificates only.",
            members: "5 Members",
            tone: "bg-[#eef4ff] text-[#3567ff]",
          },
          {
            title: "Support",
            copy: "Access to student data and support tickets.",
            members: "3 Members",
            tone: "bg-[#fff3e4] text-[#f08a18]",
          },
          {
            title: "Finance",
            copy: "Access to subscriptions, payments, and financial reports.",
            members: "2 Members",
            tone: "bg-[#e8fbf0] text-[#0f8751]",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-[22px] border border-[#dfe6f7] bg-white p-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] ${card.tone}`}>
              <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
            </span>
            <h3 className="mt-8 text-[17px] font-extrabold tracking-[-0.03em] text-[#172f54]">{card.title}</h3>
            <p className="mt-2 text-[15px] leading-7 text-[#6b7d97]">{card.copy}</p>
            <p className="mt-5 text-[16px] font-extrabold text-[#172f54]">{card.members}</p>
          </article>
        ))}
      </section>

      {modal === "deactivate" ? (
        <TeamModalFrame
          title="Deactivate Member Account"
          subtitle={
            <>
              You are about to suspend access for <span className="font-bold text-[#172f54]">Dr. Helena Vance.</span>
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
                  The user will be immediately logged out of all active sessions and restricted from the Emerald Portal environment.
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
              onClick={() => setModal(null)}
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#f22952] px-6 text-[17px] font-semibold text-white"
            >
              Confirm Deactivation
            </button>
          </div>
        </TeamModalFrame>
      ) : null}

      {modal === "reactivate" ? (
        <TeamModalFrame
          title="Reactivate Member Account"
          subtitle={
            <>
              Restore system access for <span className="font-bold text-[#172f54]">Marcus Thorne.</span>
            </>
          }
          onClose={() => setModal(null)}
        >
          <div className="rounded-[18px] bg-[#effaf6] px-5 py-5">
            <p className="text-[18px] font-extrabold text-[#172f54]">Account Meta Data</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">Original Role</p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">Senior Analyst</p>
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">Deactivated On</p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">Oct 12, 2023</p>
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8fa0ba]">Department</p>
                <p className="mt-2 text-[17px] font-semibold text-[#172f54]">Audit &amp; Compliance</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-[18px] font-semibold text-[#172f54]">Assigned Clearance Level</label>
            <div className="relative mt-3">
              <select className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-white px-4 pr-11 text-[16px] font-medium text-[#274267] outline-none">
                <option>Level 2 - Standard Access</option>
                <option>Level 3 - Elevated Access</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
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
              onClick={() => setModal(null)}
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
          className="button-primary inline-flex h-12 items-center gap-3 rounded-[14px] bg-[#4b8a60] px-6 text-[18px] font-semibold text-white"
        >
          <Download className="h-4.5 w-4.5" strokeWidth={2} />
          Export Log
        </button>
      </section>

      <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
        <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:grid-cols-4 lg:items-end">
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Search Messages</span>
            <span className="mt-3 flex h-12 items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
              <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
              <input
                className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search by user or entity..."
              />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Admin Role</span>
            <span className="relative mt-3 block">
              <select className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                <option>All Roles</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Date Range</span>
            <span className="relative mt-3 block">
              <select className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                <option>Last 30 Days</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
            </span>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Category</span>
            <span className="relative mt-3 block">
              <select className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                <option>All Categories</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
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

        {auditRows.map((row) => (
          <article
            key={row.id}
            className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.25fr_1.1fr_1.1fr_1.15fr_1fr_0.7fr] lg:items-center"
          >
            <p className="text-[16px] font-medium text-[#536781]">{row.timestamp}</p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_top,#f8d7b8_12%,#d4a97d_42%,#8d694a_100%)]" />
              <p className="text-[17px] font-extrabold text-[#172f54]">{row.user}</p>
            </div>
            <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold ${row.actionClassName}`}>
              {row.action}
            </span>
            <p className="text-[16px] font-semibold text-[#536781]">{row.entity}</p>
            <p className="text-[16px] font-medium text-[#536781]">{row.ip}</p>
            <p className={`text-[16px] font-extrabold uppercase ${row.statusClassName}`}>{row.status}</p>
          </article>
        ))}

        <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <p>Showing 1 to 5 of 12,840 certificates</p>
          <Pager />
        </div>
      </section>
    </>
  );
}

export default function TeamsPage() {
  const [view, setView] = useState<TeamView>("administrative");

  return (
    <AppShell title="Management Team" activeSection="teams" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8">
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-[#f5f6fd] px-4 py-2">
          <TopTab label="Administrative Team" active={view === "administrative"} onClick={() => setView("administrative")} />
          <TopTab label="Audit Logs" active={view === "audit"} onClick={() => setView("audit")} />
        </div>

        {view === "administrative" ? <AdministrativeTeamView /> : null}
        {view === "audit" ? <AuditLogsView /> : null}
      </div>
    </AppShell>
  );
}
