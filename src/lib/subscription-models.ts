type JsonRecord = Record<string, unknown>;

export type SubscriptionPlanInterval =
  | "monthly"
  | "annually";

export type SubscriptionPlanFeature = {
  id: string;
  planId: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionPlanInterval | string;
  paystackPlanCode?: string;
  maxStudents?: number;
  maxCourses?: number;
  maxTeamMembers?: number;
  trialDurationDays?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  features: SubscriptionPlanFeature[];
};

export type SubscriptionSchool = {
  id: string;
  name: string;
  email: string;
  logoUrl?: string | null;
  phone?: string;
  address?: string;
  country?: string;
};

export type SubscriptionRecord = {
  id: string;
  schoolId: string;
  planId: string;
  status: string;
  isTrial: boolean;
  trialEndsAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  paystackSubscriptionCode?: string;
  paystackCustomerCode?: string;
  createdAt?: string;
  updatedAt?: string;
  plan: SubscriptionPlan | null;
  school: SubscriptionSchool | null;
};
const DEBUG = true;

function log(tag: string, data?: unknown) {
  if (!DEBUG) return;
  console.log(`[subscription-parser] ${tag}`, data ?? "");
}

function logError(tag: string, error: unknown) {
  console.error(`[subscription-parser ERROR] ${tag}`, error);
}
function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : "";
}

function readOptionalString(value: unknown) {
  const nextValue = readString(value);
  return nextValue || undefined;
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
      ? parsedValue
      : undefined;
  }

  return undefined;
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

  const directCollectionKeys = ["data", "items"];

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

function parsePlanFeature(
  value: unknown
): SubscriptionPlanFeature | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const planId = readString(value.planId);
  const name = readString(value.name);

  if (!id && !name) {
    return null;
  }

  return {
    id,
    planId,
    name,
    description: readOptionalString(value.description),
    createdAt: readOptionalString(value.createdAt),
    updatedAt: readOptionalString(value.updatedAt),
  };
}
export function parseSubscriptionPlan(value: unknown): SubscriptionPlan | null {
  log("parseSubscriptionPlan() input", value);

  try {
    if (!isRecord(value)) {
      log("parseSubscriptionPlan() skipped - not a record");
      return null;
    }

    const id = readString(value.id);
    const name = readString(value.name);

    if (!id && !name) {
      log("parseSubscriptionPlan() skipped - missing id & name", value);
      return null;
    }

    const result: SubscriptionPlan = {
      id,
      name,
      description: readOptionalString(value.description),
      price: readNumber(value.price) ?? 0,
      interval: readString(value.interval) || "monthly",
      paystackPlanCode: readOptionalString(value.paystackPlanCode),
      maxStudents: readNumber(value.maxStudents),
      maxCourses: readNumber(value.maxCourses),
      maxTeamMembers: readNumber(value.maxTeamMembers),
      trialDurationDays: readNumber(value.trialDurationDays),
      isActive: readBoolean(value.isActive),
      createdAt: readOptionalString(value.createdAt),
      updatedAt: readOptionalString(value.updatedAt),
      features: Array.isArray(value.features)
        ? value.features
            .map(parsePlanFeature)
            .filter(
              (f): f is SubscriptionPlanFeature => Boolean(f)
            )
        : [],
    };

    log("parseSubscriptionPlan() success", result);

    return result;
  } catch (err) {
    logError("parseSubscriptionPlan() failed", err);
    return null;
  }
}

function parseSubscriptionSchool(value: unknown): SubscriptionSchool | null {
  log("parseSubscriptionSchool() input", value);

  if (!isRecord(value)) {
    log("parseSubscriptionSchool() skipped - not record");
    return null;
  }

  const id = readString(value.id);
  const name = readString(value.name);
  const email = readString(value.email);

  if (!id && !name && !email) {
    log("parseSubscriptionSchool() skipped - missing identifiers");
    return null;
  }

  const result: SubscriptionSchool = {
    id,
    name,
    email,
    logoUrl: readOptionalString(value.logoUrl) ?? null,
    phone: readOptionalString(value.phone),
    address: readOptionalString(value.address),
    country: readOptionalString(value.country),
  };

  log("parseSubscriptionSchool() success", result);

  return result;
}

function parseSubscriptionRecord(value: unknown): SubscriptionRecord | null {
  log("parseSubscriptionRecord() input", value);

  try {
    if (!isRecord(value)) {
      log("parseSubscriptionRecord() skipped - not record");
      return null;
    }

    const id = readString(value.id);
    const schoolId = readString(value.schoolId);
    const planId = readString(value.planId);
    const status = readString(value.status);

    if (!id && !schoolId && !planId && !status) {
      log("parseSubscriptionRecord() skipped - missing required fields");
      return null;
    }

    const result: SubscriptionRecord = {
      id,
      schoolId,
      planId,
      status,
      isTrial: readBoolean(value.isTrial),
      trialEndsAt: readOptionalString(value.trialEndsAt),
      currentPeriodStart: readOptionalString(value.currentPeriodStart),
      currentPeriodEnd: readOptionalString(value.currentPeriodEnd),
      paystackSubscriptionCode: readOptionalString(value.paystackSubscriptionCode),
      paystackCustomerCode: readOptionalString(value.paystackCustomerCode),
      createdAt: readOptionalString(value.createdAt),
      updatedAt: readOptionalString(value.updatedAt),
      plan: parseSubscriptionPlan(value.plan),
      school: parseSubscriptionSchool(value.school),
    };

    log("parseSubscriptionRecord() success", result);

    return result;
  } catch (err) {
    logError("parseSubscriptionRecord() failed", err);
    return null;
  }
}
export function parseSubscriptionPlanList(payload: unknown) {
  log("parseSubscriptionPlanList() raw payload", payload);

  const list = unwrapCollection(payload);

  log("parseSubscriptionPlanList() unwrapped", list);

  const parsed = list
    .map(parseSubscriptionPlan)
    .filter((item): item is SubscriptionPlan => Boolean(item));

  log("parseSubscriptionPlanList() result count", parsed.length);

  return parsed;
}

export function parseSubscriptionList(payload: unknown) {
  log("parseSubscriptionList() raw payload", payload);

  const list = unwrapCollection(payload);

  log("parseSubscriptionList() unwrapped", list);

  const parsed = list
    .map(parseSubscriptionRecord)
    .filter((item): item is SubscriptionRecord => Boolean(item));

  log("parseSubscriptionList() result count", parsed.length);

  return parsed;
}
