"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  Rocket,
  Star,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSchoolStepper } from "@/components/create-school-stepper";

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
}: {
  selectedPlan: PlanKey;
  onSelectPlan: (plan: PlanKey) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const plan = modalPlans.find((item) => item.key === selectedPlan)!;
  const isCurrentPlan = selectedPlan === "basic";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[17%] flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
          aria-label="Close subscription modal"
        >
          <X className="h-7 w-7" strokeWidth={2.4} />
        </button>

        <div className="w-full max-w-[720px] rounded-[34px] bg-white p-7 shadow-[0_40px_120px_rgba(27,43,77,0.22)] sm:p-10">
          <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#172f54]">
            Upgrade Subscription
          </h2>
          <p className="mt-2 text-[15px] text-[#6b7c97]">
            Select a new plan for Greenfield Academy
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-[18px] bg-[#f4f6f8] p-3 sm:grid-cols-4">
            {modalPlans.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectPlan(tab.key)}
                className={[
                  "h-[52px] rounded-[14px] text-[15px] font-medium transition-colors",
                  selectedPlan === tab.key
                    ? "bg-white text-[#4a8a60] shadow-[0_8px_18px_rgba(182,192,227,0.16)]"
                    : "text-[#5e708e]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] bg-[#fbfcff] p-7 shadow-[0_12px_32px_rgba(171,185,223,0.12)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                  {plan.title}
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[56px] font-extrabold leading-none tracking-[-0.07em] text-[#121f33]">
                    {plan.price}
                  </span>
                  <span className="pb-2 text-[18px] text-[#51627f]">{plan.suffix}</span>
                </div>
              </div>

              <div className="rounded-[20px] bg-[#4859d8] p-5 text-white shadow-[0_20px_34px_rgba(72,89,216,0.24)]">
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

          <div className="mt-6 rounded-[20px] bg-[#f5f7ff] px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-4 text-[#0f8751]">
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
                  "rounded-xl px-4 py-2 text-[14px] font-bold",
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
                className="flex h-[64px] items-center justify-center rounded-2xl border border-[#cadfd5] bg-[#edf5f1] text-[16px] font-semibold text-[#4a8a60]"
              >
                Cancel
              </button>
              <Link
                href="/schools/create-school/activation"
                onClick={onContinue}
                className="flex h-[64px] items-center justify-center gap-3 rounded-2xl bg-[#4b8a60] text-[16px] font-semibold text-white"
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

function SubscriptionSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[17%] flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
          aria-label="Close upgrade success modal"
        >
          <X className="h-7 w-7" strokeWidth={2.4} />
        </button>

        <div className="w-full max-w-[610px] rounded-[34px] bg-white px-8 py-10 shadow-[0_40px_120px_rgba(27,43,77,0.22)]">
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

            <h2 className="text-center text-[26px] font-extrabold tracking-[-0.04em] text-[#152f56]">
              Subscription Upgraded Successfully!
            </h2>
            <p className="mt-3 max-w-[460px] text-center text-[16px] leading-7 text-[#667792]">
              Greenfield Academy has been upgraded to the <span className="text-[#4659d8]">Premium Plan</span>.
              All features are now active and ready for use.
            </p>
          </div>

          <div className="mt-8 rounded-[22px] bg-[#eef2ff] px-7 py-6">
            <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#4659d8]">
              Plan Summary
            </p>

            <div className="mt-5 space-y-4 text-[16px] text-[#566881]">
              <div className="flex items-center justify-between gap-4 border-b border-[#dfe6fb] pb-4">
                <span>New Plan</span>
                <span className="font-extrabold text-[#172f54]">Premium Plan</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#dfe6fb] pb-4">
                <span>Monthly Billing</span>
                <span className="font-extrabold text-[#172f54]">$249.00 / month</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Next Billing Date</span>
                <span className="font-extrabold text-[#172f54]">October 24, 2023</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[62px] w-full items-center justify-center rounded-2xl bg-[#4b8a60] text-[16px] font-semibold text-white"
            >
              Back to Subscriptions
            </button>
            <Link
              href="/schools/create-school/invoice"
              className="flex h-[62px] items-center justify-center rounded-2xl border border-[#cadfd5] bg-[#edf5f1] text-[16px] font-semibold text-[#4a8a60]"
            >
              View Invoice Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CreateSchoolSubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("premium");
  const [modalState, setModalState] = useState<"upgrade" | "success" | null>(null);

  return (
    <AppShell title="Create New School" activeSection="schools">
      {modalState === "upgrade" ? (
        <UpgradeModal
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onClose={() => setModalState(null)}
          onContinue={() => setModalState("success")}
        />
      ) : null}
      {modalState === "success" ? <SubscriptionSuccessModal onClose={() => setModalState(null)} /> : null}

      <div className="mx-auto max-w-[1260px]">
        <CreateSchoolStepper currentStep={2} />

        <section className="mt-14 text-center">
          <h1 className="text-[42px] font-extrabold tracking-[-0.05em] text-[#162f54]">
            Step 2: Subscription Plan
          </h1>
          <p className="mx-auto mt-4 max-w-[980px] text-[18px] leading-8 text-[#667792]">
            Assign a subscription plan to Greenfield International Academy to define their student limits and feature access. You can upgrade or change this plan at any time.
          </p>
        </section>

        <section className="mt-16 grid gap-6 xl:grid-cols-4">
          {pricingCards.map((card) => {
            const selected = selectedPlan === card.key;

            return (
              <article
                key={card.key}
                className="relative rounded-[28px] bg-white p-8 shadow-[0_18px_42px_rgba(182,192,227,0.12)]"
              >
                {card.recommended ? (
                  <div className="absolute inset-x-14 -top-5 rounded-full bg-[#eef1ff] py-2 text-center text-[16px] font-semibold text-[#4659d8]">
                    Recommended
                  </div>
                ) : null}

                <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#183155]">{card.title}</h2>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[62px] font-extrabold leading-none tracking-[-0.08em] text-[#111d31]">
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
                  onClick={() => {
                    setSelectedPlan(card.key);
                    if (card.key === "premium") {
                      setModalState("upgrade");
                    }
                  }}
                  className={[
                    "mt-10 flex h-[60px] w-full items-center justify-center rounded-2xl text-[16px] font-semibold",
                    selected
                      ? "bg-[#0f8751] text-white"
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
              className="rounded-[22px] border border-[#dfe4f4] bg-[#f8f9ff] px-6 py-6 shadow-[0_12px_28px_rgba(182,192,227,0.08)]"
            >
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#4659d8]">
                {card.title}
              </h3>
              <p className="mt-2 text-[16px] leading-7 text-[#6d7d98]">{card.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
