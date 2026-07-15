"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useAuthSession } from "@/lib/auth-session";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  Search,
  Share2,
  ShieldCheck,
  X,
  Loader,
  ThumbsUp,
  ArrowRight,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  getAllCertificates,
  getPendingCertificates,
  getCertificateById,
  approveCertificate,
  rejectCertificate,
  revokeCertificate,
  reissueCertificate,
  formatCertificateForTable,
  getCertificateInitialsFromRecord,
  type Certificate,
  type CertificateStatus,
  mergeCertificateUpdate,
} from "@/lib/certificate";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { parseSchoolList } from "@/lib/backend-models";
import { PaginationFooter, usePagination } from "@/components/Pagination";

type MetricCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: string;
};

type CertificateRecord = ReturnType<typeof formatCertificateForTable>;
// ✅ FIXED: Added "reject" modal type
type CertificateModal = "verify" | "reject" | "reissue" | "revoke" | null;

const metrics: MetricCard[] = [
  {
    label: "Total Issued Certificates",
    value: "124,502",
    delta: "+12%",
    icon: ShieldCheck,
    tone: "bg-[#fff5d7] text-[#0f8751]",
  },
  {
    label: "Certificates This Month",
    value: "1,240",
    delta: "+5%",
    icon: CalendarDays,
    tone: "bg-[#fff5d7] text-[#0f8751]",
  },
  {
    label: "Verified Certificates",
    value: "98.2%",
    delta: "-2%",
    icon: ShieldCheck,
    tone: "bg-[#fff5d7] text-[#0f8751]",
  },
];




function MetricSummaryCard({ card, index }: { card: MetricCard; index: number }) {
  const Icon = card.icon;
  const deltaClassName = index === 2 ? "text-[#ef476f]" : "text-[#14a467]";

  return (
    <article className="rounded-[20px] border border-[#dfe6f7] bg-white px-6 py-6 shadow-[0_18px_40px_rgba(180,192,227,0.06)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[17px] font-extrabold tracking-[-0.03em] text-[#173257]">{card.label}</p>
          <div className="mt-8 flex items-end gap-3">
            <p className="text-[40px] font-extrabold tracking-[-0.06em] text-[#173257]">{card.value}</p>
            <span className={`pb-1 text-[15px] font-bold ${deltaClassName}`}>{card.delta}</span>
          </div>
        </div>

        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] ${card.tone}`}>
          <Icon className="h-5 w-5" strokeWidth={2.1} />
        </span>
      </div>
    </article>
  );
}

function CertificateAvatar({ initials, gradient }: { initials: string; gradient?: string }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-[10px] text-[20px] font-extrabold text-white shadow-[0_12px_24px_rgba(122,53,241,0.24)] ${
        gradient || "bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)]"
      }`}
    >
      {initials}
    </div>
  );
}

