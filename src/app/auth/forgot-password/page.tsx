import Link from "next/link";
import {
  AuthField,
  AuthFooterText,
  OnboardingShell,
  PrimaryButton,
} from "@/components/onboarding-shell";

export default function ForgotPasswordPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Forgot Password"
      panelDescription="Enter email address and a verification code that will be sent to your mail"
    >
      <div className="space-y-8">
        <AuthField label="Super Admin Email" type="email" defaultValue="admin@school.com" />

        <Link href="/auth/reset-password">
          <PrimaryButton>Send code</PrimaryButton>
        </Link>

        <AuthFooterText
          text="Already Registered?"
          action={
            <Link href="/auth/sign-in" className="font-bold text-[#4d8d63]">
              Log in
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
