"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Download,
  EllipsisVertical,
  Filter,
  WalletCards,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type PlanCard = {
  title: string;
  price: string;
  suffix: string;
  features: string[];
  recommended?: boolean;
};

type SummaryMetric = {
  label: string;
  value: string;
  note?: string;
};

type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "PENDING";

type SubscriptionRow = {
  id: number;
  school: string;
  email: string;
  plan: string;
  planClassName: string;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  avatar: "initials" | "photo";
};

type ModalType = "activate" | "cancel" | null;

const summaryMetrics: SummaryMetric[] = [
  { label: "ACTIVE SUBSCRIPTIONS", value: "12808", note: "-+12%" },
  { label: "MONTHLY RECURRING REVENUE", value: "$42,500", note: "-+12%" },
  { label: "EXPIRING SOON", value: "85" },
  { label: "CHURN RATE", value: "2.4%", note: "-0.5%" },
];

const planCards: PlanCard[] = [
  {
    title: "School Basic",
    price: "$99",
    suffix: "/month",
    features: ["Up to 500 students", "Standard Support", "Core LMS features"],
  },
  {
    title: "School Premium",
    price: "$249",
    suffix: "/month",
    features: [
      "Unlimited students",
      "White-labeling options",
      "Priority 24/7 Support",
      "Advanced Analytics",
    ],
    recommended: true,
  },
  {
    title: "Individual Monthly",
    price: "$19",
    suffix: "/month",
    features: ["Single teacher access", "Full course library", "Monthly billing cycle"],
  },
  {
    title: "Individual Annual",
    price: "$$99",
    suffix: "Year",
    features: ["Get 2 months free", "All individual features", "Annual billing"],
  },
];

const subscriptionRows: SubscriptionRow[] = [
  {
    id: 1,
    school: "Greenfield School",
    email: "Contact@Greenfield.Edu",
    plan: "SCHOOL PREMIUM",
    planClassName: "bg-[#e8f0ff] text-[#3567ff]",
    startDate: "Oct 12, 2023",
    expiryDate: "Oct 12, 2023",
    status: "ACTIVE",
    avatar: "initials",
  },
  {
    id: 2,
    school: "Greenfield School",
    email: "Contact@Greenfield.Edu",
    plan: "INDIVIDUAL",
    planClassName: "bg-[#e8f0ff] text-[#3567ff]",
    startDate: "Oct 12, 2023",
    expiryDate: "Oct 12, 2023",
    status: "EXPIRED",
    avatar: "photo",
  },
  {
    id: 3,
    school: "Greenfield School",
    email: "Contact@Greenfield.Edu",
    plan: "SCHOOL BASIC",
    planClassName: "bg-[#e8f0ff] text-[#3567ff]",
    startDate: "Oct 12, 2023",
    expiryDate: "Oct 12, 2023",
    status: "ACTIVE",
    avatar: "initials",
  },
  {
    id: 4,
    school: "Greenfield School",
    email: "Contact@Greenfield.Edu",
    plan: "SCHOOL PREMIUM",
    planClassName: "bg-[#e8f0ff] text-[#3567ff]",
    startDate: "Oct 12, 2023",
    expiryDate: "Oct 12, 2023",
    status: "PENDING",
    avatar: "initials",
  },
  {
    id: 5,
    school: "Greenfield School",
    email: "Contact@Greenfield.Edu",
    plan: "SCHOOL PREMIUM",
    planClassName: "bg-[#e8f0ff] text-[#3567ff]",
    startDate: "Oct 12, 2023",
    expiryDate: "Oct 12, 2023",
    status: "ACTIVE",
    avatar: "initials",
  },
];

const revenueTrendBars = [
  { month: "Jan", value: 22 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 30 },
  { month: "April", value: 83, highlight: true },
  { month: "May", value: 68 },
  { month: "June", value: 38 },
  { month: "July", value: 22 },
];

const cancelReasonOptions = [
  "Select a reason...",
  "Budget constraints",
  "Migrating to another platform",
  "Low adoption",
  "Temporary pause",
];

function statusBadgeClass(status: SubscriptionStatus) {
  if (status === "ACTIVE") {
    return "bg-[#e8f7ee] text-[#0a8a54]";
  }

  if (status === "EXPIRED") {
    return "bg-[#fff0f0] text-[#ff4a4a]";
  }

  return "bg-[#fff5de] text-[#f59a00]";
}