function ModalFrame({
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-[1080px]",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
        <div className={`relative mt-16 w-full ${maxWidthClassName}`}>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            {title ? (
              <div className="border-b border-[#edf1f7] px-6 py-7 sm:px-10">
                <h2 className="text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">{title}</h2>
              </div>
            ) : null}
            <div className="px-6 py-7 sm:px-10 sm:py-8">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ FIXED: Generalized modal for reject/revoke with configurable title and button text
function ActionReasonModal({
  title,
  subtitle,
  reason,
  onReasonChange,
  onSubmit,
  isLoading,
  onClose,
  confirmText,
  confirmColor = "bg-[#f22952]",
}: {
  title: string;
  subtitle: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
  confirmText: string;
  confirmColor?: string;
}) {
  return (
    <ModalFrame title="" onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="-mt-2">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f3] text-[#f03c5a]">
            <AlertTriangle className="h-7 w-7" strokeWidth={2.1} />
          </span>
          <h3 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#172f54]">{title}</h3>
        </div>

        <div className="mt-7 rounded-[18px] border border-[#ffd8de] bg-[#fff3f5] px-5 py-4 text-[16px] leading-8 text-[#c1294c]">
          {subtitle}
        </div>

        <div className="mt-7">
          <label className="block text-[15px] font-medium text-[#5c6f8d]">
            {title === "Revoke Certificate" ? "Reason For Revocation" : "Reason For Rejection"}
          </label>
          <textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            disabled={isLoading}
            rows={4}
            placeholder="Please provide a detailed justification for this action..."
            className="mt-3 w-full rounded-[16px] border border-[#dbe3f1] bg-white px-4 py-4 text-[16px] text-[#1e314f] outline-none placeholder:text-[#7687a4] disabled:bg-gray-100"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#dbe3f1] bg-white px-6 text-[17px] font-semibold text-[#485a76] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !reason.trim()}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-[14px] ${confirmColor} px-6 text-[17px] font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            {isLoading ? `${confirmText}...` : confirmText}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function CertificatePreview({
  student,
  course,
  school,
  date,
  registryId,
}: {
  student: string;
  course: string;
  school: string;
  date: string;
  registryId: string;
}) {
  return (
    <div className="relative w-full aspect-[1.414/1] rounded-[16px] border-[12px] border-[#0f5733] bg-[#faf8f5] p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Decorative Gold Corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#c5a880]" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#c5a880]" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#c5a880]" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#c5a880]" />

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-10 h-10 rounded-full bg-[#0f5733] flex items-center justify-center text-[#c5a880]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <h4 className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880]">{school}</h4>
        <div className="w-24 h-[1px] bg-[#c5a880] mx-auto mt-2" />
      </div>

      {/* Main Content */}
      <div className="text-center my-4">
        <p className="text-[11px] italic text-[#7c8ba3] font-medium">This certificate is proudly presented to</p>
        <h3 className="text-[28px] font-extrabold text-[#0f5733] my-2 font-serif">{student}</h3>
        <p className="text-[11px] text-[#7c8ba3] px-10 leading-relaxed font-medium">
          for successfully completing the professional certification program in
        </p>
        <h4 className="text-[15px] font-extrabold text-[#172f54] mt-2">{course}</h4>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end border-t border-[#edf1f7] pt-4 mt-2">
        <div className="text-left">
          <p className="text-[9px] font-bold text-[#7c8ba3] uppercase">Date Issued</p>
          <p className="text-[11px] font-bold text-[#172f54] mt-0.5">{date}</p>
        </div>
        
        {/* Gold Seal */}
        <div className="relative flex justify-center items-center w-14 h-14 bg-[#c5a880] rounded-full shadow-[0_4px_10px_rgba(197,168,128,0.4)] border-4 border-[#faf8f5] z-10">
          <div className="absolute -inset-1 border border-dashed border-[#faf8f5]/60 rounded-full" />
          <ShieldCheck className="w-7 h-7 text-[#faf8f5]" />
        </div>

        <div className="text-right">
          <p className="text-[9px] font-bold text-[#7c8ba3] uppercase">Registry ID</p>
          <p className="text-[11px] font-bold text-[#172f54] mt-0.5">{registryId}</p>
        </div>
      </div>
    </div>
  );
}

export default function CertificateManagementPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openActionRow, setOpenActionRow] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<CertificateModal>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null);
  const [actionReason, setActionReason] = useState("");

  const [loadingCertificateIds, setLoadingCertificateIds] = useState<Set<string>>(new Set());

  const { session, isHydrated } = useAuthSession();
  const authToken = session?.token ?? "";

  // Filter input states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterSchool, setFilterSchool] = useState("all");

  // Applied filter states
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [appliedDateRange, setAppliedDateRange] = useState("all");
  const [appliedSchool, setAppliedSchool] = useState("all");

  const [schoolNameMap, setSchoolNameMap] = useState<Record<string, string>>({});

  // ✅ Now that appliedSearchQuery/appliedDateRange/appliedSchool exist, this is safe:
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedCertificates,
    showingLabel,
  } = usePagination({
    items: filteredCertificates,
    pageSize: 10,
    resetKey: `${appliedSearchQuery}-${appliedDateRange}-${appliedSchool}`,
  });

  // Fetch unique schools dynamically
  const uniqueSchools = useMemo(() => {
    return Array.from(new Set(certificates.map((c) => c.school))).filter(Boolean);
  }, [certificates]);

  useEffect(() => {
    if (!isHydrated || !authToken) return;

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [certData, schoolsPayload] = await Promise.all([
        getAllCertificates(authToken),
        apiRequest(endpoints.admin.schools, { authToken }),
      ]);

      const schoolList = parseSchoolList(schoolsPayload);
      const nameMap = Object.fromEntries(schoolList.map((s) => [s.id, s.name]));
      setSchoolNameMap(nameMap);

      const formatted = certData.map((cert) => formatCertificateForTable(cert, nameMap));

      setCertificates(formatted);
      setFilteredCertificates(formatted);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch certificates";
      setError(message);
      console.error("Error fetching certificates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchCertificates();
}, [isHydrated, authToken]);

  // Apply filters on button click or change
  useEffect(() => {
    let filtered = certificates;

    if (appliedSearchQuery.trim()) {
      const query = appliedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.student.toLowerCase().includes(query) ||
          cert.course.toLowerCase().includes(query) ||
          cert.registryId.toLowerCase().includes(query)
      );
    }

    if (appliedSchool !== "all") {
      filtered = filtered.filter((cert) => cert.school === appliedSchool);
    }

    if (appliedDateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((cert) => {
        if (!cert.completionDate) return false;
        const completionDate = new Date(cert.completionDate);
        const diffTime = Math.abs(now.getTime() - completionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (appliedDateRange === "7days") return diffDays <= 7;
        if (appliedDateRange === "30days") return diffDays <= 30;
        return true;
      });
    }

    setFilteredCertificates(filtered);
  }, [certificates, appliedSearchQuery, appliedDateRange, appliedSchool]);

  const handleApplyFilters = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedDateRange(filterDateRange);
    setAppliedSchool(filterSchool);
  };

  const openModal = (modal: Exclude<CertificateModal, null>, certificate: CertificateRecord) => {
    setSelectedCertificate(certificate);
    setOpenActionRow(null);
    setActiveModal(modal);
    setActionReason("");
  };

  const setLoadingCertificate = (certificateId: string, isLoading: boolean) => {
    setLoadingCertificateIds((prev) => {
      const next = new Set(prev);
      if (isLoading) {
        next.add(certificateId);
      } else {
        next.delete(certificateId);
      }
      return next;
    });
  };

const handleApproveCertificate = async (certificate: CertificateRecord) => {
  if (!authToken) return;
// -
  setLoadingCertificate(certificate.id, true);
  try {
    const response = await approveCertificate(certificate.id, authToken);

    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === certificate.id ? mergeCertificateUpdate(cert, response, schoolNameMap) : cert
      )
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to approve certificate";
    setError(message);
  } finally {
    setLoadingCertificate(certificate.id, false);
  }
};

