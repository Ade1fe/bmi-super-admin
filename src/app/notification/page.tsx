"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChartColumn,
  ChevronDown,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session"; 
import { BroadcastData, BroadcastStatsData, createBroadcast, fetchAllBroadcasts, fetchBroadcastStats } from "@/lib/notification-api";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AudienceOption = "all_users" | "all_schools" | "faculty_only" | "parents";

const audienceOptions: { value: AudienceOption; label: string }[] = [
  { value: "all_users", label: "All Users" },
  { value: "all_schools", label: "All Schools" },
  { value: "faculty_only", label: "Faculty Only" },
  { value: "parents", label: "Parents" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function broadcastTypeClassName(type: string) {
  if (type === "urgent") return "bg-[#fff2e7] text-[#e27214]";
  if (type === "standard") return "bg-[#eef2f7] text-[#536781]";
  return "bg-[#edf1ff] text-[#6377de]";
}

function broadcastTypeLabel(type: string) {
  if (type === "urgent") return "Urgent";
  if (type === "standard") return "Standard";
  return "Informational";
}

function broadcastIcon(type: string) {
  if (type === "urgent")
    return { Icon: AlertTriangle, className: "bg-[#fff2e6] text-[#f08a18]" };
  if (type === "standard")
    return { Icon: BookOpen, className: "bg-[#e8f5ee] text-[#2e8f62]" };
  return { Icon: ShieldCheck, className: "bg-[#eaf1ff] text-[#3c74e8]" };
}

function formatSentAt(sentAt: string | null, createdAt: string) {
  const date = sentAt ?? createdAt;
  return `Sent ${new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function formatCount(n: number) {
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
    <article
      className={`rounded-[20px] border px-6 py-6 shadow-[0_18px_40px_rgba(180,193,229,0.06)] ${className}`}
    >
      <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#1b7b58]">
        {label}
      </p>
      <p className="mt-4 text-[50px] font-extrabold tracking-[-0.07em] text-[#172f54]">
        {value}
      </p>
    </article>
  );
}

function EditorTool({
  label,
  strong = false,
}: {
  label: string;
  strong?: boolean;
}) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2 text-[15px] ${
        strong
          ? "font-extrabold text-[#1f3457]"
          : "font-semibold text-[#5f7291]"
      } hover:bg-[#f4f7fb]`}
    >
      {label}
    </button>
  );
}

