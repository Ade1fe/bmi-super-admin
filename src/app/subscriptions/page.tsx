"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CirclePlus,
  CreditCard,
  LoaderCircle,
  RefreshCcw,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import { apiRequest, endpoints } from "@/lib/endpoints";
import {
  parseSubscriptionList,
  parseSubscriptionPlanList,
  type SubscriptionPlan,
  type SubscriptionRecord,
} from "@/lib/subscription-models";

type SummaryMetric = {
  label: string;
  value: string;
  note: string;
};

type Audience = "school" | "student";

const AUDIENCE_COPY: Record<
  Audience,
  {
    tab: string;
    plansNote: string;
    tableTitle: string;
    tableNote: string;
    payerHeader: string;
    countLabel: string;
    empty: string;
    createLabel: string;
  }
> = {
  school: {
    tab: "School plans",
    plansNote: "Plans sold to schools, including inactive ones.",
    tableTitle: "School Subscriptions",
    tableNote: "Cross-school subscription records from the admin listing endpoint.",
    payerHeader: "School",
    countLabel: "schools billed",
    empty: "No school subscriptions yet.",
    createLabel: "Create School Plan",
  },
  student: {
    tab: "Independent learner plans",
    plansNote:
      "Plans self-registered learners choose from, managed separately from school billing.",
    tableTitle: "Independent Learner Subscriptions",
    tableNote: "Subscriptions held by learners in their own right, outside any school.",
    payerHeader: "Learner",
    countLabel: "learners billed",
    empty: "No independent learner subscriptions yet.",
    createLabel: "Create Learner Plan",
  },
};

function planAudience(plan: SubscriptionPlan): Audience {
  return plan.audience === "student" ? "student" : "school";
}

type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "muted";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedValue);
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function getStatusTone(status: string): StatusTone {
  const normalizedStatus = normalizeStatus(status);

  if (
    normalizedStatus === "active" ||
    normalizedStatus === "trial"
  ) {
    return "success";
  }

  if (normalizedStatus === "expired") {
    return "warning";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "inactive"
  ) {
    return "danger";
  }

  return "muted";
}

function getStatusClassName(status: string) {
  const tone = getStatusTone(status);

  if (tone === "success") {
    return "bg-[#e8f7ee] text-[#0a8a54]";
  }

  if (tone === "warning") {
    return "bg-[#fff5de] text-[#d18b00]";
  }

  if (tone === "danger") {
    return "bg-[#fff0f0] text-[#d03b4f]";
  }

  return "bg-[#eef2f8] text-[#52637d]";
}

function formatStatusLabel(status: string) {
  return normalizeStatus(status)
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");
}

function computeMetrics(
  subscriptions: SubscriptionRecord[],
  plans: SubscriptionPlan[]
) {
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(
    (subscription) => {
      const status = normalizeStatus(subscription.status);
      return status === "active" || status === "trial";
    }
  );

  const expiringSoon = subscriptions.filter(
    (subscription) => {
      if (!subscription.currentPeriodEnd) {
        return false;
      }

      const endDate = new Date(
        subscription.currentPeriodEnd
      );

      if (Number.isNaN(endDate.getTime())) {
        return false;
      }

      const daysUntilExpiry =
        (endDate.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24);

      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }
  );

  const monthlyRecurringRevenue =
    activeSubscriptions.reduce(
      (sum, subscription) =>
        sum + (subscription.plan?.price ?? 0),
      0
    );

  const churnedSubscriptions = subscriptions.filter(
    (subscription) => {
      const status = normalizeStatus(subscription.status);
      return (
        status === "cancelled" ||
        status === "inactive"
      );
    }
  ).length;

  const churnRate = totalSubscriptions
    ? (churnedSubscriptions / totalSubscriptions) * 100
    : 0;

  const activePlans = plans.filter(
    (plan) => plan.isActive
  ).length;

  return [
    {
      label: "ACTIVE SUBSCRIPTIONS",
      value: activeSubscriptions.length.toLocaleString(),
      note: `${totalSubscriptions.toLocaleString()} total`,
    },
    {
      label: "RECURRING REVENUE",
      value: formatCurrency(monthlyRecurringRevenue),
      note: "From active and trial subscriptions",
    },
    {
      label: "EXPIRING SOON",
      value: expiringSoon.length.toLocaleString(),
      note: "Within the next 30 days",
    },
    {
      label: "ACTIVE PLANS",
      value: activePlans.toLocaleString(),
      note: `${plans.length.toLocaleString()} plans configured • ${churnRate.toFixed(1)}% churn`,
    },
  ] satisfies SummaryMetric[];
}

