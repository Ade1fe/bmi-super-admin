import { SubscriptionPlanEditor } from "@/components/subscription-plan-editor";

type EditPlanPageProps = {
  searchParams: Promise<{
    planId?: string | string[];
  }>;
};

export default async function EditSubscriptionPlanPage({
  searchParams,
}: EditPlanPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPlanId = resolvedSearchParams.planId;
  const planId =
    typeof rawPlanId === "string"
      ? rawPlanId
      : Array.isArray(rawPlanId)
        ? rawPlanId[0] ?? null
        : null;

  return (
    <SubscriptionPlanEditor
      mode="edit"
      planId={planId}
    />
  );
}
