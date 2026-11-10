/**
 * Platform-admin client for the AI Learning Assistant (/ai/admin and a few
 * /ai/staff reads). Every endpoint answers { message, data }.
 */

import { apiConfig, apiRequest } from "./endpoints";

export type ProgressionRule = "none" | "lesson" | "module";
export type LearnerLevel = "beginner" | "intermediate" | "advanced" | "adaptive";

export interface GradingBand {
  min: number;
  max: number;
  label: string;
  action: "pass" | "practice" | "relearn";
}

export interface AiCourseSettings {
  courseId: string;
  enabled: boolean;
  tutoringEnabled: boolean;
  assignmentGenerationEnabled: boolean;
  assessmentEnabled: boolean;
  passMark: number;
  gradingBands: GradingBand[];
  maxAttempts: number;
  learnerLevel: LearnerLevel;
  questionDifficulty: "easy" | "medium" | "hard" | "mixed";
  assessmentMandatory: boolean;
  progressionRule: ProgressionRule;
  practicalCourse: boolean;
  imageGenerationEnabled: boolean;
  webResourcesEnabled: boolean;
  learnerDailyImageLimit: number | null;
  learnerDailyWebSearchLimit: number | null;
  learnerDailyMessageLimit: number | null;
  learnerMonthlyTokenLimit: number | null;
  courseMonthlyTokenLimit: number | null;
  tutorInstructions: string | null;
}

export type AiSettingsInput = Partial<Omit<AiCourseSettings, "courseId">>;

export interface AiCourseRow {
  courseId: string;
  name: string;
  status: string;
  schoolId: string | null;
  schoolName: string | null;
  aiEnabled: boolean;
  capabilities: { tutoring: boolean; assignmentGeneration: boolean; assessment: boolean };
  assessmentMandatory: boolean;
  progressionRule: ProgressionRule;
  practicalCourse: boolean;
  media?: { pictures: boolean; webResources: boolean };
  documents: { indexed: number; failed: number; pending: number };
}

export interface AiDocument {
  id: string;
  courseId: string;
  lessonId: string | null;
  sourceType: "lesson_content" | "lesson_file" | "upload";
  title: string;
  fileUrl: string | null;
  approved: boolean;
  status: "pending" | "indexed" | "failed";
  chunkCount: number;
  errorMessage: string | null;
  indexedAt: string | null;
}

export interface AiEngineStatus {
  globallyEnabled: boolean;
  providerConfigured: boolean;
  model: string;
}

export interface AiUsage {
  totals: { calls: number; inputTokens: number; outputTokens: number; costUsd: number };
  breakdown: {
    feature: string;
    model: string;
    status: string;
    calls: number;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    avgLatencyMs: number | null;
  }[];
}

export interface AiInstitutionLimit {
  schoolId: string;
  schoolName: string;
  enabled: boolean;
  monthlyTokenLimit: number | null;
}

export interface AiMessageReport {
  id: string;
  courseId: string;
  reason: string;
  details: string | null;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  resolutionNote: string | null;
  message: { content: string; sources: { documentTitle: string }[] } | null;
}

type Envelope<T> = { message?: string; data: T; meta?: { total: number; page: number; limit: number; pages: number } };

const url = (path: string) => `${apiConfig.apiBaseUrl}/ai${path}`;

async function call<T>(path: string, token: string, options: { method?: string; body?: unknown } = {}) {
  const res = await apiRequest<Envelope<T>>(url(path), {
    method: options.method ?? "GET",
    authToken: token,
    body: options.body,
    cache: "no-store",
  });
  return res;
}

export const getAiEngineStatus = (token: string) =>
  call<AiEngineStatus>("/admin/status", token).then((r) => r.data);

export async function listAiCourses(
  token: string,
  query: { search?: string; enabled?: boolean; page?: number; limit?: number } = {},
) {
  const q = new URLSearchParams();
  if (query.search?.trim()) q.set("search", query.search.trim());
  if (query.enabled !== undefined) q.set("enabled", String(query.enabled));
  q.set("page", String(query.page ?? 1));
  q.set("limit", String(query.limit ?? 20));
  const res = await call<AiCourseRow[]>(`/admin/courses?${q}`, token);
  return { rows: res.data, meta: res.meta! };
}

export const getAiSettings = (token: string, courseId: string) =>
  call<AiCourseSettings>(`/admin/courses/${courseId}/settings`, token).then((r) => r.data);

export const saveAiSettings = (token: string, courseId: string, input: AiSettingsInput) =>
  call<AiCourseSettings>(`/admin/courses/${courseId}/settings`, token, { method: "PUT", body: input });

export const setAiEnabled = (token: string, courseId: string, enabled: boolean) =>
  call<AiCourseSettings>(`/admin/courses/${courseId}/${enabled ? "enable" : "disable"}`, token, { method: "POST" });

export const listAiDocuments = (token: string, courseId: string) =>
  call<AiDocument[]>(`/admin/courses/${courseId}/documents`, token).then((r) => r.data);

export const syncAiCourse = (token: string, courseId: string) =>
  call<{ added: number; updated: number; unchanged: number; removed: number; failed: { title: string; reason: string }[] }>(
    `/admin/courses/${courseId}/sync`, token, { method: "POST" },
  ).then((r) => r.data);

export const setAiDocumentApproved = (token: string, courseId: string, documentId: string, approved: boolean) =>
  call<AiDocument>(`/admin/courses/${courseId}/documents/${documentId}`, token, { method: "PUT", body: { approved } });

export const deleteAiDocument = (token: string, courseId: string, documentId: string) =>
  call<null>(`/admin/courses/${courseId}/documents/${documentId}`, token, { method: "DELETE" });

export async function uploadAiDocument(
  token: string,
  courseId: string,
  file: File,
  options: { lessonId?: string; title?: string } = {},
): Promise<AiDocument> {
  const form = new FormData();
  form.append("file", file);
  if (options.lessonId) form.append("lessonId", options.lessonId);
  if (options.title?.trim()) form.append("title", options.title.trim());

  const response = await fetch(url(`/admin/courses/${courseId}/documents`), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message;
    throw new Error(typeof message === "string" ? message : "Upload failed.");
  }
  return (payload as Envelope<AiDocument>).data;
}

export const getAiUsage = (token: string, query: { courseId?: string; from?: string } = {}) => {
  const q = new URLSearchParams();
  if (query.courseId) q.set("courseId", query.courseId);
  if (query.from) q.set("from", query.from);
  return call<AiUsage>(`/admin/usage?${q}`, token).then((r) => r.data);
};

export const getAiInstitutionLimit = (token: string, schoolId: string) =>
  call<AiInstitutionLimit>(`/admin/institutions/${schoolId}/limits`, token).then((r) => r.data);

export const saveAiInstitutionLimit = (
  token: string,
  schoolId: string,
  input: { enabled?: boolean; monthlyTokenLimit?: number | null },
) => call<AiInstitutionLimit>(`/admin/institutions/${schoolId}/limits`, token, { method: "PUT", body: input }).then((r) => r.data);

export async function listAiReports(token: string, status: "open" | "resolved" | "dismissed" = "open") {
  const res = await call<AiMessageReport[]>(`/staff/reports?status=${status}&limit=50`, token);
  return res.data;
}

export const resolveAiReport = (token: string, id: string, status: "resolved" | "dismissed", note?: string) =>
  call<AiMessageReport>(`/staff/reports/${id}`, token, { method: "PUT", body: { status, note: note ?? "" } });
