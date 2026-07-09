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
} from "@/lib/certificate";

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

export default function CertificateManagementPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<CertificateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openActionRow, setOpenActionRow] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<CertificateModal>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null);
  const [actionReason, setActionReason] = useState("");
  
  // ✅ FIXED: Per-certificate loading state instead of single boolean
  const [loadingCertificateIds, setLoadingCertificateIds] = useState<Set<string>>(new Set());
  
  const { session, isHydrated } = useAuthSession();
  const authToken = session?.token ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ FIXED: Merged duplicate useEffect into single effect
  useEffect(() => {
    if (!isHydrated || !authToken) return;

    const fetchCertificates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAllCertificates(authToken);
        const formatted = data.map(formatCertificateForTable);

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

  // Filter certificates based on search and status
  useEffect(() => {
    let filtered = certificates;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.student.toLowerCase().includes(query) ||
          cert.course.toLowerCase().includes(query) ||
          cert.registryId.toLowerCase().includes(query)
      );
    }

    // ✅ FIXED: Updated filter options
    if (filterStatus !== "all") {
      filtered = filtered.filter((cert) => cert.status === filterStatus);
    }

    setFilteredCertificates(filtered);
  }, [certificates, searchQuery, filterStatus]);

  const openModal = (modal: Exclude<CertificateModal, null>, certificate: CertificateRecord) => {
    setSelectedCertificate(certificate);
    setOpenActionRow(null);
    setActiveModal(modal);
    setActionReason("");
  };

  // ✅ NEW: Helper to set loading state for a certificate
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

    setLoadingCertificate(certificate.id, true);
    try {
      await approveCertificate(certificate.id, authToken);

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === certificate.id ? { ...cert, status: "Approved" as CertificateStatus } : cert
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to approve certificate";
      setError(message);
    } finally {
      setLoadingCertificate(certificate.id, false);
    }
  };

  // ✅ NEW: Handle reject certificate
  const handleRejectCertificate = async () => {
    if (!selectedCertificate || !authToken) return;

    setLoadingCertificate(selectedCertificate.id, true);
    try {
      await rejectCertificate(selectedCertificate.id, actionReason, authToken);

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === selectedCertificate.id ? { ...cert, status: "Rejected" as CertificateStatus } : cert
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
      await revokeCertificate(selectedCertificate.id, actionReason, authToken);

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === selectedCertificate.id ? { ...cert, status: "Revoked" as CertificateStatus } : cert
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

  // ✅ NEW: Handle reissue certificate
  const handleReissueCertificate = async (certificate: CertificateRecord) => {
    if (!authToken) return;

    setLoadingCertificate(certificate.id, true);
    try {
      await reissueCertificate(certificate.id, authToken);

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === certificate.id ? { ...cert, status: "Reissued" as CertificateStatus } : cert
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reissue certificate";
      setError(message);
    } finally {
      setLoadingCertificate(certificate.id, false);
    }
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
                Status
              </span>
              <span className="relative mt-3 block">
                <select
                  className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Verified">Verified</option>
                  <option value="Issued">Issued</option>
                  <option value="Reissued">Reissued</option>
                  <option value="Revoked">Revoked</option>
                  <option value="Active">Active</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Sort By
              </span>
              <span className="relative mt-3 block">
                <select className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Student A-Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <button
              type="button"
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
            {filteredCertificates.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-7">
                <p className="text-[#536781]">No certificates found</p>
              </div>
            ) : (
              filteredCertificates.map((record) => (
                <article
                  key={record.id}
                  className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.2fr_1.25fr_1.3fr_0.95fr_0.55fr] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    {/* ✅ FIXED: Use new helper function for type safety */}
                    <CertificateAvatar initials={getCertificateInitialsFromRecord(record)} />
                    <div>
                      <p className="text-[16px] font-extrabold text-[#172f54]">{record.student}</p>
                      <p className="mt-1 text-[14px] font-medium text-[#7c8ba3]">ID: {record.registryId}</p>
                    </div>
                  </div>

                  <div className="text-[16px] font-bold text-[#536781]">{record.course}</div>
                  <div className="text-[16px] font-bold text-[#536781]">{record.school}</div>
                  <div className="text-[16px] font-bold text-[#5b6d86]">{record.completionDate}</div>

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
                        {record.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveCertificate(record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Approve Certificate
                            </button>
                            {/* ✅ FIXED: Reject button now opens reject modal */}
                            <button
                              type="button"
                              onClick={() => openModal("reject", record)}
                              disabled={loadingCertificateIds.has(record.id)}
                              className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                            >
                              Reject Certificate
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => openModal("revoke", record)}
                          disabled={loadingCertificateIds.has(record.id)}
                          className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                        >
                          Revoke Certificate
                        </button>
                       {record.status === "Approved" && (
                          <button
                            type="button"
                            onClick={() => handleReissueCertificate(record)}
                            disabled={loadingCertificateIds.has(record.id)}
                            className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd] disabled:opacity-50"
                          >
                            Reissue Certificate
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>


          {filteredCertificates.length > 0 && (
            <div className="flex flex-col gap-4 px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
              <p>Showing {filteredCertificates.length} of {certificates.length} certificates</p>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0f8751] text-[15px] font-bold text-white"
                >
                  1
                </button>
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]">
                  2
                </button>
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-[15px] font-bold text-[#203552]">
                  3
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ✅ FIXED: Reject modal */}
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

      {/* ✅ FIXED: Revoke modal */}
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
    </AppShell>
  );
}