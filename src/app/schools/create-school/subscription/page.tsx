"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheckBig,
  Rocket,
  Star,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSchoolStepper } from "@/components/create-school-stepper";
import { loadSchoolOnboardingDraft } from "@/lib/school-onboarding";

type PlanKey = "basic" | "premium" | "monthly" | "annual";

const pricingCards = [
  {
    key: "basic" as const,
    title: "School Basic",
    price: "$99",
    suffix: "/month",
    recommended: false,
    features: ["Up to 500 students", "Standard Support", "Core LMS features"],
  },
  {
    key: "premium" as const,
    title: "School Premium",
    price: "$249",
    suffix: "/month",
    recommended: true,
    features: ["Unlimited students", "White-labeling options", "Priority 24/7 Support", "Advanced Analytics"],
  },
  {
    key: "monthly" as const,
    title: "Individual Monthly",
    price: "$19",
    suffix: "/month",
    recommended: false,
    features: ["Single teacher access", "Full course library", "Monthly billing cycle"],
  },
  {
    key: "annual" as const,
    title: "Individual Annual",
    price: "$$99",
    suffix: "Year",
    recommended: false,
    features: ["Get 2 months free", "All individual features", "Annual billing"],
  },
];

const modalPlans: {
  key: PlanKey;
  label: string;
  title: string;
  price: string;
  suffix: string;
  features: string[];
}[] = [
  {
    key: "basic",
    label: "School Basic",
    title: "School Basic",
    price: "$99",
    suffix: "/month",
    features: ["Up to 500 students", "Standard Support", "Core LMS features"],
  },
  {
    key: "premium",
    label: "School Premium",
    title: "School Premium",
    price: "$249",
    suffix: "/month",
    features: ["Unlimited students", "White-labeling options", "Advanced Analytics", "Priority 24/7 Support"],
  },
  {
    key: "monthly",
    label: "Individual Monthly",
    title: "Individual Monthly",
    price: "$19",
    suffix: "/month",
    features: ["Single teacher access", "Full course library", "Monthly billing cycle"],
  },
  {
    key: "annual",
    label: "Individual Annual",
    title: "Individual Monthly",
    price: "$99",
    suffix: "/month",
    features: ["Get 2 months free", "All individual features", "Annual billing"],
  },
];

const infoCards = [
  {
    title: "Automated Setup",
    detail:
      "Once submitted, the admin will receive an invitation email to set their first password.",
  },
  {
    title: "Security Check",
    detail: "Admin emails must be unique across the platform for authentication purposes.",
  },
  {
    title: "Data Residency",
    detail: "School data is hosted in the region corresponding to the selected country.",
  },
];

