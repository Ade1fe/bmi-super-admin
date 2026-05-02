"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type ReportTab = "school-usage" | "course-performance" | "student-activity" | "revenue";

type SchoolUsageRow = {
  id: number;
  name: string;
  schoolId: string;
  users: string;
  engagement: number;
  status: string;
};

type CourseAuditRow = {
  id: number;
  title: string;
  instructor: string;
  openRate: string;
  dropOffRate: number;
  exitPoint: string;
  exitTone: string;
};

type StudentLeaderboardRow = {
  id: number;
  name: string;
  detail: string;
  institution: string;
  hours: string;
  score: string;
  action: string;
};

type RevenueRow = {
  id: number;
  entity: string;
  owner: string;
  plan: string;
  date: string;
  amount: string;
  status: string;
  statusClassName: string;
};

const reportTabs: Array<{ key: ReportTab; label: string }> = [
  { key: "school-usage", label: "School Usage" },
  { key: "course-performance", label: "Course Performance" },
  { key: "student-activity", label: "Student Activity" },
  { key: "revenue", label: "Revenue" },
];

const schoolUsageRows: SchoolUsageRow[] = [
  { id: 1, name: "Greenview High", schoolId: "SCH-2023-01", users: "4,201", engagement: 45, status: "Active" },
  { id: 2, name: "Greenview High", schoolId: "SCH-2023-01", users: "4,201", engagement: 45, status: "Active" },
  { id: 3, name: "Greenview High", schoolId: "SCH-2023-01", users: "4,201", engagement: 45, status: "Active" },
  { id: 4, name: "Greenview High", schoolId: "SCH-2023-01", users: "4,201", engagement: 45, status: "Active" },
  { id: 5, name: "Greenview High", schoolId: "SCH-2023-01", users: "4,201", engagement: 45, status: "Active" },
];

const courseAuditRows: CourseAuditRow[] = [
  {
    id: 1,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Module 03 Quiz",
    exitTone: "bg-[#ffe9ea] text-[#ef4b4b]",
  },
  {
    id: 2,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Module 03 Quiz",
    exitTone: "bg-[#ffe9ea] text-[#ef4b4b]",
  },
  {
    id: 3,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Module 03 Quiz",
    exitTone: "bg-[#ffe9ea] text-[#ef4b4b]",
  },
  {
    id: 4,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Case Study 4",
    exitTone: "bg-[#fff2dd] text-[#e58b1d]",
  },
  {
    id: 5,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Module 03 Quiz",
    exitTone: "bg-[#ffe9ea] text-[#ef4b4b]",
  },
  {
    id: 6,
    title: "Intro to Molecular Biology",
    instructor: "Dr Sarah Vance",
    openRate: "3,240",
    dropOffRate: 42,
    exitPoint: "Module 03 Quiz",
    exitTone: "bg-[#ffe9ea] text-[#ef4b4b]",
  },
];

const studentLeaderboardRows: StudentLeaderboardRow[] = [
  {
    id: 1,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "Live Now",
  },
  {
    id: 2,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "View Audit",
  },
  {
    id: 3,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "Live Now",
  },
  {
    id: 4,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "Live Now",
  },
  {
    id: 5,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "Live Now",
  },
  {
    id: 6,
    name: "Adrian Albright",
    detail: "ID: EP-AC54-JCCM",
    institution: "Oxford Institute of Tech",
    hours: "142.5H",
    score: "94%",
    action: "Live Now",
  },
];

