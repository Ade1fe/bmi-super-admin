"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  EllipsisVertical,
  Search,
  Star,
  Tickets,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  buildSupportHref,
  buildSupportTicketHref,
  initialSupportTickets,
  loadStoredSupportTickets,
  persistSupportTickets,
  supportMetrics,
  ticketPriorityClassName,
  ticketStatusClassName,
  type SupportCategory,
  type SupportStatus,
  type SupportTicket,
} from "@/app/support/support-flow";

type StatusModalState = {
  ticket: SupportTicket;
  status: SupportStatus;
  reason: string;
  notify: boolean;
} | null;

function TopTabLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[18px] font-medium transition-colors ${
        active
          ? "border border-[#dbe3f1] bg-white font-bold text-[#4b8a60] shadow-[0_8px_24px_rgba(176,188,223,0.12)]"
          : "text-[#5f7290]"
      }`}
    >
      <span>{label}</span>
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f1f4f6] px-2 text-[13px] font-bold text-[#8391a8]">
        {count}
      </span>
    </Link>
  );
}

function MetricCard({
  metric,
  icon,
}: {
  metric: (typeof supportMetrics)[number];
  icon: ReactNode;
}) {
  return (
    <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[17px] font-medium text-[#203552]">{metric.label}</p>
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-[10px] ${metric.accentClassName}`}>
          {icon}
        </span>
      </div>
      <div className="mt-10 flex items-center gap-3">
        <p className="text-[46px] font-extrabold tracking-[-0.06em] text-[#173257]">
          {metric.value}
          {metric.suffix ? <span className="ml-1 text-[26px] text-[#9aa6bc]">{metric.suffix}</span> : null}
        </p>
        <span className={`inline-flex rounded-full px-3 py-1.5 text-[14px] font-bold ${metric.noteClassName}`}>
          {metric.note}
        </span>
      </div>
    </article>
  );
}

