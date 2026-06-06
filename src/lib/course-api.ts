import { apiRequest, endpoints } from "./endpoints";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
}

/**
 * All successful API responses follow this envelope:
 *   { "message": "...", "data": <array|object> }
 *
 * We always pull from `data` first, then fall back to the root payload so
 * the helpers stay safe if the shape ever changes.
 */
function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  // The backend always puts content under "data"
  return "data" in payload ? payload.data : payload;
}

/**
 * Unwrap a list response.  The backend puts arrays directly under `data`.
 * Fallback keys are kept for defensive resilience.
 */
function unwrapCollection(payload: unknown): unknown[] {
  const data = unwrapData(payload);

  if (Array.isArray(data)) return data;

  // Defensive: sometimes the array is nested one level deeper
  if (isRecord(data)) {
    for (const key of ["data", "items", "courses", "modules", "lessons", "categories"]) {
      const v = data[key];
      if (Array.isArray(v)) return v;
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function parseCategory(value: unknown): ApiCourseCategory | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const name = readString(value.name) || readString(value.title);

  if (!id || !name) return null;

  return { id, name };
}

function parseCourse(value: unknown): Course | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id) || readString(value.courseId);
  const name = readString(value.name) || readString(value.title);

  if (!id || !name) return null;

  // The API returns the category as a nested object: { id, name }
  const category = isRecord(value.category)
    ? {
        id: readString(value.category.id),
        name: readString(value.category.name) || readString(value.category.title),
      }
    : undefined;

  return {
    id,
    name,
    description: readString(value.description) || readString(value.summary),
    categoryId: readString(value.categoryId) || category?.id,
    categoryName:
      category?.name ||
      readString(value.categoryName) ||
      readString(value.category as unknown),
    difficultyLevel: readString(value.difficultyLevel) as CourseDifficultyLevel,
    status: readString(value.status) as CourseStatus,
    thumbnailUrl: readString(value.thumbnailUrl),
    // The API does not return a slug field; we fall back to id so
    // getCourseBySlug lookups and edit-page hrefs stay functional.
    slug: readString(value.slug) || id,
    totalLessons:
      typeof value.totalLessons === "number" ? value.totalLessons : 0,
    totalStudents:
      typeof value.totalStudents === "number" ? value.totalStudents : 0,
    totalQuizzes:
      typeof value.totalQuizzes === "number" ? value.totalQuizzes : 0,
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseLesson(value: unknown): CourseLesson | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id) || readString(value.lessonId);
  const title = readString(value.title) || readString(value.name);

  if (!id || !title) return null;

  return {
    id,
    title,
    content: readString(value.content) || readString(value.description),
    videoUrl: readString(value.videoUrl),
    type: readString(value.type) || "reading",
    estimatedReadingTime: readString(value.estimatedReadingTime),
    accessLevel: readString(value.accessLevel),
    order: typeof value.order === "number" ? value.order : undefined,
    moduleId: readString(value.moduleId),
    courseId: readString(value.courseId),
    enableComments:
      typeof value.enableComments === "boolean"
        ? value.enableComments
        : undefined,
    enablePdfDownload:
      typeof value.enablePdfDownload === "boolean"
        ? value.enablePdfDownload
        : undefined,
    pdfUrl: readString(value.pdfUrl) || undefined,
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseModule(value: unknown): CourseModule | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id) || readString(value.moduleId);
  const title = readString(value.title) || readString(value.name);

  if (!id || !title) return null;

  // Lessons are returned as an array directly on the module object
  const rawLessons = Array.isArray(value.lessons) ? value.lessons : [];

  // The API also returns a quiz object (or null) on each module
  const quiz =
    value.quiz && isRecord(value.quiz)
      ? parseQuiz(value.quiz)
      : null;

  return {
    id,
    title,
    description: readString(value.description),
    order: typeof value.order === "number" ? value.order : undefined,
    courseId: readString(value.courseId),
    status: readString(value.status),
    enableDripRelease:
      typeof value.enableDripRelease === "boolean"
        ? value.enableDripRelease
        : false,
    releaseInterval:
      typeof value.releaseInterval === "number"
        ? value.releaseInterval
        : undefined,
    fixedReleaseDate: readString(value.fixedReleaseDate) || undefined,
    lessons: rawLessons
      .map((item) => parseLesson(item))
      .filter((item): item is CourseLesson => Boolean(item)),
    quiz,
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseQuiz(value: unknown): CourseQuiz | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  if (!id) return null;

  return {
    id,
    moduleId: readString(value.moduleId),
    title: readString(value.title),
    passMark: typeof value.passMark === "number" ? value.passMark : 75,
    allowPartialCredit:
      typeof value.allowPartialCredit === "boolean"
        ? value.allowPartialCredit
        : false,
    timeLimit: typeof value.timeLimit === "number" ? value.timeLimit : 45,
    attempts: typeof value.attempts === "number" ? value.attempts : 2,
    visibility: readString(value.visibility) || "publish",
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseDifficultyLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived" | string;

export type ApiCourseCategory = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  categoryName?: string;
  difficultyLevel?: CourseDifficultyLevel;
  status?: CourseStatus;
  thumbnailUrl?: string;
  /** Falls back to `id` when the backend does not return a slug field. */
  slug: string;
  totalLessons?: number;
  totalStudents?: number;
  totalQuizzes?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CourseLesson = {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  type: string;
  estimatedReadingTime?: string;
  accessLevel?: string;
  order?: number;
  moduleId?: string;
  courseId?: string;
  enableComments?: boolean;
  enablePdfDownload?: boolean;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CourseQuiz = {
  id: string;
  moduleId?: string;
  title: string;
  passMark: number;
  allowPartialCredit: boolean;
  timeLimit: number;
  attempts: number;
  visibility: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  description?: string;
  order?: number;
  courseId?: string;
  status?: string;
  enableDripRelease?: boolean;
  releaseInterval?: number;
  fixedReleaseDate?: string;
  lessons: CourseLesson[];
  quiz: CourseQuiz | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCoursePayload = {
  name: string;
  categoryId: string;
  difficultyLevel: CourseDifficultyLevel;
  description: string;
  status: CourseStatus;
  thumbnailUrl: string;
};

export type UpdateCoursePayload = Partial<{
  name: string;
  categoryId: string;
  difficultyLevel: CourseDifficultyLevel;
  description: string;
  status: CourseStatus;
  thumbnailUrl: string;
}>;

export type CreateModulePayload = {
  title: string;
  description: string;
  order: number;
  courseId: string;
  status: string;
  enableDripRelease: boolean;
  releaseInterval?: number;
  fixedReleaseDate?: string;
};

export type UpdateModulePayload = Partial<{
  title: string;
  description: string;
  enableDripRelease: boolean;
  releaseInterval: number;
}>;

export type CreateLessonPayload = {
  title: string;
  content: string;
  videoUrl?: string;
  type: string;
  estimatedReadingTime?: string;
  accessLevel?: string;
  order: number;
  moduleId: string;
  instructorId?: string; 
};

export type UpdateLessonPayload = Partial<{
  title: string;
  content: string;
  videoUrl: string;
  type: string;
  estimatedReadingTime: string;
  accessLevel: string;
  order: number;
  enableComments: boolean;
}>;

export type CreateQuizPayload = {
  title: string;
  passMark: number;
  allowPartialCredit: boolean;
  timeLimit: number;
  attempts: number;
  visibility: string;
};

export type UpdateQuizPayload = Partial<CreateQuizPayload>;

export type ModulePrerequisite = {
  moduleId: string;
  title?: string;
  completionRequired: boolean;
};

export type LessonPrerequisite = {
  lessonId: string;
  title?: string;
  completionRequired: boolean;
};

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** GET /courses/get-categories → { message, data: [...] } */
export async function getCategories(authToken?: string) {
  const response = await apiRequest<unknown>(endpoints.courses.categories.all, {
    authToken,
  });

  const items = unwrapCollection(response);

  return items
    .map((item) => parseCategory(item))
    .filter((item): item is ApiCourseCategory => Boolean(item));
}

/**
 * GET /courses?page=&limit=&status=&search=
 * Response: { message, data: [...courses], meta: { total, page, limit, totalPages } }
 */
export async function getCourses(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {},
  authToken?: string
) {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status,
    search: params.search,
  });

  const url = query ? `${endpoints.courses.all}?${query}` : endpoints.courses.all;
  const response = await apiRequest<unknown>(url, { authToken });

  const items = unwrapCollection(response);

  const courses = items
    .map((item) => parseCourse(item))
    .filter((item): item is Course => Boolean(item));

  // meta lives at the root of the response envelope alongside `data`
  const meta =
    isRecord(response) && isRecord(response.meta) ? response.meta : undefined;

  return {
    courses,
    meta: {
      page: typeof meta?.page === "number" ? meta.page : (params.page ?? 1),
      limit: typeof meta?.limit === "number" ? meta.limit : (params.limit ?? 20),
      total:
        typeof meta?.total === "number" ? meta.total : courses.length,
      totalPages:
        typeof meta?.totalPages === "number" ? meta.totalPages : undefined,
    },
  };
}

/**
 * GET /courses/:id
 * Response: { message, data: { ...course } }
 */
export async function getCourse(courseId: string, authToken?: string) {
  const response = await apiRequest<unknown>(
    endpoints.courses.byId(courseId),
    { authToken }
  );

  const data = unwrapData(response);
  return parseCourse(data) ?? null;
}

/**
 * Look up a course by slug (or ID).
 *
 * The backend does not expose a slug-based lookup endpoint, so we:
 *   1. Try a direct GET /courses/:id (in case the slug IS the id or a UUID is passed).
 *   2. Fall back to GET /courses?search=<slug> and match by id or name-derived slug.
 */
export async function getCourseBySlug(slug: string, authToken?: string) {
  if (!slug.trim()) return null;

  const normalized = slug.trim().toLowerCase();

  // 1. Direct ID lookup — most common case when editing from the list page
  //    (the href uses course.id as the slug already).
  try {
    const byId = await getCourse(slug, authToken);
    if (byId) return byId;
  } catch {
    // Not a valid ID — fall through to search
  }

  // 2. Search and find a match by name-derived slug
  try {
    const response = await getCourses(
      { page: 1, limit: 50, search: normalized },
      authToken
    );

    // Try exact id match first
    const byId = response.courses.find(
      (c) => c.id.toLowerCase() === normalized
    );
    if (byId) return byId;

    // Try name → slug conversion match
    return (
      response.courses.find(
        (c) =>
          c.name.toLowerCase().replace(/\s+/g, "-") === normalized
      ) ?? null
    );
  } catch {
    return null;
  }
}

/** POST /courses → { message, data: { ...course } } */
export async function createCourse(
  payload: CreateCoursePayload,
  authToken?: string
) {
  const response = await apiRequest<unknown>(endpoints.courses.create, {
    method: "POST",
    body: payload,
    authToken,
  });

  const data = unwrapData(response);
  return parseCourse(data);
}

/** PUT /courses/:id → { message, data: { ...course } } */
export async function updateCourse(
  courseId: string,
  payload: UpdateCoursePayload,
  authToken?: string
) {
  const response = await apiRequest<unknown>(
    endpoints.courses.update(courseId),
    { method: "PUT", body: payload, authToken }
  );

  const data = unwrapData(response);
  return parseCourse(data);
}

/** POST /courses/modules → { message, data: { ...module } } */
export async function createModule(
  payload: CreateModulePayload,
  authToken?: string
) {
  const response = await apiRequest<unknown>(endpoints.courses.modules.create, {
    method: "POST",
    body: payload,
    authToken,
  });

  const data = unwrapData(response);
  return parseModule(data);
}

/** PUT /courses/modules/:moduleId → { message, data: { ...module } } */
export async function updateModule(
  moduleId: string,
  payload: UpdateModulePayload,
  authToken?: string
) {
  const response = await apiRequest<unknown>(
    endpoints.courses.modules.update(moduleId),
    { method: "PUT", body: payload, authToken }
  );

  const data = unwrapData(response);
  return parseModule(data);
}



/** DELETE /courses/modules/:moduleId → { message } */
export async function deleteModule(moduleId: string, authToken?: string) {
  return apiRequest<{ message: string }>(
    endpoints.courses.modules.delete(moduleId),
    { method: "DELETE", authToken }
  );
}

/**
 * GET /courses/modules/:courseId
 * Response: { message, data: [ { ...module, lessons: [...], quiz: null|{...} } ] }
 */
export async function fetchModules(courseId: string, authToken?: string) {
  const response = await apiRequest<unknown>(
    endpoints.courses.modules.fetchByCourse(courseId),
    { authToken }
  );

  const items = unwrapCollection(response);

  return items
    .map((item) => parseModule(item))
    .filter((item): item is CourseModule => Boolean(item));
}

/**
 * POST /courses/lessons
 * Body: { title, content, videoUrl?, type, estimatedReadingTime?, accessLevel?,
 *         order, moduleId, instructorId? }
 * Response: { message, data: { ...lesson } }
 */
export async function createLesson(
  payload: CreateLessonPayload,
  authToken?: string
) {
// AFTER
const body: Record<string, any> = {
  title: payload.title,
  content: payload.content,
  type: payload.type,
  order: payload.order,
  moduleId: payload.moduleId,
  ...(payload.videoUrl ? { videoUrl: payload.videoUrl } : {}),
  ...(payload.estimatedReadingTime
    ? { estimatedReadingTime: payload.estimatedReadingTime }
    : {}),
  ...(payload.accessLevel ? { accessLevel: payload.accessLevel } : {}),
  ...(payload.instructorId ? { instructorId: payload.instructorId } : {}),
};

  const response = await apiRequest<unknown>(
    endpoints.courses.lessons.create,
    {
      method: "POST",
      body,
      authToken,
    }
  );

  const data = unwrapData(response);
  return parseLesson(data);
}

/** PUT /courses/lessons/:lessonId → { message, data: { ...lesson } } */
export async function updateLesson(
  lessonId: string,
  payload: UpdateLessonPayload,
  authToken?: string
) {
  const response = await apiRequest<unknown>(
    endpoints.courses.lessons.update(lessonId),
    { method: "PUT", body: payload, authToken }
  );

  const data = unwrapData(response);
  return parseLesson(data);
}

/** DELETE /courses/lessons/:lessonId → { message } */
export async function deleteLesson(lessonId: string, authToken?: string) {
  return apiRequest<{ message: string }>(
    endpoints.courses.lessons.delete(lessonId),
    { method: "DELETE", authToken }
  );
}

/**
 * POST /courses/modules/:moduleId/quiz
 * Body: { title, passMark, allowPartialCredit, timeLimit, attempts, visibility }
 * Response: { message, data: { ...quiz } }
 */

/**
 * POST /courses/modules/:moduleId/quiz
 * Body: { title, passMark, allowPartialCredit, timeLimit, attempts, visibility }
 * Response: { message, data: { ...quiz } }
 */
export async function createQuiz(
  moduleId: string,
  payload: CreateQuizPayload,
  authToken?: string
) {
  console.log("[QUIZ createQuiz] →", { moduleId, payload });
 
  const response = await apiRequest<unknown>(
    endpoints.courses.quizzes.create(moduleId),
    { method: "POST", body: payload, authToken }
  );
 
  console.log("[QUIZ createQuiz] raw response:", response);
 
  const data = unwrapData(response);
  const parsed = parseQuiz(data);
  console.log("[QUIZ createQuiz] parsed:", parsed);
  return parsed;
}
 
/**
 * PUT /courses/modules/:moduleId/quiz
 * Body: partial quiz fields
 * Response: { message, data: { ...quiz } }
 */
export async function updateQuiz(
  moduleId: string,
  payload: UpdateQuizPayload,
  authToken?: string
) {
  console.log("[QUIZ updateQuiz] →", { moduleId, payload });
 
  const response = await apiRequest<unknown>(
    endpoints.courses.quizzes.update(moduleId),
    { method: "PUT", body: payload, authToken }
  );
 
  console.log("[QUIZ updateQuiz] raw response:", response);
 
  const data = unwrapData(response);
  const parsed = parseQuiz(data);
  console.log("[QUIZ updateQuiz] parsed:", parsed);
  return parsed;
}
 
/**
 * DELETE /courses/modules/:moduleId/quiz
 * Response: { message: "Quiz deleted successfully." }
 */
export async function deleteQuiz(moduleId: string, authToken?: string) {
  console.log("[QUIZ deleteQuiz] →", { moduleId });
 
  const response = await apiRequest<{ message: string }>(
    endpoints.courses.quizzes.delete(moduleId),
    { method: "DELETE", authToken }
  );
 
  console.log("[QUIZ deleteQuiz] response:", response);
  return response;
}
 
// ---------------------------------------------------------------------------
// PREREQUISITES — placeholder functions (backend not yet implemented)
// ---------------------------------------------------------------------------

export async function getModulePrerequisites(
  _moduleId: string,
  _authToken?: string
): Promise<ModulePrerequisite[]> {
  console.warn("getModulePrerequisites: Backend endpoint not yet implemented");
  return [];
}

export async function addModulePrerequisite(
  _moduleId: string,
  _prerequisiteModuleId: string,
  _authToken?: string
): Promise<void> {
  console.warn("addModulePrerequisite: Backend endpoint not yet implemented");
}

export async function removeModulePrerequisite(
  _moduleId: string,
  _prerequisiteModuleId: string,
  _authToken?: string
): Promise<void> {
  console.warn("removeModulePrerequisite: Backend endpoint not yet implemented");
}

export async function getLessonPrerequisites(
  _lessonId: string,
  _authToken?: string
): Promise<LessonPrerequisite[]> {
  console.warn("getLessonPrerequisites: Backend endpoint not yet implemented");
  return [];
}

export async function addLessonPrerequisite(
  _lessonId: string,
  _prerequisiteLessonId: string,
  _authToken?: string
): Promise<void> {
  console.warn("addLessonPrerequisite: Backend endpoint not yet implemented");
}

export async function removeLessonPrerequisite(
  _lessonId: string,
  _prerequisiteLessonId: string,
  _authToken?: string
): Promise<void> {
  console.warn("removeLessonPrerequisite: Backend endpoint not yet implemented");
}