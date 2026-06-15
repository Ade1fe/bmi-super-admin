"use client";

import { useEffect, useState } from "react";
import { Loader2, X, Check } from "lucide-react";
import {
  getAvailableSupportAgents,
  assignSupportAgent,
  type SupportAgent,
} from "@/lib/support-api";
import type { SupportTicket } from "@/app/support/support-flow";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function workloadColor(workload: SupportAgent["workload"]): string {
  switch (workload) {
    case "MINIMAL":
      return "text-[#2d8c5c]";
    case "MODERATE":
      return "text-[#d97706]";
    case "HEAVY":
    case "OFFLINE":
      return "text-[#e53e3e]";
    default:
      return "text-[#8391a8]";
  }
}

function workloadLabel(workload: SupportAgent["workload"]): string {
  switch (workload) {
    case "MINIMAL":
      return "LOW WORKLOAD";
    case "MODERATE":
      return "MODERATE";
    case "HEAVY":
      return "AT CAPACITY";
    case "OFFLINE":
      return "OFFLINE";
    default:
      return workload;
  }
}

function agentInitials(agent: SupportAgent): string {
  return `${agent.firstName[0] ?? ""}${agent.lastName[0] ?? ""}`.toUpperCase();
}

const AVATAR_COLORS = [
  "bg-[#e4f7ee] text-[#0f8751]",
  "bg-[#efe4ff] text-[#6f44ff]",
  "bg-[#fff2dc] text-[#bd7700]",
  "bg-[#fde8e8] text-[#d94040]",
  "bg-[#e0f0ff] text-[#1a7ac8]",
];

// ─────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────

interface AssignAgentModalProps {
  ticket: SupportTicket | null;
  authToken: string;
  onClose: () => void;
  onAssigned?: (ticket: SupportTicket, agentId: string) => void;
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export function AssignAgentModal({
  ticket,
  authToken,
  onClose,
  onAssigned,
}: AssignAgentModalProps) {
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch agents on open
  useEffect(() => {
    if (!ticket || !authToken) return;
    setLoading(true);
    setError(null);
    setSelectedAgentId(ticket.assignedAgent?.startsWith("Agent #") ? null : null);

    getAvailableSupportAgents(authToken)
      .then(setAgents)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load agents.")
      )
      .finally(() => setLoading(false));
  }, [ticket, authToken]);

  if (!ticket) return null;

  const handleConfirm = async () => {
    if (!selectedAgentId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await assignSupportAgent(ticket.id, { agentId: selectedAgentId }, authToken);
      onAssigned?.(ticket, selectedAgentId);
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to assign agent.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[610px]">
          {/* Close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8d8d8d]/75 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur md:-right-16 md:-top-16"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(20,28,48,0.26)]">
            {/* Header */}
            <div className="px-8 py-8 sm:px-10">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#5d47ff]">
                Admin Action
              </p>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-[#172f54]">
                Assign Support Agent
              </h2>
              <p className="mt-2 text-[16px] text-[#6b7d97]">
                Referencing Ticket ID:{" "}
                <span className="font-bold text-[#172f54]">
                  {ticket.ticketNumber}
                </span>{" "}
                &mdash;{" "}
                <span className="font-semibold text-[#172f54]">{ticket.from}</span>
              </p>

              {/* Agent list */}
              <div className="mt-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7081a1]">
                  Available Agents ({loading ? "…" : agents.length})
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  {loading ? (
                    <div className="flex items-center justify-center gap-3 py-10 text-[#8391a8]">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-[15px] font-medium">Loading agents…</span>
                    </div>
                  ) : error ? (
                    <div className="rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-4 text-[15px] text-[#a42f2f]">
                      {error}
                    </div>
                  ) : agents.length === 0 ? (
                    <div className="py-8 text-center text-[15px] text-[#8391a8]">
                      No agents available at the moment.
                    </div>
                  ) : (
                    agents.map((agent, i) => {
                      const active = selectedAgentId === agent.id;
                      const avatarClass = AVATAR_COLORS[i % AVATAR_COLORS.length];

                      return (
                        <button
                          key={agent.id}
                          type="button"
                          disabled={agent.workload === "OFFLINE"}
                          onClick={() => setSelectedAgentId(agent.id)}
                          className={`flex items-center gap-4 rounded-[16px] border px-5 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            active
                              ? "border-[#4b8a60] bg-[#eaf8f0] shadow-[inset_0_0_0_1px_#4b8a60]"
                              : "border-[#dfe6f7] hover:bg-[#f8faff]"
                          }`}
                        >
                          {/* Avatar */}
                          <span
                            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold ${avatarClass}`}
                          >
                            {agentInitials(agent)}
                          </span>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[16px] font-extrabold text-[#172f54]">
                              {agent.firstName} {agent.lastName}
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#6b7d97]">
                              {/* role not in API; show email as subtitle */}
                              {agent.email}
                            </p>
                          </div>

                          {/* Workload badge */}
                          <div className="shrink-0 text-right">
                            <p className="text-[14px] font-bold text-[#172f54]">
                              {agent.activeTicketsCount} ACTIVE TICKET
                              {agent.activeTicketsCount !== 1 ? "S" : ""}
                            </p>
                            <p className={`mt-0.5 text-[12px] font-extrabold ${workloadColor(agent.workload)}`}>
                              {workloadLabel(agent.workload)}
                            </p>
                          </div>

                          {/* Selection indicator */}
                          <span
                            className={`ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              active
                                ? "border-[#4b8a60] bg-[#4b8a60] text-white"
                                : "border-[#dbe3f1] bg-white"
                            }`}
                          >
                            {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Save error */}
              {saveError && (
                <div className="mt-4 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-3 text-[15px] text-[#a42f2f]">
                  {saveError}
                </div>
              )}
            </div>

            {/* Footer */}
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
                onClick={handleConfirm}
                disabled={!selectedAgentId || saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#4b8a60] px-6 text-[17px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Confirm Assignment
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}