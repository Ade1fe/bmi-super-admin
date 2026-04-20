"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type HistoryStatus = "Sent" | "Scheduled" | "Draft";

type AudienceType = "All Users" | "All Schools" | "Faculty Only";

type BroadcastHistoryRow = {
  id: number;
  sentDate: string;
  sentTime: string;
  subject: string;
  targetAudience: AudienceType;
  status: HistoryStatus;
  delivered: string;
  openRate: number;
  body: string;
  summary: string;
  icon: typeof AlertTriangle;
  iconClassName: string;
};

type TrendBar = {
  month: string;
  value: number;
  highlight?: boolean;
};

const historyMetrics = [
  { label: "Total Sent", value: "1,284" },
  { label: "Avg Open Rate", value: "64.2%" },
  { label: "Scheduled", value: "12" },
  { label: "Draft", value: "08" },
];

const historyRows: BroadcastHistoryRow[] = [
  {
    id: 1,
    sentDate: "Oct 24, 2023",
    sentTime: "09:15 AM",
    subject: "Quarterly Campus Safety Protocol Update",
    targetAudience: "All Users",
    status: "Sent",
    delivered: "14,202",
    openRate: 78,
    body:
      "This is the full announcement text for the Annual Sports Meet Registration. Please ensure all students are registered by the end of the week. Participation is mandatory for all physical education classes. We look forward to a week of healthy competition and team spirit!",
    summary: "Sent to 250 students, 248 delivered, 2 failed",
    icon: AlertTriangle,
    iconClassName: "bg-[#fff2e6] text-[#f08a18]",
  },
  {
    id: 2,
    sentDate: "Oct 24, 2023",
    sentTime: "09:15 AM",
    subject: "Quarterly Campus Safety Protocol Update",
    targetAudience: "All Users",
    status: "Scheduled",
    delivered: "14,202",
    openRate: 78,
    body:
      "This scheduled maintenance alert is prepared for all users and will be delivered automatically before the weekend downtime begins.",
    summary: "Scheduled for 24,502 recipients",
    icon: AlertTriangle,
    iconClassName: "bg-[#fff2e6] text-[#f08a18]",
  },
  {
    id: 3,
    sentDate: "Oct 23, 2023",
    sentTime: "11:40 AM",
    subject: "New Curriculum Resources Available",
    targetAudience: "Faculty Only",
    status: "Draft",
    delivered: "842",
    openRate: 49,
    body:
      "We have uploaded fresh STEM and life-science teaching materials for the Winter semester. Please review and publish them to your faculty hubs when ready.",
    summary: "Draft saved for 842 faculty members",
    icon: BookOpen,
    iconClassName: "bg-[#e8f5ee] text-[#2e8f62]",
  },
  {
    id: 4,
    sentDate: "Oct 21, 2023",
    sentTime: "10:20 AM",
    subject: "User Privacy Policy Update",
    targetAudience: "All Users",
    status: "Draft",
    delivered: "24,480",
    openRate: 21,
    body:
      "As part of our commitment to data security, we have updated our privacy terms. No action is required from your side at this time.",
    summary: "Draft prepared for all user accounts",
    icon: ShieldCheck,
    iconClassName: "bg-[#eaf1ff] text-[#3c74e8]",
  },
  {
    id: 5,
    sentDate: "Oct 20, 2023",
    sentTime: "08:05 AM",
    subject: "Term-End Assessment Reminder",
    targetAudience: "All Users",
    status: "Sent",
    delivered: "14,202",
    openRate: 71,
    body:
      "Assessment windows close on Friday. Please review teacher and student dashboards to confirm submissions are complete and any blocked attempts are resolved.",
    summary: "Sent to 14,202 users, 14,010 delivered, 192 failed",
    icon: BookOpen,
    iconClassName: "bg-[#e8f5ee] text-[#2e8f62]",
  },
  {
    id: 6,
    sentDate: "Oct 18, 2023",
    sentTime: "03:30 PM",
    subject: "Policy Reminder for Data Retention",
    targetAudience: "All Schools",
    status: "Sent",
    delivered: "842",
    openRate: 67,
    body:
      "Please remind school administrators to archive or export records that fall outside the current retention window before the month closes.",
    summary: "Sent to 842 school administrators",
    icon: ShieldCheck,
    iconClassName: "bg-[#eaf1ff] text-[#3c74e8]",
  },
];

