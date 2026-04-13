import { Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";

function Field({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={fullWidth ? "col-span-full" : ""}>
      <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
        {label}
      </span>
      <input
        readOnly
        value={value}
        className="h-[60px] w-full rounded-2xl border border-[#d9e0ef] bg-white px-5 text-[15px] text-[#264267] outline-none"
      />
    </label>
  );
}

export default function EditSchoolProfilePage() {
  return (
    <AppShell title="Schools Management" activeSection="schools">
      <div className="mx-auto max-w-[936px]">
        <section>
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#16345d]">
            Edit School Profile
          </h1>
          <p className="mt-3 text-[18px] text-[#304a72]">
            Update your personal information, profile photo, and social presence.
          </p>
        </section>

        <section className="mt-10 rounded-[22px] bg-white p-8 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex h-[168px] w-[168px] shrink-0 items-center justify-center rounded-full bg-[#5c7837] text-center text-white shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
              <div>
                <p className="text-[14px] font-semibold tracking-[0.18em]">GREENFIELD</p>
                <p className="text-[10px] opacity-80">International Day School</p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
                School Logo
              </h2>
              <p className="mt-2 text-[16px] italic text-[#8ea0bf]">
                PNG or JPG up to 5MB. Recommended size 400x400px.
              </p>

              <div className="mt-5 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="inline-flex h-14 items-center rounded-2xl bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#0f8751]"
                >
                  Upload New
                </button>
                <button
                  type="button"
                  className="inline-flex h-14 items-center rounded-2xl bg-[#f2f3f5] px-8 text-[15px] font-semibold text-[#66686f]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[22px] bg-white p-8 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-10">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17345d]">
            School Details
          </h2>

          <div className="mt-10 grid gap-x-5 gap-y-7 md:grid-cols-2">
            <Field label="School Name" value="International Academy of Arts" />
            <Field label="Country" value="United States" />
            <Field label="Administrator Name" value="James Wilson" />
            <Field label="Administrator Email" value="j.wilson@academy.edu" />

            <label className="col-span-full">
              <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                School Address
              </span>
              <textarea
                readOnly
                value="123 Education Plaza, University District, Seattle, WA 98105, United States"
                className="min-h-[176px] w-full rounded-2xl border border-[#d9e0ef] bg-white px-5 py-5 text-[15px] text-[#264267] outline-none"
              />
            </label>
          </div>
        </section>

        <section className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-[64px] items-center justify-center rounded-2xl border border-[#cbdccd] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4a8b61]"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className="inline-flex h-[64px] items-center justify-center gap-3 rounded-2xl bg-[#4b8a60] px-9 text-[16px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
          >
            <Save className="h-4.5 w-4.5" strokeWidth={2.2} />
            Save Changes
          </button>
        </section>
      </div>
    </AppShell>
  );
}