function UpgradeModal({
  selectedPlan,
  onSelectPlan,
  onClose,
  onContinue,
  schoolName,
}: {
  selectedPlan: PlanKey;
  onSelectPlan: (plan: PlanKey) => void;
  onClose: () => void;
  onContinue: () => void;
  schoolName: string;
}) {
  const plan = modalPlans.find((item) => item.key === selectedPlan)!;
  const isCurrentPlan = selectedPlan === "basic";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-[720px] overflow-y-auto rounded-[16px] bg-white p-5 shadow-[0_40px_120px_rgba(27,43,77,0.22)] sm:p-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
            aria-label="Close subscription modal"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54] sm:text-[28px]">
            Upgrade Subscription
          </h2>
          <p className="mt-2 text-[15px] text-[#6b7c97]">
            Select a new plan for {schoolName}
          </p>

          <div className="mt-8 rounded-[12px] bg-[#f4f6f8] p-3">
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="flex min-w-max gap-2 sm:min-w-0 sm:grid sm:grid-cols-4">
                {modalPlans.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => onSelectPlan(tab.key)}
                    className={[
                      "h-[52px] min-w-[158px] rounded-[10px] px-4 text-[15px] font-medium transition-colors sm:min-w-0",
                      selectedPlan === tab.key
                        ? "button-primary bg-[#4b8a60] text-white shadow-[0_8px_18px_rgba(75,138,96,0.18)]"
                        : "text-[#5e708e]",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[14px] bg-[#fbfcff] p-7 shadow-[0_12px_32px_rgba(171,185,223,0.12)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                  {plan.title}
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[44px] font-extrabold leading-none tracking-[-0.07em] text-[#121f33] sm:text-[56px]">
                    {plan.price}
                  </span>
                  <span className="pb-2 text-[18px] text-[#51627f]">{plan.suffix}</span>
                </div>
              </div>

              <div className="rounded-[12px] bg-[#4859d8] p-5 text-white shadow-[0_20px_34px_rgba(72,89,216,0.24)]">
                <Rocket className="h-8 w-8" strokeWidth={2} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#95a4bc]">
                What&apos;s Included
              </p>

              <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-[16px] text-[#40516f]">
                    <CircleCheckBig className="h-5 w-5 text-[#0f8a4f]" strokeWidth={2.3} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[12px] bg-[#f5f7ff] px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-[12px] bg-white p-4 text-[#0f8751]">
                  <Star className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#71819d]">Your Current Plan</p>
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#182f53]">
                    School Basic · $99/Mo
                  </p>
                </div>
              </div>

              <span
                className={[
                  "rounded-[10px] px-4 py-2 text-[14px] font-bold",
                  isCurrentPlan ? "bg-[#dff6eb] text-[#0f8a4f]" : "bg-[#ffe7eb] text-[#ff5e76]",
                ].join(" ")}
              >
                {isCurrentPlan ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {isCurrentPlan ? null : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-[64px] items-center justify-center rounded-[10px] border border-[#cadfd5] bg-[#edf5f1] text-[16px] font-semibold text-[#4a8a60]"
              >
                Cancel
              </button>
              <Link
                href="/schools/create-school/activation"
                onClick={onContinue}
                className="button-primary flex h-[64px] items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] text-[16px] font-semibold text-white"
              >
                View Student Directory
                <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function CreateSchoolSubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [schoolName] = useState(() => loadSchoolOnboardingDraft()?.schoolName ?? "Greenfield International Academy");

  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/schools/create-school" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Create New School</span>
        </div>
      }
      activeSection="schools"
    >
      <div className="mx-auto ">
        <CreateSchoolStepper currentStep={2} />

        <section className="mt-10 text-center sm:mt-14">
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#162f54] sm:text-[42px]">
            Step 2: Subscription Plan
          </h1>
          <p className="mx-auto mt-4 max-w-[980px] text-[16px] leading-7 text-[#667792] sm:text-[18px] sm:leading-8">
            Assign a subscription plan to {schoolName} to define student limits and feature access.
            You can upgrade or change this plan at any time.
          </p>
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-4">
          {pricingCards.map((card) => {
            const selected = selectedPlan === card.key;

            return (
              <article
                key={card.key}
                className="relative rounded-[14px] bg-white p-8 shadow-[0_18px_42px_rgba(182,192,227,0.12)]"
              >
                {card.recommended ? (
                  <div className="absolute inset-x-14 -top-5 rounded-[10px] bg-[#eef1ff] py-2 text-center text-[16px] font-semibold text-[#4659d8]">
                    Recommended
                  </div>
                ) : null}

                <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#183155]">{card.title}</h2>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[48px] font-extrabold leading-none tracking-[-0.08em] text-[#111d31] sm:text-[62px]">
                    {card.price}
                  </span>
                  <span className="pb-2 text-[18px] text-[#627492]">{card.suffix}</span>
                </div>

                <div className="mt-8">
                  <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#95a4bc]">
                    What&apos;s Included
                  </p>
                  <div className="mt-6 space-y-4">
                    {card.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-[16px] text-[#40516f]">
                        <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-[#0f8a4f]" strokeWidth={2.3} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(card.key)}
                  className={[
                    "mt-10 flex h-[60px] w-full items-center justify-center rounded-[10px] text-[16px] font-semibold",
                    selected
                      ? "button-primary bg-[#0f8751] text-white"
                      : "border border-[#0f8751] bg-white text-[#0f8751]",
                  ].join(" ")}
                >
                  {selected ? "Plan Selected" : "Select Plan"}
                </button>
              </article>
            );
          })}
        </section>

        <section className="mx-auto mt-8 grid max-w-[960px] gap-5 md:grid-cols-3">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[14px] border border-[#dfe4f4] bg-[#f8f9ff] px-6 py-6 shadow-[0_12px_28px_rgba(182,192,227,0.08)]"
            >
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#4659d8]">
                {card.title}
              </h3>
              <p className="mt-2 text-[16px] leading-7 text-[#6d7d98]">{card.detail}</p>
            </article>
          ))}
        </section>

        {selectedPlan ? (
          <UpgradeModal
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onClose={() => setSelectedPlan(null)}
            onContinue={() => router.push(`/schools/create-school/activation?plan=${selectedPlan}`)}
            schoolName={schoolName}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
