"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoreVertical,
  PauseCircle,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type SchoolRow = {
  id: number;
  name: string;
  schoolId: string;
  email: string;
  students: string;
  plan: string;
  planClassName: string;
  status: string;
  statusClassName: string;
  joinedDate: string;
};

const tabs = [
  { label: "School Setting", count: 2, active: true },
  { label: "Support Center", count: 2 },
  { label: "Pricing", count: 2 },
];

const topStats = [
  { label: "Average Completion Rate", value: "72%", delta: "+12%", positive: true },
  { label: "Active Students", value: "450,000", delta: "+5%", positive: true },
  { label: "Average Completion Rate", value: "$89,200", delta: "-2%", positive: false },
];

const schoolRows: SchoolRow[] = [
  {
    id: 1,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 2,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Premium",
    planClassName: "bg-[#f2e4ff] text-[#9a4dff]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 3,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Trial",
    planClassName: "bg-[#eef2f7] text-[#49556e]",
    status: "Trial",
    statusClassName: "text-[#4684ff]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 4,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Basic",
    planClassName: "bg-[#eef2f7] text-[#8b97aa]",
    status: "Basic",
    statusClassName: "text-[#8b97aa]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 5,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Suspended",
    statusClassName: "text-[#ff4747]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 6,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 7,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 8,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
  {
    id: 9,
    name: "Greenwood Academy",
    schoolId: "SCH-8921",
    email: "admin@greenwood.edu",
    students: "1,240",
    plan: "Enterprise",
    planClassName: "bg-[#e7efff] text-[#2f66df]",
    status: "Active",
    statusClassName: "text-[#29c45a]",
    joinedDate: "Jan 12, 2023",
  },
];

const footerStats = [
  { label: "TOTAL SCHOOLS", value: "146", note: "+12% vs LY", noteClassName: "text-[#28c85d]" },
  { label: "ACTIVE TRIALS", value: "18", note: "6 ending soon", noteClassName: "text-[#456ef7]" },
  { label: "TOTAL STUDENTS", value: "84.2k", note: "+2.4k this month", noteClassName: "text-[#28c85d]" },
  { label: "MONTHLY REVENUE", value: "$128.5k", note: "", noteClassName: "text-[#28c85d]" },
];

function SummaryCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <article className="rounded-[18px] border border-[#e7eafb] bg-white px-6 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:px-10">
      <p className="text-[15px] font-medium text-[#334768]">{label}</p>
      <div className="mt-7 flex items-center gap-3">
        <p className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
        <span
          className={[
            "inline-flex items-center gap-1 text-[14px] font-bold",
            positive ? "text-[#14985b]" : "text-[#ff4451]",
          ].join(" ")}
        >
          {delta}
          {positive ? (
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.3} />
          ) : (
            <ArrowDownRight className="h-4 w-4" strokeWidth={2.3} />
          )}
        </span>
      </div>
    </article>
  );
}

