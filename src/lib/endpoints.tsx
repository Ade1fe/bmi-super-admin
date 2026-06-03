type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  authToken?: string;
  body?: JsonValue;
};

function normalizeBaseUrl(value: string | undefined) {
  return (value ?? "").trim().replace(/\/+$/, "");
}

function buildEndpoint(baseUrl: string, path: string) {
  if (!baseUrl) {
    return "";
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  const message = record.message ?? record.error ?? record.detail;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (
    Array.isArray(message) &&
    typeof message[0] === "string" &&
    message[0].trim()
  ) {
    return message[0];
  }

  return fallback;
}

function logApiEvent(label: string, details: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  console.log(label, details);
}

const apiBaseUrl = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL
);

export const apiConfig = {
  apiBaseUrl,
};

export const endpoints = {
  admin: {
    register: buildEndpoint(apiBaseUrl, "/admin/register"),
    login: buildEndpoint(apiBaseUrl, "/admin/login"),

    schools: buildEndpoint(apiBaseUrl, "/admin/schools"),

    schoolById: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/admin/school/${schoolId}`),

    suspendSchool: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/admin/schools/${schoolId}/suspend`),

    activateSchool: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/admin/schools/${schoolId}/activate`),

    deactivateSchool: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/admin/schools/${schoolId}/deactivate`),
  },

  schools: {
    verifyEmail: buildEndpoint(apiBaseUrl, "/schools/verify-email"),
    verifyEmailOtp: buildEndpoint(apiBaseUrl, "/schools/verify-email-otp"),
    register: buildEndpoint(apiBaseUrl, "/schools/register"),
    login: buildEndpoint(apiBaseUrl, "/schools/login"),
    update: buildEndpoint(apiBaseUrl, "/schools"),

    retrieve: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/schools/${schoolId}`),

    addTeamMember: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/schools/${schoolId}/team`),

    teamMembers: (schoolId: string) =>
      buildEndpoint(apiBaseUrl, `/schools/${schoolId}/team`),

    registerStudent: buildEndpoint(apiBaseUrl, "/schools/students/register"),
    students: buildEndpoint(apiBaseUrl, "/schools/students"),

    verifyPasswordResetEmail: buildEndpoint(
      apiBaseUrl,
      "/schools/verify-school-email-password-reset"
    ),

    confirmPasswordResetOtp: buildEndpoint(
      apiBaseUrl,
      "/schools/confirm-school-email-password-reset-otp"
    ),

    resetPassword: buildEndpoint(apiBaseUrl, "/schools/reset-school-password"),
  },

  students: {
    login: buildEndpoint(apiBaseUrl, "/students/login"),

    profile: (studentId: string) =>
      buildEndpoint(apiBaseUrl, `/students/profile/${studentId}`),
  },

  courses: {
    // GET  /courses?page=&limit=&status=&search=
    all: buildEndpoint(apiBaseUrl, "/courses"),

    // GET  /courses/:id
    byId: (courseId: string) =>
      buildEndpoint(apiBaseUrl, `/courses/${courseId}`),

    // POST /courses
    create: buildEndpoint(apiBaseUrl, "/courses"),

    // PUT  /courses/:id
    update: (courseId: string) =>
      buildEndpoint(apiBaseUrl, `/courses/${courseId}`),

    categories: {
      // GET  /courses/get-categories
      all: buildEndpoint(apiBaseUrl, "/courses/get-categories"),

      // POST /courses/categories
      create: buildEndpoint(apiBaseUrl, "/courses/categories"),

      // PUT  /courses/categories/:categoryId
      update: (categoryId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/categories/${categoryId}`),

      // DELETE /courses/categories/:categoryId
      delete: (categoryId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/categories/${categoryId}`),
    },

    modules: {
      // POST /courses/modules
      create: buildEndpoint(apiBaseUrl, "/courses/modules"),

      // PUT  /courses/modules/:moduleId
      update: (moduleId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${moduleId}`),

      // DELETE /courses/modules/:moduleId
      delete: (moduleId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${moduleId}`),

      // GET  /courses/modules/:courseId  (fetch all modules for a course)
      fetchByCourse: (courseId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${courseId}`),
    },

    lessons: {
      // POST /courses/lessons
      create: buildEndpoint(apiBaseUrl, "/courses/lessons"),

      // PUT  /courses/lessons/:lessonId
      update: (lessonId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/lessons/${lessonId}`),

      // DELETE /courses/lessons/:lessonId
      delete: (lessonId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/lessons/${lessonId}`),
    },

    quizzes: {
      // POST /courses/modules/:moduleId/quiz
      create: (moduleId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${moduleId}/quiz`),

      // PUT  /courses/modules/:moduleId/quiz
      update: (moduleId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${moduleId}/quiz`),

      // DELETE /courses/modules/:moduleId/quiz
      delete: (moduleId: string) =>
        buildEndpoint(apiBaseUrl, `/courses/modules/${moduleId}/quiz`),
    },
  },

  subscriptions: {
    adminPlans: buildEndpoint(apiBaseUrl, "/subscriptions/admin/plans"),
    adminList: buildEndpoint(apiBaseUrl, "/subscriptions/admin/list"),
    createPlan: buildEndpoint(apiBaseUrl, "/subscriptions/plans"),

    updatePlan: (planId: string) =>
      buildEndpoint(apiBaseUrl, `/subscriptions/plans/${planId}`),

    addFeature: (planId: string) =>
      buildEndpoint(apiBaseUrl, `/subscriptions/plans/${planId}/features`),

    removeFeature: (planId: string, featureId: string) =>
      buildEndpoint(
        apiBaseUrl,
        `/subscriptions/plans/${planId}/features/${featureId}`
      ),
  },
};

export async function apiRequest<TResponse>(
  url: string,
  options: ApiRequestOptions = {}
) {
  if (!url) {
    throw new Error(
      "API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env."
    );
  }

  const { authToken, body, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  const method = rest.method ?? "GET";

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  logApiEvent("[API Request]", { method, url, body });
  console.log("Lesson payload:", body);
  

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";

  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  logApiEvent("[API Response]", {
    method,
    url,
    status: response.status,
    ok: response.ok,
    response: payload,
  });

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        payload,
        `Request failed with status ${response.status}`
      )
    );
  }

  return payload as TResponse;
}

export function combineNameParts(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

export function splitFullName(fullName: string) {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}