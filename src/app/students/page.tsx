
"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ChevronDown,
  CircleAlert,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  getSchoolStudents,
  deactivateStudent,
  reactivateStudent,
  grantPremiumAccess,
  getStudentStats,
  Student,
  FetchStudentsParams,
} from "@/lib/students-api";
import { useAuthSession } from "@/lib/auth-session";

// ─── Auth token hook ───────────────────────────────────────────────────────

function useAuthToken(): string {
  const { session } = useAuthSession();
  return session?.token ?? "";
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PLAN_STYLES: Record<string, string> = {
  Enterprise: "bg-[#e7efff] text-[#2f66df]",
  Premium: "bg-[#f2e4ff] text-[#9a4dff]",
  Basic: "bg-[#eef2f7] text-[#8b97aa]",
  Free: "bg-[#fff1df] text-[#d88314]",
};

function planStyle(plan: string) {
  return PLAN_STYLES[plan] ?? "bg-[#eef2f7] text-[#8b97aa]";
}

const PAGE_SIZE = 10;

// ─── Stat cards ───────────────────────────────────────────────────────────

function StudentSummaryCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: typeof Users;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7eafb] bg-white p-5 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef1ff] text-[#5065e3]">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
        <span className="inline-flex items-center gap-1 text-[14px] font-bold text-[#14985b]">
          {delta}
        </span>
      </div>
      <p className="mt-5 text-[15px] font-medium text-[#334768]">{label}</p>
      <p className="mt-4 text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
    </article>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────

function StudentActionMenu({
  menuRef,
  position,
  studentId,
  onDeactivate,
  onReactivate,
  onGrantAccess,
}: {
  menuRef: React.RefObject<HTMLDivElement | null>;
  position: {
    top: number;
    right: number;
  };
  studentId: string;
  onDeactivate: () => void;
  onReactivate: () => void;
  onGrantAccess: () => void;
}) {
  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position.top,
        right: position.right,
        zIndex: 9999,
      }}
      className="w-[228px] rounded-[12px] border border-[#e4e8f4] bg-white p-2 shadow-[0_24px_44px_rgba(166,178,214,0.22)]"
    >
      <Link
        href={`/students/${studentId}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex items-center gap-3 rounded-[10px] px-4 py-3 text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <Eye className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        View Student
      </Link>
      <button
        type="button"
        onClick={onDeactivate}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <ShieldAlert className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Deactivate Student
      </button>
      <button
        type="button"
        onClick={onReactivate}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[#38455f] text-[15px] font-medium hover:bg-[#f6f8fd]"
      >
        <UserCheck className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Reactivate Student
      </button>
      <button
        type="button"
        onClick={onGrantAccess}
        className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left text-[15px] font-medium text-[#38455f] hover:bg-[#f6f8fd]"
      >
        <UserPlus className="h-[18px] w-[18px] text-[#56657f]" strokeWidth={2} />
        Grant Premium Access
      </button>
    </div>
  );
}

// ─── Modal close button ───────────────────────────────────────────────────

function ModalClose({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
    >
      <X className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

// ─── Grant Access Modal ───────────────────────────────────────────────────

function GrantAccessModal({
  student,
  onClose,
  onSuccess,
  authToken,
}: {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}) {
  const [plan, setPlan] = useState("");
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!student || !plan || !duration) return;
    setLoading(true);
    setError(null);
    try {
      await grantPremiumAccess(
        student.id,
        { plan, durationMonths: Number(duration), reason },
        authToken
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close grant access modal" />
          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
              Grant Premium Access
            </h2>
            {student && (
              <p className="mt-1 text-[14px] text-[#6b7894]">
                {student.user.firstName} {student.user.lastName}
              </p>
            )}
          </div>

          <div className="space-y-6 px-6 py-7">
            {error && (
              <p className="rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                {error}
              </p>
            )}
            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">Select Plan</span>
              <div className="relative">
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="h-14 w-full appearance-none rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[16px] text-[#51627f] outline-none"
                >
                  <option value="">Choose a plan...</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c88a0]" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">Select Duration</span>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-14 w-full appearance-none rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[16px] text-[#51627f] outline-none"
                >
                  <option value="">Choose duration...</option>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="12">12 Months</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c88a0]" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">
                Reason for Granting Access
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Internal audit note (e.g., Scholarship recipient, support resolution)"
                className="min-h-[118px] w-full rounded-[10px] border border-[#dce3f2] px-4 py-4 text-[16px] text-[#6b7894] outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[16px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !plan || !duration}
              className="button-primary inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[#0f8751] px-6 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Grant Access
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Deactivate Modal ─────────────────────────────────────────────────────

function DeactivateStudentModal({
  student,
  onClose,
  onSuccess,
  authToken,
}: {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      await deactivateStudent(student.id, { reason }, authToken);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close deactivate student modal" />
          <div className="px-6 py-7 pr-20">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffe9ee] text-[#f04463]">
                <ShieldAlert className="h-8 w-8" strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
                  Deactivate Student Account
                </h2>
                {student && (
                  <p className="mt-1 text-[14px] text-[#6b7894]">
                    {student.user.firstName} {student.user.lastName}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                {error}
              </p>
            )}

            <div className="mt-7 rounded-[12px] border border-[#ffd7df] bg-[#fff0f3] px-5 py-5 text-[15px] leading-8 text-[#c52c50]">
              Warning: Deactivating this account will block all access to the student portal. No
              data will be deleted, but the student will not be able to log in until the account
              is reactivated.
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-[15px] font-bold text-[#2f4365]">
                Reason for Deactivation
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Transferring schools, End of program, etc."
                className="min-h-[86px] w-full rounded-[10px] border border-[#dce3f2] px-4 py-4 text-[16px] text-[#6b7894] outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[16px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="button-primary inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[#ef1f4f] px-6 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Reactivate Modal ────────────────────────────────────────────────────

function ReactivateStudentModal({
  student,
  onClose,
  onSuccess,
  authToken,
}: {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      await reactivateStudent(student.id, {}, authToken);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close reactivate student modal" />
          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
              Reactivate Student Account
            </h2>
            {student && (
              <p className="mt-1 text-[14px] text-[#6b7894]">
                {student.user.firstName} {student.user.lastName}
              </p>
            )}
          </div>

          <div className="space-y-6 px-6 py-7">
            {error && (
              <p className="rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                {error}
              </p>
            )}
            <div className="flex gap-4 rounded-[12px] bg-[#fbfcff] px-4 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dff6eb] text-[#0f8751]">
                <CircleAlert className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="text-[16px] leading-8 text-[#46556f]">
                Restoring access will allow the student to log in using their previous
                credentials. All course progress and profile data will be immediately available.
              </div>
            </div>
            {student && (
              <p className="text-[16px] font-bold text-[#1b2d4b]">
                Student: {student.user.firstName} {student.user.lastName} (ID:{" "}
                {student.admissionNumber ?? student.id})
              </p>
            )}
          </div>

          <div className="grid gap-4 border-t border-[#edf0f7] bg-[#f7fbff] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-14 items-center justify-center rounded-[10px] border border-[#c8dfd3] bg-white px-6 text-[16px] font-semibold text-[#4b8a60]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="button-primary inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Reactivate Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

type ActiveTab = "all" | "active" | "inactive";
type ActiveDialog = "grant" | "deactivate" | "reactivate" | null;

export default function StudentsPage() {
  const authToken = useAuthToken();
  const [openMenu, setOpenMenu] = useState<{
    rowId: string;
    top: number;
    right: number;
  } | null>(null);
  
  // Table state
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState<{
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    newThisWeek: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // UI state
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Debounce search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchStats = useCallback(async () => {
    if (!authToken) return;
    setStatsLoading(true);
    try {
      const res = await getStudentStats(authToken);
      setStats(res.data);
    } catch (err) {
      console.error("[v0] Failed to fetch student stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [authToken]);

  const fetchStudents = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    setFetchError(null);
    try {
      const params: FetchStudentsParams = {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: activeTab === "all" ? undefined : activeTab,
      };
      const res = await getSchoolStudents(authToken, params);
      setStudents(res.data);
      // Normalise pagination meta — handle both shapes
      const t = res.meta?.total ?? res.total ?? res.data.length;
      setTotal(t);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, [authToken, page, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchStats();
    fetchStudents();
  }, [fetchStats, fetchStudents]);

  // Close menu on outside click
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (!menuRef.current) return;
      if (event.target instanceof Node && menuRef.current.contains(event.target)) {
        return;
      }
      setOpenMenu(null);
    }

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  function openDialog(dialog: ActiveDialog, student: Student) {
    setSelectedStudent(student);
    setOpenMenu(null);
    setActiveDialog(dialog);
  }

  function closeDialog() {
    setActiveDialog(null);
    setSelectedStudent(null);
  }

  // Pagination helpers
  function visiblePages(): (number | "…")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "…", totalPages];
    if (page >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }

  return (
    <AppShell title="Individual Students" activeSection="student">
      {activeDialog === "grant" && (
        <GrantAccessModal
          student={selectedStudent}
          onClose={closeDialog}
          onSuccess={fetchStudents}
          authToken={authToken}
        />
      )}
      {activeDialog === "deactivate" && (
        <DeactivateStudentModal
          student={selectedStudent}
          onClose={closeDialog}
          onSuccess={fetchStudents}
          authToken={authToken}
        />
      )}
      {activeDialog === "reactivate" && (
        <ReactivateStudentModal
          student={selectedStudent}
          onClose={closeDialog}
          onSuccess={fetchStudents}
          authToken={authToken}
        />
      )}

      <section className="flex justify-stretch sm:justify-end">
        <Link
          href="/schools/create-school"
          className="button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] sm:w-auto"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Add New School
        </Link>
      </section>

      {/* Stats Section with Loading State */}
      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        {statsLoading || !stats ? (
          <>
            <div className="h-32 animate-pulse rounded-[14px] bg-[#f0f4f8]" />
            <div className="h-32 animate-pulse rounded-[14px] bg-[#f0f4f8]" />
            <div className="h-32 animate-pulse rounded-[14px] bg-[#f0f4f8]" />
          </>
        ) : (
          <>
                 <StudentSummaryCard
              label="Total Individual Students"
              value={(stats?.totalStudents ?? 0).toLocaleString()}
              delta="+12%"
              icon={Users}
            />
            <StudentSummaryCard
              label="Active This Month"
              value={(stats?.activeStudents ?? 0).toLocaleString()}
              delta="+5%"
              icon={UserCheck}
            />
            <StudentSummaryCard
              label="New This Week"
              value={(stats?.newThisWeek ?? 0).toLocaleString()}
              delta="+12%"
              icon={UserPlus}
            />
          </>
        )}
      </section>

      {/* Tabs */}
      <section className="mt-8 border-b border-[#e4e8f4]">
        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-10">
            {(["all", "active", "inactive"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setPage(1);
                }}
                className={[
                  "border-b-[3px] px-1 pb-3 text-[16px] font-bold transition-colors capitalize",
                  activeTab === key
                    ? "border-[#0f8751] text-[#4b8a60]"
                    : "border-transparent text-[#6e7c98]",
                ].join(" ")}
              >
                {key === "all" ? "All Students" : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[14px] border border-[#e4ece9] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.10)]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#eef2f7] px-6 py-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
            Student Progress Details
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#dce3f2] bg-[#fbfcff] px-4 text-[#95a0b4] sm:min-w-[360px]">
              <Search className="h-4.5 w-4.5" strokeWidth={2} />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-[15px] text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search by name, ID or course..."
              />
            </label>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#f5f7fb] px-5 text-[15px] font-semibold text-[#5d6b85]"
            >
              <Filter className="h-4.5 w-4.5" strokeWidth={2} />
              Filter
            </button>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#f5f7fb] text-[#5d6b85]"
            >
              <Download className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-[#6e7c98]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-[15px] font-medium">Loading students…</span>
          </div>
        )}
        {!loading && fetchError && (
          <p className="px-8 py-10 text-center text-[15px] text-[#c52c50]">{fetchError}</p>
        )}
        {!loading && !fetchError && students.length === 0 && (
          <p className="px-8 py-10 text-center text-[15px] text-[#6e7c98]">No students found.</p>
        )}

        {/* Mobile Cards - Full Featured */}
        {!loading && !fetchError && students.length > 0 && (
          <div className="space-y-4 p-4 xl:hidden">
            {students.map((row) => (
              <article key={row.id} className="rounded-[12px] border border-[#edf0f7] bg-[#fbfcff] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e1f29] text-[15px] font-bold text-white">
                      {getInitials(row.user.firstName, row.user.lastName)}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/students/${row.id}`}
                        onClick={() => setOpenMenu(null)}
                        className="block truncate text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]"
                      >
                        {row.user.firstName} {row.user.lastName}
                      </Link>
                      <p className="mt-1 truncate text-[14px] text-[#7f8cab]">{row.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-[12px] bg-white p-4 text-[14px] text-[#61708b]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#8b97ad]">Status</span>
                    <span
                      className={`font-bold ${row.user.isActive ? "text-[#0b8c50]" : "text-[#76839b]"}`}
                    >
                      ● {row.user.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#8b97ad]">Join Date</span>
                    <span className="text-[#40516f]">{formatDate(row.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#8b97ad]">Class</span>
                    <span className="text-[#40516f]">{row.class ?? "—"}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <Link
                    href={`/students/${row.id}`}
                    onClick={() => setOpenMenu(null)}
                    className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-4 text-[14px] font-semibold text-[#5a6986]"
                  >
                    View Student
                  </Link>

                  <button
                    type="button"
                    onClick={() => openDialog("grant", row)}
                    className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#4b8a60] px-4 text-[14px] font-semibold text-white"
                  >
                    Grant Premium Access
                  </button>

                  <button
                    type="button"
                    onClick={() => openDialog("deactivate", row)}
                    className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#ef1f4f] px-4 text-[14px] font-semibold text-white"
                  >
                    Deactivate Student
                  </button>

                  <button
                    type="button"
                    onClick={() => openDialog("reactivate", row)}
                    className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#4b8a60] bg-white px-4 text-[14px] font-semibold text-[#4b8a60]"
                  >
                    Reactivate Student
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !fetchError && students.length > 0 && (
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full border-separate border-spacing-0">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[20%]" />
                <col className="w-[14%]" />
                <col className="w-[17%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
                <col className="w-[56px]" />
              </colgroup>
              <thead>
                <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                  <th className="rounded-tl-[14px] px-8 py-5">Student Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Class</th>
                  <th className="px-6 py-5">Admission No.</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Join Date</th>
                  <th className="rounded-tr-[14px] px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((row) => (
                  <tr key={row.id} className="group relative text-[15px] text-[#6f7d98]">
                    <td className="border-b border-[#edf0f7] px-8 py-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#20242e] text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(22,28,41,0.16)]">
                          {getInitials(row.user.firstName, row.user.lastName)}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/students/${row.id}`}
                            onClick={() => setOpenMenu(null)}
                            className="block truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]"
                          >
                            {row.user.firstName} {row.user.lastName}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 text-[#40516f]">
                      <span className="block truncate" title={row.user.email}>
                        {row.user.email}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 font-semibold text-[#5d6f8f]">
                      {row.class ?? "—"}
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span
                        className={`inline-flex min-h-10 items-center rounded-full px-4 py-1.5 text-[13px] font-bold ${planStyle(
                          "Enterprise"
                        )}`}
                      >
                        {row.admissionNumber ?? "—"}
                      </span>
                    </td>
                    <td
                      className={`border-b border-[#edf0f7] px-6 py-7 text-[13px] font-bold ${
                        row.user.isActive ? "text-[#0b8c50]" : "text-[#76839b]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {row.user.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 text-[#6d7b97]">
                      {formatDate(row.createdAt)}
                    </td>
                    <td
                      className="relative border-b border-[#edf0f7] px-4 py-7 text-center"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-[#a0aac0] transition-colors hover:bg-[#f5f7fb] hover:text-[#70809d]"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (openMenu?.rowId === row.id) {
                            setOpenMenu(null);
                            return;
                          }

                          const rect = e.currentTarget.getBoundingClientRect();

                          setOpenMenu({
                            rowId: row.id,
                            top: rect.bottom + 8,
                            right: window.innerWidth - rect.right,
                          });
                        }}
                      >
                        <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
                      </button>

                      {openMenu?.rowId === row.id && (
                        <StudentActionMenu
                          menuRef={menuRef}
                          position={{ top: openMenu.top, right: openMenu.right }}
                          studentId={row.id}
                          onDeactivate={() => openDialog("deactivate", row)}
                          onReactivate={() => openDialog("reactivate", row)}
                          onGrantAccess={() => openDialog("grant", row)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-[#edf0f7] px-6 py-5 text-[15px] font-semibold text-[#6e7c98] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {students.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7] disabled:opacity-40"
            >
              ‹
            </button>
            {visiblePages().map((p, idx) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-10 w-10 items-center justify-center text-[#93a0b7]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-[8px] text-[15px] font-bold",
                    page === p ? "button-primary bg-[#0f8751] text-white" : "text-[#22314c]",
                  ].join(" ")}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7] disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}