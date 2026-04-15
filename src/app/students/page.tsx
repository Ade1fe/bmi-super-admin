"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  CircleAlert,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type StudentRow = {
  id: number;
  name: string;
  email: string;
  enrolled: string;
  plan: string;
  planClassName: string;
  status: "ACTIVE" | "INACTIVE";
  statusClassName: string;
  joinedDate: string;
};

const topStats = [
  {
    label: "Total Individual Students",
    value: "12,840",
    delta: "+12%",
    icon: Users,
  },
  {
    label: "Active This Month",
    value: "8,420",
    delta: "+5%",
    icon: UserCheck,
  },
  {
    label: "New This Week",
    value: "156",
    delta: "+12%",
    icon: UserPlus,
  },
];

const studentRows: StudentRow[] = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "ACTIVE",
    statusClassName: "text-[#0b8c50]",
    joinedDate: "Oct 24, 2023",
  },
  {
    id: 2,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Premium",
    planClassName: "bg-[#f2e4ff] text-[#9a4dff]",
    status: "INACTIVE",
    statusClassName: "text-[#76839b]",
    joinedDate: "Oct 24, 2023",
  },
  {
    id: 3,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Enterprise",
    planClassName: "bg-[#fff1df] text-[#d88314]",
    status: "ACTIVE",
    statusClassName: "text-[#0b8c50]",
    joinedDate: "Oct 24, 2023",
  },
  {
    id: 4,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Basic",
    planClassName: "bg-[#eef2f7] text-[#8b97aa]",
    status: "ACTIVE",
    statusClassName: "text-[#0b8c50]",
    joinedDate: "Oct 24, 2023",
  },
  {
    id: 5,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "ACTIVE",
    statusClassName: "text-[#0b8c50]",
    joinedDate: "Oct 24, 2023",
  },
  {
    id: 6,
    name: "Emma Thompson",
    email: "emma.t@gmail.com",
    enrolled: "12 Courses",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "ACTIVE",
    statusClassName: "text-[#0b8c50]",
    joinedDate: "Oct 24, 2023",
  },
];

function StudentSummaryCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: typeof Users;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7eafb] bg-white p-5 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef1ff] text-[#5065e3]">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <span className="inline-flex items-center gap-1 text-[14px] font-bold text-[#14985b]">
          {delta}
        </span>
      </div>
      <p className="mt-5 text-[15px] font-medium text-[#334768]">{label}</p>
      <p className="mt-4 text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">
        {value}
      </p>
    </article>
  );
}

function StudentActionMenu({
  onDeactivate,
  onReactivate,
  onGrantAccess,
}: {
  onDeactivate: () => void;
  onReactivate: () => void;
  onGrantAccess: () => void;
}) {
  return (
    <div className="absolute right-3 top-[68px] z-10 hidden w-[228px] rounded-[12px] border border-[#e4e8f4] bg-white p-2 shadow-[0_24px_44px_rgba(166,178,214,0.22)] xl:block">
      <Link
        href="/students/john-doe"
        className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <Eye className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        View Student
      </Link>
      <button
        type="button"
        onClick={onDeactivate}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <ShieldAlert className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Deactivate Student
      </button>
      <button
        type="button"
        onClick={onReactivate}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <UserCheck className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Reactivate Student
      </button>
      <button
        type="button"
        onClick={onGrantAccess}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <UserPlus className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Grant Premium Access
      </button>
    </div>
  );
}

