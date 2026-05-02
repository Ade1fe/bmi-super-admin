"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type MetricCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: string;
};

type CertificateRecord = {
  id: number;
  student: string;
  registryId: string;
  course: string;
  school: string;
  completionDate: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Verified" | "Reissued";
  idNumber: string;
  securityHash: string;
};

type CertificateModal = "verify" | "reissue" | "revoke" | null;

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

const certificateRecords: CertificateRecord[] = [
  {
    id: 1,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Verified",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
  },
  {
    id: 2,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Verified",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
  },
  {
    id: 3,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Active",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
  },
  {
    id: 4,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Reissued",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
  },
  {
    id: 5,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Verified",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
  },
  {
    id: 6,
    student: "Jordan Smith",
    registryId: "CERT-92831",
    course: "Advanced Data Analytics",
    school: "Global Tech University",
    completionDate: "Oct 12, 2023",
    issueDate: "Oct 24, 2023",
    expiryDate: "Oct 24, 2028",
    status: "Verified",
    idNumber: "GTU-9928-S",
    securityHash: "0x88e1...f4a2",
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

function CertificateAvatar() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#a748ff_0%,#6a35ff_100%)] text-[20px] font-extrabold text-white shadow-[0_12px_24px_rgba(122,53,241,0.24)]">
      GS
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

function VerificationPreview() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#d7efe4] bg-[radial-gradient(circle_at_top,#fefcf7_10%,#fcfffe_55%,#eef8f4_100%)] p-4 shadow-[0_18px_48px_rgba(176,195,227,0.14)]">
      <div className="absolute inset-y-3 left-3 w-14 rounded-[18px] bg-[linear-gradient(180deg,#0f7f63_0%,#146e56_100%)]" />
      <div className="absolute -left-6 top-6 h-24 w-24 rotate-[28deg] bg-[linear-gradient(180deg,#f7d668_0%,#e0b632_100%)] opacity-90" />
      <div className="absolute -right-10 bottom-4 h-28 w-28 rotate-[28deg] bg-[linear-gradient(180deg,#0e8463_0%,#2da273_100%)] opacity-90" />

      <div className="relative ml-10 rounded-[18px] border border-[#d7e7df] bg-white/95 px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0f8751]">
              School Of Design Excellence
            </p>
            <p className="mt-5 text-[13px] text-[#687993]">
              This certificate is proudly presented to
            </p>
            <h3 className="mt-2 text-[48px] font-extrabold tracking-[-0.06em] text-[#203552]">
              Jane Doe
            </h3>
          </div>

          <div className="rounded-full border-[8px] border-[#d6bb46] bg-[radial-gradient(circle_at_top,#2aa57b_10%,#0a7a5d_70%)] p-5 text-center text-white shadow-[0_16px_36px_rgba(13,120,89,0.2)]">
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em]">Certified</span>
          </div>
        </div>

        <p className="mt-8 max-w-[520px] text-[18px] leading-8 text-[#5f6d84]">
          for successfully completing the professional certification program in
        </p>
        <p className="mt-4 text-[34px] font-extrabold tracking-[-0.05em] text-[#213551]">
          Advanced UI Design Principles
        </p>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-[#edf2f6] pt-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9aa6ba]">
              Course Instructor
            </p>
            <p className="mt-2 text-[15px] font-bold text-[#203552]">Prof. Alexander Sterling</p>
          </div>
          <div className="rounded-[14px] border border-[#e6edf6] bg-[#fafcff] px-5 py-4 text-center">
            <div className="mx-auto h-14 w-14 rounded-[12px] border border-dashed border-[#bfd4c8]" />
            <p className="mt-2 text-[11px] font-medium text-[#9aa6ba]">ID: LBS-829-UX</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9aa6ba]">
              Date Issued
            </p>
            <p className="mt-2 text-[15px] font-bold text-[#203552]">October 24, 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationDetailsModal({
  record,
  onClose,
}: {
  record: CertificateRecord;
  onClose: () => void;
}) {
  return (
    <ModalFrame title="Verification Details" onClose={onClose}>
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <VerificationPreview />
        </div>

        <div className="w-full xl:max-w-[420px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#cfe0d7] bg-[#eef7f2] px-6 text-[16px] font-semibold text-[#4b8a60]"
            >
              <Share2 className="mr-2 h-4.5 w-4.5" strokeWidth={2.1} />
              Share Link
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
            >
              <Download className="mr-2 h-4.5 w-4.5" strokeWidth={2.1} />
              Download PDF
            </button>
          </div>

          <div className="mt-6 rounded-[22px] bg-[#f8fbff] p-6">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#51627f]">
              Verification Status
            </p>
            <div className="mt-4 flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f8ef] text-[#0f8751]">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">
                  Authenticity Confirmed
                </p>
                <p className="mt-1 text-[15px] font-medium text-[#4f63dc]">
                  Record found in Academic Ledger
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#ecf1f7] bg-white p-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">Student</p>
              <p className="mt-3 text-[18px] font-extrabold text-[#172f54]">{record.student}</p>
            </div>
            <div className="rounded-[18px] border border-[#ecf1f7] bg-white p-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">
                ID Number
              </p>
              <p className="mt-3 text-[18px] font-extrabold text-[#172f54]">{record.idNumber}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-[#ecf1f7] bg-white p-5">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#4f63dc]">Issuing Body</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[radial-gradient(circle_at_top,#f7d8b4_10%,#e2a16d_42%,#d08c59_100%)]" />
              <div>
                <p className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">{record.school}</p>
                <p className="mt-1 text-[15px] text-[#7c8ba3]">Director Of Registry</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}

function ReissueSuccessModal({
  record,
  onClose,
}: {
  record: CertificateRecord;
  onClose: () => void;
}) {
  return (
    <ModalFrame title="" onClose={onClose} maxWidthClassName="max-w-[760px]">
      <div className="-mt-2">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -left-5 top-3 h-4 w-4 rounded-full bg-[#e5f4ec]" />
            <div className="absolute -right-5 top-8 h-6 w-6 rounded-full bg-[#bcded1]" />
            <div className="absolute left-1/2 top-[-10px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#7db69f]" />
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#f8fbff] text-[#0f8751] shadow-[0_20px_50px_rgba(170,184,221,0.14)]">
              <ShieldCheck className="h-12 w-12" strokeWidth={2.1} />
            </div>
          </div>
          <h3 className="mt-6 text-[24px] font-extrabold tracking-[-0.05em] text-[#172f54]">
            Certificate Successfully Reissued
          </h3>
          <p className="mt-2 max-w-[420px] text-[16px] leading-7 text-[#6b7d97]">
            The digital ledger has been updated. A notification has been sent to the recipient.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <section className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#4e5f7b]">
              Official Credential
            </p>
            <div className="mt-5 flex flex-col gap-5 rounded-[22px] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[28px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                  Dr. Helena Montgomery
                </p>
                <p className="mt-2 text-[17px] text-[#4157d8]">Senior Clinical Research Fellow</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
                  Issue Date
                </p>
                <p className="mt-2 text-[17px] text-[#6d7f98]">Since Oct 2023</p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#4e5f7b]">
              Credential Breakdown
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-white p-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">Status</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0f8751]" />
                  <p className="text-[18px] font-extrabold text-[#172f54]">Active</p>
                </div>
              </div>
              <div className="rounded-[18px] bg-white p-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">Registry ID</p>
                <p className="mt-3 text-[18px] font-extrabold text-[#172f54]">EM-2023-9981-HM</p>
              </div>
              <div className="rounded-[18px] bg-white p-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">
                  Security Hash
                </p>
                <p className="mt-3 text-[18px] font-extrabold text-[#172f54]">{record.securityHash}</p>
              </div>
              <div className="rounded-[18px] bg-white p-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#97a4b8]">Expires</p>
                <p className="mt-3 text-[18px] font-extrabold text-[#172f54]">{record.expiryDate}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-[18px] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[radial-gradient(circle_at_top,#f8d8b9_10%,#e0a16d_42%,#d08a59_100%)]" />
                <div>
                  <p className="text-[15px] font-medium text-[#4157d8]">Authorized By</p>
                  <p className="mt-1 text-[18px] font-extrabold text-[#172f54]">Director Of Registry</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] bg-[#f8fbff] p-6">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#4e5f7b]">Quick Actions</p>
            <div className="mt-5 space-y-4">
              <button
                type="button"
                className="button-primary flex w-full items-center justify-between rounded-[16px] bg-[#0f8751] px-5 py-5 text-left text-white"
              >
                <span className="flex items-center gap-3 text-[22px] font-semibold">
                  <Eye className="h-5 w-5" strokeWidth={2.1} />
                  View Certificate
                </span>
                <ExternalLink className="h-5 w-5" strokeWidth={2.1} />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[16px] bg-white px-5 py-5 text-left text-[#20526f]"
              >
                <span className="flex items-center gap-3 text-[22px] font-semibold">
                  <Download className="h-5 w-5" strokeWidth={2.1} />
                  Download PDF
                </span>
                <span className="rounded-[10px] bg-[#eef7f1] px-3 py-2 text-[14px] font-bold text-[#4b8a60]">2.4 MB</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[16px] border border-[#cfe5d7] bg-white px-5 py-5 text-[22px] font-semibold text-[#647592]"
              >
                <Share2 className="h-5 w-5" strokeWidth={2.1} />
                Share Credential
              </button>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#d2e8da] bg-[#f4fbf7] p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0f8751]">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#0f8751]">Verification</p>
                <p className="mt-3 text-[16px] leading-7 text-[#566a85]">
                  This certificate is cryptographically signed and stored on the immutable Emerald Ledger.
                  Anyone with the Registry ID can verify its authenticity.
                </p>
                <button type="button" className="mt-4 text-[16px] font-extrabold text-[#0f8751]">
                  Verify Public Link
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ModalFrame>
  );
}

function RevokeCertificateModal({
  reason,
  onReasonChange,
  onClose,
}: {
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <ModalFrame title="" onClose={onClose} maxWidthClassName="max-w-[560px]">
      <div className="-mt-2">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f3] text-[#f03c5a]">
            <AlertTriangle className="h-7 w-7" strokeWidth={2.1} />
          </span>
          <h3 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#172f54]">
            Revoke Certificate
          </h3>
        </div>

        <div className="mt-7 rounded-[18px] border border-[#ffd8de] bg-[#fff3f5] px-5 py-4 text-[16px] leading-8 text-[#c1294c]">
          This action is irreversible. Revoking this credential will immediately invalidate the
          verification link and notify the issuing institution.
        </div>

        <div className="mt-7">
          <label className="block text-[15px] font-medium text-[#5c6f8d]">Reason For Revocation</label>
          <textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            rows={4}
            placeholder="Please provide a detailed justification for this system action..."
            className="mt-3 w-full rounded-[16px] border border-[#dbe3f1] bg-white px-4 py-4 text-[16px] text-[#1e314f] outline-none placeholder:text-[#7687a4]"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#dbe3f1] bg-white px-6 text-[17px] font-semibold text-[#485a76]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#f22952] px-6 text-[17px] font-semibold text-white"
          >
            Revoke Certificate
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

export default function CertificateManagementPage() {
  const [openActionRow, setOpenActionRow] = useState<number | null>(1);
  const [activeModal, setActiveModal] = useState<CertificateModal>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<number>(1);
  const [revokeReason, setRevokeReason] = useState("");

  const selectedRecord = useMemo(
    () => certificateRecords.find((record) => record.id === selectedRecordId) ?? certificateRecords[0],
    [selectedRecordId],
  );

  const openModal = (modal: Exclude<CertificateModal, null>, recordId: number) => {
    setSelectedRecordId(recordId);
    setOpenActionRow(null);
    setActiveModal(modal);
  };

  return (
    <AppShell
      title="Certificates Management"
      activeSection="certificate"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
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
                />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Audience Type
              </span>
              <span className="relative mt-3 block">
                <select className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                  <option>Date Range: All Time</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b89a0]" strokeWidth={2.2} />
              </span>
            </label>

            <label className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7e8aa0]">
                Date Range
              </span>
              <span className="relative mt-3 block">
                <select className="h-[52px] w-full appearance-none rounded-[14px] bg-[#f3f6fb] px-4 pr-10 text-[15px] font-medium text-[#274267] outline-none">
                  <option>School: All Schools</option>
                  <option>Global Tech University</option>
                  <option>Greenfield Institute</option>
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
            {certificateRecords.map((record) => (
              <article
                key={record.id}
                className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[1.2fr_1.25fr_1.3fr_0.95fr_0.55fr] lg:items-center"
              >
                <div className="flex items-center gap-4">
                  <CertificateAvatar />
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
                  >
                    <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                  </button>

                  {openActionRow === record.id ? (
                    <div className="absolute right-0 top-11 z-10 w-[228px] rounded-[16px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                      <button
                        type="button"
                        onClick={() => openModal("verify", record.id)}
                        className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                      >
                        Verify Certificate
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal("revoke", record.id)}
                        className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                      >
                        Revoke Certificate
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal("reissue", record.id)}
                        className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                      >
                        Reissue Certificate
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <p>Showing 1 to 5 of 12,840 certificates</p>

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
              <span className="px-1 text-[#98a2b6]">...</span>
              <button type="button" className="inline-flex h-10 items-center justify-center px-1 text-[15px] font-bold text-[#203552]">
                256
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {activeModal === "verify" ? (
        <VerificationDetailsModal record={selectedRecord} onClose={() => setActiveModal(null)} />
      ) : null}
      {activeModal === "reissue" ? (
        <ReissueSuccessModal record={selectedRecord} onClose={() => setActiveModal(null)} />
      ) : null}
      {activeModal === "revoke" ? (
        <RevokeCertificateModal
          reason={revokeReason}
          onReasonChange={setRevokeReason}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </AppShell>
  );
}
