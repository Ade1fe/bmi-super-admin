import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Cylinder,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSchoolStepper } from "@/components/create-school-stepper";

const infoCards = [
  {
    title: "Automated Setup",
    detail:
      "Once submitted, the admin will receive an invitation email to set their first password.",
    icon: BadgeInfo,
  },
  {
    title: "Security Check",
    detail: "Admin emails must be unique across the platform for authentication purposes.",
    icon: ShieldCheck,
  },
  {
    title: "Data Residency",
    detail: "School data is hosted in the region corresponding to the selected country.",
    icon: Cylinder,
  },
];

function InputField({
  label,
  placeholder,
  fullWidth,
}: {
  label: string;
  placeholder: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={fullWidth ? "col-span-full" : ""}>
      <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <input
        defaultValue={placeholder}
        className="h-[62px] w-full rounded-2xl border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267] outline-none"
      />
    </label>
  );
}

export default function CreateSchoolPage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/schools" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Create New School</span>
        </div>
      }
      activeSection="schools"
    >
      <div className="mx-auto max-w-[1120px]">
        <CreateSchoolStepper currentStep={1} />

        <section className="mt-10 text-center sm:mt-14">
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#162f54] sm:text-[42px]">
            New Institution Setup
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-[16px] leading-7 text-[#667792] sm:text-[18px] sm:leading-8">
            Onboarding Process for new institution
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-[960px] rounded-[24px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-10">
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#182f53] sm:text-[22px]">
            Step 1: School Details
          </h2>
          <p className="mt-2 text-[16px] text-[#71819d]">
            Enter the core administrative information for the school.
          </p>

          <div className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2">
            <InputField label="School Name" placeholder="e.g. St. Andrews Academy" fullWidth />
            <InputField label="Admin Name" placeholder="e.g. Jane Doe" />
            <InputField label="Admin Email" placeholder="e.g. STU-2024-001" />
            <InputField label="Admin Email" placeholder="e.g. Jane Doe" />
            <InputField label="Student Limit" placeholder="e.g. STU-2024-001" />
          </div>

          <div className="mt-12 flex flex-col justify-end gap-4 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-[62px] w-full items-center justify-center rounded-2xl border border-[#cadfd5] bg-[#edf5f1] px-10 text-[16px] font-semibold text-[#4a8a60] sm:w-auto"
            >
              Cancel
            </button>
            <Link
              href="/schools/create-school/subscription"
              className="button-primary inline-flex h-[62px] w-full items-center justify-center gap-3 rounded-2xl bg-[#4b8a60] px-10 text-[16px] font-semibold text-white sm:w-auto"
            >
              Continue to Step 2
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-[960px] gap-5 md:grid-cols-3">
          {infoCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-[22px] border border-[#dfe4f4] bg-[#f8f9ff] px-6 py-6 shadow-[0_12px_28px_rgba(182,192,227,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <Icon className="mt-1 h-6 w-6 text-[#4659d8]" strokeWidth={2.1} />
                  <div>
                    <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#4659d8]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[16px] leading-7 text-[#6d7d98]">{card.detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