const revenueRows: RevenueRow[] = [
  {
    id: 1,
    entity: "Intro to Molecular Biology",
    owner: "Dr Sarah Vance",
    plan: "Enterprise School",
    date: "Jan 12, 2024",
    amount: "$12,500.00",
    status: "Completed",
    statusClassName: "bg-[#e7f8ef] text-[#0f8751]",
  },
  {
    id: 2,
    entity: "Intro to Molecular Biology",
    owner: "Dr Sarah Vance",
    plan: "Enterprise School",
    date: "Jan 12, 2024",
    amount: "$12,500.00",
    status: "In Progress",
    statusClassName: "bg-[#fff2cf] text-[#cf7a07]",
  },
  {
    id: 3,
    entity: "Intro to Molecular Biology",
    owner: "Dr Sarah Vance",
    plan: "Enterprise School",
    date: "Jan 12, 2024",
    amount: "$12,500.00",
    status: "Completed",
    statusClassName: "bg-[#e7f8ef] text-[#0f8751]",
  },
  {
    id: 4,
    entity: "Intro to Molecular Biology",
    owner: "Dr Sarah Vance",
    plan: "Enterprise School",
    date: "Jan 12, 2024",
    amount: "$12,500.00",
    status: "Completed",
    statusClassName: "bg-[#e7f8ef] text-[#0f8751]",
  },
];

const growthBars = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 27 },
  { month: "April", value: 68, highlight: true },
  { month: "May", value: 58 },
  { month: "June", value: 33 },
  { month: "July", value: 18 },
];

const studentActivityTrend = [52, 55, 53, 54, 55, 56, 56, 58, 57, 60, 63, 64, 64, 62, 60, 64, 66, 69, 69, 66, 68, 66, 67, 72, 79];
const chartWidth = 640;
const chartHeight = 220;
const trendMin = Math.min(...studentActivityTrend);
const trendMax = Math.max(...studentActivityTrend);
const trendRange = trendMax - trendMin || 1;

function ReportTabButton({
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
      className={`border-b-[3px] pb-3 text-[18px] font-semibold transition-colors ${
        active ? "border-[#0f8751] text-[#4b8a60]" : "border-transparent text-[#667892]"
      }`}
    >
      {label}
    </button>
  );
}

