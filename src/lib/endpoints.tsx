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

const prodApiUrl = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_PROD_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL
);

export const apiConfig = {
  apiBaseUrl,
  prodApiUrl,
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
    verifyEmail: buildEndpoint(
      prodApiUrl,
      "/schools/verify-email"
    ),

    verifyEmailOtp: buildEndpoint(
      prodApiUrl,
      "/schools/verify-email-otp"
    ),

    register: buildEndpoint(prodApiUrl, "/schools/register"),

    login: buildEndpoint(prodApiUrl, "/schools/login"),

    update: buildEndpoint(apiBaseUrl, "/schools"),

    retrieve: (schoolId: string) =>
      buildEndpoint(prodApiUrl, `/schools/${schoolId}`),

    addTeamMember: (schoolId: string) =>
      buildEndpoint(prodApiUrl, `/schools/${schoolId}/team`),

    teamMembers: (schoolId: string) =>
      buildEndpoint(prodApiUrl, `/schools/${schoolId}/team`),

    registerStudent: buildEndpoint(
      prodApiUrl,
      "/schools/students/register"
    ),

    students: buildEndpoint(prodApiUrl, "/schools/students"),

    verifyPasswordResetEmail: buildEndpoint(
      prodApiUrl,
      "/schools/verify-school-email-password-reset"
    ),

    confirmPasswordResetOtp: buildEndpoint(
      prodApiUrl,
      "/schools/confirm-school-email-password-reset-otp"
    ),

    resetPassword: buildEndpoint(
      prodApiUrl,
      "/schools/reset-school-password"
    ),
  },

  students: {
    login: buildEndpoint(prodApiUrl, "/students/login"),

    profile: (studentId: string) =>
      buildEndpoint(prodApiUrl, `/students/profile/${studentId}`),
  },

  courses: {
    all: buildEndpoint(apiBaseUrl, "/courses"),

    byId: (courseId: string) =>
      buildEndpoint(prodApiUrl, `/courses/${courseId}`),

    create: buildEndpoint(apiBaseUrl, "/courses"),

    categories: {
      all: buildEndpoint(
        apiBaseUrl,
        "/courses/get-categories"
      ),

      create: buildEndpoint(
        apiBaseUrl,
        "/courses/categories"
      ),

      update: (categoryId: string) =>
        buildEndpoint(
          apiBaseUrl,
          `/courses/categories/${categoryId}`
        ),

      delete: (categoryId: string) =>
        buildEndpoint(
          apiBaseUrl,
          `/courses/categories/${categoryId}`
        ),
    },
  },
};

export async function apiRequest<TResponse>(
  url: string,
  options: ApiRequestOptions = {}
) {
  if (!url) {
    throw new Error(
      "API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_PROD_API_URL in .env."
    );
  }

  const { authToken, body, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  const method = rest.method ?? "GET";

  if (
    body !== undefined &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  if (
    authToken &&
    !requestHeaders.has("Authorization")
  ) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${authToken}`
    );
  }

  logApiEvent("[API Request]", {
    method,
    url,
    body,
  });

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
  });

  const contentType =
    response.headers.get("content-type") ?? "";

  const payload = contentType.includes(
    "application/json"
  )
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

export function combineNameParts(
  firstName: string,
  lastName: string
) {
  return [firstName.trim(), lastName.trim()]
    .filter(Boolean)
    .join(" ");
}

export function splitFullName(fullName: string) {
  const [firstName = "", ...rest] = fullName
    .trim()
    .split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}