function SummaryCard({ metric }: { metric: SummaryMetric }) {
  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#72829a]">
        {metric.label}
      </p>
      <p className="mt-8 text-[34px] font-extrabold tracking-[-0.05em] text-[#173257]">
        {metric.value}
      </p>
      <p className="mt-3 text-[14px] leading-6 text-[#5f7290]">
        {metric.note}
      </p>
    </article>
  );
}

function intervalSuffix(interval: string) {
  if (interval === "one_time") {
    return "one-time";
  }

  return interval === "annually" ? "/year" : "/month";
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const isLearnerPlan = planAudience(plan) === "student";

  return (
    <article className="rounded-[20px] border border-[#dfe6f2] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#1d2d47]">
            {plan.name}
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-[#5f7290]">
            {plan.description || "No description provided."}
          </p>
        </div>
        <span
          className={[
            "inline-flex rounded-full px-3 py-1.5 text-[13px] font-bold",
            plan.isActive
              ? "bg-[#e8f7ee] text-[#0a8a54]"
              : "bg-[#fff0f0] text-[#d03b4f]",
          ].join(" ")}
        >
          {plan.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-7 flex items-end gap-2">
        <span className="text-[48px] font-extrabold leading-none tracking-[-0.08em] text-[#101d31]">
          {formatCurrency(plan.price)}
        </span>
        <span className="pb-2 text-[17px] text-[#6c7f9b]">
          {plan.price > 0 ? intervalSuffix(plan.interval) : "free"}
        </span>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {[
          ...(isLearnerPlan
            ? []
            : [
                [
                  "Students",
                  plan.maxStudents?.toLocaleString() ??
                    "Not limited",
                ],
              ]),
          [
            "Courses",
            plan.maxCourses?.toLocaleString() ??
              "Not limited",
          ],
          ...(isLearnerPlan
            ? []
            : [
                [
                  "Team",
                  plan.maxTeamMembers?.toLocaleString() ??
                    "Not limited",
                ],
              ]),
          [
            "Trial",
            plan.trialDurationDays
              ? `${plan.trialDurationDays} days`
              : "No trial",
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[14px] bg-[#f6f8fd] px-4 py-3"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8ea0ba]">
              {label}
            </p>
            <p className="mt-2 text-[15px] font-bold text-[#173257]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8ea0ba]">
          Features
        </p>
        <div className="mt-4 space-y-3">
          {plan.features.length ? (
            plan.features.slice(0, 4).map((feature) => (
              <div
                key={feature.id}
                className="rounded-[14px] border border-[#e5ebf6] px-4 py-3"
              >
                <p className="text-[15px] font-semibold text-[#173257]">
                  {feature.name}
                </p>
                {feature.description ? (
                  <p className="mt-1 text-[14px] leading-6 text-[#5f7290]">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="rounded-[14px] border border-dashed border-[#d7deee] px-4 py-4 text-[14px] text-[#7c8ba3]">
              No feature bullets yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[13px] text-[#7c8ba3]">
          {plan.paystackPlanCode
            ? `Paystack: ${plan.paystackPlanCode}`
            : "Paystack plan code pending"}
        </div>
        <Link
          href={`/subscriptions/edit-plan?planId=${plan.id}`}
          className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#0f8751] px-5 text-[15px] font-semibold text-[#0f8751]"
        >
          Edit Plan
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#d7deee] bg-white px-6 py-12 text-center">
      <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#5f7290]">
        {description}
      </p>
    </div>
  );
}

function SubscriptionWindow({
  subscription,
}: {
  subscription: SubscriptionRecord;
}) {
  if (
    normalizeStatus(subscription.status) === "trial" &&
    subscription.trialEndsAt
  ) {
    return (
      <div>
        <p className="font-semibold text-[#173257]">
          Trial ends
        </p>
        <p className="mt-1 text-[14px] text-[#72829a]">
          {formatDate(subscription.trialEndsAt)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-semibold text-[#173257]">
        {formatDate(subscription.currentPeriodStart)}
      </p>
      <p className="mt-1 text-[14px] text-[#72829a]">
        to {formatDate(subscription.currentPeriodEnd)}
      </p>
    </div>
  );
}

export default function SubscriptionManagementPage() {
  const { session, isHydrated } = useAuthSession();
  const [plans, setPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [audience, setAudience] = useState<Audience>("school");

  useEffect(() => {
    const authToken = session?.token;

    if (!isHydrated || !authToken) {
      if (isHydrated) {
        setIsLoading(false);
      }
      return;
    }

    let isCancelled = false;

    async function loadSubscriptions() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [plansResponse, subscriptionsResponse] =
          await Promise.all([
            apiRequest(endpoints.subscriptions.adminPlans, {
              authToken,
            }),
            apiRequest(endpoints.subscriptions.adminList, {
              authToken,
            }),
          ]);

        if (isCancelled) {
          return;
        }

        setPlans(
          parseSubscriptionPlanList(plansResponse)
        );
        setSubscriptions(
          parseSubscriptionList(subscriptionsResponse)
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load subscriptions."
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSubscriptions();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated, reloadKey, session?.token]);

  const copy = AUDIENCE_COPY[audience];
  const audiencePlans = plans.filter(
    (plan) => planAudience(plan) === audience
  );
  const audienceSubscriptions = subscriptions.filter(
    (subscription) => subscription.subscriberType === audience
  );
  const summaryMetrics = computeMetrics(
    audienceSubscriptions,
    audiencePlans
  );

  return (
    <AppShell
      title="Subscription Management"
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              Subscription Management
            </h1>
            <p className="mt-3 max-w-[760px] text-[17px] leading-7 text-[#465b7d]">
              Manage school plans and independent learner plans side by side. Each
              audience has its own catalogue, subscriptions and metrics.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setReloadKey((current) => current + 1)
              }
              disabled={isLoading || !session?.token}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-white px-5 text-[15px] font-semibold text-[#42546f] disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              )}
              Refresh
            </button>
            <Link
              href={`/subscriptions/create-plan?audience=${audience}`}
              className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white"
            >
              <CirclePlus
                className="h-5 w-5"
                strokeWidth={2.1}
              />
              {copy.createLabel}
            </Link>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Plan audience"
          className="mt-8 inline-flex rounded-[14px] border border-[#dfe6f2] bg-white p-1.5"
        >
          {(Object.keys(AUDIENCE_COPY) as Audience[]).map((key) => {
            const count = plans.filter(
              (plan) => planAudience(plan) === key
            ).length;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={audience === key}
                onClick={() => setAudience(key)}
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-[10px] px-5 text-[15px] font-semibold",
                  audience === key
                    ? "bg-[#4b8a60] text-white"
                    : "text-[#52637d]",
                ].join(" ")}
              >
                {AUDIENCE_COPY[key].tab}
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[12px] font-bold",
                    audience === key
                      ? "bg-white/20 text-white"
                      : "bg-[#eef2f8] text-[#52637d]",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {!session?.token && isHydrated ? (
          <section className="mt-8 rounded-[22px] border border-[#ffe1c8] bg-[#fff8f1] px-6 py-5 text-[15px] text-[#8c5b18]">
            Sign in with a super admin account to load plans and subscriptions.
          </section>
        ) : null}

        {errorMessage ? (
          <section className="mt-8 rounded-[22px] border border-[#ffd9d9] bg-[#fff4f4] px-6 py-5 text-[15px] text-[#d03b4f]">
            {errorMessage}
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <SummaryCard
              key={metric.label}
              metric={metric}
            />
          ))}
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
                Plans
              </h2>
              <p className="mt-2 text-[15px] text-[#5f7290]">
                {copy.plansNote}
              </p>
            </div>
            <div className="rounded-full bg-[#eef1ff] px-4 py-2 text-[14px] font-bold text-[#4057d8]">
              {audiencePlans.length.toLocaleString()} plans
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[22px] bg-white">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#4b8a60]" />
              </div>
            ) : audiencePlans.length === 0 ? (
              <EmptyState
                title="No plans yet"
                description={`Create the first ${audience === "student" ? "independent learner" : "school"} plan to populate this catalogue.`}
              />
            ) : (
              <div className="grid gap-5 xl:grid-cols-3">
                {audiencePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#dfe6f2] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                {copy.tableTitle}
              </h2>
              <p className="mt-2 text-[15px] text-[#7c8ba3]">
                {copy.tableNote}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-[12px] bg-[#f8fbff] px-4 py-3 text-[14px] font-semibold text-[#4e5d77]">
                <Users className="h-4 w-4" strokeWidth={2} />
                {audienceSubscriptions.length.toLocaleString()} {copy.countLabel}
              </div>
              <div className="inline-flex items-center gap-2 rounded-[12px] bg-[#f8fbff] px-4 py-3 text-[14px] font-semibold text-[#4e5d77]">
                <CreditCard
                  className="h-4 w-4"
                  strokeWidth={2}
                />
                {formatCurrency(
                  audienceSubscriptions.reduce(
                    (sum, subscription) =>
                      sum +
                      (subscription.plan?.price ?? 0),
                    0
                  )
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f6f8fd]">
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-6 py-5">{copy.payerHeader}</th>
                  <th className="px-4 py-5">Plan</th>
                  <th className="px-4 py-5">Status</th>
                  <th className="px-4 py-5">Billing Window</th>
                  <th className="px-4 py-5">Created</th>
                  <th className="px-4 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-[15px] text-[#72829a]"
                    >
                      Loading subscriptions...
                    </td>
                  </tr>
                ) : audienceSubscriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-[15px] text-[#72829a]"
                    >
                      {copy.empty}
                    </td>
                  </tr>
                ) : (
                  audienceSubscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="border-t border-[#edf1f7] text-[15px] text-[#4f5f7c]"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-[#1d314f]">
                            {(audience === "student"
                              ? subscription.student?.name
                              : subscription.school?.name) ||
                              (audience === "student"
                                ? "Unknown learner"
                                : "Unknown school")}
                          </p>
                          <p className="mt-1 text-[14px] text-[#7c8ba3]">
                            {(audience === "student"
                              ? subscription.student?.email
                              : subscription.school?.email) ||
                              "Email not available"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div>
                          <p className="font-semibold text-[#173257]">
                            {subscription.plan?.name ||
                              "No plan attached"}
                          </p>
                          <p className="mt-1 text-[14px] text-[#72829a]">
                            {formatCurrency(
                              subscription.plan?.price ?? 0
                            )}{" "}
                            {(subscription.plan?.price ?? 0) > 0
                              ? intervalSuffix(
                                  subscription.plan?.interval ?? ""
                                )
                              : "free"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-bold ${getStatusClassName(subscription.status)}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {formatStatusLabel(
                            subscription.status
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <SubscriptionWindow
                          subscription={subscription}
                        />
                      </td>
                      <td className="px-4 py-5 font-medium">
                        <div className="flex items-center gap-2 text-[#52637d]">
                          <CalendarDays
                            className="h-4 w-4"
                            strokeWidth={2}
                          />
                          {formatDate(
                            subscription.createdAt
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-right">
                        {audience === "student" && subscription.studentId ? (
                          <Link
                            href={`/students/${subscription.studentId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#dbe3f1] px-4 py-2 text-[14px] font-semibold text-[#4057d8]"
                          >
                            View Learner
                            <ArrowUpRight
                              className="h-4 w-4"
                              strokeWidth={2}
                            />
                          </Link>
                        ) : audience === "school" && subscription.schoolId ? (
                          <Link
                            href={`/schools/${subscription.schoolId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#dbe3f1] px-4 py-2 text-[14px] font-semibold text-[#4057d8]"
                          >
                            View School
                            <ArrowUpRight
                              className="h-4 w-4"
                              strokeWidth={2}
                            />
                          </Link>
                        ) : (
                          <span className="text-[14px] text-[#8ea0ba]">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
