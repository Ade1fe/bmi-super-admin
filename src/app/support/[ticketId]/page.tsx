"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Image as ImageIcon, Loader2, TableProperties } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  loadStoredSupportTickets,
  mapApiTicketToUi,
  type SupportTicket,
} from "@/app/support/support-flow";
import { getSupportTicketDetails } from "@/lib/support-api";
import { useAuthSession } from "@/lib/auth-session";

function useAuthToken(): string {
  const { session } = useAuthSession();
  return session?.token ?? "";
}

export default function SupportTicketDetailPage() {
  const params = useParams<{ ticketId: string }>();
  const authToken = useAuthToken();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.ticketId) return;

    // Try localStorage first for instant render
    const stored = loadStoredSupportTickets();
    const cached = stored.find((t) => t.id === params.ticketId);
    if (cached) setTicket(cached);

    // Always fetch fresh from API if we have a token
    if (!authToken) {
      if (!cached) setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getSupportTicketDetails(params.ticketId, authToken)
      .then((apiTicket) => {
        // The API may return the ticket wrapped in data or directly
        const raw = (apiTicket as { data?: typeof apiTicket }).data ?? apiTicket;
        const uiTicket = mapApiTicketToUi(raw as Parameters<typeof mapApiTicketToUi>[0]);
        setTicket(uiTicket);
      })
      .catch((err) => {
        // If API fails but we have cached data, just keep it silently
        if (!cached) {
          setError(err instanceof Error ? err.message : "Failed to load ticket.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.ticketId, authToken]);

  if (loading && !ticket) {
    return (
      <AppShell title="Support Center" activeSection="support">
        <div className="flex items-center justify-center gap-3 py-20 text-[#8391a8]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-[17px] font-medium">Loading ticket…</span>
        </div>
      </AppShell>
    );
  }

  if (error && !ticket) {
    return (
      <AppShell title="Support Center" activeSection="support">
        <div className="px-6 py-10 text-[18px] font-semibold text-[#e53e3e]">{error}</div>
      </AppShell>
    );
  }

  if (!ticket) {
    return (
      <AppShell title="Support Center" activeSection="support">
        <div className="px-6 py-10 text-[18px] font-semibold text-[#536781]">
          Ticket not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Support Center"
      activeSection="support"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <section className="grid gap-4 xl:grid-cols-4">
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-[8px] bg-[#e7f8ef] px-3 py-1 text-[13px] font-extrabold text-[#258861]">
                {ticket.caseCode}
              </span>
              <span className="inline-flex rounded-[8px] bg-[#ffe58a] px-3 py-1 text-[13px] font-extrabold uppercase text-[#d27400]">
                {ticket.status}
              </span>
            </div>
            <h2 className="mt-5 text-[18px] font-extrabold leading-8 text-[#172f54]">{ticket.title}</h2>
            <div className="mt-5 rounded-[12px] bg-[#eef0ff] px-5 py-4">
              <p className="text-[16px] font-medium text-[#4b5de0]">
                Priority Level:{" "}
                <span className="font-extrabold text-[#ff4a4a]">
                  {ticket.priority} (Academic Impact)
                </span>
              </p>
            </div>
          </article>

          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Ticket Summary</p>
            <p className="mt-5 text-[16px] leading-8 text-[#46556b]">{ticket.summary}</p>
          </article>

          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Assigned Support</p>
            <p className="mt-5 text-[18px] font-extrabold text-[#172f54]">{ticket.assignedAgent}</p>
          </article>

          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Submitted by</p>
            <p className="mt-5 text-[18px] font-extrabold text-[#172f54]">{ticket.submittedBy}</p>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">
              Detail Description
            </h2>
            <div className="mt-8 flex items-start gap-5">
              <span
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold ${ticket.requesterTone}`}
              >
                {ticket.requesterAvatar}
              </span>
              <article className="flex-1 rounded-[24px] border border-[#dfe6f7] bg-white px-8 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">
                    {ticket.requesterName}
                  </p>
                  <span className="inline-flex rounded-[10px] bg-[#eef2f7] px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#23324a]">
                    ({ticket.requesterRole})
                  </span>
                </div>
                <div className="mt-8 space-y-5 text-[19px] leading-10 text-[#2f405d]">
                  {ticket.description.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                {ticket.attachments.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-5">
                    {ticket.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="inline-flex items-center gap-4 rounded-[14px] border border-[#d9ebe4] bg-[#fbfffd] px-5 py-4"
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef8f1] text-[#0f8751]">
                          {attachment.type === "sheet" ? (
                            <TableProperties className="h-4.5 w-4.5" strokeWidth={2.1} />
                          ) : (
                            <ImageIcon className="h-4.5 w-4.5" strokeWidth={2.1} />
                          )}
                        </span>
                        <p className="text-[18px] font-extrabold text-[#172f54]">
                          {attachment.name}{" "}
                          {attachment.size ? (
                            <span className="text-[15px] font-medium text-[#7d8aa0]">
                              {attachment.size}
                            </span>
                          ) : null}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </div>

          <aside className="rounded-[24px] border border-[#dfe6f7] bg-white px-8 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <h3 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">
              Execution Timeline
            </h3>
            <div className="mt-10 space-y-10">
              {ticket.executionTimeline.map((step, index) => (
                <div key={step.id} className="relative pl-8">
                  {index !== ticket.executionTimeline.length - 1 ? (
                    <span className="absolute left-[11px] top-6 h-[calc(100%+24px)] w-[2px] bg-[#dfebe5]" />
                  ) : null}
                  <span
                    className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 ${
                      step.state === "current"
                        ? "border-[#0f8751] bg-[#0f8751]"
                        : step.state === "pending"
                          ? "border-[#d9e4f1] bg-[#aab7ca]"
                          : "border-[#dcf5e7] bg-[#9fe0b8]"
                    }`}
                  />
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#7c8ba2]">
                    {step.state === "current"
                      ? "Current State"
                      : step.state === "pending"
                        ? "Pending"
                        : step.timestamp}
                  </p>
                  <h4 className="mt-1 text-[18px] font-extrabold text-[#172f54]">{step.title}</h4>
                  <p className="mt-2 text-[16px] leading-7 text-[#687993]">{step.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}