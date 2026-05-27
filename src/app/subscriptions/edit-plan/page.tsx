"use client";

import { useSearchParams } from "next/navigation";
import { SubscriptionPlanEditor } from "@/components/subscription-plan-editor";

export default function EditSubscriptionPlanPage() {
  const searchParams = useSearchParams();

  return (
    <SubscriptionPlanEditor
      mode="edit"
      planId={searchParams.get("planId")}
    />
  );
}
