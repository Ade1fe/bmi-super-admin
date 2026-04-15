import Link from "next/link";
import {
  AuthFooterText,
  OnboardingShell,
  OtpInputRow,
  PrimaryButton,
} from "@/components/onboarding-shell";

export default function ResetPasswordCodePage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Reset Password"
      panelDescription={
        <>
          Enter 4 digits verification code has been sent to
          <span className="font-medium text-[#173257]"> okoro@mail.com</span>
        </>
      }
    >
      <div className="space-y-8">
        <OtpInputRow />

        <Link href="/auth/set-new-password">
          <PrimaryButton>Send code</PrimaryButton>
        </Link>

        <AuthFooterText
          text="Didn't get a code?"
          action={
            <Link href="/auth/reset-password" className="font-bold text-[#4d8d63]">
              Resend
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
