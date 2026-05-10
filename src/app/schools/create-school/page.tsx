"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeInfo, Cylinder, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSchoolStepper } from "@/components/create-school-stepper";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { persistSchoolOnboardingDraft } from "@/lib/school-onboarding";

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
  value,
  onChange,
  type = "text",
  fullWidth,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  fullWidth?: boolean;
}) {
  return (
    <label className={fullWidth ? "col-span-full" : ""}>
      <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[62px] w-full rounded-2xl border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267] outline-none placeholder:text-[#91a0b8]"
      />
    </label>
  );
}

export default function CreateSchoolPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [country, setCountry] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled =
    !schoolName.trim() ||
    !country.trim() ||
    !adminFirstName.trim() ||
    !adminLastName.trim() ||
    !adminEmail.trim() ||
    !password.trim() ||
    isSubmitting;

  const handleContinue = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await apiRequest(endpoints.schools.register, {
        method: "POST",
        body: {
          school_name: schoolName.trim(),
          country: country.trim(),
          admin_first_name: adminFirstName.trim(),
          admin_last_name: adminLastName.trim(),
          admin_email: adminEmail.trim().toLowerCase(),
          password,
        },
      });

      persistSchoolOnboardingDraft({
        schoolName: schoolName.trim(),
        country: country.trim(),
        adminFirstName: adminFirstName.trim(),
        adminLastName: adminLastName.trim(),
        adminEmail: adminEmail.trim().toLowerCase(),
      });

      router.push("/schools/create-school/subscription");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create school.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <InputField
              label="School Name"
              placeholder="e.g. St. Andrews Academy"
              value={schoolName}
              onChange={setSchoolName}
              fullWidth
            />
            <InputField
              label="Country"
              placeholder="e.g. Nigeria"
              value={country}
              onChange={setCountry}
            />
            <InputField
              label="Admin Email"
              placeholder="e.g. admin@school.com"
              value={adminEmail}
              onChange={setAdminEmail}
              type="email"
            />
            <InputField
              label="Admin First Name"
              placeholder="e.g. Jane"
              value={adminFirstName}
              onChange={setAdminFirstName}
            />
            <InputField
              label="Admin Last Name"
              placeholder="e.g. Doe"
              value={adminLastName}
              onChange={setAdminLastName}
            />
            <InputField
              label="Temporary Password"
              placeholder="Create a secure password"
              value={password}
              onChange={setPassword}
              type="password"
              fullWidth
            />
          </div>

          {errorMessage ? <p className="mt-6 text-[14px] font-medium text-[#cf3f4f]">{errorMessage}</p> : null}

          <div className="mt-12 flex flex-col justify-end gap-4 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-[62px] w-full items-center justify-center rounded-2xl border border-[#cadfd5] bg-[#edf5f1] px-10 text-[16px] font-semibold text-[#4a8a60] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitDisabled}
              className="button-primary inline-flex h-[62px] w-full items-center justify-center gap-3 rounded-2xl bg-[#4b8a60] px-10 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Continue to Step 2"}
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
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