function ReportMetricCard({
  title,
  value,
  note,
  tone = "bg-white",
  noteClassName = "text-[#14a467]",
}: {
  title: string;
  value: string;
  note: string;
  tone?: string;
  noteClassName?: string;
}) {
  return (
    <article className={`rounded-[22px] border border-[#dfe6f7] px-6 py-7 shadow-[0_18px_40px_rgba(180,192,227,0.06)] ${tone}`}>
      <p className="text-[16px] font-extrabold tracking-[-0.03em] text-[#173257]">{title}</p>
      <p className="mt-8 text-[52px] font-extrabold tracking-[-0.06em] text-[#173257]">{value}</p>
      <p className={`mt-3 text-[16px] font-semibold ${noteClassName}`}>{note}</p>
    </article>
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

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">{title}</h3>
          {subtitle ? <p className="mt-1 text-[15px] text-[#7c8ba3]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

function SchoolUsageView() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-6">
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-7 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Select Date Range</h3>
              <CalendarDays className="h-5 w-5 text-[#4961e8]" strokeWidth={2.1} />
            </div>
            <div className="mt-8 flex items-center justify-between text-[#5f7290]">
              <button type="button">
                <ChevronLeft className="h-4.5 w-4.5" strokeWidth={2.2} />
              </button>
              <p className="text-[18px] font-extrabold text-[#172f54]">October 2023</p>
              <button type="button">
                <ChevronRight className="h-4.5 w-4.5" strokeWidth={2.2} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-[#97a4b8]">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {[28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1].map(
                (date, index) => {
                  const active = date === 5 || date === 30;
                  const muted = index < 3 || index === 34;
                  return (
                    <div
                      key={`${date}-${index}`}
                      className={`flex h-10 items-center justify-center rounded-[10px] text-[16px] font-medium ${
                        active
                          ? "bg-[#4b63e9] text-white"
                          : muted
                            ? "text-[#c4ccdb]"
                            : "bg-[#f6f8fd] text-[#324765]"
                      }`}
                    >
                      {date}
                    </div>
                  );
                },
              )}
            </div>
          </article>

          <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-7 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
            <h3 className="text-[18px] font-extrabold uppercase tracking-[0.08em] text-[#172f54]">Export Options</h3>
            <div className="mt-6 space-y-4">
              {["PDF Document", "Excel Spreadsheet", "CSV Data File"].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[16px] bg-[#f4f6ff] px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[12px] font-extrabold ${
                        index === 0
                          ? "bg-[#fff0f0] text-[#ff4a4a]"
                          : index === 1
                            ? "bg-[#eefbf2] text-[#0f8751]"
                            : "bg-[#eef4ff] text-[#3567ff]"
                      }`}
                    >
                      {index === 0 ? "PDF" : index === 1 ? "XLS" : "CSV"}
                    </span>
                    <span className="text-[17px] font-semibold text-[#223f64]">{label}</span>
                  </div>
                  <Download className="h-5 w-5 text-[#98a2b6]" strokeWidth={2.1} />
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <ReportMetricCard title="Active Schools" value="1,248" note="+12% from last month" tone="bg-[#edf8f2]" />
            <ReportMetricCard
              title="Average Session Duration"
              value="42m 15s"
              note="Average Session Duration"
              tone="bg-[#eef4ff]"
              noteClassName="text-[#3567ff]"
            />
          </div>

          <SectionCard
            title="Lesson Engagement"
            action={
              <label className="flex h-11 w-full max-w-[328px] items-center gap-3 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[#95a0b4]">
                <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
                <input
                  className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                  placeholder="Search schools..."
                />
              </label>
            }
          >
            <div className="hidden grid-cols-[1.6fr_0.8fr_1fr_0.7fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9aa6ba] lg:grid">
              <span>Lesson Name</span>
              <span>Active Users</span>
              <span>Avg. Engagement</span>
              <span>Status</span>
            </div>
            {schoolUsageRows.map((row) => (
              <article
                key={row.id}
                className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.6fr_0.8fr_1fr_0.7fr] lg:items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[15px] font-extrabold text-white">
                    01
                  </span>
                  <div>
                    <p className="text-[17px] font-extrabold text-[#172f54]">{row.name}</p>
                    <p className="mt-1 text-[14px] text-[#7c8ba3]">ID: {row.schoolId}</p>
                  </div>
                </div>
                <p className="text-[16px] font-bold text-[#536781]">{row.users}</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full max-w-[100px] overflow-hidden rounded-full bg-[#e7ecf5]">
                    <div className="h-full rounded-full bg-[#0f8751]" style={{ width: `${row.engagement}%` }} />
                  </div>
                  <span className="text-[14px] font-medium text-[#536781]">{row.engagement}% Activity</span>
                </div>
                <span className="inline-flex w-fit rounded-full bg-[#e5f7ef] px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#0f8a4f]">
                  {row.status}
                </span>
              </article>
            ))}
          </SectionCard>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#dfe6f7] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">User Growth Trends</h2>
            <p className="mt-1 text-[15px] text-[#7e8aa0]">User Growth Trends over the last 6 months</p>
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[15px] font-semibold text-[#223f64]"
          >
            <CalendarDays className="h-4.5 w-4.5" strokeWidth={2} />
            Last 6 month
            <ChevronDown className="h-4 w-4" strokeWidth={2.1} />
          </button>
        </div>

        <div className="mt-10 grid h-[280px] grid-cols-7 items-end gap-4 sm:h-[360px] sm:gap-7">
          {growthBars.map((bar) => (
            <div key={bar.month} className="flex h-full flex-col items-center justify-end gap-4">
              <div className="flex h-full w-full items-end">
                <div
                  className={[
                    "w-full rounded-t-[10px] bg-[#cfe1da]",
                    bar.highlight ? "bg-[linear-gradient(180deg,#5ea68b_0%,#58a486_70%,#dfffee_100%)]" : "",
                  ].join(" ")}
                  style={{ height: `${bar.value}%` }}
                />
              </div>
              <span className="text-[14px] font-medium text-[#7f88a0] sm:text-[16px]">{bar.month}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CoursePerformanceView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Course Performance</h2>
          <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
            Comprehensive analysis of student progression, engagement metrics, and instructional efficacy across the portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Last 70d", "Last 30 d", "Custom"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`inline-flex h-11 items-center justify-center rounded-[14px] border px-5 text-[14px] font-semibold ${
                index === 1
                  ? "border-[#0f8751] bg-[#0f8751] text-white"
                  : "border-[#cadfd5] bg-white text-[#6c7f9b]"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#cadfd5] bg-white px-5 text-[14px] font-semibold text-[#0f8751]"
          >
            <CalendarDays className="h-4.5 w-4.5" strokeWidth={2} />
            Date Range
          </button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_250px]">
        <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-7 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Course Completion Funnel</h3>
          <div className="mt-8 space-y-6">
            {[
              { label: "Enrollment", note: "100% (12.4K)", width: "100%", chip: "PHASE 01: INITIAL ACCESS" },
              { label: "First Lesson Completed", note: "78% (9.6K)", width: "81%", chip: "PHASE 02: ENGAGEMENT" },
              { label: "Mid -Point Quiz Passed", note: "100% (12.4K)", width: "62%", chip: "PHASE 03: ASSESSMENT" },
              { label: "Final Exam & Certification", note: "34% (4.2K)", width: "45%", chip: "PHASE 01: INITIAL ACCESS" },
            ].map((step) => (
              <div key={step.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-[16px] font-semibold text-[#172f54]">{step.label}</p>
                  <p className="text-[14px] font-extrabold text-[#172f54]">{step.note}</p>
                </div>
                <div className="rounded-[16px] bg-[#edf2ff] p-1">
                  <div
                    className="flex h-12 items-center rounded-[14px] bg-[linear-gradient(90deg,#3154d9_0%,#284fdd_100%)] px-4 text-[15px] font-extrabold text-white"
                    style={{ width: step.width }}
                  >
                    {step.chip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#dfe6f7] bg-[#f7f9ff] p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <p className="text-[12px] italic text-[#4f63dc]">Academic Health</p>
          <h3 className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-[#0f8751]">Average Quiz Scores</h3>
          <p className="mt-8 text-[68px] font-extrabold tracking-[-0.08em] text-[#172f54]">84.2%</p>
          <p className="mt-3 text-[15px] font-bold uppercase text-[#172f54]">+2.4% from prev. month</p>
          <div className="mt-10 space-y-5 text-[15px] text-[#5f7290]">
            <div className="flex items-center justify-between gap-4">
              <span>Highest Score (Design)</span>
              <span className="font-extrabold text-[#172f54]">92.1%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Lowest Score (Math)</span>
              <span className="font-extrabold text-[#172f54]">71.5%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Total Assessments</span>
              <span className="font-extrabold text-[#172f54]">48,291</span>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">Most Popular Courses</h3>
          <button type="button" className="text-[16px] font-extrabold text-[#0f8751]">
            View All →
          </button>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {new Array(4).fill(null).map((_, index) => (
            <article key={index} className="overflow-hidden rounded-[18px] border border-[#dfe6f7] bg-white shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
              <div className="relative h-[210px] bg-[linear-gradient(135deg,#1d0404_0%,#4c0c0c_35%,#0b0b0f_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#ff6a00_0%,transparent_34%)] opacity-60" />
                <div className="absolute right-4 top-4 rounded-[8px] bg-[#0f8751] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white">
                  9.8K Enroll
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="max-w-[190px] text-[14px] font-semibold uppercase tracking-[0.06em] text-white/75">
                    Top Design
                  </div>
                  <div className="mt-1 text-[44px] font-extrabold leading-none tracking-[-0.06em] text-white">
                    USE 1
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[16px] font-extrabold text-[#172f54]">Advanced Data Structures</p>
                <p className="mt-1 text-[14px] uppercase tracking-[0.06em] text-[#9aa6ba]">Computer Science</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionCard
        title="Recent Transactions"
        action={
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f6f8fd] text-[#6c7f9b]">
              <Filter className="h-4.5 w-4.5" strokeWidth={2.1} />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f6f8fd] text-[#6c7f9b]">
              <Download className="h-4.5 w-4.5" strokeWidth={2.1} />
            </button>
          </div>
        }
      >
        <div className="hidden grid-cols-[1.6fr_0.8fr_0.9fr_1fr_1fr_0.8fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9aa6ba] lg:grid">
          <span>Course Title</span>
          <span>Open Rate</span>
          <span>Total Students</span>
          <span>Drop-Off Rate</span>
          <span>Critical Exit Point</span>
          <span>Actions</span>
        </div>
        {courseAuditRows.map((row) => (
          <article
            key={row.id}
            className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.6fr_0.8fr_0.9fr_1fr_1fr_0.8fr] lg:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[14px] font-extrabold text-white">
                GS
              </span>
              <div>
                <p className="text-[17px] font-extrabold text-[#172f54]">{row.title}</p>
                <p className="mt-1 text-[14px] text-[#7c8ba3]">{row.instructor}</p>
              </div>
            </div>
            <p className="text-[16px] font-bold text-[#536781]">{row.openRate}</p>
            <p className="text-[16px] font-bold text-[#536781]">{row.openRate}</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-full max-w-[90px] overflow-hidden rounded-full bg-[#ffe5e5]">
                <div className="h-full rounded-full bg-[#ef4b4b]" style={{ width: `${row.dropOffRate}%` }} />
              </div>
              <span className="text-[15px] font-extrabold text-[#ef4b4b]">{row.dropOffRate}%</span>
            </div>
            <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${row.exitTone}`}>
              {row.exitPoint}
            </span>
            <button type="button" className="text-left text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#0f8751]">
              Review Audit
            </button>
          </article>
        ))}
        <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <p>Showing 1 to 5 of 12,840 certificates</p>
          <Pager />
        </div>
      </SectionCard>
    </div>
  );
}

function StudentActivityView() {
  const linePoints = useMemo(
    () =>
      studentActivityTrend
        .map((value, index) => {
          const x = 12 + (index * (chartWidth - 24)) / (studentActivityTrend.length - 1);
          const y = 180 - ((value - trendMin) / trendRange) * 95;
          return `${x},${y}`;
        })
        .join(" "),
    [],
  );

  const heatmapRows = new Array(36).fill(null).map((_, rowIndex) =>
    new Array(5).fill(null).map((__, columnIndex) => {
      const phase = (rowIndex + columnIndex * 5) % 10;
      if (phase >= 7) return "bg-[#5b11d2]";
      if (phase >= 4) return "bg-[#8e74ff]";
      return "bg-[#e9ddff]";
    }),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Student Activity</h2>
          <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
            Comprehensive analysis of student progression, engagement metrics, and instructional efficacy across the portal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#cadfd5] bg-white px-5 text-[14px] font-semibold text-[#0f8751]"
          >
            <CalendarDays className="h-4.5 w-4.5" strokeWidth={2} />
            Oct 01 - Oct 31, 2023
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="button-primary inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#4b8a60] px-5 text-[14px] font-semibold text-white"
          >
            <Download className="h-4.5 w-4.5" strokeWidth={2} />
            Export Data
          </button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_220px]">
        <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Daily Active Users (DAU)</h3>
          <div className="mt-6">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[230px] w-full"
              preserveAspectRatio="none"
              aria-label="Daily active users"
            >
              <defs>
                <linearGradient id="student-activity-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4b8b62" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#4b8b62" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon points={`12,190 ${linePoints} ${chartWidth - 12},190`} fill="url(#student-activity-fill)" />
              <polyline
                points={linePoints}
                fill="none"
                stroke="#0f8751"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-medium text-[#7f88a0] sm:text-[14px]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-[24px] border border-[#dfe6f7] bg-[#f7f9ff] p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <p className="text-[12px] text-[#4f63dc]">NEW</p>
          <p className="mt-4 text-[15px] leading-7 text-[#667892]">
            Average student engagement: duration during each session across all digital modules per session.
          </p>
          <div className="mt-12">
            <span className="text-[64px] font-extrabold tracking-[-0.08em] text-[#172f54]">48.5</span>
            <span className="ml-2 text-[22px] font-semibold text-[#172f54]">min</span>
          </div>
        </article>
      </section>

      <section className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0f8751]">Density Analysis</p>
            <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">
              Platform Activity by Hour &amp; Day
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#98a2b6]">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#e9ddff]" />Low</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#8e74ff]" />Mid</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#5b11d2]" />High</span>
          </div>
        </div>
        <div className="mt-8">
          <div className="mb-3 grid grid-cols-[60px_repeat(5,minmax(0,1fr))] gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#98a2b6]">
            <span />
            {["12AM", "6AM", "12PM", "6PM", "11PM"].map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
          <div className="space-y-1.5">
            {heatmapRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-[60px_repeat(5,minmax(0,1fr))] gap-2">
                <span className="flex items-center text-[11px] font-bold uppercase tracking-[0.08em] text-[#98a2b6]">
                  {rowIndex === 6 ? "Mon" : rowIndex === 20 ? "Wed" : rowIndex === 32 ? "Fri" : ""}
                </span>
                {row.map((shade, columnIndex) => (
                  <div key={`${rowIndex}-${columnIndex}`} className={`h-5 rounded-[4px] ${shade}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionCard
        title="Top Engaged Students"
        action={
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f6f8fd] text-[#6c7f9b]">
              <Filter className="h-4.5 w-4.5" strokeWidth={2.1} />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f6f8fd] text-[#6c7f9b]">
              <Download className="h-4.5 w-4.5" strokeWidth={2.1} />
            </button>
          </div>
        }
      >
        <div className="hidden grid-cols-[1.45fr_1.15fr_0.7fr_0.85fr_0.8fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9aa6ba] lg:grid">
          <span>Course Title</span>
          <span>Primary Institution</span>
          <span>Total Hours</span>
          <span>Critical Exit Point</span>
          <span>Actions</span>
        </div>
        {studentLeaderboardRows.map((row) => (
          <article
            key={row.id}
            className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.45fr_1.15fr_0.7fr_0.85fr_0.8fr] lg:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[14px] font-extrabold text-white">
                AA
              </span>
              <div>
                <p className="text-[17px] font-extrabold text-[#172f54]">{row.name}</p>
                <p className="mt-1 text-[13px] text-[#7c8ba3]">{row.detail}</p>
              </div>
            </div>
            <p className="text-[15px] font-medium text-[#536781]">{row.institution}</p>
            <p className="text-[15px] font-extrabold text-[#172f54]">{row.hours}</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-full max-w-[90px] overflow-hidden rounded-full bg-[#e7ecf5]">
                <div className="h-full rounded-full bg-[#0f8751]" style={{ width: row.score }} />
              </div>
              <span className="text-[15px] font-extrabold text-[#172f54]">{row.score}</span>
            </div>
            <span className="inline-flex w-fit rounded-full bg-[#e5f7ef] px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#0f8a4f]">
              {row.action}
            </span>
          </article>
        ))}
        <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <p>Showing 1 to 5 of 12,840 certificates</p>
          <Pager />
        </div>
      </SectionCard>
    </div>
  );
}

function RevenueView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">Revenue</h2>
          <p className="mt-2 max-w-[760px] text-[18px] leading-8 text-[#4f627e]">
            Subscription health, payment throughput, and revenue retention insights across the portal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#bfc8ff] bg-white px-5 text-[16px] font-semibold text-[#0f8751]"
          >
            <CalendarDays className="h-4.5 w-4.5" strokeWidth={2} />
            OCT 2023 - JAN 2024
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="button-primary inline-flex h-12 items-center gap-2 rounded-[14px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
          >
            <Download className="h-4.5 w-4.5" strokeWidth={2} />
            Export Data
          </button>
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-3">
        <ReportMetricCard title="Monthly Recurring Revenue" value="$482,904" note="+12%" />
        <ReportMetricCard title="Average Revenue Per User" value="$142.50" note="Plan optimization required" noteClassName="text-[#ff7d1a]" />
        <ReportMetricCard title="Global Average Retention Rate: 1.8%" value="98.2%" note="High Health Score" noteClassName="text-[#0f8751]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_400px]">
        <SectionCard
          title="Recent Transactions"
          action={
            <button type="button" className="text-[16px] font-extrabold text-[#0f8751]">
              View All Records →
            </button>
          }
        >
          <div className="hidden grid-cols-[1.55fr_1fr_0.8fr_0.9fr_0.8fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9aa6ba] lg:grid">
            <span>Entity</span>
            <span>Plan Type</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {revenueRows.map((row) => (
            <article
              key={row.id}
              className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.55fr_1fr_0.8fr_0.9fr_0.8fr] lg:items-center"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[16px] font-extrabold text-white">
                  GS
                </span>
                <div>
                  <p className="text-[17px] font-extrabold text-[#172f54]">{row.entity}</p>
                  <p className="mt-1 text-[14px] text-[#7c8ba3]">{row.owner}</p>
                </div>
              </div>
              <p className="text-[16px] font-bold text-[#536781]">{row.plan}</p>
              <p className="text-[16px] font-medium text-[#536781]">{row.date}</p>
              <p className="text-[16px] font-extrabold text-[#172f54]">{row.amount}</p>
              <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${row.statusClassName}`}>
                {row.status}
              </span>
            </article>
          ))}
        </SectionCard>

        <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">Student Registrations</h3>
          <div className="mt-8 flex justify-center">
            <div className="relative flex h-[270px] w-[270px] items-center justify-center rounded-full bg-[conic-gradient(#1916be_0_285deg,#e76b49_285deg_360deg)] shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex h-[146px] w-[146px] flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[54px] font-extrabold tracking-[-0.07em] text-[#3e3e3e]">75%</span>
                <span className="mt-1 text-[15px] font-medium uppercase tracking-[0.08em] text-[#6d7f98]">Schools</span>
              </div>
              <div className="absolute left-5 top-[74px] rounded-[12px] bg-[#2e2f35] px-3 py-3 text-[16px] font-extrabold text-white">45%</div>
              <div className="absolute right-4 top-[120px] rounded-[12px] bg-[#2e2f35] px-3 py-3 text-[16px] font-extrabold text-white">79%</div>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-[4px] bg-[#e76b49]" />
                <span className="text-[18px] font-semibold text-[#172f54]">School Subscriptions</span>
              </div>
              <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">$362,178</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-[4px] bg-[#1916be]" />
                <span className="text-[18px] font-semibold text-[#172f54]">Individual Plans</span>
              </div>
              <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">$120,726</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default function ReportsManagementPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("school-usage");

  const heading = reportTabs.find((tab) => tab.key === activeTab)?.label ?? "Reports";

  return (
    <AppShell title="Reports Management" activeSection="reports" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8">
      <div className="mx-auto">
        <div className="border-b border-[#e7ebf7]">
          <div className="flex flex-wrap items-center gap-8">
            {reportTabs.map((tab) => (
              <ReportTabButton
                key={tab.key}
                label={tab.label}
                active={tab.key === activeTab}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>

        {activeTab === "school-usage" ? (
          <div className="mt-10">
            <div className="mb-8">
              <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">{heading}</h2>
              <p className="mt-2 max-w-[720px] text-[18px] leading-8 text-[#4f627e]">
                Generate and export platform-wide performance analytics.
              </p>
            </div>
            <SchoolUsageView />
          </div>
        ) : null}

        {activeTab === "course-performance" ? <div className="mt-10"><CoursePerformanceView /></div> : null}
        {activeTab === "student-activity" ? <div className="mt-10"><StudentActivityView /></div> : null}
        {activeTab === "revenue" ? <div className="mt-10"><RevenueView /></div> : null}
      </div>
    </AppShell>
  );
}
