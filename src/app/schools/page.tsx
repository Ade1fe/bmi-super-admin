

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  MoreVertical,
  PauseCircle,
  Plus,
  TrendingUp,
  TriangleAlert,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { parseSchoolList, type SchoolSummary } from "@/lib/backend-models";
import { useAuthSession } from "@/lib/auth-session";
import { apiRequest, endpoints } from "@/lib/endpoints";

// const tabs = [
//   { label: "School Setting", active: true },
//   { label: "Support Center" },
//   { label: "Pricing" },
// ];

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 1000 ? 1 : 0,
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value);
}

function formatJoinedDate(value: string | undefined) {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function getInitials(name: string) {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || "SC";
}

function buildSchoolCode(school: SchoolSummary) {
  const normalizedId = school.id.replace(/-/g, "").slice(0, 8).toUpperCase();
  return normalizedId ? `SCH-${normalizedId}` : "SCH-UNKNOWN";
}

function SummaryCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7eafb] bg-white px-6 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:px-10">
      <p className="text-[15px] font-medium text-[#334768]">{label}</p>
      <div className="mt-7 flex items-end justify-between gap-3">
        <p className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
        <span className="inline-flex items-center gap-1 text-[14px] font-bold text-[#14985b]">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.3} />
          Live
        </span>
      </div>
      <p className="mt-3 text-[14px] font-medium text-[#74839d]">{note}</p>
    </article>
  );
}

