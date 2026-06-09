"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchAllBroadcasts,
  fetchBroadcastStats,
  resendBroadcast,
  BroadcastData,
  BroadcastStatsData,
} from "@/lib/notification-api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function broadcastIcon(type: string) {
  if (type === "urgent")
    return { Icon: AlertTriangle, iconClassName: "bg-[#fff2e6] text-[#f08a18]" };
  if (type === "standard")
    return { Icon: BookOpen, iconClassName: "bg-[#e8f5ee] text-[#2e8f62]" };
  return { Icon: ShieldCheck, iconClassName: "bg-[#eaf1ff] text-[#3c74e8]" };
}

function statusClassName(status: string) {
  if (status === "sent") return "bg-[#e5f7ef] text-[#0f8a4f]";
  if (status === "scheduled") return "bg-[#fff2cf] text-[#d88709]";
  return "bg-[#edf1f7] text-[#70809d]";
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function audienceLabel(audience: string) {
  return audience.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(dateStr: string | null, fallback: string) {
  const d = new Date(dateStr ?? fallback);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function formatCount(n: number) {
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-7 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <p className="text-[15px] font-medium uppercase tracking-[0.04em] text-[#314868]">
        {label}
      </p>
      <p className="mt-10 text-[34px] font-extrabold tracking-[-0.05em] text-[#173257]">
        {value}
      </p>
    </article>
  );
}

function BroadcastDetailsModal({
  row,
  onClose,
  onResend,
  resending,
}: {
  row: BroadcastData;
  onClose: () => void;
  onResend: (id: string) => Promise<void>;
  resending: boolean;
}) {
  const { Icon, iconClassName } = broadcastIcon(row.type);
  const { date, time } = formatDateTime(row.sentAt, row.createdAt);

  const deliverySummary = (() => {
    const parts = [`Delivered to ${formatCount(row.deliveredCount)}`];
    if (row.failedCount > 0) parts.push(`${formatCount(row.failedCount)} failed`);
    if (row.openedCount > 0) parts.push(`${formatCount(row.openedCount)} opened`);
    return parts.join(", ");
  })();

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
                {row.title}
              </h3>

              <div className="mt-6 grid gap-5 border-y border-[#edf1f7] py-6 sm:grid-cols-2">
                <div>
                  <p className="text-[15px] font-medium text-[#6d7f98]">Target Recipient</p>
                  <div className="mt-3 flex items-center gap-2 text-[16px] font-extrabold text-[#203552]">
                    <Users className="h-4 w-4 text-[#0f8751]" strokeWidth={2.1} />
                    {audienceLabel(row.targetAudience)}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-medium text-[#6d7f98]">Sent Date &amp; Time</p>
                  <div className="mt-3 flex items-center gap-2 text-[16px] font-extrabold text-[#203552]">
                    <CalendarDays className="h-4 w-4 text-[#0f8751]" strokeWidth={2.1} />
                    {date} - {time}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[15px] font-medium text-[#6d7f98]">Message Body</p>
                <div className="mt-3 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 py-4 text-[16px] leading-8 text-[#4a5e7d]">
                  {row.content}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-[#cfe5d7] bg-[#eff8f3] px-4 py-4">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${iconClassName}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[16px] font-extrabold text-[#0f8751]">
                    Delivery Status Summary
                  </p>
                  <p className="mt-1 text-[15px] text-[#536781]">{deliverySummary}</p>
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
                disabled={resending}
                onClick={() => onResend(row.id)}
                className="button-primary inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white disabled:opacity-60"
              >
                {resending && <Loader2 className="h-4 w-4 animate-spin" />}
                {resending ? "Resending…" : "Resend"}
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;

export default function BroadcastHistoryPage() {
  const { session, isHydrated } = useAuthSession();
  const token = session?.token;

  // Data
  const [stats, setStats] = useState<BroadcastStatsData | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);

  // Filters (client-side search + audience; date range UI only for now)
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");

  // Modal / resend
  const [selectedRow, setSelectedRow] = useState<BroadcastData | null>(null);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [statsRes, broadcastsRes] = await Promise.all([
          fetchBroadcastStats(token),
          fetchAllBroadcasts(token, { page, limit: ITEMS_PER_PAGE }),
        ]);
        setStats(statsRes.data);
        setBroadcasts(broadcastsRes.data);
        setMeta({
          total: broadcastsRes.meta.total,
          page: broadcastsRes.meta.page,
          totalPages: broadcastsRes.meta.totalPages,
        });
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load broadcasts.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isHydrated, token, page]);

  // ---------------------------------------------------------------------------
  // Client-side filtering
  // ---------------------------------------------------------------------------

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      const matchesSearch =
        !search.trim() ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.content.toLowerCase().includes(search.toLowerCase());

      const matchesAudience =
        audienceFilter === "all" || b.targetAudience === audienceFilter;

      return matchesSearch && matchesAudience;
    });
  }, [broadcasts, search, audienceFilter]);

  // ---------------------------------------------------------------------------
  // Resend
  // ---------------------------------------------------------------------------

  async function handleResend(broadcastId: string) {
    if (!token) return;
    setResending(true);
    setResendError(null);
    try {
      const res = await resendBroadcast(broadcastId, token);
      // Update the row in the list with fresh data
      setBroadcasts((prev) =>
        prev.map((b) => (b.id === broadcastId ? res.data : b))
      );
      // Also update modal row if it's open
      if (selectedRow?.id === broadcastId) {
        setSelectedRow(res.data);
      }
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "Resend failed.");
    } finally {
      setResending(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Pagination helpers
  // ---------------------------------------------------------------------------

  function goToPage(p: number) {
    if (p < 1 || p > meta.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    const { totalPages } = meta;
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, meta.totalPages]);

  // ---------------------------------------------------------------------------
  // Engagement trend — derived from stats (visual only, bars are illustrative)
  // ---------------------------------------------------------------------------

  const trendBars = [
    { month: "Jan", value: 18 },
    { month: "Feb", value: 58 },
    { month: "Mar", value: 27 },
    { month: "April", value: stats ? Math.min(100, stats.avgOpenRate) : 68, highlight: true },
    { month: "May", value: 58 },
    { month: "June", value: 33 },
    { month: "July", value: 18 },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
        {/* Export button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="button-primary inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#4b8a60] px-5 text-[15px] font-semibold text-white"
          >
            <Download className="h-4 w-4" strokeWidth={2.2} />
            Export
          </button>
        </div>

        {/* Metric cards */}
        <section className="mt-8 grid gap-4 xl:grid-cols-4">
          <MetricCard
            label="Total Sent"
            value={stats ? String(stats.totalSent) : "—"}
          />
          <MetricCard
            label="Avg Open Rate"
            value={stats ? `${stats.avgOpenRate}%` : "—"}
          />
          <MetricCard
            label="Scheduled"
            value={stats ? String(stats.scheduled) : "—"}
          />
          <MetricCard
            label="Draft"
            value={stats ? String(stats.draft) : "—"}
          />
        </section>

        {/* Load error banner */}
        {loadError && (
          <p className="mt-6 rounded-[12px] bg-red-50 px-5 py-4 text-[15px] font-medium text-red-600">
            {loadError}
          </p>
        )}

        {/* Resend error banner */}
        {resendError && (
          <p className="mt-6 rounded-[12px] bg-red-50 px-5 py-4 text-[15px] font-medium text-red-600">
            {resendError}
          </p>
        )}

        {/* Broadcasts table */}
        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          {/* Filters */}
          <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:grid-cols-[1.4fr_0.7fr_0.8fr_auto] lg:items-end">
            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Search Messages
              </span>
              <span className="mt-3 flex h-12 items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
                <Search className="h-4 w-4" strokeWidth={2.1} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="h-12 w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
                >
                  <option value="all">All Audiences</option>
                  <option value="all_users">All Users</option>
                  <option value="all_schools">All Schools</option>
                  <option value="faculty_only">Faculty Only</option>
                  <option value="parents">Parents</option>
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
              <span className="mt-3 flex h-12 items-center justify-between rounded-[14px] bg-[#f3f6fb] px-4 text-[15px] font-medium text-[#6b7f9b]">
                All time
                <CalendarDays className="h-4 w-4 text-[#93a1b8]" strokeWidth={2} />
              </span>
            </label>

            <button
              type="button"
              onClick={() => { setSearch(""); setAudienceFilter("all"); }}
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#eef7f1] px-6 text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]"
            >
              Clear Filters
            </button>
          </div>

          {/* Table header */}
          <div className="hidden grid-cols-[1.1fr_1.5fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr] gap-4 border-b border-[#edf1f7] bg-[#fbfcff] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
            <span>Date / Time</span>
            <span>Message Subject</span>
            <span>Target Audience</span>
            <span>Status</span>
            <span>Delivered</span>
            <span>Open Rate</span>
            <span>Action</span>
          </div>

          {/* Table body */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-7 w-7 animate-spin text-[#0f8751]" />
            </div>
          ) : filteredBroadcasts.length === 0 ? (
            <p className="px-7 py-16 text-center text-[15px] text-[#8090a8]">
              {broadcasts.length === 0 ? "No broadcasts found." : "No results match your filters."}
            </p>
          ) : (
            <div>
              {filteredBroadcasts.map((row) => {
                const { date, time } = formatDateTime(row.sentAt, row.createdAt);
                const openRate =
                  row.deliveredCount > 0
                    ? Math.round((row.openedCount / row.deliveredCount) * 100)
                    : 0;

                return (
                  <article
                    key={row.id}
                    className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.1fr_1.5fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr] lg:items-center"
                  >
                    <div>
                      <p className="text-[15px] font-extrabold text-[#172f54]">{date}</p>
                      <p className="mt-1 text-[14px] font-medium text-[#7e8aa0]">{time}</p>
                    </div>

                    <div>
                      <p className="max-w-[280px] text-[15px] font-bold leading-7 text-[#536781]">
                        {row.title}
                      </p>
                    </div>

                    <div>
                      <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#3567ff]">
                        {audienceLabel(row.targetAudience)}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] ${statusClassName(row.status)}`}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </div>

                    <div className="text-[15px] font-bold text-[#536781]">
                      {formatCount(row.deliveredCount)}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full max-w-[90px] overflow-hidden rounded-full bg-[#e7ecf5]">
                        <div
                          className="h-full rounded-full bg-[#0f8751]"
                          style={{ width: `${openRate}%` }}
                        />
                      </div>
                      <span className="text-[15px] font-extrabold text-[#0f8751]">
                        {openRate}%
                      </span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => { setSelectedRow(row); setResendError(null); }}
                        className="text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#0f8751]"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col gap-4 px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <p>
              Showing {broadcasts.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(page * ITEMS_PER_PAGE, meta.total)} of {meta.total.toLocaleString()}{" "}
              broadcasts
            </p>

            <div className="flex items-center gap-2 self-end lg:self-auto">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>

              {pageNumbers.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-[#98a2b6]">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p as number)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[15px] font-bold ${
                      page === p
                        ? "bg-[#0f8751] text-white"
                        : "text-[#203552]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={page === meta.totalPages}
                onClick={() => goToPage(page + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>

        {/* Engagement trend */}
        <section className="mt-8 rounded-[24px] border border-[#dfe6f7] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-7 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                Broadcast Engagement Trend
              </h2>
              <p className="mt-1 text-[15px] text-[#7e8aa0]">
                Open-rate trend over the last 6 months
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#dbe3f1] bg-[#fbfcff] px-4 text-[15px] font-semibold text-[#223f64]"
            >
              <CalendarDays className="h-4 w-4" strokeWidth={2} />
              Last 6 months
              <ChevronDown className="h-4 w-4" strokeWidth={2.1} />
            </button>
          </div>

          <div className="mt-10 grid h-[280px] grid-cols-7 items-end gap-4 sm:h-[360px] sm:gap-7">
            {trendBars.map((bar) => (
              <div
                key={bar.month}
                className="flex h-full flex-col items-center justify-end gap-4"
              >
                <div className="flex h-full w-full items-end">
                  <div
                    className={[
                      "w-full rounded-t-[10px]",
                      bar.highlight
                        ? "bg-[linear-gradient(180deg,#5ea68b_0%,#58a486_70%,#dfffee_100%)]"
                        : "bg-[#cfe1da]",
                    ].join(" ")}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="text-[14px] font-medium text-[#7f88a0] sm:text-[16px]">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Broadcast detail modal */}
      {selectedRow && (
        <BroadcastDetailsModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onResend={handleResend}
          resending={resending}
        />
      )}
    </AppShell>
  );
}