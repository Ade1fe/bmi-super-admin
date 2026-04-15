import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  CircleDot,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

function InputField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label>
      <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <input
        readOnly
        value={value}
        className="h-[60px] w-full rounded-[10px] border border-[#d9e0ef] bg-white px-5 text-[15px] text-[#264267] outline-none"
      />
    </label>
  );
}

export default function StudentEditPage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/students" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Individual Students</span>
        </div>
      }
      activeSection="student"
    >
      <div className="mx-auto max-w-[1150px]">
        <section>
          <h1 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[32px]">
            Edit Profile
          </h1>
          <p className="mt-3 text-[16px] text-[#304a72] sm:text-[18px]">
            Update details for Student ID: <span className="font-bold text-[#4659d8]">STU-88291</span>
          </p>
        </section>

        <section className="mt-10 rounded-[14px] bg-white p-8 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-10">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
            Personal Information
          </h2>

          <div className="mt-10 grid gap-x-12 gap-y-7 md:grid-cols-2">
            <InputField label="Full Name" value="Alexander Thompson" />
            <InputField label="Email Address" value="alex.thompson@example.com" />
            <InputField label="Student ID" value="STU-88291" />

            <label>
              <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                Class / Cohort
              </span>
              <div className="relative">
                <input
                  readOnly
                  value="Data Science Intensive"
                  className="h-[60px] w-full rounded-[10px] border border-[#d9e0ef] bg-white px-5 pr-12 text-[15px] text-[#264267] outline-none"
                />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8ea0bf]" />
              </div>
            </label>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr_310px]">
          <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
              Account Status
            </h2>

            <div className="mt-8 rounded-[12px] bg-[#f2efff] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[16px] font-extrabold text-[#1b2d4b]">Active Status</p>
                  <p className="mt-3 text-[15px] text-[#7b88a1]">Student can access materials</p>
                </div>
                <div className="flex h-10 w-[72px] items-center rounded-full bg-[#0f8751] px-1">
                  <span className="ml-auto h-8 w-8 rounded-full bg-white shadow-[0_6px_14px_rgba(15,135,81,0.18)]" />
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
              Subscription Plan
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4 rounded-[12px] border border-[#5a6fff] bg-[#f2f0ff] px-5 py-5">
                <CircleDot className="mt-1 h-6 w-6 shrink-0 text-[#4257de]" strokeWidth={2.3} />
                <div className="flex-1">
                  <p className="text-[18px] font-extrabold text-[#1b2d4b]">Premium Plan</p>
                  <p className="mt-1 text-[15px] text-[#7b88a1]">$49.00 / month</p>
                </div>
                <div className="rounded-full bg-[#eef1ff] p-2 text-[#4257de]">
                  <Save className="h-4.5 w-4.5" strokeWidth={2.1} />
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-[12px] border border-[#dfe4f4] bg-white px-5 py-5">
                <span className="mt-1 h-6 w-6 rounded-full border-2 border-[#7f8cab]" />
                <div>
                  <p className="text-[18px] font-extrabold text-[#1b2d4b]">Free Plan</p>
                  <p className="mt-1 text-[15px] text-[#7b88a1]">Limited access</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] bg-white p-6 text-center shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
            <div className="mx-auto flex h-[138px] w-[138px] items-center justify-center rounded-full bg-[#dcd2ff] text-[64px]">
              🙂
            </div>
            <div className="mt-8 rounded-full bg-[#edf1ff] p-2 text-[#5d73ff] inline-flex">
              <Camera className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
              Change Photo
            </h2>
            <p className="mt-3 text-[16px] text-[#4b8a60]">PNG or JPG, max 5MB</p>
          </article>
        </section>

        <section className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-[64px] w-full items-center justify-center rounded-[10px] border border-[#cbdccd] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4a8b61] sm:w-auto"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className="button-primary inline-flex h-[64px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-9 text-[16px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] sm:w-auto"
          >
            <Save className="h-4.5 w-4.5" strokeWidth={2.2} />
            Save Changes
          </button>
        </section>
      </div>
    </AppShell>
  );
}
