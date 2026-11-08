"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Lock, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import {
  getAiEngineStatus,
  getAiUsage,
  listAiCourses,
  listAiReports,
  resolveAiReport,
  setAiEnabled,
  type AiCourseRow,
  type AiEngineStatus,
  type AiMessageReport,
  type AiUsage,
} from "@/lib/ai-admin-api";

function Switch({ on, busy, onChange, label }: { on: boolean; busy?: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={busy}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? "bg-[#0f8751]" : "bg-[#cbd5e1]"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "red" | "blue" }) {
  const tones = {
    slate: "bg-[#eef2f7] text-[#475569]",
    green: "bg-[#e6f6ee] text-[#0f8751]",
    amber: "bg-[#fff3d6] text-[#8a5a00]",
    red: "bg-[#fdeaea] text-[#a33d3d]",
    blue: "bg-[#e8f0ff] text-[#1f4aa0]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${tones[tone]}`}>{children}</span>;
}

export default function AiLearningPage() {
  const { session, isHydrated } = useAuthSession();
  const token = session?.token ?? "";

  const [engine, setEngine] = useState<AiEngineStatus | null>(null);
  const [rows, setRows] = useState<AiCourseRow[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "on" | "off">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [reports, setReports] = useState<AiMessageReport[]>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listAiCourses(token, {
        search,
        enabled: filter === "all" ? undefined : filter === "on",
        page,
      });
      setRows(res.rows);
      setMeta({ total: res.meta.total, page: res.meta.page, pages: res.meta.pages });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load courses.");
    } finally {
      setLoading(false);
    }
  }, [token, search, filter, page]);

  useEffect(() => { if (isHydrated) void load(); }, [isHydrated, load]);

  useEffect(() => {
    if (!token) return;
    getAiEngineStatus(token).then(setEngine).catch(() => setEngine(null));
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    getAiUsage(token, { from: monthStart.toISOString() }).then(setUsage).catch(() => setUsage(null));
    listAiReports(token).then(setReports).catch(() => setReports([]));
  }, [token]);

  async function toggle(row: AiCourseRow) {
    setBusyId(row.courseId);
    try {
      const res = await setAiEnabled(token, row.courseId, !row.aiEnabled);
      toast.success(res.message ?? "Updated.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this course.");
    } finally {
      setBusyId(null);
    }
  }

  async function closeReport(id: string, status: "resolved" | "dismissed") {
    try {
      await resolveAiReport(token, id, status);
      setReports((r) => r.filter((x) => x.id !== id));
      toast.success(status === "resolved" ? "Report resolved." : "Report dismissed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the report.");
    }
  }

  return (
    <AppShell title="AI Learning" activeSection="ai" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8" searchPlaceholder="Search courses...">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#173257]"><Sparkles className="h-6 w-6 text-[#0f8751]" /> BMI AI Tutor</h2>
            <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
              Switch the AI Learning Assistant on for individual courses, choose what it may read, and set pass marks, attempts and limits. Courses you leave off are unaffected.
            </p>
          </div>
        </div>

        {engine ? (
          <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border px-4 py-3 text-sm ${engine.providerConfigured && engine.globallyEnabled ? "border-[#cfe8da] bg-[#f3faf6] text-[#17473a]" : "border-[#f0dfb5] bg-[#fffaf0] text-[#6b4a00]"}`}>
            {engine.providerConfigured ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span><strong>Engine:</strong> {engine.providerConfigured ? "connected" : "no API key configured on the server"}</span>
            <span><strong>Model:</strong> {engine.model}</span>
            <span><strong>Platform switch:</strong> {engine.globallyEnabled ? "on" : "OFF. No course can use AI"}</span>
          </div>
        ) : null}

        {usage ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["AI calls this month", usage.totals.calls.toLocaleString()],
              ["Input tokens", usage.totals.inputTokens.toLocaleString()],
              ["Output tokens", usage.totals.outputTokens.toLocaleString()],
              ["Estimated cost", `$${usage.totals.costUsd.toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[#e6ebf3] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">{label}</p>
                <p className="mt-1 text-xl font-bold text-[#173257]">{value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <section className="rounded-xl border border-[#e6ebf3] bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#eef2f7] p-4">
            <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search courses"
                className="w-full rounded-lg border border-[#e2e8f0] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0f8751]"
              />
            </div>
            <div className="flex rounded-lg border border-[#e2e8f0] p-0.5 text-sm">
              {(["all", "on", "off"] as const).map((f) => (
                <button key={f} type="button" onClick={() => { setFilter(f); setPage(1); }} className={`rounded-md px-3 py-1.5 font-medium ${filter === f ? "bg-[#173257] text-white" : "text-[#64748b]"}`}>
                  {f === "all" ? "All" : f === "on" ? "AI on" : "AI off"}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="p-6 text-sm text-[#a33d3d]">{error}</p> : null}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-[#94a3b8]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">AI</th>
                  <th className="px-4 py-3 font-semibold">Capabilities</th>
                  <th className="px-4 py-3 font-semibold">Materials</th>
                  <th className="px-4 py-3 font-semibold">Rules</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[#94a3b8]"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[#94a3b8]">No courses match.</td></tr>
                ) : rows.map((row) => (
                  <tr key={row.courseId} className="align-middle">
                    <td className="px-4 py-3 font-semibold text-[#173257]">{row.name}<div className="text-xs font-normal capitalize text-[#94a3b8]">{row.status}</div></td>
                    <td className="px-4 py-3 text-[#475569]">{row.schoolName ?? "Platform"}</td>
                    <td className="px-4 py-3"><Switch on={row.aiEnabled} busy={busyId === row.courseId} onChange={() => toggle(row)} label={`AI for ${row.name}`} /></td>
                    <td className="px-4 py-3">
                      {row.aiEnabled ? (
                        <div className="flex flex-wrap gap-1">
                          {row.capabilities.tutoring ? <Pill tone="green">Tutor</Pill> : null}
                          {row.capabilities.assignmentGeneration ? <Pill tone="green">Assignments</Pill> : null}
                          {row.capabilities.assessment ? <Pill tone="green">Grading</Pill> : null}
                        </div>
                      ) : <span className="text-[#cbd5e1]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {row.documents.indexed + row.documents.failed + row.documents.pending === 0 ? <span className="text-[#cbd5e1]">None</span> : (
                        <div className="flex flex-wrap gap-1">
                          <Pill tone="green">{row.documents.indexed} ready</Pill>
                          {row.documents.failed ? <Pill tone="red">{row.documents.failed} failed</Pill> : null}
                          {row.documents.pending ? <Pill tone="amber">{row.documents.pending} pending</Pill> : null}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.assessmentMandatory ? <Pill tone="blue"><Lock className="mr-1 h-3 w-3" />Compulsory · {row.progressionRule}</Pill> : null}
                        {row.practicalCourse ? <Pill tone="amber">Practical skill</Pill> : null}
                        {!row.assessmentMandatory && !row.practicalCourse ? <span className="text-[#cbd5e1]">—</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right"><Link href={`/ai/${row.courseId}`} className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#173257] hover:bg-[#f8fafc]">Configure</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#eef2f7] px-4 py-3 text-sm text-[#64748b]">
            <span>{meta.total} courses</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-[#e2e8f0] p-1.5 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
              <span>Page {meta.page} of {Math.max(1, meta.pages)}</span>
              <button type="button" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-[#e2e8f0] p-1.5 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#e6ebf3] bg-white p-4 sm:p-5">
          <h3 className="text-base font-bold text-[#173257]">Reported AI answers</h3>
          <p className="text-sm text-[#64748b]">Learners flag replies that look wrong or inappropriate. Review them here.</p>
          {reports.length === 0 ? <p className="mt-4 text-sm text-[#94a3b8]">Nothing waiting for review.</p> : (
            <ul className="mt-4 divide-y divide-[#eef2f7]">
              {reports.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{r.reason.replace("_", " ")}</Pill><span className="text-xs text-[#94a3b8]">{new Date(r.createdAt).toLocaleString()}</span></div>
                  {r.details ? <p className="mt-1 text-sm text-[#334155]">&ldquo;{r.details}&rdquo;</p> : null}
                  {r.message ? <p className="mt-2 line-clamp-3 rounded-lg bg-[#f8fafc] p-3 text-sm text-[#475569]">{r.message.content}</p> : null}
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => closeReport(r.id, "resolved")} className="rounded-lg bg-[#173257] px-3 py-1.5 text-xs font-semibold text-white">Mark resolved</button>
                    <button type="button" onClick={() => closeReport(r.id, "dismissed")} className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#475569]">Dismiss</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
