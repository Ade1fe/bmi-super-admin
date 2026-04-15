import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AuthField,
  AuthFooterText,
  OnboardingShell,
  PrimaryButton,
  RememberCheckLabel,
  RememberRow,
} from "@/components/onboarding-shell";

export default function SignInPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Welcome to BMI LMS</span>
          <span className="block">Super- Admin Platform</span>
        </>
      }
      panelTitle="Welcome Back"
      panelDescription="Please sign in safely. Protect your login information."
    >
      <div className="space-y-8">
        <div className="space-y-7">
          <AuthField label="Super Admin Email" type="email" defaultValue="admin@school.com" />
          <AuthField label="Password" type="password" defaultValue="************" />
        </div>

        <RememberRow
          left={<RememberCheckLabel>Remember Me</RememberCheckLabel>}
          right={
            <Link href="/auth/forgot-password" className="font-medium text-[#173257]">
              Forgot Password?
            </Link>
          }
        />

        <Link href="/auth/login-success">
          <PrimaryButton>Sing in</PrimaryButton>
        </Link>

        <AuthFooterText
          text="Don't have an account?"
          action={
            <Link href="/auth" className="font-bold text-[#4d8d63]">
              Sign up
            </Link>
          }
        />
      </div>
    </OnboardingShell>
  );
}