export default function SchoolsPage() {
  const [openMenuRowId, setOpenMenuRowId] = useState<number | null>(1);

  return (
    <AppShell title="Schools Management" activeSection="schools">
      <section className="rounded-[18px] bg-[#f2f4fb] p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={[
                "inline-flex h-12 items-center gap-3 rounded-2xl px-4 text-[15px] font-semibold transition-colors",
                tab.active
                  ? "bg-white text-[#4b8a60] shadow-[0_8px_24px_rgba(185,194,225,0.14)]"
                  : "text-[#606b83]",
              ].join(" ")}
            >
              {tab.label}
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f0f2f8] px-2 text-[13px] text-[#6f7891]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 flex justify-end">
        <Link
          href="/schools/create-school"
          className="inline-flex h-14 items-center gap-3 rounded-xl bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Add New School
        </Link>
      </section>

      <section className="mt-10 grid gap-4 xl:grid-cols-3">
        {topStats.map((item) => (
          <SummaryCard
            key={`${item.label}-${item.value}`}
            label={item.label}
            value={item.value}
            delta={item.delta}
            positive={item.positive}
          />
        ))}
      </section>

      <section className="mt-8 rounded-[24px] border border-[#e4e8f6] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="min-w-[1240px] table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[360px]" />
              <col className="w-[170px]" />
              <col className="w-[300px]" />
              <col className="w-[140px]" />
              <col className="w-[160px]" />
              <col className="w-[160px]" />
              <col className="w-[190px]" />
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr className="bg-[#f5f7fb] text-left text-[14px] font-bold uppercase tracking-[0.14em] text-[#70809d]">
                <th className="rounded-tl-[24px] px-8 py-7">School Name</th>
                <th className="px-6 py-7">School ID</th>
                <th className="px-6 py-7">Admin Email</th>
                <th className="px-6 py-7">Students</th>
                <th className="px-6 py-7">Plan</th>
                <th className="px-6 py-7">Status</th>
                <th className="px-6 py-7">Joined Date</th>
                <th className="rounded-tr-[24px] px-6 py-7" />
              </tr>
            </thead>
            <tbody>
              {schoolRows.map((row) => (
                <tr key={row.id} className="relative text-[16px] text-[#6f7d98]">
                  <td className="border-b border-[#edf0f7] px-8 py-8">
                    <div className="flex items-center gap-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#dfe5ff] text-[17px] font-bold text-[#4055c5]">
                        GS
                      </span>
                      <Link
                        href="/schools/greenfield-schools"
                        className="text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]"
                      >
                        {row.name}
                      </Link>
                    </div>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8 text-[16px] text-[#7f8cab]">
                    ID: {row.schoolId}
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8 text-[16px] text-[#6e7c98]">
                    {row.email}
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8 text-[18px] font-extrabold text-[#121f33]">
                    {row.students}
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8">
                    <span
                      className={`inline-flex min-h-10 items-center rounded-full px-5 text-[14px] font-bold ${row.planClassName}`}
                    >
                      {row.plan}
                    </span>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8">
                    <span
                      className={`inline-flex items-center gap-2.5 text-[14px] font-bold ${row.statusClassName}`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="border-b border-[#edf0f7] px-6 py-8 text-[16px] text-[#6d7b97]">
                    {row.joinedDate}
                  </td>
                  <td className="relative border-b border-[#edf0f7] px-6 py-8">
                    <button
                      type="button"
                      className="rounded-full p-1.5 text-[#a0aac0]"
                      onClick={() =>
                        setOpenMenuRowId((current) => (current === row.id ? null : row.id))
                      }
                    >
                      <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
                    </button>

                    {openMenuRowId === row.id ? (
                      <div className="absolute right-8 top-[70px] z-10 w-[220px] rounded-[18px] border border-[#e4e8f4] bg-white p-2.5 shadow-[0_24px_44px_rgba(166,178,214,0.22)]">
                        <Link
                          href="/schools/greenfield-schools"
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#5a6986] hover:bg-[#f6f8fd]"
                        >
                          <PauseCircle className="h-4.5 w-4.5 text-[#56657f]" strokeWidth={2} />
                          View Details
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium text-[#5a6986] hover:bg-[#f6f8fd]"
                        >
                          <TriangleAlert className="h-4.5 w-4.5 text-[#56657f]" strokeWidth={2} />
                          Move / Transfer Student
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 xl:grid-cols-4">
        {footerStats.map((item, index) => (
          <article
            key={item.label}
            className="rounded-[18px] border border-[#e7eafb] bg-white px-8 py-7 shadow-[0_16px_34px_rgba(171,185,223,0.06)]"
          >
            <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#2f4365]">
              {item.label}
            </p>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-[32px] font-extrabold tracking-[-0.05em] text-[#17345d]">
                {item.value}
              </p>
              {item.note ? (
                <p className={`text-[14px] font-bold ${item.noteClassName}`}>{item.note}</p>
              ) : (
                <span className={index === 3 ? "text-[#0f8d4e]" : "hidden"}>
                  <ArrowUpRight className="h-7 w-7" strokeWidth={2.2} />
                </span>
              )}
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
