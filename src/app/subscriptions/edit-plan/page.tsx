"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, CirclePlus, FileText, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const editFeatures = [
  "Unlimited course creation",
  "Bulk student import (CSV/XLS)",
  "Advanced School Analytics Dashboard",
  "Dedicated Account Manager",
];

const editableFeatureInputs = [
  "e.g. Advanced UI Design Patterns",
  "e.g. Advanced UI Design Patterns",
  "e.g. Advanced UI Design Patterns",
  "e.g. Advanced UI Design Patterns",
];

function EditFeaturesModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[760px]">
          <button
            type="button"
            aria-label="Close edit features modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-10"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#e8edf7] px-8 py-6">
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#142f56]">
                Edit Features
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[16px] font-bold text-[#0f8751]"
              >
                <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
                Add New layer
              </button>
            </div>

            <div className="space-y-6 px-8 py-8">
              {editableFeatureInputs.map((placeholder, index) => (
                <label key={index} className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Feature {index + 1}
                  </span>
                  <input
                    defaultValue={placeholder}
                    className="h-14 w-full rounded-[16px] border border-[#d7deee] px-5 text-[16px] text-[#264267] outline-none"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#e8edf7] bg-[#f8fbfa] px-8 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4b8a60]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white"
              >
                Update Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditSubscriptionPlanPage() {
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  return (
    <AppShell
      title="Edit Subscription Plan"
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto max-w-[1288px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              Edit Subscription Plan
            </h1>
            <p className="mt-3 text-[18px] text-[#465b7d]">
              Configure pricing, target audience, and feature entitlements.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/subscriptions"
              className="inline-flex h-14 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4b8a60]"
            >
              Discard Changes
            </Link>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white"
            >
              Save Plan Details
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
          <div className="space-y-6">
            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Plan Basics
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {[
                  ["Plan Name", "Alexander Thompson"],
                  ["Target Audience", "Beginner"],
                  ["Monthly Price (USDT)", "Alexander Thompson"],
                  ["Yearly Price (USDT)", "Beginner"],
                ].map(([label, value]) => (
                  <label key={label}>
                    <span className="mb-3 block text-[16px] font-bold text-[#19355d]">{label}</span>
                    <span className="relative flex h-[64px] items-center rounded-[16px] border border-[#d7deee] bg-white px-5">
                      <input
                        defaultValue={value}
                        className="w-full bg-transparent text-[16px] text-[#264267] outline-none"
                      />
                      <ChevronDown className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
                    </span>
                  </label>
                ))}
              </div>
            </article>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
              <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                    Features
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowFeatureModal(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#edf5f1] px-4 py-2 text-[15px] font-bold text-[#0f8751]"
                  >
                    <CirclePlus className="h-4.5 w-4.5" strokeWidth={2.1} />
                    Edit Feature
                  </button>
                </div>

                <div className="mt-7 space-y-5">
                  {editFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-4 rounded-[18px] bg-[#f5f7ff] px-5 py-5"
                    >
                      <CheckCircle2 className="h-8 w-8 text-[#4d63e1]" strokeWidth={2.1} />
                      <p className="text-[16px] font-semibold text-[#243450]">{feature}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
                <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Publishing Status
                </h2>

                <div className="mt-8 space-y-5">
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 rounded-[22px] border-2 border-[#4d63e1] bg-[#eef1ff] px-6 py-7 text-left"
                  >
                    <CheckCircle2 className="mt-1 h-7 w-7 text-[#4d63e1]" strokeWidth={2.1} />
                    <div>
                      <p className="text-[18px] font-extrabold text-[#4d63e1]">Active</p>
                      <p className="mt-1 text-[15px] text-[#4d63e1]">Visible to all schools</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-start gap-4 rounded-[22px] border border-[#dfe6f7] bg-white px-6 py-7 text-left"
                  >
                    <FileText className="mt-1 h-7 w-7 text-[#8ea0ba]" strokeWidth={2.1} />
                    <div>
                      <p className="text-[18px] font-extrabold text-[#243450]">Draft</p>
                      <p className="mt-1 text-[15px] text-[#7c8ba3]">Internal Preview Only</p>
                    </div>
                  </button>
                </div>
              </article>
            </div>
          </div>

          <aside>
            <p className="mb-6 text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Live Preview
            </p>
            <article className="rounded-[22px] bg-white p-10 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#1e2e49]">
                Individual Monthly
              </h2>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-[88px] font-extrabold leading-none tracking-[-0.08em] text-[#101d31]">
                  $19
                </span>
                <span className="pb-3 text-[24px] text-[#6c7f9b]">/month</span>
              </div>

              <div className="mt-10">
                <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#97a6be]">
                  What&apos;s Included
                </p>
                <div className="mt-6 space-y-5">
                  {[
                    "Single teacher access",
                    "Full course library",
                    "Monthly billing cycle",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-[18px] text-[#44546e]">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#0e8b57]" strokeWidth={2.1} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-14 inline-flex h-14 w-full items-center justify-center rounded-[14px] border border-[#0f8751] bg-white text-[18px] font-semibold text-[#0f8751]"
              >
                Select This Plan
              </button>
              <p className="mt-8 text-center text-[14px] font-medium uppercase tracking-[0.06em] text-[#6f809b]">
                Billed annually at $1999/Year
              </p>
            </article>
          </aside>
        </section>
      </div>

      {showFeatureModal ? <EditFeaturesModal onClose={() => setShowFeatureModal(false)} /> : null}
    </AppShell>
  );
}