const engagementTrend: TrendBar[] = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 27 },
  { month: "April", value: 68, highlight: true },
  { month: "May", value: 58 },
  { month: "June", value: 33 },
  { month: "July", value: 18 },
];

function statusClassName(status: HistoryStatus) {
  if (status === "Sent") {
    return "bg-[#e5f7ef] text-[#0f8a4f]";
  }

  if (status === "Scheduled") {
    return "bg-[#fff2cf] text-[#d88709]";
  }

  return "bg-[#edf1f7] text-[#70809d]";
}

function audienceClassName(audience: AudienceType) {
  if (audience === "Faculty Only") {
    return "bg-[#eaf1ff] text-[#3567ff]";
  }

  return "bg-[#eaf1ff] text-[#3567ff]";
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-7 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <p className="text-[15px] font-medium uppercase tracking-[0.04em] text-[#314868]">{label}</p>
      <p className="mt-10 text-[34px] font-extrabold tracking-[-0.05em] text-[#173257]">{value}</p>
    </article>
  );
}

function BroadcastDetailsModal({
  row,
  onClose,
}: {
  row: BroadcastHistoryRow;
  onClose: () => void;
}) {
  const Icon = row.icon;

  return (
    <>
      <button
        type="button"
        aria-label="Close broadcast details"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[640px]">
          <button
            type="button"
            aria-label="Dismiss broadcast details"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            <div className="flex items-center justify-between border-b border-[#edf1f7] px-6 py-6 sm:px-8">
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                Broadcast Details
              </h2>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="text-[#95a1b6]"
              >
                <X className="h-6 w-6" strokeWidth={2.2} />
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
                Message Title
              </p>
              <h3 className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                {row.subject}
              </h3>

              <div className="mt-6 grid gap-5 border-y border-[#edf1f7] py-6 sm:grid-cols-2">
                <div>
                  <p className="text-[15px] font-medium text-[#6d7f98]">Target Recipient</p>
                  <div className="mt-3 flex items-center gap-2 text-[16px] font-extrabold text-[#203552]">
                    <Users className="h-4 w-4 text-[#0f8751]" strokeWidth={2.1} />
                    {row.targetAudience}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-medium text-[#6d7f98]">Sent Date &amp; Time</p>
                  <div className="mt-3 flex items-center gap-2 text-[16px] font-extrabold text-[#203552]">
                    <CalendarDays className="h-4 w-4 text-[#0f8751]" strokeWidth={2.1} />
                    {row.sentDate} - {row.sentTime}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[15px] font-medium text-[#6d7f98]">Message Body</p>
                <div className="mt-3 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 py-4 text-[16px] leading-8 text-[#4a5e7d]">
                  {row.body}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-[#cfe5d7] bg-[#eff8f3] px-4 py-4">
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${row.iconClassName}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[16px] font-extrabold text-[#0f8751]">Delivery Status Summary</p>
                  <p className="mt-1 text-[15px] text-[#536781]">{row.summary}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#edf1f7] bg-[#fbfcff] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#dbe3f1] bg-white px-8 text-[16px] font-semibold text-[#223f64]"
              >
                Close
              </button>
              <button
                type="button"
                className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white"
              >
                Resend
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default function BroadcastHistoryPage() {
  const [selectedRow, setSelectedRow] = useState<BroadcastHistoryRow | null>(null);

  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/notification"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe3f1] text-[#30496c]"
            aria-label="Back to notification centre"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.1} />
          </Link>
          <span>Broadcast History</span>
        </div>
      }
      activeSection="notification"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex justify-end">
          <button
            type="button"
            className="button-primary inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#4b8a60] px-5 text-[15px] font-semibold text-white"
          >
            <Download className="h-4.5 w-4.5" strokeWidth={2.2} />
            Export
          </button>
        </div>

        <section className="mt-8 grid gap-4 xl:grid-cols-4">
          {historyMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:grid-cols-[1.4fr_0.7fr_0.8fr_auto] lg:items-end">
            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Search Messages
              </span>
              <span className="mt-3 flex h-12 items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
                <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
                <input
                  className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                  placeholder="Search by subject or content..."
                />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Audience Type
              </span>
              <span className="relative mt-3 block">
                <select className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                  <option>All Audiences</option>
                  <option>All Users</option>
                  <option>All Schools</option>
                  <option>Faculty Only</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Date Range
              </span>
              <span className="mt-3 flex h-12 items-center justify-between rounded-[14px] bg-[#f3f6fb] px-4 text-[15px] font-medium text-[#6b7f9b]">
                Oct 01 - Oct 31, 2023
                <CalendarDays className="h-4.5 w-4.5 text-[#93a1b8]" strokeWidth={2} />
              </span>
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#eef7f1] px-6 text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]"
            >
              Apply Filters
            </button>
          </div>

          <div className="hidden grid-cols-[1.1fr_1.5fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr] gap-4 border-b border-[#edf1f7] bg-[#fbfcff] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
            <span>Date / Time</span>
            <span>Message Subject</span>
            <span>Target Audience</span>
            <span>Status</span>
            <span>Delivered</span>
            <span>Open Rate</span>
            <span>Action</span>
          </div>

          <div>
            {historyRows.map((row) => (
              <article
                key={row.id}
                className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.1fr_1.5fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr] lg:items-center"
              >
                <div>
                  <p className="text-[15px] font-extrabold text-[#172f54]">{row.sentDate}</p>
                  <p className="mt-1 text-[14px] font-medium text-[#7e8aa0]">{row.sentTime}</p>
                </div>

                <div>
                  <p className="max-w-[280px] text-[15px] font-bold leading-7 text-[#536781]">{row.subject}</p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${audienceClassName(
                      row.targetAudience,
                    )}`}
                  >
                    {row.targetAudience}
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${statusClassName(
                      row.status,
                    )}`}
                  >
                    {row.status}
                  </span>
                </div>

                <div className="text-[15px] font-bold text-[#536781]">{row.delivered}</div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-full max-w-[90px] overflow-hidden rounded-full bg-[#e7ecf5]">
                    <div
                      className="h-full rounded-full bg-[#0f8751]"
                      style={{ width: `${row.openRate}%` }}
                    />
                  </div>
                  <span className="text-[15px] font-extrabold text-[#0f8751]">{row.openRate}%</span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedRow(row)}
                    className="text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#0f8751]"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <p>Showing 1 to 6 of 12,840 broadcasts</p>

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
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-[#dfe6f7] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-7 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                Broadcast Engagement Trend
              </h2>
              <p className="mt-1 text-[15px] text-[#7e8aa0]">Open-rate trend over the last 6 months</p>
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
            {engagementTrend.map((bar) => (
              <div key={bar.month} className="flex h-full flex-col items-center justify-end gap-4">
                <div className="flex h-full w-full items-end">
                  <div
                    className={[
                      "w-full rounded-t-[10px] bg-[#cfe1da]",
                      bar.highlight
                        ? "bg-[linear-gradient(180deg,#5ea68b_0%,#58a486_70%,#dfffee_100%)]"
                        : "",
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

      {selectedRow ? <BroadcastDetailsModal row={selectedRow} onClose={() => setSelectedRow(null)} /> : null}
    </AppShell>
  );
}
