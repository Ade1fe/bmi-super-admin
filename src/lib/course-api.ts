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
 */
function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return "data" in payload ? payload.data : payload;
}

function unwrapCollection(payload: unknown): unknown[] {
  const data = unwrapData(payload);

  if (Array.isArray(data)) return data;

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

// ✅ REPLACE THIS FUNCTION in your course-api.ts
// This version includes learningObjectives extraction from the API response

function parseCourse(value: unknown): Course | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id) || readString(value.courseId);
  const name = readString(value.name) || readString(value.title);

  if (!id || !name) return null;

  const category = isRecord(value.category)
    ? {
        id: readString(value.category.id),
        name: readString(value.category.name) || readString(value.category.title),
      }
    : undefined;

  // ✅ Extract learning objectives from course response
  const rawObjectives = Array.isArray(value.learningObjectives) ? value.learningObjectives : [];

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
    slug: readString(value.slug) || id,
    totalLessons:
      typeof value.totalLessons === "number" ? value.totalLessons : 0,
    totalStudents:
      typeof value.totalStudents === "number" ? value.totalStudents : 0,
    totalQuizzes:
      typeof value.totalQuizzes === "number" ? value.totalQuizzes : 0,
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
    // ✅ Include parsed objectives from API response
    learningObjectives: rawObjectives
      .map((item) => parseObjective(item))
      .filter((item): item is CourseObjective => Boolean(item)),
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

/**
 * Parse a quiz question from the API response.
 * Shape: { id, quizId, question, type, marks, options, correctOption, order, createdAt, updatedAt }
 * - `options` is null for theory questions
 * - `correctOption` is null for theory questions
 */
function parseQuizQuestion(value: unknown): QuizQuestion | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const question = readString(value.question);

  if (!id || !question) return null;

  return {
    id,
    quizId: readString(value.quizId),
    question,
    type: (readString(value.type) || "multiple_choice") as QuizQuestionType,
    marks: typeof value.marks === "number" ? value.marks : 10,
    options: Array.isArray(value.options)
      ? (value.options as unknown[]).map((o) => String(o))
      : null,
    correctOption:
      typeof value.correctOption === "number" ? value.correctOption : null,
    order: typeof value.order === "number" ? value.order : 0,
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseQuiz(value: unknown): CourseQuiz | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  if (!id) return null;

  // Questions are returned as an array on the quiz object (from Create response)
  const rawQuestions = Array.isArray(value.questions) ? value.questions : [];

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
    questions: rawQuestions
      .map((q) => parseQuizQuestion(q))
      .filter((q): q is QuizQuestion => Boolean(q))
      .sort((a, b) => a.order - b.order),
    createdAt: readString(value.createdAt),
    updatedAt: readString(value.updatedAt),
  };
}

function parseModule(value: unknown): CourseModule | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id) || readString(value.moduleId);
  const title = readString(value.title) || readString(value.name);

  if (!id || !title) return null;

  const rawLessons = Array.isArray(value.lessons) ? value.lessons : [];

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


function parseObjective(value: unknown): CourseObjective | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const courseId = readString(value.courseId);
const objective =
  readString(value.objective) ||
  readString(value.title) ||
  readString(value.description);

if (!id || !courseId || !objective) return null;

return {
  id,
  courseId,
  objective,
  order:
    typeof value.order === "number"
      ? value.order
      : undefined,
  createdAt: readString(value.createdAt),
  updatedAt: readString(value.updatedAt),
};
}


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CourseDifficultyLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived" | string;
export type QuizQuestionType = "multiple_choice" | "theory";

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
  slug: string;
  totalLessons?: number;
  totalStudents?: number;
  totalQuizzes?: number;
  createdAt?: string;
  updatedAt?: string;
   learningObjectives?: CourseObjective[];
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

/**
 * A single quiz question as returned by the API.
 * - multiple_choice: has options[] and correctOption (index)
 * - theory:          options is null, correctOption is null
 */