function ModalClose({
  onClose,
  label,
}: {
  onClose: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
    >
      <X className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

function GrantAccessModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close grant access modal" />
          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
              Grant Premium Access
            </h2>
          </div>

          <div className="space-y-6 px-6 py-7">
            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">Select Plan</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[16px] text-[#51627f] outline-none">
                  <option>Choose a plan...</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c88a0]" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">Select Duration</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[16px] text-[#51627f] outline-none">
                  <option>Choose duration...</option>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>12 Months</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c88a0]" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">
                Reason for Granting Access
              </span>
              <textarea
                defaultValue="Internal audit note (e.g., Scholarship recipient, support resolution)"
                className="min-h-[118px] w-full rounded-[10px] border border-[#dce3f2] px-4 py-4 text-[16px] text-[#6b7894] outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[16px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center rounded-[10px] bg-[#0f8751] px-6 text-[16px] font-semibold text-white"
            >
              Grant Access
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DeactivateStudentModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close deactivate student modal" />
          <div className="px-6 py-7 pr-20">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffe9ee] text-[#f04463]">
                <ShieldAlert className="h-8 w-8" strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
                  Deactivate Student Account
                </h2>
              </div>
            </div>

            <div className="mt-7 rounded-[12px] border border-[#ffd7df] bg-[#fff0f3] px-5 py-5 text-[15px] leading-8 text-[#c52c50]">
              Warning: Deactivating this account will block all access to the student portal. No
              data will be deleted, but the student will not be able to log in until the account
              is reactivated.
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">
                Reason for Deactivation
              </span>
              <textarea
                defaultValue="e.g., Transferring schools, End of program, etc."
                className="min-h-[86px] w-full rounded-[10px] border border-[#dce3f2] px-4 py-4 text-[16px] text-[#6b7894] outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[16px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center rounded-[10px] bg-[#ef1f4f] px-6 text-[16px] font-semibold text-white"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ReactivateStudentModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close reactivate student modal" />
          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
              Reactivate Student Account
            </h2>
          </div>

          <div className="space-y-6 px-6 py-7">
            <div className="flex gap-4 rounded-[12px] bg-[#fbfcff] px-4 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dff6eb] text-[#0f8751]">
                <CircleAlert className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="text-[16px] leading-8 text-[#46556f]">
                Restoring access will allow the student to log in using their previous
                credentials. All course progress and profile data will be immediately available.
              </div>
            </div>
            <p className="text-[16px] font-bold text-[#1b2d4b]">
              Student: John Doe (ID: 2024-0891)
            </p>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#c8dfd3] bg-white px-6 text-[16px] font-semibold text-[#4b8a60]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center rounded-[10px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
            >
              Reactivate Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function StudentsPage() {
  const [openMenuRowId, setOpenMenuRowId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [activeDialog, setActiveDialog] = useState<
    "grant" | "deactivate" | "reactivate" | null
  >(null);

  return (
    <AppShell title="Individual Students" activeSection="student">
      {activeDialog === "grant" ? <GrantAccessModal onClose={() => setActiveDialog(null)} /> : null}
      {activeDialog === "deactivate" ? (
        <DeactivateStudentModal onClose={() => setActiveDialog(null)} />
      ) : null}
      {activeDialog === "reactivate" ? (
        <ReactivateStudentModal onClose={() => setActiveDialog(null)} />
      ) : null}

      <section className="flex justify-stretch sm:justify-end">
        <Link
          href="/schools/create-school"
          className="button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] sm:w-auto"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Add New School
        </Link>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        {topStats.map((item) => (
          <StudentSummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            icon={item.icon}
          />
        ))}
      </section>

      <section className="mt-8 border-b border-[#e4e8f4]">
        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-10">
            {[
              { key: "all", label: "All Students" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={[
                  "border-b-[3px] px-1 pb-3 text-[16px] font-bold transition-colors",
                  activeTab === tab.key
                    ? "border-[#0f8751] text-[#4b8a60]"
                    : "border-transparent text-[#6e7c98]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[14px] border border-[#e4ece9] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.10)]">
        <div className="flex flex-col gap-4 border-b border-[#eef2f7] px-6 py-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
            Student Progress Details
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#dce3f2] bg-[#fbfcff] px-4 text-[#95a0b4] sm:min-w-[360px]">
              <Search className="h-4.5 w-4.5" strokeWidth={2} />
              <input
                className="w-full bg-transparent text-[15px] text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search by name, ID or course..."
              />
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#f5f7fb] px-5 text-[15px] font-semibold text-[#5d6b85]"
            >
              <Filter className="h-4.5 w-4.5" strokeWidth={2} />
              Filter
            </button>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#f5f7fb] text-[#5d6b85]"
            >
              <Download className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4 xl:hidden">
          {studentRows.map((row) => (
            <article key={row.id} className="rounded-[12px] border border-[#edf0f7] bg-[#fbfcff] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e1f29] text-[15px] font-bold text-white">
                    ET
                  </span>
                  <div className="min-w-0">
                    <Link
                      href="/students/john-doe"
                      className="block truncate text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]"
                    >
                      {row.name}
                    </Link>
                    <p className="mt-1 truncate text-[14px] text-[#7f8cab]">{row.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenMenuRowId((current) => (current === row.id ? null : row.id))}
                  className="rounded-full p-1.5 text-[#a0aac0]"
                >
                  <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>

              <div className="mt-5 grid gap-3 rounded-[12px] bg-white p-4 text-[14px] text-[#61708b]">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#8b97ad]">Enrolled</span>
                  <span className="text-[#40516f]">{row.enrolled}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#8b97ad]">Plan</span>
                  <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${row.planClassName}`}>
                    {row.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#8b97ad]">Status</span>
                  <span className={`font-bold ${row.statusClassName}`}>● {row.status}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#8b97ad]">Join Date</span>
                  <span className="text-[#40516f]">{row.joinedDate}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/students/john-doe"
                  className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[14px] font-semibold text-[#5a6986]"
                >
                  View Student
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveDialog("grant")}
                  className="button-primary inline-flex h-12 items-center justify-center rounded-[10px] bg-[#4b8a60] px-4 text-[14px] font-semibold text-white"
                >
                  Grant Premium Access
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto xl:block xl:overflow-visible">
          <table className="min-w-[1180px] w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[14%]" />
              <col className="w-[17%]" />
              <col className="w-[11%]" />
              <col className="w-[10%]" />
              <col className="w-[56px]" />
            </colgroup>
            <thead>
              <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                <th className="rounded-tl-[14px] px-8 py-5">Student Name</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Enrolled</th>
                <th className="px-6 py-5">Subscription Plan</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Join Date</th>
                <th className="rounded-tr-[14px] px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map((row) => (
                <tr key={row.id} className="group relative text-[15px] text-[#6f7d98]">
                  <td className="border-b border-[#edf0f7] px-8 py-7">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#20242e] text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(22,28,41,0.16)]">
                        ET
                      </span>
                      <div className="min-w-0">
                        <Link
                          href="/students/john-doe"
                          className="block truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]"
                        >
                          {row.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-7 text-[#40516f]">
                    <span className="block truncate" title={row.email}>
                      {row.email}
                    </span>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-7 font-semibold text-[#5d6f8f]">
                    {row.enrolled}
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-7">
                    <span
                      className={`inline-flex min-h-10 items-center rounded-full px-4 py-1.5 text-[13px] font-bold ${row.planClassName}`}
                    >
                      {row.plan}
                    </span>
                  </td>
                  <td
                    className={`border-b border-[#edf0f7] px-6 py-7 text-[13px] font-bold ${row.statusClassName}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-7 text-[#6d7b97]">
                    {row.joinedDate}
                  </td>
                  <td className="relative border-b border-[#edf0f7] px-4 py-7 text-center">
                    <button
                      type="button"
                      className="rounded-full p-1.5 text-[#a0aac0] transition-colors hover:bg-[#f5f7fb] hover:text-[#70809d]"
                      onClick={() => setOpenMenuRowId((current) => (current === row.id ? null : row.id))}
                    >
                      <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
                    </button>

                    {openMenuRowId === row.id ? (
                      <StudentActionMenu
                        onDeactivate={() => {
                          setOpenMenuRowId(null);
                          setActiveDialog("deactivate");
                        }}
                        onReactivate={() => {
                          setOpenMenuRowId(null);
                          setActiveDialog("reactivate");
                        }}
                        onGrantAccess={() => {
                          setOpenMenuRowId(null);
                          setActiveDialog("grant");
                        }}
                      />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#edf0f7] px-6 py-5 text-[15px] font-semibold text-[#6e7c98] sm:flex-row sm:items-center sm:justify-between">
          <p>Showing 1 to 5 of 12,840 students</p>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7]">
              ‹
            </button>
            <button className="button-primary flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0f8751] text-[15px] font-bold text-white">
              1
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">3</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#93a0b7]">…</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">256</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7]">
              ›
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
