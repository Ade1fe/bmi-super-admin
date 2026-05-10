export type SchoolOnboardingDraft = {
  schoolName: string;
  country: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
};

const schoolOnboardingStorageKey = "bmi-super-admin-school-onboarding";

export function persistSchoolOnboardingDraft(draft: SchoolOnboardingDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(schoolOnboardingStorageKey, JSON.stringify(draft));
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
