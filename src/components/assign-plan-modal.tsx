"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  assignPlan,
  fetchAssignablePlans,
  fetchStudentSubscription,
  formatPlanPrice,
  type AssignPlanResult,
  type PlanAssignee,
} from "@/lib/subscription-api";
import type { SubscriptionPlan } from "@/lib/subscription-models";

/** Matches the backend's 36-month ceiling. */
const TERM_OPTIONS = [1, 3, 6, 12, 24, 36];

/**
 * Puts a school or an independent student on a plan with no checkout — for
 * billing settled offline, scholarships, and support resolutions.
 */
export function AssignPlanModal({
  assignee,
  currentPlanId,
  authToken,
  onClose,
  onAssigned,
}: {
  assignee: PlanAssignee;
  /**
   * Preselected and marked "Current" in the list. Null means no plan; leave it
   * out for a student and the modal looks it up.
   */
  currentPlanId?: string | null;
  authToken: string;
  onClose: () => void;
  onAssigned?: (result: AssignPlanResult) => void;
}) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [current, setCurrent] = useState<string | null>(currentPlanId ?? null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [planId, setPlanId] = useState(currentPlanId ?? "");
  const [term, setTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookUpCurrent = currentPlanId === undefined && assignee.type === "student";

  useEffect(() => {
    let active = true;

    // The current plan only marks a row, so failing to find it is not fatal.
    const currentLookup = lookUpCurrent
      ? fetchStudentSubscription(assignee.id, authToken)
          .then((subscription) => subscription?.planId ?? null)
          .catch(() => null)
      : Promise.resolve(null);

    Promise.all([fetchAssignablePlans(assignee.type, authToken), currentLookup])
      .then(([list, found]) => {
        if (!active) return;
        setPlans(list);
        if (lookUpCurrent && found) {
          setCurrent(found);
          setPlanId((picked) => picked || found);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Unable to load plans.");
        }
      })
      .finally(() => {
        if (active) setLoadingPlans(false);
      });

    return () => {
      active = false;
    };
  }, [assignee.type, assignee.id, authToken, lookUpCurrent]);

  const selected = plans.find((plan) => plan.id === planId);
  const durationMonths = term ? Number(term) : undefined;
  // Re-assigning the current plan only does something when it sets a new term.
  const unchanged = Boolean(planId) && planId === current && !durationMonths;
  const showsTrialNote =
    assignee.type === "school" && !durationMonths && (selected?.trialDurationDays ?? 0) > 0;
  const audienceLabel = assignee.type === "school" ? "school" : "student";

  async function handleSubmit() {
    if (!selected || unchanged) return;

    setSaving(true);
    setError(null);
    try {
      const result = await assignPlan(
        assignee,
        { planId: selected.id, durationMonths },
        authToken,
      );
      toast.success(result.message);
      onAssigned?.(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign the plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-plan-title"
          className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[540px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assign plan modal"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20 sm:px-8">
            <h2
              id="assign-plan-title"
              className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]"
            >
              {current ? "Change Plan" : "Assign Plan"}
            </h2>
            <p className="mt-1 text-[14px] text-[#6b7894]">{assignee.name}</p>
          </div>

          <div className="space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
            {error && (
              <p className="rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                {error}
              </p>
            )}

            <fieldset>
              <legend className="mb-2 block text-[15px] font-bold text-[#2f4365]">Plan</legend>

              {loadingPlans ? (
                <div className="flex items-center gap-3 rounded-[10px] border border-[#dce3f2] px-4 py-5 text-[14px] text-[#6b7894]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading plans…
                </div>
              ) : loadError ? (
                <p className="rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                  {loadError}
                </p>
              ) : plans.length === 0 ? (
                <p className="rounded-[10px] border border-dashed border-[#dce3f2] px-4 py-5 text-[14px] text-[#6b7894]">
                  There are no active {audienceLabel} plans.{" "}
                  <Link
                    href="/subscriptions/create-plan"
                    className="font-semibold text-[#0f8751] underline"
                  >
                    Create one
                  </Link>{" "}
                  first.
                </p>
              ) : (
                <div className="space-y-2">
                  {plans.map((plan) => {
                    const isSelected = plan.id === planId;
                    const isCurrent = plan.id === current;
                    return (
                      <label
                        key={plan.id}
                        className={[
                          "flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border px-4 py-3.5 transition-colors",
                          isSelected
                            ? "border-[#0f8751] bg-[#f1fbf5]"
                            : "border-[#dce3f2] bg-white hover:bg-[#f7f9fc]",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="assign-plan"
                          value={plan.id}
                          checked={isSelected}
                          onChange={() => setPlanId(plan.id)}
                          className="sr-only"
                        />
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={[
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                              isSelected
                                ? "border-[#0f8751] bg-[#0f8751] text-white"
                                : "border-[#c5cee0] bg-white",
                            ].join(" ")}
                          >
                            {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="truncate text-[15px] font-bold text-[#182c4e]">
                                {plan.name}
                              </span>
                              {isCurrent && (
                                <span className="rounded-full bg-[#e6f7ef] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#0f8751]">
                                  Current
                                </span>
                              )}
                            </span>
                            {plan.description && (
                              <span className="mt-0.5 block truncate text-[13px] text-[#7f8cab]">
                                {plan.description}
                              </span>
                            )}
                          </span>
                        </span>
                        <span className="shrink-0 text-[14px] font-semibold text-[#40516f]">
                          {formatPlanPrice(plan)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">Term</span>
              <div className="relative">
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="h-12 w-full appearance-none rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[15px] text-[#51627f] outline-none focus:border-[#0f8751]"
                >
                  <option value="">One billing period (plan default)</option>
                  {TERM_OPTIONS.map((months) => (
                    <option key={months} value={months}>
                      {months} {months === 1 ? "month" : "months"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c88a0]" />
              </div>
              <span className="mt-2 block text-[13px] leading-5 text-[#7f8cab]">
                {unchanged
                  ? `Already on this plan. Pick a term to start a new one from today.`
                  : showsTrialNote
                    ? `If this is the school's first plan, it starts with the ${selected?.trialDurationDays}-day trial. Pick a term to skip the trial.`
                    : "Free and lifetime plans have no end date unless you pick a term."}
              </span>
            </label>

            <p className="rounded-[10px] bg-[#f6f8ff] px-4 py-3 text-[13px] leading-5 text-[#4659d8]">
              No payment is collected. If the {audienceLabel} is paying for a plan through
              Paystack, that billing stops when this plan starts.
            </p>
          </div>

          <div className="grid gap-3 border-t border-[#edf0f7] bg-[#f7fbff] px-6 py-4 sm:grid-cols-2 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[15px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !selected || unchanged}
              className="button-primary inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0f8751] px-6 text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Assigning…" : current ? "Change Plan" : "Assign Plan"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
