"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCheck,
  CircleCheckBig,
  FileSpreadsheet,
  Link as LinkIcon,
  LockKeyhole,
  Mail,
  NotebookPen,
  TriangleAlert,
  UploadCloud,
  UserRoundPlus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type StudentTab = "manual" | "csv" | "invite";

const tabs: {
  key: StudentTab;
  label: string;
  icon: typeof NotebookPen;
}[] = [
  { key: "manual", label: "Manual Entry", icon: NotebookPen },
  { key: "csv", label: "Bulk CSV Upload", icon: FileSpreadsheet },
  { key: "invite", label: "Invite Link", icon: LinkIcon },
];

const metrics = [
  { label: "Total Students", value: "1,284", note: "+12 this week", noteClassName: "text-[#0f8a4f]" },
  { label: "Pending Invites", value: "42", note: "Sent via invite link", noteClassName: "text-[#90a1bf]" },
  { label: "Last Upload", value: "Oct 12", note: "128 students added", noteClassName: "text-[#90a1bf]" },
];

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof NotebookPen;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-[74px] items-center justify-center gap-3 px-6 text-[15px] font-semibold transition-colors",
        active ? "text-[#0f8751]" : "text-[#657695]",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" strokeWidth={2.2} />
      {label}
      {active ? <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#0f8751]" /> : null}
    </button>
  );
}

function StudentSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute top-[18%] flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white">
          <button type="button" onClick={onClose} aria-label="Close success modal">
            <X className="h-7 w-7" strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative w-full max-w-[600px] rounded-[34px] bg-white px-6 py-8 shadow-[0_40px_120px_rgba(27,43,77,0.22)] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
            <div className="relative h-40 w-40">
              <div className="absolute left-8 top-7 h-4 w-4 rounded-full bg-[#f2f6f7]" />
              <div className="absolute left-14 top-0 text-[#ffdb9f]">*</div>
              <div className="absolute left-20 top-6 text-[#ffdb9f]">*</div>
              <div className="absolute right-7 top-14 h-6 w-6 rounded-full bg-[#a9d5cb]" />
              <div className="absolute right-20 top-0 h-2.5 w-2.5 rounded-full bg-[#83bcb0]" />
              <div className="absolute right-9 top-34 h-2 w-2 rounded-full bg-[#9fd0c6]" />
              <div className="absolute left-20 top-9">
                <CheckCheck className="h-24 w-24 text-[#131313]" strokeWidth={2.2} />
              </div>
              <div className="absolute right-10 top-8 rounded-full border-[6px] border-[#46c7cf] bg-white p-1">
                <CircleCheckBig className="h-5 w-5 text-[#46c7cf]" strokeWidth={2.6} />
              </div>
            </div>
          </div>

          <div className="pt-36 text-center">
            <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#152f56]">
              School Workspace Active
            </h2>
            <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-7 text-[#667792]">
              Congratulations! Your school&apos;s digital environment is ready to use. You can now start adding teachers,
              students, and courses.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="rounded-[18px] bg-[#fbfdff] p-5 shadow-[0_8px_24px_rgba(183,194,230,0.12)]">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#f4f7f2] p-4 text-[#0f8751]">
                  <Mail className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#19355d]">Welcome Emails Sent</h3>
                  <p className="mt-1 text-[15px] leading-6 text-[#92a2bd]">
                    Login instructions and temporary credentials have been dispatched to all 15 students.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 text-[15px] font-bold text-[#0f8751]">
                    <CircleCheckBig className="h-4 w-4" strokeWidth={2.4} />
                    Delivered
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#fbfdff] p-5 shadow-[0_8px_24px_rgba(183,194,230,0.12)]">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#f4f7f2] p-4 text-[#0f8751]">
                  <FileSpreadsheet className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#19355d]">Profile Setup Complete</h3>
                  <p className="mt-1 text-[15px] leading-6 text-[#92a2bd]">
                    All personal records, course enrollments, and ID numbers have been generated.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 text-[15px] font-bold text-[#0f8751]">
                    <CircleCheckBig className="h-4 w-4" strokeWidth={2.4} />
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/schools/greenfield-schools"
              className="flex h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#cadfd5] bg-[#edf5f1] text-[16px] font-semibold text-[#4a8a60]"
            >
              <UserRoundPlus className="h-5 w-5" strokeWidth={2.2} />
              View Student Directory
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[62px] w-full items-center justify-center gap-3 rounded-2xl bg-[#4b8a60] text-[16px] font-semibold text-white"
            >
              <UserRoundPlus className="h-5 w-5" strokeWidth={2.2} />
              Add More Students
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AddStudentsPage() {
  const [activeTab, setActiveTab] = useState<StudentTab>("manual");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <AppShell title="Schools Management" activeSection="schools">
      {showSuccessModal ? <StudentSuccessModal onClose={() => setShowSuccessModal(false)} /> : null}

      <div className="mx-auto max-w-[1020px]">
        <section>
          <h1 className="text-[32px] font-extrabold tracking-[-0.05em] text-[#16345d]">
            Add New Students
          </h1>
          <p className="mt-3 text-[18px] text-[#304a72]">
            Expand your school community by adding students manually, via bulk upload, or secure invitation.
          </p>
        </section>

        <section className="mt-10 rounded-[22px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
          <div className="grid border-b border-[#e4e8f4] sm:grid-cols-3">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                label={tab.label}
                icon={tab.icon}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          {activeTab === "manual" ? (
            <div className="p-6 sm:p-10">
              <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
                <label>
                  <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                    Full Name
                  </span>
                  <input
                    defaultValue="e.g. Jane Doe"
                    className="h-[60px] w-full rounded-2xl border border-[#d9e0ef] px-5 text-[15px] text-[#264267] outline-none"
                  />
                </label>

                <label>
                  <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                    Student ID
                  </span>
                  <input
                    defaultValue="e.g. STU-2024-001"
                    className="h-[60px] w-full rounded-2xl border border-[#d9e0ef] px-5 text-[15px] text-[#264267] outline-none"
                  />
                </label>

                <label className="col-span-full">
                  <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                    Email Address
                  </span>
                  <textarea
                    defaultValue="student@greenwood.edu"
                    className="min-h-[142px] w-full rounded-2xl border border-[#d9e0ef] px-5 py-4 text-[15px] text-[#264267] outline-none"
                  />
                </label>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(true)}
                  className="inline-flex h-[64px] items-center gap-3 rounded-2xl bg-[#4b8a60] px-9 text-[16px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
                >
                  <UserRoundPlus className="h-5 w-5" strokeWidth={2.2} />
                  Add Student
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "csv" ? (
            <div className="p-6 sm:p-10">
              <div className="rounded-[24px] border-2 border-dashed border-[#a8d7c5] bg-[#f4fbf8] px-6 py-12 text-center sm:px-10 sm:py-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#118755] shadow-[0_8px_24px_rgba(17,135,85,0.08)]">
                  <UploadCloud className="h-7 w-7" strokeWidth={2} />
                </div>
                <h2 className="mt-6 text-[18px] font-extrabold tracking-[-0.03em] text-[#192e4c]">
                  Drag and drop your CSV file here
                </h2>
                <p className="mt-3 text-[16px] text-[#7d8daa]">Maximum file size: 10MB</p>
                <button
                  type="button"
                  className="mt-8 inline-flex h-14 items-center rounded-2xl border border-[#c9dfd6] bg-white px-7 text-[16px] font-semibold text-[#0f8751]"
                >
                  Browse Files
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-4 text-[16px] text-[#7d8daa] sm:flex-row sm:items-center sm:justify-between">
                <p>Need the standard format?</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 font-semibold text-[#0f8751]"
                >
                  <FileSpreadsheet className="h-5 w-5" strokeWidth={2.1} />
                  Download CSV Template
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "invite" ? (
            <div className="p-6 sm:p-10">
              <p className="text-[18px] text-[#627492]">
                Send this secure link to students. They will be prompted to create their own account details.
              </p>

              <div className="mt-8 flex flex-col gap-4 xl:flex-row">
                <div className="flex h-[72px] flex-1 items-center justify-between rounded-2xl border border-[#bfe0d5] bg-[#f7fbff] px-6 text-[15px] text-[#4362d8]">
                  <span className="truncate">
                    https://greenwood.edu/register?token=gw_2024_ad82xI...
                  </span>
                  <LockKeyhole className="ml-4 h-5 w-5 shrink-0 text-[#91a2bf]" strokeWidth={2} />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#c8ddd4] bg-white px-8 text-[16px] font-semibold text-[#1a2233]"
                  >
                    <FileSpreadsheet className="h-5 w-5" strokeWidth={2.1} />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#c8ddd4] bg-white px-8 text-[16px] font-semibold text-[#1a2233]"
                  >
                    <LinkIcon className="h-5 w-5" strokeWidth={2.1} />
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#f0ca63] bg-[#fffaf0] px-5 py-5 text-[#ad6518]">
                <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={2.2} />
                <p className="text-[16px] font-medium">
                  This link will expire in 48 hours. Regenerating the link will invalidate the current one immediately.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[22px] border border-[#dde3f2] bg-white px-7 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)]"
            >
              <p className="text-[18px] text-[#304a72]">{metric.label}</p>
              <p className="mt-7 text-[52px] font-extrabold tracking-[-0.06em] text-[#18355d]">
                {metric.value}
              </p>
              <p className={`mt-3 text-[16px] font-medium ${metric.noteClassName}`}>{metric.note}</p>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