export type QuizQuestion = {
  id: string;
  quizId?: string;
  question: string;
  type: QuizQuestionType;
  marks: number;
  options: string[] | null;
  correctOption: number | null;
  order: number;
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
  questions: QuizQuestion[];
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

/**
 * A question inside a CreateQuizPayload / UpdateQuizPayload.
 *
 * multiple_choice → requires options[] and correctOption (0-based index)
 * theory          → options and correctOption must be omitted
 */
export type QuizQuestionInput = {
  question: string;
  type: QuizQuestionType;
  marks: number;
  order: number;
  // multiple_choice only
  options?: string[];
  correctOption?: number;
};

/**
 * POST /courses/modules/:moduleId/quiz
 * Questions are sent inline — the API creates the quiz and all questions atomically.
 */
export type CreateQuizPayload = {
  title: string;
  passMark: number;
  allowPartialCredit: boolean;
  timeLimit: number;
  attempts: number;
  visibility: string;
  questions: QuizQuestionInput[];
};

export type UpdateQuizPayload = Partial<Omit<CreateQuizPayload, "questions">> & {
  questions?: QuizQuestionInput[];
};

/**
 * POST /courses/quizzes/:quizzId/questions
 */
export type AddQuestionPayload = {
  question: string;
  type: QuizQuestionType;
  marks: number;
  options?: string[];
  correctOption?: number;
};

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


export type CourseObjective = {
  id: string;
  courseId: string;
  objective: string;  // ✅ Changed from 'title'
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateObjectivePayload = {
  objective: string;  // ✅ Single field
};

export type UpdateObjectivePayload = {
  objective?: string;  // ✅ Single field
};
// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** GET /courses/get-categories → { message, data: [...] } */
export async function getCategories(authToken?: string) {
  console.log("[v0] getCategories() called");
  const response = await apiRequest<unknown>(endpoints.courses.categories.all, {
    authToken,
  });

  const items = unwrapCollection(response);
  console.log("[v0] getCategories() items parsed:", items.length);

  return items
    .map((item) => parseCategory(item))
    .filter((item): item is ApiCourseCategory => Boolean(item));
}

/**
 * GET /courses?page=&limit=&status=&search=
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
  console.log("[v0] getCourses() called with params:", params);

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

  const meta =
    isRecord(response) && isRecord(response.meta) ? response.meta : undefined;

  return {
    courses,
    meta: {
      page: typeof meta?.page === "number" ? meta.page : (params.page ?? 1),
      limit: typeof meta?.limit === "number" ? meta.limit : (params.limit ?? 20),
      total: typeof meta?.total === "number" ? meta.total : courses.length,
      totalPages:
        typeof meta?.totalPages === "number" ? meta.totalPages : undefined,
    },
  };
}

/** GET /courses/:id */
export async function getCourse(courseId: string, authToken?: string) {
  console.log("[v0] getCourse() called with courseId:", courseId);

  const response = await apiRequest<unknown>(
    endpoints.courses.byId(courseId),
    { authToken }
  );

  const data = unwrapData(response);
  const parsed = parseCourse(data);

  console.log("[v0] getCourse() parsed:", { courseId, found: !!parsed, courseName: parsed?.name });
  return parsed ?? null;
}

export async function getCourseBySlug(slug: string, authToken?: string) {
  if (!slug.trim()) return null;

  const normalized = slug.trim().toLowerCase();

  try {
    const byId = await getCourse(slug, authToken);
    if (byId) return byId;
  } catch {
    // Not a valid ID — fall through to search
  }

  try {
    const response = await getCourses(
      { page: 1, limit: 50, search: normalized },
      authToken
    );

    const byId = response.courses.find(
      (c) => c.id.toLowerCase() === normalized
    );
    if (byId) return byId;

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

/** POST /courses */
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

/** PUT /courses/:id */
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

/** POST /courses/modules */
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

/** PUT /courses/modules/:moduleId */
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

/** DELETE /courses/modules/:moduleId */
export async function deleteModule(moduleId: string, authToken?: string) {
  return apiRequest<{ message: string }>(
    endpoints.courses.modules.delete(moduleId),
    { method: "DELETE", authToken }
  );
}

/** GET /courses/modules/:courseId */
export async function fetchModules(courseId: string, authToken?: string) {
  console.log("[v0] fetchModules() called with courseId:", courseId);

  const response = await apiRequest<unknown>(
    endpoints.courses.modules.fetchByCourse(courseId),
    { authToken }
  );

  const items = unwrapCollection(response);

  const modules = items
    .map((item) => parseModule(item))
    .filter((item): item is CourseModule => Boolean(item));

  console.log("[v0] fetchModules() parsed:", {
    courseId,
    moduleCount: modules.length,
    lessonsPerModule: modules.map((m) => m.lessons.length),
  });

  return modules;
}

/** POST /courses/lessons */
export async function createLesson(
  payload: CreateLessonPayload,
  authToken?: string
) {
  const body: Record<string, unknown> = {
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

  const response = await apiRequest<unknown>(endpoints.courses.lessons.create, {
    method: "POST",
    body,
    authToken,
  });

  const data = unwrapData(response);
  return parseLesson(data);
}

/** PUT /courses/lessons/:lessonId */
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

/** DELETE /courses/lessons/:lessonId */
export async function deleteLesson(lessonId: string, authToken?: string) {
  return apiRequest<{ message: string }>(
    endpoints.courses.lessons.delete(lessonId),
    { method: "DELETE", authToken }
  );
}

// ---------------------------------------------------------------------------
// Quiz API  — updated to match Postman collection
// ---------------------------------------------------------------------------

/**
 * POST /courses/modules/:moduleId/quiz
 *
 * Creates the quiz AND its questions in one request.
 * The questions array is required — send [] if you want to create the quiz
 * settings first and add questions later via addQuizQuestion().
 *
 * Response shape: { message, data: { ...quiz, questions: [...] } }
 */
export async function createQuiz(
  moduleId: string,
  payload: CreateQuizPayload,
  authToken?: string
) {
  console.log("[QUIZ createQuiz] →", { moduleId, questionCount: payload.questions.length });

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
 *
 * Updates quiz settings and optionally replaces the questions array.
 * Omit `questions` to update settings only.
 *
 * NOTE: The update response does NOT return the questions array back,
 * so we trigger a module refresh on the caller side after this resolves.
 */
export async function updateQuiz(
  moduleId: string,
  payload: UpdateQuizPayload,
  authToken?: string
) {
  console.log("[QUIZ updateQuiz] →", {
    moduleId,
    questionCount: payload.questions?.length,
  });

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

/**
 * POST /courses/quizzes/:quizzId/questions
 *
 * Add a single question to an already-created quiz.
 * Use this when editing an existing quiz to append new questions one at a time,
 * rather than re-sending the full questions array via updateQuiz().
 */
export async function addQuizQuestion(
  quizId: string,
  payload: AddQuestionPayload,
  authToken?: string
) {
  console.log("[QUIZ addQuizQuestion] →", { quizId, payload });

  const response = await apiRequest<unknown>(
    endpoints.courses.quizzes.addQuestion(quizId),
    { method: "POST", body: payload, authToken }
  );

  console.log("[QUIZ addQuizQuestion] raw response:", response);

  const data = unwrapData(response);
  const parsed = parseQuizQuestion(data);
  console.log("[QUIZ addQuizQuestion] parsed:", parsed);
  return parsed;
}

/**
 * DELETE /courses/quizzes/questions/:questionId
 *
 * Remove a single question from a quiz by its question ID.
 */
export async function deleteQuizQuestion(questionId: string, authToken?: string) {
  console.log("[QUIZ deleteQuizQuestion] →", { questionId });

  const response = await apiRequest<{ message: string }>(
    endpoints.courses.quizzes.deleteQuestion(questionId),
    { method: "DELETE", authToken }
  );

  console.log("[QUIZ deleteQuizQuestion] response:", response);
  return response;
}


/**
 * POST /courses/:courseId/objectives
 * Create a new course objective
 */
export async function createObjective(
  courseId: string,
  payload: CreateObjectivePayload,
  authToken?: string
) {
  console.log("[v0] createObjective() called with courseId:", courseId);

  const response = await apiRequest<unknown>(
    endpoints.courses.objectives.create(courseId),
    { method: "POST", body: payload, authToken }
  );

  const data = unwrapData(response);
  const objective = parseObjective(data);
  console.log("[v0] createObjective() parsed:", objective);
  return objective;
}

/**
 * PATCH /courses/objectives/:objectiveId
 * Update an existing course objective
 */
export async function updateObjective(
  objectiveId: string,
  payload: UpdateObjectivePayload,
  authToken?: string
) {
  console.log("[v0] updateObjective() called with objectiveId:", objectiveId);

  const response = await apiRequest<unknown>(
    endpoints.courses.objectives.update(objectiveId),
    { method: "PATCH", body: payload, authToken }
  );

  const data = unwrapData(response);
  const objective = parseObjective(data);
  console.log("[v0] updateObjective() parsed:", objective);
  return objective;
}

/**
 * DELETE /courses/objectives/:objectiveId
 * Delete a course objective
 */
export async function deleteObjective(
  objectiveId: string,
  authToken?: string
) {
  console.log("[v0] deleteObjective() called with objectiveId:", objectiveId);

  return apiRequest<{ message: string }>(
    endpoints.courses.objectives.delete(objectiveId),
    { method: "DELETE", authToken }
  );
}

/**
 * GET /courses/:courseId/objectives
 * Fetch all objectives for a course
 */
export async function fetchObjectives(
  courseId: string,
  authToken?: string
) {
  console.log("[v0] fetchObjectives() called with courseId:", courseId);

  const response = await apiRequest<unknown>(
    endpoints.courses.objectives.fetchByCourse(courseId),
    { authToken }
  );

  const items = unwrapCollection(response);
  const objectives = items
    .map((item) => parseObjective(item))
    .filter((item): item is CourseObjective => Boolean(item));

  console.log("[v0] fetchObjectives() parsed:", {
    courseId,
    objectiveCount: objectives.length,
  });

  return objectives;
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