"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CirclePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import { apiRequest, endpoints } from "@/lib/endpoints";
import {
  parseSubscriptionPlan,
  parseSubscriptionPlanList,
  type SubscriptionPlan,
} from "@/lib/subscription-models";

type PlanEditorMode = "create" | "edit";

type FeatureDraft = {
  key: string;
  id?: string;
  name: string;
  description: string;
  originalName?: string;
  originalDescription?: string;
};

type SubscriptionPlanEditorProps = {
  mode: PlanEditorMode;
  planId?: string | null;
};

type ApiEnvelope<TData> = {
  message?: string;
  data?: TData;
};

function createFeatureDraft(
  feature?: SubscriptionPlan["features"][number]
) {
  return {
    key:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random()}`,
    id: feature?.id,
    name: feature?.name ?? "",
    description: feature?.description ?? "",
    originalName: feature?.name,
    originalDescription: feature?.description ?? "",
  } satisfies FeatureDraft;
}

function emptyFeatureDraft() {
  return createFeatureDraft();
}

function toInputValue(value?: number) {
  return value === undefined ? "" : String(value);
}

function parseOptionalInteger(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatIntervalLabel(interval: string) {
  return interval === "annually"
    ? "per year"
    : "per month";
}

function buildPlanPayload(formState: {
  name: string;
  description: string;
  price: string;
  interval: string;
  maxStudents: string;
  maxCourses: string;
  maxTeamMembers: string;
  trialDurationDays: string;
}) {
  const price = parseOptionalInteger(formState.price);
  const maxStudents = parseOptionalInteger(
    formState.maxStudents
  );
  const maxCourses = parseOptionalInteger(
    formState.maxCourses
  );
  const maxTeamMembers = parseOptionalInteger(
    formState.maxTeamMembers
  );
  const trialDurationDays = parseOptionalInteger(
    formState.trialDurationDays
  );

  if (!formState.name.trim()) {
    throw new Error("Plan name is required.");
  }

  if (price === undefined || price === null || price <= 0) {
    throw new Error(
      "Price must be a whole number greater than zero."
    );
  }

  if (
    maxStudents === null ||
    maxCourses === null ||
    maxTeamMembers === null ||
    trialDurationDays === null
  ) {
    throw new Error(
      "Limits and trial duration must be whole numbers or left empty."
    );
  }

  return {
    name: formState.name.trim(),
    price,
    interval:
      formState.interval === "annually"
        ? "annually"
        : "monthly",
    ...(formState.description.trim()
      ? {
          description: formState.description.trim(),
        }
      : {}),
    ...(maxStudents !== undefined
      ? { maxStudents }
      : {}),
    ...(maxCourses !== undefined
      ? { maxCourses }
      : {}),
    ...(maxTeamMembers !== undefined
      ? { maxTeamMembers }
      : {}),
    ...(trialDurationDays !== undefined
      ? { trialDurationDays }
      : {}),
  };
}

function validateFeatureDrafts(features: FeatureDraft[]) {
  const preparedFeatures = features
    .map((feature) => ({
      ...feature,
      name: feature.name.trim(),
      description: feature.description.trim(),
    }))
    .filter(
      (feature) =>
        feature.name || feature.description
    );

  for (const feature of preparedFeatures) {
    if (!feature.name) {
      throw new Error(
        "Each feature needs a name before saving."
      );
    }
  }

  return preparedFeatures;
}

function FeatureRow({
  feature,
  onChange,
  onRemove,
  removeLabel,
}: {
  feature: FeatureDraft;
  onChange: (
    key: string,
    field: "name" | "description",
    value: string
  ) => void;
  onRemove: (key: string) => void;
  removeLabel: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#dfe6f2] bg-[#fbfcff] p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-[#1f3556]">
            Feature name
          </span>
          <input
            value={feature.name}
            onChange={(event) =>
              onChange(
                feature.key,
                "name",
                event.target.value
              )
            }
            placeholder="Advanced analytics"
            className="h-12 w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-[#1f3556]">
            Description
          </span>
          <input
            value={feature.description}
            onChange={(event) =>
              onChange(
                feature.key,
                "description",
                event.target.value
              )
            }
            placeholder="Optional detail for school owners"
            className="h-12 w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onRemove(feature.key)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#ffd9d9] px-4 text-[15px] font-semibold text-[#d03b4f]"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            {removeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionPlanEditor({
  mode,
  planId,
}: SubscriptionPlanEditorProps) {
  const router = useRouter();
  const { session, isHydrated } = useAuthSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("monthly");
  const [maxStudents, setMaxStudents] = useState("");
  const [maxCourses, setMaxCourses] = useState("");
  const [maxTeamMembers, setMaxTeamMembers] =
    useState("");
  const [trialDurationDays, setTrialDurationDays] =
    useState("");
  const [isActive, setIsActive] = useState(true);
  const [features, setFeatures] = useState<
    FeatureDraft[]
  >([emptyFeatureDraft()]);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isLoadingPlan, setIsLoadingPlan] =
    useState(mode === "edit");
  const [loadError, setLoadError] = useState<
    string | null
  >(null);
  const [loadedPlan, setLoadedPlan] =
    useState<SubscriptionPlan | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (mode !== "edit") {
      setIsLoadingPlan(false);
      return;
    }

    if (!isHydrated) {
      return;
    }

    const authToken = session?.token;

    if (!authToken) {
      setIsLoadingPlan(false);
      return;
    }

    if (!planId) {
      setLoadError("Select a plan from subscriptions first.");
      setIsLoadingPlan(false);
      return;
    }

    let isCancelled = false;

    async function loadPlan() {
      setIsLoadingPlan(true);
      setLoadError(null);

      try {
        const response = await apiRequest<
          ApiEnvelope<unknown>
        >(endpoints.subscriptions.adminPlans, {
          authToken,
        });

        if (isCancelled) {
          return;
        }

        const plans =
          parseSubscriptionPlanList(response);
        const plan =
          plans.find((item) => item.id === planId) ??
          null;

        if (!plan) {
          setLoadError("The selected plan could not be found.");
          setLoadedPlan(null);
          return;
        }

        setLoadedPlan(plan);
        setName(plan.name);
        setDescription(plan.description ?? "");
        setPrice(String(plan.price || ""));
        setInterval(
          plan.interval === "annually"
            ? "annually"
            : "monthly"
        );
        setMaxStudents(toInputValue(plan.maxStudents));
        setMaxCourses(toInputValue(plan.maxCourses));
        setMaxTeamMembers(
          toInputValue(plan.maxTeamMembers)
        );
        setTrialDurationDays(
          toInputValue(plan.trialDurationDays)
        );
        setIsActive(plan.isActive);
        setFeatures(
          plan.features.length
            ? plan.features.map((feature) =>
                createFeatureDraft(feature)
              )
            : [emptyFeatureDraft()]
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load plan."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingPlan(false);
        }
      }
    }

    loadPlan();

    return () => {
      isCancelled = true;
    };
  }, [
    isHydrated,
    mode,
    planId,
    reloadKey,
    session?.token,
  ]);

  function handleFeatureChange(
    key: string,
    field: "name" | "description",
    value: string
  ) {
    setFeatures((current) =>
      current.map((feature) =>
        feature.key === key
          ? { ...feature, [field]: value }
          : feature
      )
    );
  }

  function handleRemoveFeature(key: string) {
    setFeatures((current) => {
      if (current.length === 1) {
        return [emptyFeatureDraft()];
      }

      return current.filter(
        (feature) => feature.key !== key
      );
    });
  }

  async function handleSubmit() {
    if (!session?.token) {
      toast.error("Sign in again to manage plans.");
      return;
    }

    const authToken = session.token;

    let planPayload: ReturnType<typeof buildPlanPayload>;
    let preparedFeatures: ReturnType<
      typeof validateFeatureDrafts
    >;

    try {
      planPayload = buildPlanPayload({
        name,
        description,
        price,
        interval,
        maxStudents,
        maxCourses,
        maxTeamMembers,
        trialDurationDays,
      });
      preparedFeatures = validateFeatureDrafts(
        features
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Review the plan fields and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const response = await apiRequest<
          ApiEnvelope<unknown>
        >(endpoints.subscriptions.createPlan, {
          method: "POST",
          authToken,
          body: planPayload,
        });

        const createdPlan =
          parseSubscriptionPlan(response.data) ??
          parseSubscriptionPlan(response);

        if (!createdPlan?.id) {
          throw new Error(
            "Plan was created but no plan ID was returned."
          );
        }

        if (!isActive) {
          await apiRequest(
            endpoints.subscriptions.updatePlan(
              createdPlan.id
            ),
            {
              method: "PUT",
              authToken,
              body: {
                isActive: false,
              },
            }
          );
        }

        const featureResults =
          await Promise.allSettled(
            preparedFeatures.map((feature) =>
              apiRequest(
                endpoints.subscriptions.addFeature(
                  createdPlan.id
                ),
                {
                  method: "POST",
                  authToken,
                  body: {
                    name: feature.name,
                    ...(feature.description
                      ? {
                          description:
                            feature.description,
                        }
                      : {}),
                  },
                }
              )
            )
          );

        const failedFeatureCount =
          featureResults.filter(
            (result) => result.status === "rejected"
          ).length;

        if (failedFeatureCount > 0) {
          toast.error(
            `Plan created, but ${failedFeatureCount} feature change(s) failed.`
          );
          router.replace(
            `/subscriptions/edit-plan?planId=${createdPlan.id}`
          );
          return;
        }

        toast.success("Plan created successfully.");
        router.replace("/subscriptions");
        return;
      }

      if (!loadedPlan?.id) {
        throw new Error("Reload the plan and try again.");
      }

      await apiRequest(
        endpoints.subscriptions.updatePlan(
          loadedPlan.id
        ),
        {
          method: "PUT",
          authToken,
          body: {
            ...planPayload,
            isActive,
          },
        }
      );

      const featuresToDelete = loadedPlan.features.filter(
        (feature) => {
          const currentVersion =
            preparedFeatures.find(
              (item) => item.id === feature.id
            );

          if (!currentVersion) {
            return true;
          }

          return (
            currentVersion.name !==
              (currentVersion.originalName ?? "") ||
            currentVersion.description !==
              (currentVersion.originalDescription ?? "")
          );
        }
      );

      const featuresToCreate = preparedFeatures.filter(
        (feature) =>
          !feature.id ||
          feature.name !==
            (feature.originalName ?? "") ||
          feature.description !==
            (feature.originalDescription ?? "")
      );

      const deleteResults =
        await Promise.allSettled(
          featuresToDelete.map((feature) =>
            apiRequest(
              endpoints.subscriptions.removeFeature(
                loadedPlan.id,
                feature.id
              ),
              {
                method: "DELETE",
                authToken,
              }
            )
          )
        );

      const createResults =
        await Promise.allSettled(
          featuresToCreate.map((feature) =>
            apiRequest(
              endpoints.subscriptions.addFeature(
                loadedPlan.id
              ),
              {
                method: "POST",
                authToken,
                body: {
                  name: feature.name,
                  ...(feature.description
                    ? {
                        description:
                          feature.description,
                      }
                    : {}),
                },
              }
            )
          )
        );

      const failedChangeCount = [
        ...deleteResults,
        ...createResults,
      ].filter((result) => result.status === "rejected")
        .length;

      if (failedChangeCount > 0) {
        toast.error(
          `Plan updated, but ${failedChangeCount} feature change(s) failed.`
        );
      } else {
        toast.success("Plan updated successfully.");
      }

      setReloadKey((current) => current + 1);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save plan."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const saveLabel =
    mode === "create"
      ? isSubmitting
        ? "Publishing..."
        : "Publish Plan"
      : isSubmitting
        ? "Saving..."
        : "Save Plan";

  if (!isHydrated) {
    return (
      <AppShell
        title={
          mode === "create"
            ? "Create New Plan"
            : "Edit Subscription Plan"
        }
        activeSection="subscriptions"
      >
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#4b8a60]" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={
        mode === "create"
          ? "Create New Plan"
          : "Edit Subscription Plan"
      }
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto ">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              {mode === "create"
                ? "Create Subscription Plan"
                : "Edit Subscription Plan"}
            </h1>
            <p className="mt-3 max-w-[760px] text-[17px] leading-7 text-[#465b7d]">
              Manage pricing, limits, trial days, and the feature bullets school owners see
              during subscription checkout.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/subscriptions"
              className="inline-flex h-14 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4b8a60]"
            >
              Back to Plans
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (mode === "edit" && isLoadingPlan)
              }
              className="button-primary inline-flex h-14 items-center justify-center rounded-[12px] bg-[#4b8a60] px-8 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              {saveLabel}
            </button>
          </div>
        </div>

        {!session?.token ? (
          <section className="mt-8 rounded-[22px] border border-[#ffe1c8] bg-[#fff8f1] px-6 py-5 text-[15px] text-[#8c5b18]">
            Sign in with a super admin account to manage subscription plans.
          </section>
        ) : null}

        {loadError ? (
          <section className="mt-8 rounded-[22px] border border-[#ffd9d9] bg-[#fff4f4] px-6 py-5 text-[15px] text-[#d03b4f]">
            {loadError}
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_380px]">
          <div className="space-y-6">
            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Plan Details
                </h2>
                {isLoadingPlan ? (
                  <LoaderCircle className="h-5 w-5 animate-spin text-[#4b8a60]" />
                ) : null}
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Plan name
                  </span>
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Basic Plan"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Perfect for small schools just getting started"
                    className="w-full rounded-[16px] border border-[#d7deee] bg-white px-5 py-4 text-[16px] leading-7 text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Price (NGN)
                  </span>
                  <input
                    inputMode="numeric"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    placeholder="5000"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Billing interval
                  </span>
                  <select
                    value={interval}
                    onChange={(event) =>
                      setInterval(
                        event.target.value
                      )
                    }
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none"
                  >
                    <option value="monthly">
                      Monthly
                    </option>
                    <option value="annually">
                      Annually
                    </option>
                  </select>
                </label>
              </div>
            </article>

            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Access Limits
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Max students
                  </span>
                  <input
                    inputMode="numeric"
                    value={maxStudents}
                    onChange={(event) =>
                      setMaxStudents(
                        event.target.value
                      )
                    }
                    placeholder="100"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Max courses
                  </span>
                  <input
                    inputMode="numeric"
                    value={maxCourses}
                    onChange={(event) =>
                      setMaxCourses(
                        event.target.value
                      )
                    }
                    placeholder="10"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Max team members
                  </span>
                  <input
                    inputMode="numeric"
                    value={maxTeamMembers}
                    onChange={(event) =>
                      setMaxTeamMembers(
                        event.target.value
                      )
                    }
                    placeholder="5"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[16px] font-bold text-[#19355d]">
                    Trial duration (days)
                  </span>
                  <input
                    inputMode="numeric"
                    value={trialDurationDays}
                    onChange={(event) =>
                      setTrialDurationDays(
                        event.target.value
                      )
                    }
                    placeholder="14"
                    className="h-[58px] w-full rounded-[16px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                </label>
              </div>
            </article>

            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                    Plan Features
                  </h2>
                  <p className="mt-2 text-[15px] text-[#5f7290]">
                    These are saved through the dedicated `/features` endpoints.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFeatures((current) => [
                      ...current,
                      emptyFeatureDraft(),
                    ])
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#edf5f1] px-4 text-[15px] font-semibold text-[#0f8751]"
                >
                  <CirclePlus className="h-4 w-4" strokeWidth={2.1} />
                  Add Feature
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {features.map((feature) => (
                  <FeatureRow
                    key={feature.key}
                    feature={feature}
                    onChange={handleFeatureChange}
                    onRemove={handleRemoveFeature}
                    removeLabel={
                      feature.id
                        ? "Remove"
                        : "Delete"
                    }
                  />
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#edf5f1] text-[#0f8751]">
                  <BadgeCheck
                    className="h-5 w-5"
                    strokeWidth={2.1}
                  />
                </span>
                <div>
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                    Preview
                  </p>
                  <p className="text-[14px] text-[#7c8ba3]">
                    Matches the backend plan payload.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#1e2e49]">
                      {name.trim() || "Untitled Plan"}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#5f7290]">
                      {description.trim() ||
                        "No description yet."}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1.5 text-[13px] font-bold",
                      isActive
                        ? "bg-[#e8f7ee] text-[#0a8a54]"
                        : "bg-[#fff0f0] text-[#d03b4f]",
                    ].join(" ")}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-[52px] font-extrabold leading-none tracking-[-0.08em] text-[#101d31]">
                    {formatCurrency(Number(price) || 0)}
                  </span>
                  <span className="pb-2 text-[18px] text-[#6c7f9b]">
                    {formatIntervalLabel(interval)}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {[
                  [
                    "Students",
                    maxStudents.trim() || "Not limited",
                  ],
                  [
                    "Courses",
                    maxCourses.trim() || "Not limited",
                  ],
                  [
                    "Team members",
                    maxTeamMembers.trim() ||
                      "Not limited",
                  ],
                  [
                    "Trial period",
                    trialDurationDays.trim()
                      ? `${trialDurationDays} days`
                      : "No trial",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[14px] bg-[#f6f8fd] px-4 py-3"
                  >
                    <span className="text-[14px] font-medium text-[#5f7290]">
                      {label}
                    </span>
                    <span className="text-[14px] font-bold text-[#173257]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#97a6be]">
                    Feature bullets
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setIsActive((current) => !current)
                    }
                    className={[
                      "inline-flex h-9 items-center rounded-full px-4 text-[13px] font-bold",
                      isActive
                        ? "bg-[#e8f7ee] text-[#0a8a54]"
                        : "bg-[#fff0f0] text-[#d03b4f]",
                    ].join(" ")}
                  >
                    {isActive
                      ? "Visible to schools"
                      : "Hidden from schools"}
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {features.some(
                    (feature) =>
                      feature.name.trim() ||
                      feature.description.trim()
                  ) ? (
                    features
                      .filter(
                        (feature) =>
                          feature.name.trim() ||
                          feature.description.trim()
                      )
                      .map((feature) => (
                        <div
                          key={feature.key}
                          className="rounded-[14px] border border-[#e3e9f4] px-4 py-3"
                        >
                          <p className="text-[15px] font-bold text-[#173257]">
                            {feature.name.trim() ||
                              "Untitled feature"}
                          </p>
                          {feature.description.trim() ? (
                            <p className="mt-1 text-[14px] leading-6 text-[#5f7290]">
                              {feature.description.trim()}
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
            </article>

            {mode === "edit" && loadedPlan?.paystackPlanCode ? (
              <article className="rounded-[22px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
                <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#97a6be]">
                  Paystack plan code
                </p>
                <p className="mt-3 break-all text-[18px] font-extrabold text-[#16345d]">
                  {loadedPlan.paystackPlanCode}
                </p>
              </article>
            ) : null}
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
