"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  CirclePlus,
  Cloud,
  Users,
  Video,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type FeatureManagementCard = {
  title: string;
  subtext: string;
  value: string;
  enabled: boolean;
};

const managementCards: FeatureManagementCard[] = Array.from({ length: 4 }, () => ({
  title: "LMS Storage Limit",
  subtext: "Global asset hosting per institution",
  value: "50 GB",
  enabled: true,
}));

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
        enabled ? "bg-[#0f8751]" : "bg-[#dfe5e9]"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
          enabled ? "left-7" : "left-1"
        }`}
      />
    </span>
  );
}

function FeatureSetManagementModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[760px]">
          <button
            type="button"
            aria-label="Close feature set modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-10"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#e8edf7] px-8 py-6">
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#142f56]">
                Feature Set Management
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[16px] font-bold text-[#0f8751]"
              >
                <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
                Add New layer
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-8 py-8">
              {managementCards.map((card, index) => (
                <div key={index} className="rounded-[20px] bg-[#f5f7ff] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-extrabold text-[#19355d]">Apply This Feature</h3>
                    <Toggle enabled={card.enabled} />
                  </div>

                  <div className="mt-5 space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-[14px] font-medium text-[#5e7292]">Feature 1</span>
                      <input
                        defaultValue={card.title}
                        className="h-14 w-full rounded-[14px] border border-[#d7deee] px-4 text-[15px] font-semibold text-[#243450] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[14px] font-medium text-[#5e7292]">Subtext</span>
                      <input
                        defaultValue={card.subtext}
                        className="h-14 w-full rounded-[14px] border border-[#d7deee] px-4 text-[15px] text-[#5e7292] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[14px] font-medium text-[#5e7292]">Feature Value</span>
                      <input
                        defaultValue={card.value}
                        className="h-14 w-full rounded-[14px] border border-[#d7deee] px-4 text-[15px] font-semibold text-[#243450] outline-none"
                      />
                    </label>
                  </div>
                </div>
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

export default function CreateSubscriptionPlanPage() {
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  return (
    <AppShell
      title="Create New Plan"
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto max-w-[1288px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              Create Subscription Plan
            </h1>
            <p className="mt-3 text-[18px] text-[#465b7d]">
              Configure academic access tiers and resource allocation.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/subscriptions"
              className="inline-flex h-14 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4b8a60]"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white"
            >
              Publish Plan
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
          <div className="space-y-6">
            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                General Configuration
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {[
                  ["Plan Name", "Alexander Thompson"],
                  ["Target Audience", "Beginner"],
                  ["Pricing Tier (Monthly)", "Alexander Thompson"],
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

                <div>
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">Initial Status</span>
                  <div className="grid h-[64px] grid-cols-2 rounded-[16px] border border-[#d7deee] p-2">
                    <button
                      type="button"
                      className="rounded-[12px] bg-[#0f8751] text-[16px] font-bold text-white"
                    >
                      ACTIVE
                    </button>
                    <button
                      type="button"
                      className="text-[16px] font-bold text-[#7b8ca7]"
                    >
                      DRAFT
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Features
                </h2>
                <button
                  type="button"
                  onClick={() => setShowFeatureModal(true)}
                  className="inline-flex items-center gap-2 text-[16px] font-bold text-[#0f8751]"
                >
                  <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
                  Edit Custom Features
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Cloud,
                    title: "LMS Storage Limit",
                    detail: "Global asset hosting per institution",
                    value: "50 GB",
                    enabled: true,
                  },
                  {
                    icon: Users,
                    title: "User Seat Allocation",
                    detail: "Maximum active student profiles",
                    value: "Unlimited",
                    enabled: true,
                  },
                  {
                    icon: Video,
                    title: "Virtual Lab Access",
                    detail: "Real-time simulation environment",
                    value: "OFF/ON",
                    enabled: false,
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-center gap-4 rounded-[18px] bg-[#f5f7ff] px-5 py-6"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e7ebff] text-[#4d63e1]">
                        <Icon className="h-5 w-5" strokeWidth={2.1} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-extrabold text-[#243450]">{feature.title}</p>
                        <p className="mt-1 text-[15px] text-[#6d7d98]">{feature.detail}</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="rounded-[12px] border border-[#d8e0ee] bg-white px-4 py-2 text-[16px] font-bold text-[#243450]">
                          {feature.value}
                        </span>
                        <Toggle enabled={feature.enabled} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside>
            <p className="mb-6 text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Customers Preview
            </p>
            <article className="rounded-[22px] bg-white p-10 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#1e2e49]">
                Emerald Elite Monthly
              </h2>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-[88px] font-extrabold leading-none tracking-[-0.08em] text-[#101d31]">
                  $499
                </span>
                <span className="pb-3 text-[24px] text-[#6c7f9b]">/month</span>
              </div>

              <div className="mt-10">
                <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#97a6be]">
                  What&apos;s Included
                </p>
                <div className="mt-6 space-y-5">
                  {[
                    { label: "LMS Storage Limit", enabled: true },
                    { label: "User Seat Allocation", enabled: true },
                    { label: "Virtual Lab Simulation", enabled: false },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-start gap-3 text-[18px] text-[#44546e]">
                      {feature.enabled ? (
                        <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#0e8b57]" strokeWidth={2.1} />
                      ) : (
                        <X className="mt-0.5 h-6 w-6 text-[#ff6c4a]" strokeWidth={2.1} />
                      )}
                      <span>{feature.label}</span>
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
            </article>
          </aside>
        </section>
      </div>

      {showFeatureModal ? <FeatureSetManagementModal onClose={() => setShowFeatureModal(false)} /> : null}
    </AppShell>
  );
}
