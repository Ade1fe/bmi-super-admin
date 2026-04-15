import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";

export default function LoginSuccessPage() {
  return (
    <OnboardingShell
      heroTitle={
        <>
          <span className="block">Empower Your School with</span>
          <span className="block">Modern Learning</span>
        </>
      }
      heroDescription="Onboard students, assign courses, and track progress with ease."
      panelTitle="Login Successful"
      panelDescription="You have successfully Login as Super Admin"
      topAction={
        <Link href="/auth/sign-in" className="text-[16px] font-medium text-[#ff5858] sm:text-[18px]">
          Log out
        </Link>
      }
      alignPanelCenter
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-[#14347d] bg-[#ffe0eb] shadow-[inset_0_0_0_10px_#f6f0ff] sm:h-36 sm:w-36">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d7f26d] text-[#14347d] sm:h-24 sm:w-24">
            <BadgeCheck className="h-12 w-12 sm:h-14 sm:w-14" strokeWidth={2.4} />
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 text-[22px] font-medium text-[#4d8d63] sm:text-[26px]"
        >
          Continue to dashboard
          <ArrowRight className="h-6 w-6" strokeWidth={2.2} />
        </Link>
      </div>
    </OnboardingShell>
  );
}
