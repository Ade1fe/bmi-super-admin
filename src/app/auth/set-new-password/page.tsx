import Link from "next/link";
import {
  AuthField,
  OnboardingShell,
  PrimaryButton,
} from "@/components/onboarding-shell";

export default function SetNewPasswordPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Set New Password"
      panelDescription="Please enter your new password to reset"
    >
      <div className="space-y-8">
        <div className="space-y-7">
          <AuthField label="Password" type="password" defaultValue="************" />
          <AuthField label="Confirm Password" type="password" defaultValue="************" />
        </div>

        <Link href="/auth/sign-in">
          <PrimaryButton>Reset Password</PrimaryButton>
        </Link>
      </div>
    </OnboardingShell>
  );
}
