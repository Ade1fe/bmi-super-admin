"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChartColumn,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type AudienceOption = "All Users" | "All Schools" | "Faculty Only" | "Parents";

type BroadcastType = "urgent" | "standard" | "informational";

type BroadcastMetric = {
  audience: string;
  delivered: string;
  opened: string;
};

type BroadcastItem = {
  id: number;
  title: string;
  sentAt: string;
  description: string;
  type: BroadcastType;
  metric: BroadcastMetric;
  icon: typeof AlertTriangle;
  iconClassName: string;
};

const audienceOptions: AudienceOption[] = [
  "All Users",
  "All Schools",
  "Faculty Only",
  "Parents",
];

const recentBroadcasts: BroadcastItem[] = [
  {
    id: 1,
    title: "Scheduled System Maintenance",
    sentAt: "Sent Oct 24, 2023 • 09:45 AM",
    description:
      "The platform will be undergoing scheduled maintenance this Sunday from 2:00 AM to 4:00 AM GMT. Access may be intermittent during this period.",
    type: "urgent",
    metric: {
      audience: "All Users",
      delivered: "24,502",
      opened: "18,230 (74%)",
    },
    icon: AlertTriangle,
    iconClassName: "bg-[#fff2e6] text-[#f08a18]",
  },
  {
    id: 2,
    title: "New Curriculum Resources Available",
    sentAt: "Sent Oct 22, 2023 • 02:15 PM",
    description:
      "We have just uploaded new STEM modules for the Winter semester. Please review the updated materials in your dashboard library.",
    type: "standard",
    metric: {
      audience: "All Schools",
      delivered: "842",
      opened: "412 (49%)",
    },
    icon: BookOpen,
    iconClassName: "bg-[#e8f5ee] text-[#2e8f62]",
  },
  {
    id: 3,
    title: "User Privacy Policy Update",
    sentAt: "Sent Oct 15, 2023 • 10:00 AM",
    description:
      "As part of our commitment to data security, we have updated our privacy terms. No action is required from your side at this time.",
    type: "informational",
    metric: {
      audience: "All Users",
      delivered: "24,480",
      opened: "5,122 (21%)",
    },
    icon: ShieldCheck,
    iconClassName: "bg-[#eaf1ff] text-[#3c74e8]",
  },
];

function broadcastTypeClassName(type: BroadcastType) {
  if (type === "urgent") {
    return "bg-[#fff2e7] text-[#e27214]";
  }

  if (type === "standard") {
    return "bg-[#eef2f7] text-[#536781]";
  }

  return "bg-[#edf1ff] text-[#6377de]";
}

function broadcastTypeLabel(type: BroadcastType) {
  if (type === "urgent") {
    return "Urgent";
  }

  if (type === "standard") {
    return "Standard";
  }

  return "Informational";
}

function SummaryCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <article className={`rounded-[20px] border px-6 py-6 shadow-[0_18px_40px_rgba(180,193,229,0.06)] ${className}`}>
      <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#1b7b58]">{label}</p>
      <p className="mt-4 text-[50px] font-extrabold tracking-[-0.07em] text-[#172f54]">{value}</p>
    </article>
  );
}

function EditorTool({ label, strong = false }: { label: string; strong?: boolean }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2 text-[15px] ${
        strong ? "font-extrabold text-[#1f3457]" : "font-semibold text-[#5f7291]"
      } hover:bg-[#f4f7fb]`}
    >
      {label}
    </button>
  );
}