const handleRejectCertificate = async () => {
  if (!selectedCertificate || !authToken) return;

  setLoadingCertificate(selectedCertificate.id, true);
  try {
    const response = await rejectCertificate(selectedCertificate.id, actionReason, authToken);

    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === selectedCertificate.id ? mergeCertificateUpdate(cert, response, schoolNameMap) : cert
      )
    );

    setActiveModal(null);
    setActionReason("");
    setSelectedCertificate(null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reject certificate";
    setError(message);
    console.error("Error rejecting certificate:", err);
  } finally {
    setLoadingCertificate(selectedCertificate.id, false);
  }
};

const handleRevokeCertificate = async () => {
  if (!selectedCertificate || !authToken) return;

  setLoadingCertificate(selectedCertificate.id, true);
  try {
    const response = await revokeCertificate(selectedCertificate.id, actionReason, authToken);

    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === selectedCertificate.id ? mergeCertificateUpdate(cert, response, schoolNameMap) : cert
      )
    );

    setActiveModal(null);
    setActionReason("");
    setSelectedCertificate(null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to revoke certificate";
    setError(message);
    console.error("Error revoking certificate:", err);
  } finally {
    setLoadingCertificate(selectedCertificate.id, false);
  }
};

const handleReissueCertificate = async (certificate: CertificateRecord) => {
  if (!authToken) return;

  setLoadingCertificate(certificate.id, true);
  try {
    const response = await reissueCertificate(certificate.id, authToken);
    const updatedCert = mergeCertificateUpdate(certificate, response, schoolNameMap);

    setCertificates((prev) =>
      prev.map((cert) => (cert.id === certificate.id ? updatedCert : cert))
    );

    setSelectedCertificate(updatedCert);
    setActiveModal("reissue");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reissue certificate";
    setError(message);
  } finally {
    setLoadingCertificate(certificate.id, false);
  }
};

  const handleVerifyCertificateClick = (record: CertificateRecord) => {
    setSelectedCertificate(record);
    setActiveModal("verify");
    setOpenActionRow(null);
  };

  if (isLoading) {
    return (
      <AppShell
        title="Certificates Management"
        activeSection="certificate"
        contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
      >
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin text-[#0f8751]" />
            <p className="text-[#536781]">Loading certificates...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Certificates Management"
      activeSection="certificate"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        {error && (
          <div className="mb-6 rounded-[16px] border border-[#fdd4d7] bg-[#fff5f6] px-5 py-4 text-[#c1294c]">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="button-primary inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
          >
            <Download className="h-4.5 w-4.5" strokeWidth={2.2} />
            Export Data
          </button>
        </div>

        <section className="mt-8 grid gap-4 xl:grid-cols-3">
          {metrics.map((metric, index) => (
            <MetricSummaryCard key={metric.label} card={metric} index={index} />
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:grid-cols-[1.3fr_0.9fr_0.9fr_auto] lg:items-end">
            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Search Messages
              </span>
              <span className="mt-3 flex h-[52px] items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
                <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
                <input
                  className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                  placeholder="Search student, course, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Audience Type
              </span>
              <span className="relative mt-3 block">
                <select
                  className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                >
                  <option value="all">Date Range: All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Date Range
              </span>
              <span className="relative mt-3 block">
                <select
                  className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
                  value={filterSchool}
                  onChange={(e) => setFilterSchool(e.target.value)}
                >
                  <option value="all">School: All Schools</option>
                  {uniqueSchools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex h-[52px] items-center justify-center rounded-[14px] bg-[#eef7f1] px-6 text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]"
            >
              Apply Filters
            </button>
          </div>

          <div className="hidden grid-cols-[1.2fr_1.25fr_1.3fr_0.95fr_0.55fr] gap-4 border-b border-[#edf1f7] bg-[#fbfcff] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
            <span>Student Name</span>
            <span>Course</span>
            <span>School</span>
            <span>Completion Date</span>
            <span className="text-right">Action</span>
          </div>

          <div>
       {paginatedCertificates.length === 0 ? (
  <div className="px-5 py-12 text-center sm:px-7">
    <p className="text-[#536781]">No certificates found</p>
  </div>
) : (
  paginatedCertificates.map((record) => (
                <article
                  key={record.id}
                  className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.2fr_1.25fr_1.3fr_0.95fr_0.55fr] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    <CertificateAvatar initials={getCertificateInitialsFromRecord(record)} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[16px] font-extrabold text-[#172f54]">{record.student}</p>
                        {record.status === "revoked" && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                            REVOKED
                          </span>
                        )}
                        {record.status === "reissued" && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                            REISSUED
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[14px] font-medium text-[#7c8ba3]">ID: {record.registryId}</p>
                    </div>
                  </div>

                  <div className="text-[16px] font-bold text-[#536781]">{record.course}</div>
                  <div className="text-[16px] font-bold text-[#536781]">{record.school}</div>
                  <div className="text-[16px] font-bold text-[#5b6d86]">{record.completionDateDisplay}</div>

                  <div className="relative flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenActionRow((current) => (current === record.id ? null : record.id))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8fa0ba]"
                      disabled={loadingCertificateIds.has(record.id)}
                    >
                      {loadingCertificateIds.has(record.id) ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                      )}
                    </button>

                    {openActionRow === record.id ? (
                      <div className="absolute right-0 top-11 z-10 w-[228px] rounded-[16px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                        {record.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveCertificate(record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Approve Certificate
                            </button>
                            <button
                              type="button"
                              onClick={() => openModal("reject", record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Reject Certificate
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleVerifyCertificateClick(record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Verify Certificate
                            </button>
                            <button
                              type="button"
                              onClick={() => openModal("revoke", record)}
                              disabled={loadingCertificateIds.has(record.id) || record.status === "revoked"}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50 disabled:text-gray-400"
                            >
                              Revoke Certificate
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReissueCertificate(record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Reissue Certificate
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))

              // --
            )}
          </div>

       {filteredCertificates.length > 0 && (
  <PaginationFooter
    label={showingLabel}
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}
        </section>
      </div>

      {/* Reject modal */}
      {activeModal === "reject" && selectedCertificate ? (
        <ActionReasonModal
          title="Reject Certificate"
          subtitle="This action cannot be undone. Rejecting this certificate will notify the student and remove it from their active certificates."
          reason={actionReason}
          onReasonChange={setActionReason}
          onSubmit={handleRejectCertificate}
          isLoading={loadingCertificateIds.has(selectedCertificate.id)}
          onClose={() => setActiveModal(null)}
          confirmText="Reject Certificate"
          confirmColor="bg-[#ef476f]"
        />
      ) : null}

      {/* Revoke modal */}
      {activeModal === "revoke" && selectedCertificate ? (
        <ActionReasonModal
          title="Revoke Certificate"
          subtitle="This action is irreversible. Revoking this credential will immediately invalidate the verification link and notify the issuing institution."
          reason={actionReason}
          onReasonChange={setActionReason}
          onSubmit={handleRevokeCertificate}
          isLoading={loadingCertificateIds.has(selectedCertificate.id)}
          onClose={() => setActiveModal(null)}
          confirmText="Revoke Certificate"
          confirmColor="bg-[#f22952]"
        />
      ) : null}

      {/* Verify Certificate Modal */}
      {activeModal === "verify" && selectedCertificate ? (
        <ModalFrame title="Verification Details" onClose={() => setActiveModal(null)} maxWidthClassName="max-w-[960px]">
          <div className="flex justify-end gap-3 -mt-[72px] mb-8 relative z-20">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#dbe3f1] bg-white px-4 text-[14px] font-semibold text-[#485a76]"
            >
              <Share2 className="h-4 w-4" />
              Share Link
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#0f8751] px-4 text-[14px] font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Left: Certificate Preview */}
            <div className="flex flex-col justify-center">
         <CertificatePreview
  student={selectedCertificate.student}
  course={selectedCertificate.course}
  school={selectedCertificate.school}
  date={selectedCertificate.completionDateDisplay}
  registryId={selectedCertificate.registryId}
/>
            </div>

            {/* Right: Verification Details */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                  Verification Status
                </span>
                {selectedCertificate.status === "revoked" ? (
                  <div className="mt-3 flex items-center gap-4 rounded-[16px] border border-red-200 bg-red-50 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertTriangle className="h-6 w-6" />
                    </span>
                    <div>
                      <h4 className="text-[17px] font-extrabold text-red-950">Credential Revoked</h4>
                      <p className="mt-0.5 text-[14px] font-medium text-red-800">This record has been explicitly invalidated</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-4 rounded-[16px] border border-[#d0edd8] bg-[#f2faf5] p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e1f5e8] text-[#14a467]">
                      <ShieldCheck className="h-6 w-6" />
                    </span>
                    <div>
                      <h4 className="text-[17px] font-extrabold text-[#172f54]">Authenticity Confirmed</h4>
                      <p className="mt-0.5 text-[14px] font-medium text-[#536781]">Record found in Academic Ledger</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-[20px] border border-[#dfe6f7] bg-white p-6 shadow-[0_12px_32px_rgba(182,192,227,0.04)]">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c8ba3]">Student</p>
                  <p className="mt-1 text-[16px] font-extrabold text-[#172f54]">{selectedCertificate.student}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c8ba3]">ID Number</p>
                  <p className="mt-1 text-[16px] font-extrabold text-[#172f54]">{selectedCertificate.registryId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c8ba3]">Course Name</p>
                  <p className="mt-1 text-[16px] font-extrabold text-[#172f54]">{selectedCertificate.course}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c8ba3]">Issue Date</p>
                 <p className="mt-1 text-[16px] font-extrabold text-[#172f54]">{selectedCertificate.completionDateDisplay}</p>
                </div>
              </div>

              <div>
                <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                  Issuing Body
                </span>
                <div className="mt-3 flex items-center justify-between rounded-[18px] border border-[#dfe6f7] bg-white p-4 shadow-[0_12px_32px_rgba(182,192,227,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f0f4fd] text-[16px] font-extrabold text-[#3a67d6]">
                      {selectedCertificate.school ? selectedCertificate.school[0] : "S"}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-extrabold text-[#172f54]">{selectedCertificate.school}</h4>
                      <p className="text-[13px] font-medium text-[#7c8ba3]">Platform Registered Institution</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e1f5e8] px-3 py-1 text-[12px] font-bold text-[#14a467]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Issuer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ModalFrame>
      ) : null}

      {/* Certificate Successfully Reissued Modal */}
      {activeModal === "reissue" && selectedCertificate ? (
        <ModalFrame title="" onClose={() => setActiveModal(null)} maxWidthClassName="max-w-[620px]">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e1f5e8] text-[#14a467] mb-4">
              <ThumbsUp className="h-8 w-8" />
            </span>
            <h3 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#172f54]">
              Certificate Successfully Reissued
            </h3>
            <p className="mt-2 text-[15px] font-medium text-[#536781] px-6">
              The digital ledger has been updated. A notification has been sent to the recipient.
            </p>
          </div>

          <div className="mt-8 rounded-[20px] bg-gradient-to-br from-[#0f5733] to-[#0a3a22] p-6 text-white relative overflow-hidden shadow-[0_15px_35px_rgba(10,58,34,0.15)]">
            <div className="absolute right-0 bottom-0 opacity-5 -mr-10 -mb-10 pointer-events-none">
              <ShieldCheck className="w-48 h-48" />
            </div>

            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#c5a880]">
                Official Credential
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#14a467]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#4ade80]">
                ● ACTIVE
              </span>
            </div>

            <div className="mt-8">
              <h4 className="text-[22px] font-extrabold tracking-[-0.03em]">{selectedCertificate.student}</h4>
              <p className="mt-1 text-[14px] text-[#c5a880] font-medium">Graduate Professional Certification</p>
              {/* <p className="mt-6 text-[12px] text-white/70 font-semibold uppercase">Date Completed: {selectedCertificate.completionDate}</p> */}
              <p className="mt-6 text-[12px] text-white/70 font-semibold uppercase">Date Completed: {selectedCertificate.completionDateDisplay}</p>
            </div>
          </div>

          <div className="mt-6 text-left">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Credential Breakdown
            </span>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 rounded-[20px] border border-[#dfe6f7] bg-white p-5">
              <div>
                <p className="text-[11px] font-bold uppercase text-[#7c8ba3]">Status</p>
                <p className="mt-0.5 text-[14px] font-extrabold text-[#14a467]">ACTIVE</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#7c8ba3]">Registry ID</p>
                <p className="mt-0.5 text-[14px] font-extrabold text-[#172f54]">{selectedCertificate.registryId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] font-bold uppercase text-[#7c8ba3]">Security Hash</p>
                <p className="mt-0.5 text-[13px] font-mono text-[#536781] break-all">
                  0x88e1a7b63f290d21a55c2d9e48df9281a8f9f4a2
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#7c8ba3]">Expires</p>
                <p className="mt-0.5 text-[14px] font-extrabold text-[#172f54]">Oct 24, 2028</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#7c8ba3]">Authorized By</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0f4fd] text-[9px] font-bold text-[#3a67d6]">
                    DR
                  </span>
                  <p className="text-[13px] font-extrabold text-[#172f54]">Director Of Registry</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-left">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
              Quick Actions
            </span>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#0f8751] px-5 text-[14px] font-bold text-white shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                View Certificate
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#f3f6fb] px-5 text-[14px] font-bold text-[#536781]"
              >
                <Download className="h-4 w-4" />
                Download PDF
                <span className="text-[11px] font-medium text-[#98a2b6] ml-1">2.4 MB</span>
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-white px-5 text-[14px] font-bold text-[#536781]"
              >
                <Share2 className="h-4 w-4" />
                Share Credential
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-[16px] border border-[#d0edd8] bg-[#f2faf5] p-4 text-left flex gap-3">
            <ShieldCheck className="h-5 w-5 text-[#14a467] shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-[#0f5733]">
                This certificate is cryptographically signed and stored on the immutable Emerald Ledger. Anyone with the Registry ID can verify its authenticity.
              </p>
              <button type="button" className="mt-2 text-[13px] font-bold text-[#14a467] hover:underline inline-flex items-center gap-1">
                Verify Public Link
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </ModalFrame>
      ) : null}
    </AppShell>
  );
}