// school-onboarding.ts
export type SchoolOnboardingDraft = {
  /** Set once step 1 has created the school; later steps act on it. */
  schoolId?: string;
  schoolName: string;
  country: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  planId?: string;
  planName?: string;
};

const schoolOnboardingStorageKey = "bmi-super-admin-school-onboarding";

export function persistSchoolOnboardingDraft(draft: SchoolOnboardingDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(schoolOnboardingStorageKey, JSON.stringify(draft));
}

export function clearSchoolOnboardingDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(schoolOnboardingStorageKey);
}

export function loadSchoolOnboardingDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.sessionStorage.getItem(schoolOnboardingStorageKey);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as SchoolOnboardingDraft;
  } catch {
    return null;
  }
}
