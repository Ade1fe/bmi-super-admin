type JsonRecord = Record<string, unknown>;

export type SchoolSummary = {
  id: string;
  name: string;
  email: string;
  population: number;
  isActive: boolean;
  country?: string;
  phone?: string;
  address?: string;
  logoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  adminCount: number;
};

export type StudentSummary = {
  id: string;
  userId: string;
  schoolId: string;
  admissionNumber?: string;
  className?: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readOptionalString(value: unknown) {
  const nextValue = readString(value);
  return nextValue || undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function unwrapCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const directCollectionKeys = ["data", "schools", "students", "items"];

  for (const key of directCollectionKeys) {
    const candidate = payload[key];

    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (isRecord(candidate)) {
      const nestedArray = unwrapCollection(candidate);

      if (nestedArray.length) {
        return nestedArray;
      }
    }
  }

  return [];
}

export function parseSchoolSummary(value: unknown): SchoolSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  const schoolUsers = Array.isArray(value.schoolUsers) ? value.schoolUsers : [];
  const id = readString(value.id);
  const name = readString(value.name);
  const email = readString(value.email);

  if (!id && !name && !email) {
    return null;
  }

  return {
    id,
    name,
    email,
    population: readNumber(value.population),
    isActive: readBoolean(value.isActive),
    country: readOptionalString(value.country),
    phone: readOptionalString(value.phone),
    address: readOptionalString(value.address),
    logoUrl: readOptionalString(value.logoUrl) ?? null,
    createdAt: readOptionalString(value.createdAt),
    updatedAt: readOptionalString(value.updatedAt),
    adminCount: schoolUsers.length,
  };
}

export function parseSchoolList(payload: unknown) {
  return unwrapCollection(payload)
    .map((item) => parseSchoolSummary(item))
    .filter((item): item is SchoolSummary => Boolean(item));
}

function parseStudentSummary(value: unknown): StudentSummary | null {
  if (!isRecord(value) || !isRecord(value.user)) {
    return null;
  }

  const id = readString(value.id);
  const userId = readString(value.userId);
  const schoolId = readString(value.schoolId);
  const user = value.user;
  const userRecord = {
    id: readString(user.id),
    firstName: readString(user.firstName),
    lastName: readString(user.lastName),
    email: readString(user.email),
  };

  if (!id && !userId && !schoolId && !userRecord.email) {
    return null;
  }

  return {
    id,
    userId,
    schoolId,
    admissionNumber: readOptionalString(value.admissionNumber),
    className: readOptionalString(value.class),
    createdAt: readOptionalString(value.createdAt),
    updatedAt: readOptionalString(value.updatedAt),
    user: userRecord,
  };
}

export function parseStudentList(payload: unknown) {
  return unwrapCollection(payload)
    .map((item) => parseStudentSummary(item))
    .filter((item): item is StudentSummary => Boolean(item));
}
