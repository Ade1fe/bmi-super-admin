import { apiRequest, endpoints } from "./endpoints";
import {
  parseSubscriptionPlanList,
  parseSubscriptionRecord,
  type SubscriberType,
  type SubscriptionPlan,
  type SubscriptionRecord,
} from "./subscription-models";

/** Who a plan is being assigned to. */
export type PlanAssignee = {
  type: SubscriberType;
  id: string;
  name: string;
};

export type AssignPlanPayload = {
  planId: string;
  /** Omit for one billing period of the plan (and its trial, for a school's first plan). */
  durationMonths?: number;
};

export type AssignPlanResult = {
  message: string;
  subscription: SubscriptionRecord | null;
};

/**
 * Active plans sold to `audience`, cheapest first. School and student tiers
 * share one table, so the filter is what keeps a student plan out of the
 * school picker and the reverse.
 */
export async function fetchAssignablePlans(
  audience: SubscriberType,
  authToken: string,
): Promise<SubscriptionPlan[]> {
  const payload = await apiRequest<unknown>(endpoints.subscriptions.adminPlans, {
    authToken,
    cache: "no-store",
  });

  return parseSubscriptionPlanList(payload)
    .filter((plan) => plan.isActive && (plan.audience ?? "school") === audience)
    .sort((a, b) => a.price - b.price);
}

/** Puts a school or an independent student on a plan, with no checkout. */
export async function assignPlan(
  assignee: Pick<PlanAssignee, "type" | "id">,
  payload: AssignPlanPayload,
  authToken: string,
): Promise<AssignPlanResult> {
  const url =
    assignee.type === "school"
      ? endpoints.subscriptions.assignSchoolPlan(assignee.id)
      : endpoints.subscriptions.studentPlan(assignee.id);

  const response = await apiRequest<{ message?: string; data?: unknown }>(url, {
    method: "POST",
    authToken,
    body: payload,
  });

  return {
    message: response?.message ?? "Plan assigned.",
    subscription: parseSubscriptionRecord(response?.data),
  };
}

/** An independent student's live plan, or null if they have none. */
export async function fetchStudentSubscription(
  studentId: string,
  authToken: string,
): Promise<SubscriptionRecord | null> {
  const response = await apiRequest<{ data?: unknown }>(
    endpoints.subscriptions.studentPlan(studentId),
    { authToken, cache: "no-store" },
  );

  return parseSubscriptionRecord(response?.data);
}

export function formatPlanPrice(plan: Pick<SubscriptionPlan, "price" | "interval">) {
  if (!plan.price) return "Free";

  const price = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(plan.price);

  const suffix =
    plan.interval === "annually" ? "/year" : plan.interval === "one_time" ? " once" : "/month";

  return `${price}${suffix}`;
}

export function formatPlanDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

/** One line on when a subscription's current term ends. */
export function describeTerm(subscription: {
  status?: string;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
}) {
  const trialEnds = formatPlanDate(subscription.trialEndsAt);
  if (subscription.status === "trial" && trialEnds) return `Trial ends ${trialEnds}`;

  const periodEnds = formatPlanDate(subscription.currentPeriodEnd);
  return periodEnds ? `Runs until ${periodEnds}` : "No end date";
}
