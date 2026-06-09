"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthRecord = Record<string, unknown>;

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSchool = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  logoUrl?: string | null;
  population?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  token: string;
  role: string;
  permissions: string[];
  user: AuthUser | null;
  school: AuthSchool | null;
};

type AuthSessionFallback = {
  token?: string;
  role?: string;
  permissions?: string[];
  user?: Partial<AuthUser>;
  school?: Partial<AuthSchool>;
};

type AuthSessionContextValue = {
  session: AuthSession | null;
  isHydrated: boolean;
  setSession: (session: AuthSession | null) => void;
  clearSession: () => void;
};

const authSessionStorageKey = "bmi-super-admin-session";

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);




function isRecord(value: unknown): value is AuthRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readOptionalString(value: unknown) {
  const nextValue = readString(value);
  return nextValue || undefined;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function coerceUser(value: unknown, fallback?: Partial<AuthUser>) {
  const source = isRecord(value) ? value : {};
  const id = readString(source.id) || readString(fallback?.id);
  const firstName = readString(source.firstName) || readString(fallback?.firstName);
  const lastName = readString(source.lastName) || readString(fallback?.lastName);
  const email = readString(source.email) || readString(fallback?.email);

  if (!id && !firstName && !lastName && !email) {
    return null;
  }

  return {
    id,
    firstName,
    lastName,
    email,
    isActive: readBoolean(source.isActive) ?? fallback?.isActive,
    createdAt: readOptionalString(source.createdAt) ?? fallback?.createdAt,
    updatedAt: readOptionalString(source.updatedAt) ?? fallback?.updatedAt,
  } satisfies AuthUser;
}

function coerceSchool(value: unknown, fallback?: Partial<AuthSchool>) {
  const source = isRecord(value) ? value : {};
  const id = readString(source.id) || readString(fallback?.id);
  const name = readString(source.name) || readString(fallback?.name);
  const email = readString(source.email) || readString(fallback?.email);

  if (!id && !name && !email) {
    return null;
  }

  const logoUrl = readOptionalString(source.logoUrl);

  return {
    id,
    name,
    email,
    phone: readOptionalString(source.phone) ?? fallback?.phone,
    address: readOptionalString(source.address) ?? fallback?.address,
    country: readOptionalString(source.country) ?? fallback?.country,
    logoUrl: logoUrl ?? fallback?.logoUrl ?? null,
    population: readNumber(source.population) ?? fallback?.population,
    isActive: readBoolean(source.isActive) ?? fallback?.isActive,
    createdAt: readOptionalString(source.createdAt) ?? fallback?.createdAt,
    updatedAt: readOptionalString(source.updatedAt) ?? fallback?.updatedAt,
  } satisfies AuthSchool;
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(authSessionStorageKey);
    return;
  }

  window.localStorage.setItem(authSessionStorageKey, JSON.stringify(session));
}

function loadStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(authSessionStorageKey);

  
  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return createSessionFromAuthResponse(parsedValue);
  } catch {
    return null;
  }
}

export function createSessionFromAuthResponse(payload: unknown, fallback: AuthSessionFallback = {}) {
  const root = isRecord(payload) ? payload : {};
  const nestedData = isRecord(root.data) ? root.data : {};
  const role = readString(nestedData.role) || readString(root.role) || fallback.role || "admin";
  const token = readString(nestedData.token) || readString(root.token) || fallback.token || "";
  const permissions = readStringArray(nestedData.permissions).length
    ? readStringArray(nestedData.permissions)
    : fallback.permissions ?? [];

  // ✅ Try data.user first, then treat data itself as the user object (your API shape)
  const userSource = isRecord(nestedData.user) ? nestedData.user : nestedData;
  const user = coerceUser(userSource ?? root.user, fallback.user);
  const school = coerceSchool(nestedData.school ?? root.school, fallback.school);

  if (!token && !user && !school) {
    return null;
  }

  return {
    token,
    role,
    permissions,
    user,
    school,
  } satisfies AuthSession;
}

export function formatRoleLabel(role: string | undefined) {
  const normalizedRole = (role ?? "").trim();

  if (!normalizedRole) {
    return "Admin";
  }

  return normalizedRole
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getSessionProfileName(session: AuthSession | null) {
  if (session?.user) {
    const fullName = [session.user.firstName, session.user.lastName].filter(Boolean).join(" ").trim();
    if (fullName) {
      return fullName;
    }

    if (session.user.email) {
      return session.user.email;
    }
  }

  if (session?.school?.name) {
    return session.school.name;
  }

  return "Naomi Tan";
}

export function getSessionProfileRole(session: AuthSession | null) {
  if (!session) {
    return "Super Admin";
  }

  const roleLabel = formatRoleLabel(session.role);

  if (session.school?.name) {
    return `${roleLabel} • ${session.school.name}`;
  }

  return roleLabel;
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSessionState(loadStoredSession());
    setIsHydrated(true);
  }, []);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    persistSession(nextSession);
  };

  const clearSession = () => {
    setSession(null);
  };

  return (
    <AuthSessionContext.Provider
      value={{
        session,
        isHydrated,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}



export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider.");
  }

  return context;
}