function SummaryCard({ metric }: { metric: SummaryMetric }) {
  const isChurn = metric.label === "CHURN RATE";

  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <p className="text-[15px] font-medium uppercase tracking-[0.04em] text-[#244266]">
        {metric.label}
      </p>
      <div className="mt-10 flex items-center gap-4">
        <p className="text-[35px] font-extrabold tracking-[-0.05em] text-[#173257]">
          {metric.value}
        </p>
        {metric.note ? (
          <span
            className={`text-[14px] font-bold ${
              isChurn ? "text-[#14a467]" : "text-[#14a467]"
            }`}
          >
            {metric.note}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function PlanPriceCard({ card }: { card: PlanCard }) {
  return (
    <article className="relative rounded-[18px] border border-[#dfe6f7] bg-white px-7 py-8">
      {card.recommended ? (
        <div className="absolute inset-x-12 -top-5 rounded-full border border-[#dbe2ff] bg-[#edf1ff] py-2 text-center text-[14px] font-semibold text-[#4c5fe0]">
          Recommended
        </div>
      ) : null}

      <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1d2d47]">{card.title}</h2>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-[62px] font-extrabold leading-none tracking-[-0.08em] text-[#101d31]">
          {card.price}
        </span>
        <span className="pb-2 text-[18px] text-[#6c7f9b]">{card.suffix}</span>
      </div>

      <div className="mt-8">
        <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#97a6be]">
          What&apos;s Included
        </p>
        <div className="mt-5 space-y-4">
          {card.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 text-[16px] leading-7 text-[#44546e]">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#0e8b57] text-[#0e8b57]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/subscriptions/edit-plan"
        className="mt-12 inline-flex h-12 w-full items-center justify-center rounded-[12px] border border-[#0f8751] bg-white text-[17px] font-semibold text-[#0f8751]"
      >
        Edit Plan
      </Link>
    </article>
  );
}

function SubscriptionAvatar({ variant }: { variant: SubscriptionRow["avatar"] }) {
  if (variant === "photo") {
    return (
      <div className="h-9 w-9 rounded-full bg-[radial-gradient(circle_at_top,#b361ff_10%,#13234a_48%,#10d0ff_100%)] shadow-[0_8px_18px_rgba(56,80,164,0.25)]" />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#7a35f1] text-[14px] font-bold text-white">
      GS
    </div>
  );
}

function ActivationModal({
  onClose,
  licenseConfirmed,
  billingConfirmed,
  onLicenseChange,
  onBillingChange,
}: {
  onClose: () => void;
  licenseConfirmed: boolean;
  billingConfirmed: boolean;
  onLicenseChange: () => void;
  onBillingChange: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[640px]">
          <button
            type="button"
            aria-label="Close activation modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16 md:h-12 md:w-12"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="w-full rounded-[26px] bg-white p-8 shadow-[0_40px_120px_rgba(20,28,48,0.26)] sm:p-10">
            <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#142f56]">
              Activate Subscription
            </h2>
            <p className="mt-2 text-[16px] text-[#5f7290]">
              Reviewing renewal for St. Jude Academy
            </p>

            <div className="mt-8 rounded-[18px] bg-[#fbfcff] p-6">
              <div className="flex items-center gap-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#637798]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0f0] text-[#ff4a4a]">
                  <AlertTriangle className="h-4 w-4" strokeWidth={2.1} />
                </span>
                Expired Account Context
              </div>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[18px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                    School Basic
                  </p>
                  <p className="mt-1 text-[15px] text-[#6e7e98]">Standard Administrative Access</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[16px] font-extrabold text-[#ff4a4a]">EXPIRED</p>
                  <p className="mt-1 text-[15px] text-[#6e7e98]">Since Oct 2023</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border-2 border-[#546bf0] bg-[#eef1ff] px-5 py-5">
                <p className="text-[13px] font-medium text-[#51627f]">Effectively Start</p>
                <p className="mt-2 text-[18px] font-extrabold text-[#4057d8]">Nov 01, 2023</p>
                <p className="mt-1 text-[14px] text-[#51627f]">Retroactive Date</p>
              </div>
              <div className="rounded-[18px] border-2 border-[#4b8a60] bg-[#edf7f1] px-5 py-5">
                <p className="text-[13px] font-medium text-[#51627f]">New Expiry</p>
                <p className="mt-2 text-[18px] font-extrabold text-[#278c57]">Nov 01, 2024</p>
                <p className="mt-1 text-[14px] text-[#51627f]">12 Month Term</p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="flex items-start gap-3 text-[15px] leading-7 text-[#687993]">
                <button
                  type="button"
                  onClick={onLicenseChange}
                  className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border ${
                    licenseConfirmed
                      ? "border-[#0f8751] bg-[#0f8751] text-white"
                      : "border-[#dbe3f1] bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <span>
                  I confirm the reactivation of <span className="font-bold text-[#44546e]">450 student licenses</span> and
                  administrative data recovery.
                </span>
              </label>
              <label className="flex items-start gap-3 text-[15px] leading-7 text-[#687993]">
                <button
                  type="button"
                  onClick={onBillingChange}
                  className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border ${
                    billingConfirmed
                      ? "border-[#0f8751] bg-[#0f8751] text-white"
                      : "border-[#dbe3f1] bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <span>
                  Apply standard academic billing rates ($12.00/user/annum) to the ledger for Q4.
                </span>
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-white px-6 text-[17px] font-semibold text-[#4b8a60]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[17px] font-semibold text-white"
              >
                Confirm Activation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CancelSubscriptionModal({
  onClose,
  reason,
  comments,
  onReasonChange,
  onCommentsChange,
}: {
  onClose: () => void;
  reason: string;
  comments: string;
  onReasonChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[640px]">
          <button
            type="button"
            aria-label="Close cancellation modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16 md:h-12 md:w-12"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="w-full rounded-[26px] bg-white p-8 shadow-[0_40px_120px_rgba(20,28,48,0.26)] sm:p-10">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f0] text-[#f03c5a]">
                <AlertTriangle className="h-7 w-7" strokeWidth={2.1} />
              </span>
              <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#142f56]">
                Cancel Subscription?
              </h2>
            </div>

            <div className="mt-8 rounded-[18px] border border-[#ffd8de] bg-[#fff3f5] px-5 py-4 text-[16px] leading-8 text-[#c1294c]">
              This action will immediately terminate access for all 2,500 students and staff at St.
              Andrew&apos;s Academy. Note: Cancellations are processed immediately. Any remaining time in
              the current billing cycle will be forfeited.
            </div>

            <div className="mt-6">
              <label className="block text-[15px] font-medium text-[#5c6f8d]">
                Reason for Cancellation
              </label>
              <div className="relative mt-2">
                <select
                  value={reason}
                  onChange={(event) => onReasonChange(event.target.value)}
                  className="h-12 w-full appearance-none rounded-[12px] border border-[#dbe3f1] bg-white px-4 pr-11 text-[15px] text-[#5c6f8d] outline-none"
                >
                  {cancelReasonOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-[15px] font-medium text-[#5c6f8d]">
                Additional Comments ( Optional)
              </label>
              <textarea
                value={comments}
                onChange={(event) => onCommentsChange(event.target.value)}
                rows={4}
                placeholder="Help us improve by sharing your feedback..."
                className="mt-2 w-full rounded-[12px] border border-[#dbe3f1] bg-white px-4 py-4 text-[15px] text-[#1e314f] outline-none placeholder:text-[#8e9cb2]"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#dbe3f1] bg-white px-6 text-[17px] font-semibold text-[#485a76]"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#f22952] px-6 text-[17px] font-semibold text-white"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SubscriptionManagementPage() {
  const [openActionRow, setOpenActionRow] = useState<number | null>(1);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [licenseConfirmed, setLicenseConfirmed] = useState(true);
  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const [cancelReason, setCancelReason] = useState(cancelReasonOptions[0]);
  const [cancelComments, setCancelComments] = useState("");

  return (
    <AppShell
      title="Subscription Management"
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex justify-end">
          <Link
            href="/subscriptions/create-plan"
            className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
          >
            <CirclePlus className="h-5 w-5" strokeWidth={2.2} />
            Create New Plan
          </Link>
        </div>

        <section className="mt-8 grid gap-4 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <SummaryCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-4">
          {planCards.map((card) => (
            <PlanPriceCard key={card.title} card={card} />
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#dfe6f2] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Recent Subscriptions
            </h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#4e5d77]"
              >
                <Filter className="h-4.5 w-4.5" strokeWidth={2} />
                Filter
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#f8fbff] px-4 text-[15px] font-semibold text-[#4e5d77]"
              >
                <Download className="h-4.5 w-4.5" strokeWidth={2} />
                Download
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f6f8fd]">
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-6 py-5">Course Name</th>
                  <th className="px-4 py-5">Category</th>
                  <th className="px-4 py-5">Start Date</th>
                  <th className="px-4 py-5">Expiry Date</th>
                  <th className="px-4 py-5">Status</th>
                  <th className="px-4 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#edf1f7] text-[15px] text-[#4f5f7c]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <SubscriptionAvatar variant={row.avatar} />
                        <div>
                          <p className="font-bold text-[#1d314f]">{row.school}</p>
                          <p className="text-[14px] text-[#7c8ba3]">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`rounded-full px-3 py-1.5 text-[14px] font-bold ${row.planClassName}`}>
                        {row.plan}
                      </span>
                    </td>
                    <td className="px-4 py-5 font-medium">{row.startDate}</td>
                    <td className="px-4 py-5 font-medium">{row.expiryDate}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-bold ${statusBadgeClass(row.status)}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="relative px-4 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionRow((current) => (current === row.id ? null : row.id))
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8fa0ba]"
                      >
                        <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                      </button>

                      {openActionRow === row.id ? (
                        <div className="absolute right-6 top-[58px] z-10 w-[214px] rounded-[14px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                          {row.status === "ACTIVE" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModal("cancel");
                                setOpenActionRow(null);
                              }}
                              className="flex w-full items-center rounded-[10px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                            >
                              Cancel Subscription
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModal("activate");
                                setOpenActionRow(null);
                              }}
                              className="flex w-full items-center rounded-[10px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                            >
                              Activate subscription
                            </button>
                          )}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-6 py-5 text-[15px] text-[#667892] sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">Showing 1 to 5 of 12,840 certificates</p>
            <div className="flex items-center gap-2 text-[#33496b]">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#0f8751] text-white"
              >
                1
              </button>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                2
              </button>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                3
              </button>
              <span className="px-1">...</span>
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]">
                256
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dbe3f1] bg-white"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
          <article className="rounded-[22px] border border-[#dfe6f2] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Revenue Trend
                </h2>
                <p className="mt-1 text-[15px] text-[#7c8ba3]">Revenue trend over the last 6 months</p>
              </div>

              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[14px] font-semibold text-[#314868]"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={2} />
                Last 6 month
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-10 grid h-[320px] grid-cols-7 items-end gap-5">
              {revenueTrendBars.map((bar) => (
                <div key={bar.month} className="flex h-full flex-col items-center justify-end gap-4">
                  <div className="flex h-full w-full items-end">
                    <div
                      className={[
                        "w-full rounded-t-[6px] bg-[#cfe1da]",
                        bar.highlight
                          ? "bg-[linear-gradient(180deg,#5aa688_0%,#5aa688_70%,#dfffee_100%)]"
                          : "",
                      ].join(" ")}
                      style={{ height: `${bar.value}%` }}
                    />
                  </div>
                  <span className="text-[14px] text-[#7a879d]">{bar.month}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[22px] border border-[#dfe6f2] bg-white p-6 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">System Health</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-[14px] bg-[#eef1ff] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[16px] font-bold text-[#203250]">Auto-renewals</p>
                  <p className="text-[16px] font-extrabold text-[#14a467]">98.2%</p>
                </div>
              </div>
              <div className="rounded-[14px] bg-[#eef1ff] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[16px] font-bold text-[#203250]">Churn Rate</p>
                  <p className="text-[16px] font-extrabold text-[#f03c5a]">1.4%</p>
                </div>
              </div>
              <div className="rounded-[14px] bg-[#eef1ff] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[16px] font-bold text-[#203250]">New Trials</p>
                  <p className="text-[16px] font-extrabold text-[#111d31]">42</p>
                </div>
              </div>
            </div>

            <Link
              href="/subscriptions/system-health-report"
              className="button-primary mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-[#0f8751] text-[17px] font-semibold text-white"
            >
              <WalletCards className="h-4.5 w-4.5" strokeWidth={2.2} />
              View Health Report
            </Link>
          </article>
        </section>
      </div>

      {activeModal === "activate" ? (
        <ActivationModal
          onClose={() => setActiveModal(null)}
          licenseConfirmed={licenseConfirmed}
          billingConfirmed={billingConfirmed}
          onLicenseChange={() => setLicenseConfirmed((current) => !current)}
          onBillingChange={() => setBillingConfirmed((current) => !current)}
        />
      ) : null}

      {activeModal === "cancel" ? (
        <CancelSubscriptionModal
          onClose={() => setActiveModal(null)}
          reason={cancelReason}
          comments={cancelComments}
          onReasonChange={setCancelReason}
          onCommentsChange={setCancelComments}
        />
      ) : null}
    </AppShell>
  );
}
