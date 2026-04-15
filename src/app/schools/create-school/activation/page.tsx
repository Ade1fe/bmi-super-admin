"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleCheckBig,
  Copy,
  KeyRound,
  Lock,
  Mail,
  ToggleRight,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSchoolStepper } from "@/components/create-school-stepper";

function ActivationCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Mail;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-[#dfe7ea] bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-[10px] bg-[#f1fbf5] p-4 text-[#0f8751]">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-[17px] font-extrabold tracking-[-0.03em] text-[#17345d]">{title}</h3>
          <p className="mt-1 max-w-[320px] text-[15px] leading-6 text-[#74839d]">{detail}</p>
        </div>
      </div>

      <ToggleRight className="h-12 w-12 shrink-0 self-end text-[#0f8751] sm:self-auto" strokeWidth={1.7} />
    </div>
  );
}

function WorkspaceActiveModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-[540px] overflow-y-auto rounded-[16px] bg-white px-5 py-8 shadow-[0_40px_120px_rgba(27,43,77,0.22)] sm:px-8 sm:py-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
            aria-label="Close workspace active modal"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <div className="mx-auto flex w-fit flex-col items-center">
            <div className="relative mb-8 h-28 w-28">
              <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-[#eef4f2]" />
              <div className="absolute right-0 top-8 h-6 w-6 rounded-full bg-[#aad7cc]" />
              <div className="absolute left-9 top-7 text-[#0a0a0a]">
                <Check className="h-16 w-16" strokeWidth={2.2} />
              </div>
              <div className="absolute right-7 top-2 rounded-full border-[6px] border-[#46c7cf] bg-white p-1">
                <CircleCheckBig className="h-5 w-5 text-[#46c7cf]" strokeWidth={2.6} />
              </div>
            </div>

            <h2 className="text-center text-[22px] font-extrabold tracking-[-0.04em] text-[#152f56] sm:text-[26px]">
              School Workspace Active
            </h2>
            <p className="mt-3 max-w-[430px] text-center text-[16px] leading-7 text-[#667792]">
              Congratulations! Your school&apos;s digital environment is ready to use. You can now start adding teachers, students, and courses.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-center text-[14px] font-semibold text-[#687998]">Your Workspace URL</p>
            <div className="mt-3 flex flex-col gap-3 rounded-[12px] border-2 border-dashed border-[#7f8cff] bg-[#fbfcff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 text-[#4659d8]">
                <Lock className="h-5 w-5" strokeWidth={2.2} />
                <span className="truncate text-[16px] font-bold sm:text-[18px]">greenfield.lms.com</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#627492]"
              >
                <Copy className="h-4 w-4" strokeWidth={2.1} />
                Copy
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-[#dbe2eb] bg-[#f8fafc] px-4 py-2 text-[14px] text-[#73829b]">
              ● System Status: Fully Activated
            </span>
            <span className="rounded-full border border-[#dbe2eb] bg-[#f8fafc] px-4 py-2 text-[14px] text-[#73829b]">
              <Lock className="mr-2 inline h-4 w-4" strokeWidth={2.1} />
              SSL Secure
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[62px] items-center justify-center rounded-[10px] border border-[#cadfd5] bg-[#edf5f1] text-[16px] font-semibold text-[#4a8a60]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button-primary flex h-[62px] items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] text-[16px] font-semibold text-white"
            >
              Continue to Step 2
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CreateSchoolActivationPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [selectedPlanLabel, setSelectedPlanLabel] = useState("School Premium");

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    const nextPlanLabel =
      {
        basic: "School Basic",
        premium: "School Premium",
        monthly: "Individual Monthly",
        annual: "Individual Annual",
      }[plan ?? ""] ?? "School Premium";

    setSelectedPlanLabel(nextPlanLabel);
  }, []);

  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/schools/create-school/subscription" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Create New School</span>
        </div>
      }
      activeSection="schools"
    >
      {showSuccessModal ? <WorkspaceActiveModal onClose={() => setShowSuccessModal(false)} /> : null}

      <div className="mx-auto max-w-[980px]">
        <CreateSchoolStepper currentStep={3} />

        <section className="mt-10 text-center sm:mt-14">
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#162f54] sm:text-[42px]">
            Step 3: Account Activation
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-[16px] leading-7 text-[#667792] sm:text-[18px] sm:leading-8">
            Finalize the institution setup and generate the administrator access link.
          </p>
        </section>

        <section className="mt-10 space-y-6">
          <article className="rounded-[14px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
            <div className="border-b border-[#e4e8f4] px-6 py-6 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4659d8] sm:px-8 sm:text-[16px]">
              Institution Summary
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-2 sm:p-8">
              <div>
                <p className="text-[14px] font-semibold uppercase text-[#6f7f99]">School Name</p>
                <p className="mt-2 text-[18px] font-extrabold leading-7 text-[#182f53]">
                  Greenwood International
                  <br />
                  Academy
                </p>
              </div>
              <div>
                <p className="text-[14px] font-semibold uppercase text-[#6f7f99]">Administrator Email</p>
                <p className="mt-2 text-[18px] font-extrabold text-[#182f53]">admin@greenwood.edu</p>
              </div>
              <div>
                <p className="text-[14px] font-semibold uppercase text-[#6f7f99]">Selected Plan</p>
                <p className="mt-2 text-[18px] font-extrabold text-[#182f53]">
                  {selectedPlanLabel}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
            <div className="border-b border-[#e4e8f4] px-6 py-6 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4659d8] sm:px-8 sm:text-[16px]">
              Activation Settings
            </div>
            <div className="space-y-4 p-6">
              <ActivationCard
                icon={Mail}
                title="Auto-Generate Credentials"
                detail="Administrator will receive login details immediately."
              />
              <ActivationCard
                icon={KeyRound}
                title="Send Welcome Email Instantly"
                detail="System will create a secure initial password."
              />
            </div>
          </article>

          <article className="rounded-[14px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
            <div className="border-b border-[#e4e8f4] px-6 py-6 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4659d8] sm:px-8 sm:text-[16px]">
              Activation Settings
            </div>
            <div className="space-y-4 p-6">
              <ActivationCard
                icon={Mail}
                title="Auto-Generate Credentials"
                detail="Administrator will receive login details immediately."
              />
              <ActivationCard
                icon={KeyRound}
                title="Send Welcome Email Instantly"
                detail="System will create a secure initial password."
              />
            </div>
          </article>

          <div className="rounded-[12px] border border-[#dfe4f4] bg-[#f6f8ff] px-6 py-5 text-[17px] text-[#4659d8]">
            <span className="mr-3">ⓘ</span>
            Once activated, the school instance will be deployed to the production environment instantly.
          </div>

          <div className="flex flex-col justify-end gap-4 sm:flex-row">
            <Link
              href="/schools/create-school/subscription"
              className="inline-flex h-[62px] w-full items-center justify-center rounded-[10px] border border-[#cadfd5] bg-[#edf5f1] px-10 text-[16px] font-semibold text-[#4a8a60] sm:w-auto"
            >
              Back to subscription
            </Link>
            <button
              type="button"
              onClick={() => setShowSuccessModal(true)}
              className="button-primary inline-flex h-[62px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-10 text-[16px] font-semibold text-white sm:w-auto"
            >
              Complete Setup & Activate
              <span className="text-[18px]">⚡</span>
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