function BroadcastCard({ item }: { item: BroadcastData }) {
  const { Icon, className: iconClassName } = broadcastIcon(item.type);

  return (
    <article className="border-t border-[#edf1f7] px-5 py-6 sm:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <span
            className={`mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${iconClassName}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.1} />
          </span>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                {item.title}
              </h3>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.08em] ${broadcastTypeClassName(item.type)}`}
              >
                {broadcastTypeLabel(item.type)}
              </span>
            </div>
            <p className="mt-1 text-[15px] font-medium text-[#7b89a0]">
              {formatSentAt(item.sentAt, item.createdAt)}
            </p>
            <p className="mt-4 max-w-[900px] text-[17px] leading-8 text-[#536781]">
              {item.content}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-[18px] bg-[#f7f9fe] px-5 py-4 sm:grid-cols-[1.1fr_1fr_1fr_auto] sm:items-center">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
            Audience
          </p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">
            {item.targetAudience.replace("_", " ")}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
            Delivered
          </p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">
            {formatCount(item.deliveredCount)}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
            Opened
          </p>
          <p className="mt-1 text-[16px] font-extrabold text-[#203552]">
            {formatCount(item.openedCount)}
            {item.deliveredCount > 0 && (
              <span className="ml-1 text-[14px] font-semibold text-[#7b89a0]">
                ({Math.round((item.openedCount / item.deliveredCount) * 100)}%)
              </span>
            )}
          </p>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-[#137c57] shadow-[0_10px_24px_rgba(170,184,221,0.12)]">
          <ChartColumn className="h-5 w-5" strokeWidth={2.1} />
        </span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationCentrePage() {

const { session, isHydrated } = useAuthSession();
const token = session?.token;

  // Stats
  const [stats, setStats] = useState<BroadcastStatsData | null>(null);

  // Recent broadcasts
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);

  // Create form
  const [audience, setAudience] = useState<AudienceOption>("all_users");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

useEffect(() => {
  // ✅ Don't fetch until localStorage has been read
  if (!isHydrated) return;

  async function load() {
    try {
      const [statsRes, broadcastsRes] = await Promise.all([
        fetchBroadcastStats(token),
        fetchAllBroadcasts(token, { page: 1, limit: 3 }),
      ]);
      setStats(statsRes.data);
      setBroadcasts(broadcastsRes.data);
    } catch (error) {
      console.error("[notification-centre] load failed:", error);
    } finally {
      setLoadingBroadcasts(false);
    }
  }

  load();
}, [token, isHydrated]); 

  // ---------------------------------------------------------------------------
  // Form submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!title.trim()) {
      setFormError("Please enter a message title.");
      return;
    }

    if (!message.trim()) {
      setFormError("Please enter message content.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createBroadcast(
        {
          title: title.trim(),
          content: message.trim(),
          targetAudience: audience,
          isUrgent,
          saveAsDraft: false,
        },
        token
      );

      // Prepend the new broadcast to the list
      setBroadcasts((prev) => [res.data, ...prev].slice(0, 3));

      // Update stats optimistically
      setStats((prev) =>
        prev ? { ...prev, totalSent: prev.totalSent + 1 } : prev
      );

      // Reset form
      setTitle("");
      setMessage("");
      setIsUrgent(false);
      setAudience("all_users");
      setFormSuccess(true);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to send broadcast."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppShell
      title="Notification Centre"
      activeSection="notification"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        {/* Summary cards */}
        <section className="grid gap-4 md:max-w-[460px] md:grid-cols-2">
          <SummaryCard
            label="Total Sent"
            value={stats ? String(stats.totalSent) : "—"}
            className="border-[#b8ddd0] bg-[#e8f5ef]"
          />
          <SummaryCard
            label="Avg Open Rate"
            value={stats ? `${stats.avgOpenRate}%` : "—"}
            className="border-[#d8e3ff] bg-[#eff4ff]"
          />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          {/* ---------------------------------------------------------------- */}
          {/* Create broadcast form                                             */}
          {/* ---------------------------------------------------------------- */}
          <article className="overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_24px_50px_rgba(184,194,229,0.08)]">
            <div className="px-6 py-7 sm:px-8">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                New Broadcast
              </h2>

              <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
                {/* Audience */}
                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">
                    Target Audience
                  </label>
                  <div className="relative mt-3">
                    <select
                      value={audience}
                      onChange={(e) =>
                        setAudience(e.target.value as AudienceOption)
                      }
                      className="h-14 w-full appearance-none rounded-[14px] border border-[#dbe3f1] bg-white px-4 pr-11 text-[16px] font-medium text-[#2f4769] outline-none"
                    >
                      {audienceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]"
                      strokeWidth={2.2}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">
                    Message Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-3 h-14 w-full rounded-[14px] border border-[#dbe3f1] bg-white px-4 text-[16px] font-medium text-[#2f4769] outline-none placeholder:text-[#97a3b8]"
                    placeholder="e.g., Platform Maintenance Update"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[15px] font-semibold text-[#1e3558]">
                    Message Content
                  </label>
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
                      <EditorTool label="</>" />
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={10}
                      className="w-full resize-none bg-white px-5 py-5 text-[16px] leading-8 text-[#243957] outline-none placeholder:text-[#98a2b6]"
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>

                {/* Urgent checkbox */}
                <label className="flex items-center gap-3 text-[15px] font-medium text-[#536781]">
                  <button
                    type="button"
                    onClick={() => setIsUrgent((v) => !v)}
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

                {/* Feedback */}
                {formError && (
                  <p className="rounded-[10px] bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                    {formError}
                  </p>
                )}
                {formSuccess && (
                  <p className="rounded-[10px] bg-[#e8f5ef] px-4 py-3 text-[14px] font-medium text-[#0f8751]">
                    Broadcast sent successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="button-primary inline-flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#4b8a60] text-[17px] font-semibold text-white shadow-[0_18px_34px_rgba(75,138,96,0.18)] disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {submitting ? "Sending…" : "Send Broadcast"}
                </button>
              </form>
            </div>
          </article>

          {/* ---------------------------------------------------------------- */}
          {/* Recent broadcasts list                                            */}
          {/* ---------------------------------------------------------------- */}
          <article className="overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_24px_50px_rgba(184,194,229,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#edf1f7] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                  Recent Broadcasts
                </h2>
                <p className="mt-1 text-[14px] text-[#8090a8]">
                  Latest messages sent across the platform.
                </p>
              </div>

              <Link
                href="/notification/history"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe1d8] bg-[#f6fbf8] px-5 text-[14px] font-bold text-[#0f8751]"
              >
                View All History
              </Link>
            </div>

            {loadingBroadcasts ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-[#0f8751]" />
              </div>
            ) : broadcasts.length === 0 ? (
              <p className="px-7 py-12 text-center text-[15px] text-[#8090a8]">
                No broadcasts yet.
              </p>
            ) : (
              <div>
                {broadcasts.map((item) => (
                  <BroadcastCard key={item.id} item={item} />
                ))}
              </div>
            )}

            <div className="border-t border-[#edf1f7] px-5 py-5 text-center sm:px-7">
              <Link
                href="/notification/history"
                className="text-[16px] font-bold text-[#0f8751]"
              >
                Load older notifications
              </Link>
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}