function BroadcastCard({ item }: { item: BroadcastItem }) {
  const Icon = item.icon;

  return (
    <article className="border-t border-[#edf1f7] px-5 py-6 sm:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <span className={`mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${item.iconClassName}`}>
            <Icon className="h-5 w-5" strokeWidth={2.1} />
          </span>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">{item.title}</h3>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.08em] ${broadcastTypeClassName(item.type)}`}
              >
                {broadcastTypeLabel(item.type)}
              </span>
            </div>
            <p className="mt-1 text-[15px] font-medium text-[#7b89a0]">{item.sentAt}</p>
            <p className="mt-4 max-w-[900px] text-[17px] leading-8 text-[#536781]">{item.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-[18px] bg-[#f7f9fe] px-5 py-4 sm:grid-cols-[1.1fr_1fr_1fr_auto] sm:items-center">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Audience</p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">{item.metric.audience}</p>
        </div>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Delivered</p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">{item.metric.delivered}</p>
        </div>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">Opened</p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">{item.metric.opened}</p>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-[#137c57] shadow-[0_10px_24px_rgba(170,184,221,0.12)]">
          <ChartColumn className="h-5 w-5" strokeWidth={2.1} />
        </span>
      </div>
    </article>
  );
}

export default function NotificationCentrePage() {
  const [audience, setAudience] = useState<AudienceOption>("All Users");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  return (
    <AppShell
      title="Notification Centre"
      activeSection="notification"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <section className="grid gap-4 md:max-w-[460px] md:grid-cols-2">
          <SummaryCard label="Sent Today" value="12" className="border-[#b8ddd0] bg-[#e8f5ef]" />
          <SummaryCard label="Avg Open Rate" value="64%" className="border-[#d8e3ff] bg-[#eff4ff]" />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <article className="overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_24px_50px_rgba(184,194,229,0.08)]">
            <div className="px-6 py-7 sm:px-8">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">New Broadcast</h2>

              <form
                className="mt-8 space-y-7"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">Target Audience</label>
                  <div className="relative mt-3">
                    <select
                      value={audience}
                      onChange={(event) => setAudience(event.target.value as AudienceOption)}
                      className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-white px-4 pr-11 text-[16px] font-medium text-[#2f4769] outline-none"
                    >
                      {audienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">Message Title</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] font-medium text-[#2f4769] outline-none placeholder:text-[#97a3b8]"
                    placeholder="e.g., Platform Maintenance Update"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">Message Content</label>
                  <div className="mt-3 overflow-hidden rounded-[18px] border border-[#dbe3f1]">
                    <div className="flex flex-wrap items-center gap-1 border-b border-[#edf1f7] bg-[#fbfcff] px-3 py-3">
                      <EditorTool label="B" strong />
                      <EditorTool label="I" />
                      <EditorTool label="U" />
                      <span className="mx-1 h-6 w-px bg-[#dbe3f1]" />
                      <EditorTool label="•" />
                      <EditorTool label="1." />
                      <span className="mx-1 h-6 w-px bg-[#dbe3f1]" />
                      <EditorTool label="link" />
                      <EditorTool label="img" />
                      <EditorTool label="&lt;/&gt;" />
                    </div>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={10}
                      className="w-full resize-none bg-white px-5 py-5 text-[16px] leading-8 text-[#243957] outline-none placeholder:text-[#98a2b6]"
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 text-[15px] font-medium text-[#536781]">
                  <button
                    type="button"
                    onClick={() => setIsUrgent((current) => !current)}
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-[5px] border ${
                      isUrgent
                        ? "border-[#0f8751] bg-[#0f8751] text-white"
                        : "border-[#cfd8e7] bg-white text-transparent"
                    }`}
                  >
                    <span className="text-[12px] font-extrabold">✓</span>
                  </button>
                  Mark as Urgent (Push Notification)
                </label>

                <button
                  type="submit"
                  className="button-primary inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-[#4b8a60] text-[17px] font-semibold text-white shadow-[0_18px_34px_rgba(75,138,96,0.18)]"
                >
                  Save Broadcast
                </button>
              </form>
            </div>
          </article>

          <article className="overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_24px_50px_rgba(184,194,229,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#edf1f7] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Recent Broadcasts</h2>
                <p className="mt-1 text-[14px] text-[#8090a8]">Latest messages sent across the BMI platform.</p>
              </div>

              <Link
                href="/notification/history"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe1d8] bg-[#f6fbf8] px-5 text-[14px] font-bold text-[#0f8751]"
              >
                View All History
              </Link>
            </div>

            <div>
              {recentBroadcasts.map((item) => (
                <BroadcastCard key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t border-[#edf1f7] px-5 py-5 text-center sm:px-7">
              <Link href="/notification/history" className="text-[16px] font-bold text-[#0f8751]">
                Load older notifications
              </Link>
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