function SchoolActionMenu({
  schoolId,
  onDeactivate,
  onSuspend,
}: {
  schoolId: string;
  onDeactivate: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="absolute right-4 top-[70px] z-10 hidden w-[258px] rounded-[12px] border border-[#e4e8f4] bg-white p-2.5 shadow-[0_24px_44px_rgba(166,178,214,0.22)] xl:block">
      <Link
        href={`/schools/${schoolId}`}
        className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-[15px] font-medium text-[#5a6986] hover:bg-[#f6f8fd]"
      >
        <PauseCircle className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        View Details
      </Link>

      <button
        type="button"
        onClick={onDeactivate}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <TriangleAlert className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Deactivate School
      </button>

      <button
        type="button"
        onClick={onSuspend}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <PauseCircle className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Suspend School Access
      </button>
    </div>
  );
}

function SuspendSchoolModal({
  school,
  onClose,
  onConfirm,
  isLoading,
}: {
  school: SchoolSummary;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close suspend modal"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20 sm:px-7">
            <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
              Suspend School Access
            </h2>
          </div>

          <div className="space-y-6 px-6 py-7 sm:px-7">
            <div>
              <p className="text-[15px] font-medium text-[#6f7f99]">School to Suspend</p>
              <div className="mt-3 flex items-center gap-3 rounded-[10px] border border-[#e8edf7] bg-[#f6f8ff] px-4 py-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#dfe5ff] text-[#4e63dd]">
                  <Building2 className="h-7 w-7" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                    {school.name}
                  </p>
                  <p className="mt-1 text-[14px] text-[#7a88a2]">ID: {buildSchoolCode(school)}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[15px] font-bold text-[#2f4365]">Reason for Suspension</p>
              <textarea
                defaultValue="Provide a detailed reason for the suspension..."
                className="mt-3 min-h-[116px] w-full rounded-[10px] border border-[#dce3f2] px-5 py-4 text-[16px] text-[#6b7894] outline-none"
              />
              <p className="mt-2 text-[14px] text-[#9aa7bf]">
                Suspending this school will temporarily restrict access.
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-13 items-center justify-center rounded-[10px] border border-[#c8dfd3] bg-white px-6 text-[16px] font-semibold text-[#4b8a60]"
            >
              Cancel
            </button>
<button
  type="button"
  onClick={onConfirm}
  disabled={isLoading}
  className="inline-flex h-13 items-center justify-center rounded-[10px] bg-[#ea8600] px-6 text-[16px] font-semibold text-white shadow-[0_18px_34px_rgba(234,134,0,0.18)] disabled:opacity-60"
>
  {isLoading ? "Processing..." : "Confirm Suspension"}
</button>
          </div>
        </div>
      </div>
    </>
  );
}

function DeactivateSchoolModal({
  school,
  onClose,
  onConfirm,
  isLoading,
}: {
  school: SchoolSummary;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white px-6 py-7 shadow-[0_34px_90px_rgba(15,25,51,0.24)] sm:px-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close deactivate modal"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>

          <div className="flex items-start gap-4 pr-14">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffe9ee] text-[#f04463]">
              <TriangleAlert className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e] sm:text-[24px]">
                Deactivate School Account
              </h2>
              <p className="mt-1 text-[15px] text-[#6f7f99]">
                {school.name} ({buildSchoolCode(school)})
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-[12px] border border-[#ffd7df] bg-[#fff0f3] px-5 py-5 text-[15px] leading-8 text-[#c52c50]">
           This action will permanently deactivate this school account.
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[16px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
       <button
  type="button"
  onClick={onConfirm}
  disabled={isLoading}
  className="inline-flex h-14 items-center justify-center rounded-[10px] bg-[#ef1f4f] px-6 text-[16px] font-semibold text-white shadow-[0_18px_34px_rgba(239,31,79,0.18)] disabled:opacity-60"
>
  {isLoading ? "Processing..." : "Deactivate Permanently"}
</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SchoolsPage() {
  const { session } = useAuthSession();
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolSummary | null>(null);
  const [activeDialog, setActiveDialog] = useState<"suspend" | "deactivate" | null>(null);

  const loadSchools = useCallback(async () => {
  if (!session?.token) {
    setSchools([]);
    setErrorMessage("Sign in to load schools from the backend.");
    setIsLoading(false);
    return;
  }

  try {
    setIsLoading(true);
    setErrorMessage("");

    const response = await apiRequest(endpoints.admin.schools, {
      authToken: session.token,
      cache: "no-store",
    });

    setSchools(parseSchoolList(response));
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to load schools."
    );
  } finally {
    setIsLoading(false);
  }
}, [session?.token]);


useEffect(() => {
  void loadSchools();
}, [loadSchools]);


const handleSuspendSchool = async (schoolId: string) => {
  if (!session?.token) return;

  try {
    setActionLoading(true);

    await apiRequest(
      endpoints.admin.suspendSchool(schoolId),
      {
        method: "PATCH",
        authToken: session.token,
      }
    );

    await loadSchools();

    setActiveDialog(null);
    setSelectedSchool(null);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Failed to suspend school."
    );
  } finally {
    setActionLoading(false);
  }
};

const handleDeactivateSchool = async (schoolId: string) => {
  if (!session?.token) return;

  try {
    setActionLoading(true);

    await apiRequest(
      endpoints.admin.deactivateSchool(schoolId),
      {
        method: "PATCH",
        authToken: session.token,
      }
    );

    await loadSchools();

    setActiveDialog(null);
    setSelectedSchool(null);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Failed to deactivate school."
    );
  } finally {
    setActionLoading(false);
  }
};

const handleActivateSchool = async (schoolId: string) => {
  if (!session?.token) return;

  try {
    setActionLoading(true);

    await apiRequest(
      endpoints.admin.activateSchool(schoolId),
      {
        method: "PATCH",
        authToken: session.token,
      }
    );

    await loadSchools();
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Failed to activate school."
    );
  } finally {
    setActionLoading(false);
  }
};



  const activeSchools = schools.filter((school) => school.isActive).length;
  const totalStudents = schools.reduce((sum, school) => sum + school.population, 0);
  const countriesCovered = new Set(
    schools.map((school) => school.country).filter((country): country is string => Boolean(country)),
  ).size;
  const newestSchool = [...schools]
    .sort((first, second) => (second.createdAt ?? "").localeCompare(first.createdAt ?? ""))[0];
  const totalSchoolAdmins = schools.reduce((sum, school) => sum + school.adminCount, 0);
  const summaryCards = [
    {
      label: "Total Schools",
      value: formatCompactNumber(schools.length),
      note: isLoading ? "Loading from admin/schools..." : "Live count from the backend",
    },
    {
      label: "Active Schools",
      value: formatCompactNumber(activeSchools),
      note: `${Math.max(0, schools.length - activeSchools)} inactive records`,
    },
    {
      label: "Total Students",
      value: formatCompactNumber(totalStudents),
      note: "Summed from each school's population field",
    },
    {
      label: "Countries Covered",
      value: formatCompactNumber(countriesCovered),
      note: "Unique countries represented in connected schools",
    },
  ];


  return (
    <AppShell title="Schools Management" activeSection="schools">
     {activeDialog === "suspend" && selectedSchool ? (
  <SuspendSchoolModal
    school={selectedSchool}
    isLoading={actionLoading}
    onConfirm={() =>
      handleSuspendSchool(selectedSchool.id)
    }
    onClose={() => {
      setActiveDialog(null);
      setSelectedSchool(null);
    }}
  />
) : null}

{activeDialog === "deactivate" && selectedSchool ? (
  <DeactivateSchoolModal
    school={selectedSchool}
    isLoading={actionLoading}
    onConfirm={() =>
      handleDeactivateSchool(selectedSchool.id)
    }
    onClose={() => {
      setActiveDialog(null);
      setSelectedSchool(null);
    }}
  />
) : null}
{/* 
      <section className="rounded-[14px] bg-[#f2f4fb] p-3 sm:p-4">
        <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
          <div className="flex min-w-max items-center gap-3 sm:flex-wrap sm:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={[
                  "inline-flex h-12 shrink-0 items-center gap-3 rounded-[10px] px-4 text-[15px] font-semibold transition-colors",
                  tab.active
                    ? "bg-[#4b8a60] text-white shadow-[0_8px_24px_rgba(75,138,96,0.18)]"
                    : "text-[#606b83]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section> */}

      <section className="mt-8 flex justify-stretch sm:justify-end">
        <Link
          href="/schools/create-school"
          className="button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] [&_svg]:text-white sm:w-auto"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Add New School
        </Link>
      </section>

      <section className="mt-10 grid gap-4 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </section>

      <section className="mt-6 rounded-[20px] border border-[#e4e8f6] bg-white shadow-[0_14px_32px_rgba(182,192,227,0.12)] sm:mt-8 sm:rounded-[24px]">
        <div className="border-b border-[#edf1f7] px-5 py-5 sm:px-7">
          <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Connected Schools</p>
          <p className="mt-2 text-[15px] text-[#667892]">
            {errorMessage
              ? errorMessage
              : isLoading
                ? "Loading school records from the backend."
                : `${schools.length} school record${schools.length === 1 ? "" : "s"} loaded from admin/schools.`}
          </p>
        </div>

        <div className="overflow-hidden p-3 sm:p-4 xl:p-0">
          <div className="xl:overflow-x-auto">
            <table className="w-full border-separate [border-spacing:0_0.85rem] xl:min-w-[1180px] xl:table-fixed xl:[border-spacing:0]">
              <colgroup>
                <col className="xl:w-[300px]" />
                <col className="xl:w-[150px]" />
                <col className="xl:w-[250px]" />
                <col className="xl:w-[120px]" />
                <col className="xl:w-[140px]" />
                <col className="xl:w-[140px]" />
                <col className="xl:w-[160px]" />
                <col className="xl:w-[72px]" />
              </colgroup>

              <thead className="hidden xl:table-header-group">
                <tr className="bg-[#f5f7fb] text-left text-[14px] font-bold uppercase tracking-[0.14em] text-[#70809d]">
                  <th className="rounded-tl-[24px] px-8 py-7">School Name</th>
                  <th className="px-6 py-7">School ID</th>
                  <th className="px-6 py-7">Admin Email</th>
                  <th className="px-6 py-7">Students</th>
                  <th className="px-6 py-7">Country</th>
                  <th className="px-6 py-7">Status</th>
                  <th className="px-6 py-7">Joined Date</th>
                  <th className="rounded-tr-[24px] px-6 py-7" />
                </tr>
              </thead>

              <tbody>
                {schools.map((school) => {
                  const schoolCode = buildSchoolCode(school);
                  const isActive = school.isActive;

                  return (
                    <tr
                      key={school.id}
                      className="block overflow-hidden rounded-[20px] border border-[#edf0f7] bg-[#fbfcff] text-[15px] text-[#6f7d98] shadow-[0_10px_22px_rgba(182,192,227,0.08)] xl:table-row xl:rounded-none xl:border-0 xl:bg-transparent xl:text-[16px] xl:shadow-none"
                    >
                      <td className="block border-b border-[#edf0f7] px-4 py-4 sm:px-5 sm:py-5 xl:table-cell xl:px-8 xl:py-8">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                          School Name
                        </span>

                        <div className="flex min-w-0 items-start gap-3 sm:gap-4 xl:items-center xl:gap-6">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#dfe5ff] text-[15px] font-bold text-[#4055c5] sm:h-11 sm:w-11 sm:text-[17px] xl:h-10 xl:w-10 xl:rounded-[8px]">
                            {getInitials(school.name)}
                          </span>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/schools/${school.id}`}
                              className="block truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e] sm:text-[17px] xl:text-[18px]"
                              title={school.name}
                            >
                              {school.name}
                            </Link>

                            <p className="mt-1 text-[13px] text-[#7f8cab] xl:hidden">
                              ID: {schoolCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="hidden border-b border-[#edf0f7] px-6 py-8 text-[16px] text-[#7f8cab] xl:table-cell">
                        <span className="block truncate" title={`ID: ${schoolCode}`}>
                          ID: {schoolCode}
                        </span>
                      </td>

                      <td className="block border-b border-[#edf0f7] px-4 py-3.5 sm:px-5 sm:py-4 xl:table-cell xl:px-6 xl:py-8">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between xl:block">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                            Admin Email
                          </span>
                          <span
                            className="block break-words text-[14px] text-[#40516f] sm:max-w-[68%] sm:text-right xl:max-w-none xl:truncate xl:text-left xl:text-[16px] xl:text-[#6e7c98] xl:break-normal"
                            title={school.email}
                          >
                            {school.email || "Not available"}
                          </span>
                        </div>
                      </td>

                      <td className="block border-b border-[#edf0f7] px-4 py-3.5 sm:px-5 sm:py-4 xl:table-cell xl:px-6 xl:py-8">
                        <div className="flex items-center justify-between gap-4 xl:block">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                            Students
                          </span>
                          <span className="text-[15px] font-extrabold text-[#121f33] sm:text-[16px] xl:text-[18px]">
                            {formatCompactNumber(school.population)}
                          </span>
                        </div>
                      </td>

                      <td className="block border-b border-[#edf0f7] px-4 py-3.5 sm:px-5 sm:py-4 xl:table-cell xl:px-6 xl:py-8">
                        <div className="flex items-center justify-between gap-4 xl:block">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                            Country
                          </span>
                          <span className="text-[14px] text-[#40516f] sm:text-[15px] xl:text-[16px] xl:text-[#6d7b97]">
                            {school.country || "Not available"}
                          </span>
                        </div>
                      </td>

                      <td className="block border-b border-[#edf0f7] px-4 py-3.5 sm:px-5 sm:py-4 xl:table-cell xl:px-6 xl:py-8">
                        <div className="flex items-center justify-between gap-4 xl:block">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                            Status
                          </span>
                          <span
                            className={`inline-flex items-center gap-2 text-[13px] font-bold sm:text-[14px] ${
                              isActive ? "text-[#29c45a]" : "text-[#ff4747]"
                            }`}
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-current" />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="block border-b border-[#edf0f7] px-4 py-3.5 sm:px-5 sm:py-4 xl:table-cell xl:px-6 xl:py-8">
                        <div className="flex items-center justify-between gap-4 xl:block">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b97ad] xl:hidden">
                            Joined Date
                          </span>
                          <span className="text-[14px] text-[#40516f] sm:text-[15px] xl:text-[16px] xl:text-[#6d7b97]">
                            {formatJoinedDate(school.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td className="block px-4 py-4 sm:px-5 sm:py-4 xl:relative xl:table-cell xl:border-b xl:border-[#edf0f7] xl:px-6 xl:py-8">
<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:hidden">
  <Link
    href={`/schools/${school.id}`}
    className="button-primary inline-flex h-11 items-center justify-center rounded-xl bg-[#4b8a60] px-4 text-center text-[13px] font-semibold text-white sm:h-12 sm:text-[14px]"
  >
    View Details
  </Link>

  <button
    type="button"
    onClick={() => {
      setSelectedSchool(school);
      setActiveDialog("suspend");
    }}
    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#dce3f2] bg-white px-4 py-3 text-center text-[13px] font-semibold text-[#5a6986] sm:h-12 sm:text-[14px]"
  >
    Suspend School Access
  </button>

  <button
    type="button"
    onClick={() => {
      setSelectedSchool(school);
      setActiveDialog("deactivate");
    }}
    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#ef1f4f] px-4 py-3 text-center text-[13px] font-semibold text-white sm:h-12 sm:text-[14px]"
  >
    Deactivate School
  </button>
</div>

                        <button
                          type="button"
                          className="hidden rounded-full p-1.5 text-[#a0aac0] xl:block"
                          onClick={() =>
                            setOpenMenuRowId((current) => (current === school.id ? null : school.id))
                          }
                        >
                          <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
                        </button>

                        {openMenuRowId === school.id ? (
                          <SchoolActionMenu
                            schoolId={school.id}
                            onDeactivate={() => {
                              setSelectedSchool(school);
                              setActiveDialog("deactivate");
                              setOpenMenuRowId(null);
                            }}
                            onSuspend={() => {
                              setSelectedSchool(school);
                              setActiveDialog("suspend");
                              setOpenMenuRowId(null);
                            }}
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isLoading && schools.length === 0 ? (
              <div className="px-4 py-10 text-center text-[15px] text-[#6f7d98]">
                {errorMessage || "No schools were returned by the backend yet."}
              </div>
            ) : null}
          </div>
        </div>
      </section>

     <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  <article className="rounded-[18px] border border-[#e7eafb] bg-[#f8f8f8] px-8 py-7">
    <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#2f4365]">
      TOTAL SCHOOLS
    </p>

    <div className="mt-8 flex items-end justify-between gap-4">
      <p className="text-[58px] font-extrabold leading-none tracking-[-0.05em] text-[#0b2b52]">
        146
      </p>

      <p className="pb-2 text-[16px] font-bold text-[#22c55e]">
        +12% vs LY
      </p>
    </div>
  </article>

  <article className="rounded-[18px] border border-[#e7eafb] bg-[#f8f8f8] px-8 py-7">
    <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#2f4365]">
      ACTIVE TRIALS
    </p>

    <div className="mt-8 flex items-end justify-between gap-4">
      <p className="text-[58px] font-extrabold leading-none tracking-[-0.05em] text-[#0b2b52]">
        18
      </p>

      <p className="pb-2 text-[16px] font-bold text-[#3b82f6]">
        6 ending soon
      </p>
    </div>
  </article>

  <article className="rounded-[18px] border border-[#e7eafb] bg-[#f8f8f8] px-8 py-7">
    <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#2f4365]">
      TOTAL STUDENTS
    </p>

    <div className="mt-8 flex items-end justify-between gap-4">
      <p className="text-[58px] font-extrabold leading-none tracking-[-0.05em] text-[#0b2b52]">
        84.2k
      </p>

      <p className="pb-2 text-[16px] font-bold text-[#22c55e]">
        +2.4k this month
      </p>
    </div>
  </article>

  <article className="rounded-[18px] border border-[#e7eafb] bg-[#f8f8f8] px-8 py-7">
    <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#2f4365]">
      MONTHLY REVENUE
    </p>

    <div className="mt-8 flex items-end justify-between gap-4">
      <p className="text-[58px] font-extrabold leading-none tracking-[-0.05em] text-[#0b2b52]">
        $128.5k
      </p>

      <span className="pb-2 text-[#0f8d4e]">
        <TrendingUp className="h-10 w-10" strokeWidth={2.5} />
      </span>
    </div>
  </article>
</section>
    </AppShell>
  );
}