function downloadTicketsCsv(tickets: SupportTicket[]) {
  if (typeof window === "undefined") {
    return;
  }

  const csv = [
    "ticket_id,from,category,priority,status,last_updated",
    ...tickets.map(
      (ticket) =>
        `${ticket.ticketNumber},${ticket.from},${ticket.category},${ticket.priority},${ticket.status},${ticket.lastUpdated}`,
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "support-tickets.csv";
  link.click();
  window.URL.revokeObjectURL(url);
}

function Pager() {
  return (
    <div className="flex items-center gap-2 self-end lg:self-auto">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#1e9162] bg-[#eaf8f0] text-[15px] font-bold text-[#0f8751]"
      >
        1
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[15px] font-bold text-[#6a7891]"
      >
        2
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[15px] font-bold text-[#6a7891]"
      >
        3
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dbe3f1] text-[#98a2b6]"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}

function StatusChangeModal({
  modalState,
  onClose,
  onConfirm,
  onChange,
}: {
  modalState: StatusModalState;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (state: StatusModalState) => void;
}) {
  if (!modalState) {
    return null;
  }

  const statusOptions: Array<{ value: SupportStatus; detail: string; dotClassName: string }> = [
    { value: "Open", detail: "Currently active status", dotClassName: "bg-[#5a43ff]" },
    { value: "In Progress", detail: "Work is being executed", dotClassName: "bg-[#ff7d18]" },
    { value: "Resolved", detail: "Problem addressed", dotClassName: "bg-[#498d63]" },
    { value: "On Hold", detail: "Awaiting external input", dotClassName: "bg-[#498d63]" },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[610px]">
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            <div className="px-8 py-8 sm:px-10">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#5d47ff]">
                Admin Action
              </p>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">
                Update Ticket Status
              </h2>
              <p className="mt-2 text-[16px] text-[#6b7d97]">
                Referencing Ticket ID: <span className="font-bold text-[#172f54]">{modalState.ticket.from}</span>
              </p>

              <div className="mt-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7081a1]">
                  Select New Status
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {statusOptions.map((option) => {
                    const active = modalState.status === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange({ ...modalState, status: option.value })}
                        className={`rounded-[16px] border px-5 py-4 text-left ${
                          active ? "border-[#5a43ff] bg-[#f1efff] shadow-[inset_0_0_0_1px_#5a43ff]" : "border-[#dfe6f7]"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`h-3 w-3 rounded-full ${option.dotClassName}`} />
                          <div>
                            <p className="text-[17px] font-extrabold text-[#172f54]">{option.value}</p>
                            <p className="mt-1 text-[14px] text-[#6b7d97]">{option.detail}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#101927]">
                    Reason For Change
                  </p>
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#a3afc3]">
                    Required Field
                  </p>
                </div>
                <textarea
                  value={modalState.reason}
                  onChange={(event) => onChange({ ...modalState, reason: event.target.value })}
                  placeholder="Enter administrative justification for this status update..."
                  rows={4}
                  className="mt-3 w-full rounded-[14px] border border-[#dbe3f1] bg-[#fbfefd] px-4 py-4 text-[16px] text-[#173257] outline-none placeholder:text-[#b0bacc]"
                />
              </div>

              <label className="mt-5 flex items-center gap-3 text-[15px] text-[#60718f]">
                <input
                  type="checkbox"
                  checked={modalState.notify}
                  onChange={(event) => onChange({ ...modalState, notify: event.target.checked })}
                  className="h-5 w-5 rounded border border-[#dbe3f1]"
                />
                Notify Relevant Agents Of this Change.
              </label>
            </div>

            <div className="flex flex-col gap-3 bg-[#fbfcff] px-8 py-6 sm:flex-row sm:justify-end sm:px-10">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#bfd9cb] bg-white px-6 text-[17px] font-semibold text-[#4b8a60]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={modalState.reason.trim().length === 0}
                className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#4b8a60] px-6 text-[17px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Confirm Changes
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default function SupportCenterPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<SupportCategory>("All Tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<StatusModalState>(null);

  useEffect(() => {
    const hydrateTickets = window.setTimeout(() => {
      setTickets(loadStoredSupportTickets());
      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrateTickets);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    persistSupportTickets(tickets);
  }, [hasHydrated, tickets]);

  const filteredTickets = tickets.filter((ticket) => {
    if (categoryFilter !== "All Tickets" && ticket.category !== categoryFilter) {
      return false;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return [
      ticket.ticketNumber,
      ticket.from,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.title,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const handleConfirmStatus = () => {
    if (!statusModal) {
      return;
    }

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === statusModal.ticket.id
          ? {
              ...ticket,
              status: statusModal.status,
              lastUpdated: "Just now",
            }
          : ticket,
      ),
    );
    setStatusModal(null);
  };

  const categoryTabs: SupportCategory[] = [
    "All Tickets",
    "Technical",
    "Payment",
    "Course Access",
    "Onboarding",
  ];

  return (
    <AppShell
      title="Support Center"
      activeSection="support"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-[#f5f6fd] px-4 py-2">
          <TopTabLink href={buildSupportHref("tickets")} label="Tickets" count={2} active />
          <TopTabLink href={buildSupportHref("chat")} label="Live Chat" count={2} active={false} />
        </div>

        <section className="mt-8 grid gap-5 xl:grid-cols-4">
          <MetricCard
            metric={supportMetrics[0]}
            icon={<Tickets className="h-5 w-5" strokeWidth={2.1} />}
          />
          <MetricCard
            metric={supportMetrics[1]}
            icon={<CircleHelp className="h-5 w-5" strokeWidth={2.1} />}
          />
          <MetricCard
            metric={supportMetrics[2]}
            icon={<Clock3 className="h-5 w-5" strokeWidth={2.1} />}
          />
          <MetricCard metric={supportMetrics[3]} icon={<Star className="h-5 w-5" strokeWidth={2.1} />} />
        </section>

        <div className="mt-9 flex flex-wrap gap-3">
          {categoryTabs.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={`rounded-full border px-6 py-3 text-[16px] font-semibold transition-colors ${
                categoryFilter === category
                  ? "border-[#4b8a60] bg-[#4b8a60] text-white"
                  : "border-[#dfe6f7] bg-white text-[#62738f]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[#edf1f7] px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Support Tickets</h2>
            <label className="flex h-12 w-full max-w-[300px] items-center gap-3 rounded-[14px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
              <Search className="h-4.5 w-4.5" strokeWidth={2.1} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-[15px] font-medium text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search tickets..."
              />
            </label>
          </div>

          <div className="hidden grid-cols-[0.9fr_1.4fr_1fr_0.8fr_0.95fr_0.95fr_0.55fr] gap-4 bg-[#fbfcff] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7f8ca2] lg:grid">
            <span>Ticket ID</span>
            <span>From</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Last Updated</span>
            <span>Actions</span>
          </div>

          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="grid gap-4 border-t border-[#edf1f7] px-5 py-5 sm:px-7 lg:grid-cols-[0.9fr_1.4fr_1fr_0.8fr_0.95fr_0.95fr_0.55fr] lg:items-center"
            >
              <p className="text-[17px] font-medium text-[#118a62]">{ticket.ticketNumber}</p>
              <p className="text-[17px] font-extrabold text-[#172f54]">{ticket.from}</p>
              <span className="inline-flex w-fit rounded-[8px] bg-[#eef2f7] px-3 py-1.5 text-[13px] font-extrabold uppercase text-[#5e708c]">
                {ticket.category}
              </span>
              <p className={`text-[16px] font-extrabold ${ticketPriorityClassName(ticket.priority)}`}>
                {ticket.priority}
              </p>
              <p className={`text-[16px] font-extrabold ${ticketStatusClassName(ticket.status)}`}>
                • {ticket.status}
              </p>
              <p className="text-[16px] text-[#64758f]">{ticket.lastUpdated}</p>
              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenRow((current) => (current === ticket.id ? null : ticket.id))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8fa0ba]"
                >
                  <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                </button>

                {openRow === ticket.id ? (
                  <div className="absolute right-0 top-11 z-10 w-[192px] rounded-[16px] border border-[#e7ecf6] bg-white p-2 text-left shadow-[0_20px_44px_rgba(164,176,212,0.22)]">
                    <Link
                      href={buildSupportTicketHref(ticket)}
                      className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/support/${ticket.id}`}
                      className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                    >
                      Assign Agent
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusModal({
                          ticket,
                          status: ticket.status,
                          reason: "",
                          notify: false,
                        });
                        setOpenRow(null);
                      }}
                      className="flex w-full items-center rounded-[12px] px-4 py-3 text-[15px] font-medium text-[#36455f] hover:bg-[#f7f9fd]"
                    >
                      Update Ticket Status
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}

          <div className="flex flex-col gap-4 border-t border-[#edf1f7] px-5 py-4 text-[15px] font-medium text-[#536781] sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <p>Showing {filteredTickets.length} of {tickets.length} tickets</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => downloadTicketsCsv(filteredTickets)}
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#f6f8fd] px-4 text-[15px] font-semibold text-[#5c6f8d]"
              >
                <Download className="h-4.5 w-4.5" strokeWidth={2.1} />
                Export
              </button>
              <Pager />
            </div>
          </div>
        </section>
      </div>

      <StatusChangeModal
        modalState={statusModal}
        onClose={() => setStatusModal(null)}
        onConfirm={handleConfirmStatus}
        onChange={setStatusModal}
      />
    </AppShell>
  );
}
