import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AuthField,
  AuthFooterText,
  OnboardingShell,
  PrimaryButton,
} from "@/components/onboarding-shell";

export default function AuthSignUpPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Super Admin Platform"
    >
      <div className="space-y-8">
        <div className="space-y-7">
          <AuthField label="Super Admin Email" type="email" defaultValue="admin@school.com" />
          <AuthField label="Password" type="password" defaultValue="************" />
          <AuthField label="Confirm Password" type="password" defaultValue="************" />
        </div>

        <Link href="/auth/verify-email">
          <PrimaryButton>
            <span className="inline-flex items-center gap-3">
              Next <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </span>
          </PrimaryButton>
        </Link>

        <AuthFooterText
          text="Already have an account?"
          action={
            <Link href="/auth/sign-in" className="font-bold text-[#4d8d63]">
              Sign in
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
