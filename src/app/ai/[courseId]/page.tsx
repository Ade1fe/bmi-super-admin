"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, FileText, Loader2, Plus, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import {
  deleteAiDocument,
  getAiSettings,
  getAiUsage,
  listAiDocuments,
  saveAiSettings,
  setAiDocumentApproved,
  syncAiCourse,
  uploadAiDocument,
  type AiCourseSettings,
  type AiDocument,
  type AiUsage,
  type GradingBand,
} from "@/lib/ai-admin-api";

/** Same rule the server enforces: bands tile 0-100 exactly, with no gaps or overlaps. */
function bandProblem(bands: GradingBand[]): string | null {
  if (!bands.length) return "Add at least one grading band.";
  const sorted = [...bands].sort((a, b) => a.min - b.min);
  let expected = 0;
  for (const b of sorted) {
    if (![b.min, b.max].every(Number.isInteger)) return "Band limits must be whole numbers.";
    if (b.min > b.max) return `"${b.label || "A band"}" starts above where it ends.`;
    if (b.min > expected) return `Nothing covers ${expected}% to ${b.min - 1}%.`;
    if (b.min < expected) return `Bands overlap around ${b.min}%.`;
    expected = b.max + 1;
  }
  return expected === 101 ? null : "Bands must cover 0% to 100%.";
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#e6ebf3] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#173257]">{title}</h3>
      {hint ? <p className="mt-0.5 text-sm text-[#64748b]">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Toggle({ on, onChange, label, hint, disabled }: { on: boolean; onChange: (v: boolean) => void; label: string; hint?: string; disabled?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <p className="text-sm font-semibold text-[#173257]">{label}</p>
        {hint ? <p className="text-xs text-[#64748b]">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!on)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 ${on ? "bg-[#0f8751]" : "bg-[#cbd5e1]"}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#173257] outline-none focus:border-[#0f8751]";

/** Empty = platform default, 0 = unlimited, otherwise a number. */
function LimitField({ label, value, onChange, hint }: { label: string; value: number | null; onChange: (v: number | null) => void; hint: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#475569]">{label}</span>
      <input
        type="number"
        min={0}
        value={value ?? ""}
        placeholder="Platform default"
        onChange={(e) => onChange(e.target.value === "" ? null : Math.max(0, Math.floor(Number(e.target.value))))}
        className={`${inputClass} mt-1`}
      />
      <span className="text-[0.7rem] text-[#94a3b8]">{hint}</span>
    </label>
  );
}

const STATUS_TONE: Record<AiDocument["status"], string> = {
  indexed: "bg-[#e6f6ee] text-[#0f8751]",
  pending: "bg-[#fff3d6] text-[#8a5a00]",
  failed: "bg-[#fdeaea] text-[#a33d3d]",
};

export default function AiCourseSettingsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { session, isHydrated } = useAuthSession();
  const token = session?.token ?? "";

  const [settings, setSettings] = useState<AiCourseSettings | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [docs, setDocs] = useState<AiDocument[]>([]);
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!token || !courseId) return;
    try {
      const [s, d, u] = await Promise.all([
        getAiSettings(token, courseId),
        listAiDocuments(token, courseId),
        getAiUsage(token, { courseId }).catch(() => null),
      ]);
      setSettings(s);
      setSaved(JSON.stringify(s));
      setDocs(d);
      setUsage(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load this course.");
    } finally {
      setLoading(false);
    }
  }, [token, courseId]);

  useEffect(() => { if (isHydrated) void load(); }, [isHydrated, load]);

  const dirty = settings !== null && JSON.stringify(settings) !== saved;
  const problem = useMemo(() => (settings ? bandProblem(settings.gradingBands) : null), [settings]);

  function patch(change: Partial<AiCourseSettings>) {
    setSettings((s) => (s ? { ...s, ...change } : s));
  }

  function patchBand(index: number, change: Partial<GradingBand>) {
    if (!settings) return;
    patch({ gradingBands: settings.gradingBands.map((b, i) => (i === index ? { ...b, ...change } : b)) });
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const { courseId: _id, ...input } = settings;
      void _id;
      const res = await saveAiSettings(token, courseId, input);
      setSettings(res.data);
      setSaved(JSON.stringify(res.data));
      toast.success(res.message ?? "Saved.");
      if ((res as { syncStarted?: boolean }).syncStarted) setTimeout(() => void load(), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function sync() {
    setSyncing(true);
    try {
      const r = await syncAiCourse(token, courseId);
      toast.success(`Synchronised: ${r.added} added, ${r.updated} updated, ${r.removed} removed${r.failed.length ? `, ${r.failed.length} failed` : ""}.`);
      setDocs(await listAiDocuments(token, courseId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadAiDocument(token, courseId, file, { title: uploadTitle });
      toast.success("Document added to the AI knowledge base.");
      setUploadTitle("");
      setDocs(await listAiDocuments(token, courseId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function approve(doc: AiDocument, approved: boolean) {
    setDocs((list) => list.map((d) => (d.id === doc.id ? { ...d, approved } : d)));
    try {
      await setAiDocumentApproved(token, courseId, doc.id, approved);
    } catch (err) {
      setDocs((list) => list.map((d) => (d.id === doc.id ? { ...d, approved: !approved } : d)));
      toast.error(err instanceof Error ? err.message : "Could not update the document.");
    }
  }

  async function remove(doc: AiDocument) {
    if (!window.confirm(`Remove "${doc.title}" from the AI knowledge base?`)) return;
    try {
      await deleteAiDocument(token, courseId, doc.id);
      setDocs((list) => list.filter((d) => d.id !== doc.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove the document.");
    }
  }

  return (
    <AppShell title="AI Learning" activeSection="ai" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8" searchPlaceholder="Search courses...">
      <div className="mx-auto max-w-[980px] space-y-5 pb-24">
        <Link href="/ai" className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#173257]"><ArrowLeft className="h-4 w-4" /> All courses</Link>

        {loading ? (
          <div className="flex justify-center py-24 text-[#94a3b8]"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : error || !settings ? (
          <p className="rounded-xl border border-[#f3d3d3] bg-[#fff5f5] p-5 text-sm text-[#a33d3d]">{error ?? "Course not found."}</p>
        ) : (
          <>
            <Card title="Availability" hint="Turning AI off here never affects any other course. Learners see “Learn with AI” only when it is on and they are enrolled.">
              <Toggle on={settings.enabled} onChange={(v) => patch({ enabled: v })} label="Enable the AI Learning Assistant for this course" />
              <div className={`mt-1 divide-y divide-[#f1f5f9] border-t border-[#f1f5f9] ${settings.enabled ? "" : "opacity-50"}`}>
                <Toggle on={settings.tutoringEnabled} onChange={(v) => patch({ tutoringEnabled: v })} disabled={!settings.enabled} label="AI tutor" hint="Chat, explanations, examples and follow-up questions." />
                <Toggle on={settings.assignmentGenerationEnabled} onChange={(v) => patch({ assignmentGenerationEnabled: v })} disabled={!settings.enabled} label="Assignment and quiz generation" hint="Questions written from the approved course material." />
                <Toggle on={settings.assessmentEnabled} onChange={(v) => patch({ assessmentEnabled: v })} disabled={!settings.enabled} label="Assessment and grading" hint="Marks submissions and gives feedback." />
              </div>
            </Card>

            <Card title="Pass mark and grading bands" hint="Used for every formal assessment in this course.">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block"><span className="text-xs font-semibold text-[#475569]">Pass mark (%)</span>
                  <input type="number" min={1} max={100} value={settings.passMark} onChange={(e) => patch({ passMark: Math.floor(Number(e.target.value)) })} className={`${inputClass} mt-1`} />
                </label>
                <label className="block"><span className="text-xs font-semibold text-[#475569]">Attempts per lesson/module</span>
                  <input type="number" min={0} max={50} value={settings.maxAttempts} onChange={(e) => patch({ maxAttempts: Math.floor(Number(e.target.value)) })} className={`${inputClass} mt-1`} />
                  <span className="text-[0.7rem] text-[#94a3b8]">0 = unlimited</span>
                </label>
                <label className="block"><span className="text-xs font-semibold text-[#475569]">Question difficulty</span>
                  <select value={settings.questionDifficulty} onChange={(e) => patch({ questionDifficulty: e.target.value as AiCourseSettings["questionDifficulty"] })} className={`${inputClass} mt-1`}>
                    <option value="mixed">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 block sm:max-w-xs"><span className="text-xs font-semibold text-[#475569]">Learner level</span>
                <select value={settings.learnerLevel} onChange={(e) => patch({ learnerLevel: e.target.value as AiCourseSettings["learnerLevel"] })} className={`${inputClass} mt-1`}>
                  <option value="adaptive">Adaptive (adjusts to the learner)</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                </select>
              </label>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Grading bands</p>
              <div className="mt-2 space-y-2">
                {settings.gradingBands.map((b, i) => (
                  <div key={i} className="grid grid-cols-[64px_64px_minmax(0,1fr)_minmax(0,140px)_36px] items-center gap-2">
                    <input aria-label="From %" type="number" min={0} max={100} value={b.min} onChange={(e) => patchBand(i, { min: Math.floor(Number(e.target.value)) })} className={inputClass} />
                    <input aria-label="To %" type="number" min={0} max={100} value={b.max} onChange={(e) => patchBand(i, { max: Math.floor(Number(e.target.value)) })} className={inputClass} />
                    <input aria-label="Label" value={b.label} maxLength={60} onChange={(e) => patchBand(i, { label: e.target.value })} className={inputClass} />
                    <select aria-label="Action" value={b.action} onChange={(e) => patchBand(i, { action: e.target.value as GradingBand["action"] })} className={inputClass}>
                      <option value="pass">Pass, progress</option><option value="practice">Feedback + practice</option><option value="relearn">Relearn + reassess</option>
                    </select>
                    <button type="button" aria-label="Remove band" onClick={() => patch({ gradingBands: settings.gradingBands.filter((_, n) => n !== i) })} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => patch({ gradingBands: [...settings.gradingBands, { min: 0, max: 0, label: "New band", action: "practice" }] })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f8751]"><Plus className="h-4 w-4" /> Add band</button>
                {problem ? <span className="flex items-center gap-1.5 text-sm text-[#a33d3d]"><AlertTriangle className="h-4 w-4" />{problem}</span> : <span className="text-sm text-[#0f8751]">Bands cover 0–100%.</span>}
              </div>
              <p className="mt-3 text-xs text-[#94a3b8]">A learner passes at or above the pass mark. Bands decide the advice below it (practice or relearn).</p>
            </Card>

            <Card title="Progression" hint="Decide whether passing the AI assessment is required before a learner can move on.">
              <Toggle on={settings.assessmentMandatory} onChange={(v) => patch({ assessmentMandatory: v, ...(v && settings.progressionRule === "none" ? { progressionRule: "module" as const } : {}) })} label="Make AI assessment compulsory" hint="Locked content stays locked, on the server too, until the assessment is passed." />
              <label className={`mt-2 block sm:max-w-sm ${settings.assessmentMandatory ? "" : "opacity-50"}`}><span className="text-xs font-semibold text-[#475569]">Unlock content</span>
                <select disabled={!settings.assessmentMandatory} value={settings.progressionRule} onChange={(e) => patch({ progressionRule: e.target.value as AiCourseSettings["progressionRule"] })} className={`${inputClass} mt-1`}>
                  <option value="module">One module at a time</option><option value="lesson">One lesson at a time</option><option value="none">No locking</option>
                </select>
              </label>
              <div className="mt-3 border-t border-[#f1f5f9] pt-2">
                <Toggle on={settings.practicalCourse} onChange={(v) => patch({ practicalCourse: v })} label="Hands-on skills course" hint="Solar installation, garment making, cosmetology, horticulture, hardware repair. A written AI result can never certify the skill: learners must upload photo/video evidence and a teacher verifies it before they can pass." />
              </div>
            </Card>

            <Card title="Usage limits" hint="Empty uses the platform default. 0 means unlimited.">
              <div className="grid gap-4 sm:grid-cols-3">
                <LimitField label="Messages per learner per day" value={settings.learnerDailyMessageLimit} onChange={(v) => patch({ learnerDailyMessageLimit: v })} hint="Tutor chat messages." />
                <LimitField label="Tokens per learner per month" value={settings.learnerMonthlyTokenLimit} onChange={(v) => patch({ learnerMonthlyTokenLimit: v })} hint="All AI activity in this course." />
                <LimitField label="Tokens for the whole course per month" value={settings.courseMonthlyTokenLimit} onChange={(v) => patch({ courseMonthlyTokenLimit: v })} hint="A hard stop for the course." />
              </div>
              {usage ? <p className="mt-4 text-sm text-[#64748b]">All-time for this course: <strong>{usage.totals.calls.toLocaleString()}</strong> calls · <strong>{(usage.totals.inputTokens + usage.totals.outputTokens).toLocaleString()}</strong> tokens · about <strong>${usage.totals.costUsd.toFixed(2)}</strong></p> : null}
            </Card>

            <Card title="Tutor instructions" hint="Optional extra guidance for the tutor in this course (tone, vocabulary, local examples). It can never override the rule to stay within the approved materials.">
              <textarea value={settings.tutorInstructions ?? ""} maxLength={1500} rows={4} onChange={(e) => patch({ tutorInstructions: e.target.value })} className={inputClass} placeholder="e.g. Use Nigerian examples and prices where they help." />
            </Card>

            <Card title="Course materials the AI may read" hint="Lesson text and attached PDF, Word and PowerPoint files are read automatically. Switch a material off to stop the AI using it. Uploads are for answer keys, marking guides or extra notes.">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={sync} disabled={syncing} className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3.5 py-2 text-sm font-semibold text-[#173257] hover:bg-[#f8fafc] disabled:opacity-60">
                  {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Sync from lessons
                </button>
                <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="Title (optional)" className={`${inputClass} !w-48`} />
                <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.txt,.md,.csv,.html" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg bg-[#173257] px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload document
                </button>
              </div>

              {docs.length === 0 ? (
                <p className="mt-5 rounded-lg border border-dashed border-[#e2e8f0] p-6 text-center text-sm text-[#94a3b8]">No materials yet. Enable AI and sync, or upload a document.</p>
              ) : (
                <ul className="mt-4 divide-y divide-[#f1f5f9]">
                  {docs.map((d) => (
                    <li key={d.id} className="flex flex-wrap items-center gap-3 py-3">
                      <FileText className="h-5 w-5 shrink-0 text-[#94a3b8]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#173257]">{d.title}</p>
                        <p className="text-xs text-[#94a3b8]">
                          {d.sourceType === "upload" ? "Uploaded" : d.sourceType === "lesson_file" ? "Lesson file" : "Lesson text"} · {d.chunkCount} passages
                          {d.errorMessage ? <span className="text-[#a33d3d]"> · {d.errorMessage}</span> : null}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${STATUS_TONE[d.status]}`}>{d.status}</span>
                      <label className="flex items-center gap-2 text-xs text-[#475569]">
                        <input type="checkbox" checked={d.approved} onChange={(e) => approve(d, e.target.checked)} className="accent-[#0f8751]" /> AI may use
                      </label>
                      <button type="button" onClick={() => remove(d)} aria-label={`Remove ${d.title}`} className="text-[#94a3b8] hover:text-[#a33d3d]"><Trash2 className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>

      {settings && dirty ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e6ebf3] bg-white/95 px-4 py-3 backdrop-blur lg:left-[274px]">
          <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3">
            <p className="text-sm text-[#64748b]">You have unsaved changes.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSettings(JSON.parse(saved))} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#475569]">Discard</button>
              <button type="button" disabled={saving || !!problem} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-[#0f8751] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
