import { apiRequest, endpoints } from "./endpoints";

// ─── Types ─────────────────────────────────────────────

export interface StudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentSchool {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  userId: string;
  schoolId: string;
  admissionNumber: string | null;
  class: string | null;
  createdAt: string;
  updatedAt: string;
  user: StudentUser;
  school: StudentSchool;
}

// ─── Payloads ──────────────────────────────────────────

export interface StudentLoginPayload {
  email: string;
  password: string;
}

export interface RegisterStudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  admissionNumber?: string;
  class?: string;
}

export interface DeactivateStudentPayload {
  reason: string;
}

export interface ReactivateStudentPayload {
  reason?: string;
}

export interface GrantPremiumAccessPayload {
  plan: string;
  durationMonths: number;
  reason: string;
}

// ─── Query params ──────────────────────────────────────

export interface FetchStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  /** "active" | "inactive" | undefined (all) */
  status?: "active" | "inactive";
}

// ─── Responses ─────────────────────────────────────────

export interface StudentLoginResponse {
  message: string;
  data: {
    token: string;
    student: Student;
  };
}

export interface RegisterStudentResponse {
  message: string;
  data: Student;
}

export interface FetchStudentsResponse {
  message: string;
  data: Student[];
  /** Some APIs wrap pagination metadata here */
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  /** Others put it at the root */
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface StudentProfileResponse {
  message: string;
  data: Student;
}

export interface StudentStatsResponse {
  message: string;
  data: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    newThisWeek: number;
  };
}

export interface DeactivateStudentResponse {
  message: string;
  data: Student;
}

export interface ReactivateStudentResponse {
  message: string;
  data: Student;
}

export interface GrantPremiumAccessResponse {
  message: string;
  data: {
    studentId: string;
    plan: string;
    durationMonths: number;
    grantedAt: string;
  };
}
const DEBUG = true;

function log(tag: string, data?: unknown) {
  if (!DEBUG) return;
  console.log(`[students-api] ${tag}`, data ?? "");
}

function logError(tag: string, error: unknown) {
  console.error(`[students-api ERROR] ${tag}`, error);
}
// ─── Helpers ───────────────────────────────────────────

function buildQueryString(params: Record<string, string | number | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

// ─── API FUNCTIONS ─────────────────────────────────────

/**
 * Student login
 */
export async function studentLogin(payload: StudentLoginPayload) {
  log("studentLogin() called", { email: payload.email });

  try {
    const res = await apiRequest<StudentLoginResponse>(
      endpoints.students.login,
      {
        method: "POST",
        body: payload,
      }
    );

    log("studentLogin() response", res);
    return res;
  } catch (err) {
    logError("studentLogin() failed", err);
    throw err;
  }
}

/**
 * Register student (school admin)
 */
export async function registerStudent(
  payload: RegisterStudentPayload,
  authToken: string
) {
  log("registerStudent() called", {
    email: payload.email,
    class: payload.class,
  });

  try {
    const res = await apiRequest<RegisterStudentResponse>(
      endpoints.schools.registerStudent,
      {
        method: "POST",
        authToken,
        body: payload,
      }
    );

    log("registerStudent() response", res);
    return res;
  } catch (err) {
    logError("registerStudent() failed", err);
    throw err;
  }
}
/**
 * Get all students (admin) — supports pagination, search, status filter
 */
export async function getSchoolStudents(
  authToken: string,
  params: FetchStudentsParams = {}
) {
  const qs = buildQueryString({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
  });

  const url = `${endpoints.admin.students}${qs}`;

  log("getSchoolStudents() called", { url, params });

  try {
    const res = await apiRequest<FetchStudentsResponse>(url, {
      method: "GET",
      authToken,
    });

    log("getSchoolStudents() response", res);
    log("getSchoolStudents() students count", res.data?.length);

    return res;
  } catch (err) {
    logError("getSchoolStudents() failed", err);
    throw err;
  }
}

/**
 * Get single student profile
 */
export async function getStudentProfile(
  studentId: string,
  authToken: string
) {
  log("getStudentProfile() called", { studentId });

  try {
    const res = await apiRequest<StudentProfileResponse>(
      endpoints.students.profile(studentId),
      { method: "GET", authToken }
    );

    log("getStudentProfile() raw response", res);

    const student = res as unknown as Student;

    log("getStudentProfile() parsed student", student);

    return student;
  } catch (err) {
    logError("getStudentProfile() failed", err);
    throw err;
  }
}
/**
 * Deactivate a student account
 */
export async function deactivateStudent(
  studentId: string,
  payload: DeactivateStudentPayload,
  authToken: string
) {
  log("deactivateStudent() called", { studentId, payload });

  try {
    const res = await apiRequest<DeactivateStudentResponse>(
      endpoints.admin.deactivateStudent(studentId),
      {
        method: "PUT",
        authToken,
        body: payload,
      }
    );

    log("deactivateStudent() response", res);
    return res;
  } catch (err) {
    logError("deactivateStudent() failed", err);
    throw err;
  }
}

export async function reactivateStudent(
  studentId: string,
  payload: ReactivateStudentPayload,
  authToken: string
) {
  log("reactivateStudent() called", { studentId, payload });

  try {
    const res = await apiRequest<ReactivateStudentResponse>(
      endpoints.admin.reactivateStudent(studentId),
      {
        method: "PUT",
        authToken,
        body: payload,
      }
    );

    log("reactivateStudent() response", res);
    return res;
  } catch (err) {
    logError("reactivateStudent() failed", err);
    throw err;
  }
}

/**
 * Get student statistics (admin)
 */
export async function getStudentStats(authToken: string) {
  log("getStudentStats() called");

  try {
    const res = await apiRequest<StudentStatsResponse>(
      endpoints.admin.studentStats,
      { method: "GET", authToken }
    );

    log("getStudentStats() response", res);
    log("getStudentStats() stats", res.data);

    return res;
  } catch (err) {
    logError("getStudentStats() failed", err);
    throw err;
  }
}
/**
 * Grant premium access to a student
 */
export async function grantPremiumAccess(
  studentId: string,
  payload: GrantPremiumAccessPayload,
  authToken: string
) {
  log("grantPremiumAccess() called", {
    studentId,
    plan: payload.plan,
    durationMonths: payload.durationMonths,
  });

  try {
    const res = await apiRequest<GrantPremiumAccessResponse>(
      `${endpoints.admin.students}/${studentId}/grant-premium`,
      {
        method: "POST",
        authToken,
        body: payload,
      }
    );

    log("grantPremiumAccess() response", res);
    return res;
  } catch (err) {
    logError("grantPremiumAccess() failed", err);
    throw err;
  }
}