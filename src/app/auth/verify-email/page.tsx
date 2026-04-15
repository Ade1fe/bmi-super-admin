import Link from "next/link";
import {
  AuthFooterText,
  OnboardingShell,
  OtpInputRow,
  PrimaryButton,
} from "@/components/onboarding-shell";

export default function VerifyEmailPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Verify Your Email"
      panelDescription={
        <>
          We&apos;ve sent a 4-digit verification code to your email address
          <span className="font-medium text-[#173257]"> admin@school.com</span>
        </>
      }
    >
      <div className="space-y-8">
        <OtpInputRow />

        <Link href="/auth/login-success">
          <PrimaryButton>Verify</PrimaryButton>
        </Link>

        <AuthFooterText
          text="Didn't get a code?"
          action={
            <Link href="/auth/verify-email" className="font-bold text-[#4d8d63]">
              Resend
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
