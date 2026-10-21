import { SubscriptionPlanEditor } from "@/components/subscription-plan-editor";

type CreatePlanPageProps = {
  searchParams: Promise<{
    audience?: string | string[];
  }>;
};

export default async function CreateSubscriptionPlanPage({
  searchParams,
}: CreatePlanPageProps) {
  const { audience } = await searchParams;
  const rawAudience = Array.isArray(audience) ? audience[0] : audience;

  return (
    <SubscriptionPlanEditor
      mode="create"
      initialAudience={rawAudience === "student" ? "student" : "school"}
    />
  );
}
