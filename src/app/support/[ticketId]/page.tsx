"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Bot,
  CalendarClock,
  CheckSquare,
  ChevronDown,
  Image as ImageIcon,
  Link2,
  Lock,
  NotebookPen,
  Paperclip,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  initialSupportTickets,
  loadStoredSupportTickets,
  persistSupportTickets,
  supportAgents,
  type ReplyMode,
  type SupportPriority,
  type SupportStatus,
  type SupportTicket,
  type TicketActivity,
} from "@/app/support/support-flow";

function ActivityCard({ activity }: { activity: TicketActivity }) {
  const toneClassName =
    activity.tone === "internal"
      ? "border-[#f2d37b] bg-[#fff8dc]"
      : activity.tone === "agent"
        ? "border-[#1d9c6f] bg-white shadow-[inset_4px_0_0_0_#0f8751]"
        : "border-[#d9e2f3] bg-white";

  const badgeClassName =
    activity.tone === "internal"
      ? "bg-[#ffe58a] text-[#8d5c06]"
      : "bg-[#eef2f7] text-[#23324a]";

  return (
    <div className={`rounded-[22px] border px-6 py-6 shadow-[0_10px_24px_rgba(180,192,224,0.08)] ${toneClassName}`}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[20px] font-extrabold tracking-[-0.03em] text-[#172f54]">{activity.author}</p>
        <p className="text-[16px] text-[#6b7d97]">{activity.timestamp}</p>
        <span className={`inline-flex rounded-[8px] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] ${badgeClassName}`}>
          {activity.badge}
        </span>
      </div>
      <div className="mt-6 space-y-4 text-[16px] leading-8 text-[#2f405d]">
        {activity.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {activity.attachment ? (
        <div className="mt-6 inline-flex items-center gap-4 rounded-[14px] border border-[#d9ebe4] bg-[#fbfffd] px-4 py-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef8f1] text-[#0f8751]">
            <ImageIcon className="h-4.5 w-4.5" strokeWidth={2.1} />
          </span>
          <p className="text-[16px] font-extrabold text-[#172f54]">{activity.attachment.name}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SupportTicketActivityPage() {
  const params = useParams<{ ticketId: string }>();
  const [tickets, setTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activityView, setActivityView] = useState<"all" | "internal">("all");
  const [replyMode, setReplyMode] = useState<ReplyMode>("public");
  const [draftMessage, setDraftMessage] = useState("");

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

  const ticket = tickets.find((entry) => entry.id === params.ticketId);

  if (!ticket) {
    return (
      <AppShell title="Support Center" activeSection="support">
        <div className="px-6 py-10 text-[18px] font-semibold text-[#536781]">Ticket not found.</div>
      </AppShell>
    );
  }

  const renderedActivity =
    ticket.activity.length > 0
      ? ticket.activity
      : [
          {
            id: "generated-request",
            author: ticket.requesterName,
            timestamp: "yesterday at 4:32 PM",
            badge: "REQUESTER",
            tone: "requester" as const,
            body: ticket.description,
            attachment: ticket.attachments[0],
          },
        ];

  const filteredActivity =
    activityView === "internal"
      ? renderedActivity.filter((entry) => entry.tone === "internal")
      : renderedActivity;

  const updateTicket = (updater: (current: SupportTicket) => SupportTicket) => {
    setTickets((currentTickets) =>
      currentTickets.map((entry) => (entry.id === ticket.id ? updater(entry) : entry)),
    );
  };

  const handleSubmitUpdate = () => {
    const trimmedDraft = draftMessage.trim();

    if (!trimmedDraft) {
      return;
    }

    updateTicket((currentTicket) => ({
      ...currentTicket,
      lastUpdated: "Just now",
      activity: [
        ...currentTicket.activity,
        {
          id: `activity-${currentTicket.activity.length + 1}`,
          author: currentTicket.assignedAgent,
          timestamp: "Just now",
          badge: replyMode === "public" ? "SUPPORT AGENT" : "INTERNAL NOTE",
          tone: replyMode === "public" ? "agent" : "internal",
          body: [trimmedDraft],
        },
      ],
    }));
    setDraftMessage("");
  };

  return (
    <AppShell
      title="Support Center"
      activeSection="support"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto">
        <section className="grid gap-4 xl:grid-cols-[1.05fr_1.05fr_1fr_1fr]">
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <span className="inline-flex rounded-full bg-[#e7f8ef] px-3 py-1 text-[13px] font-extrabold text-[#258861]">
              {ticket.caseCode}
            </span>
            <div className="mt-5 flex items-center gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-extrabold ${ticket.requesterTone}`}>
                {ticket.requesterAvatar}
              </span>
              <p className="text-[17px] font-extrabold text-[#172f54]">{ticket.requesterName}</p>
            </div>
          </article>
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Environment</p>
            <p className="mt-3 text-[17px] font-extrabold text-[#172f54]">{ticket.environment}</p>
            <p className="mt-2 text-[15px] text-[#6b7d97]">{ticket.environmentMeta}</p>
          </article>
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Identity</p>
            <p className="mt-3 text-[17px] font-extrabold text-[#172f54]">{ticket.identity}</p>
            <p className="mt-2 text-[15px] text-[#6b7d97]">{ticket.identityMeta}</p>
          </article>
          <article className="rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-5 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
            <p className="text-[16px] font-extrabold text-[#4c5fe0]">Slo Deadline</p>
            <p className="mt-3 text-[17px] font-extrabold text-[#ff4a4a]">{ticket.slaDeadline}</p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">Activity Stream</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActivityView("all")}
                  className={`rounded-[12px] px-5 py-2.5 text-[17px] font-semibold ${
                    activityView === "all" ? "bg-[#eef7f1] text-[#0f8751]" : "text-[#6d7c95]"
                  }`}
                >
                  All Activity
                </button>
                <button
                  type="button"
                  onClick={() => setActivityView("internal")}
                  className={`rounded-[12px] px-5 py-2.5 text-[17px] font-semibold ${
                    activityView === "internal" ? "bg-[#eef7f1] text-[#0f8751]" : "text-[#6d7c95]"
                  }`}
                >
                  Internal Notes
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {filteredActivity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4">
                  <span
                    className={`mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      entry.tone === "requester"
                        ? ticket.requesterTone
                        : entry.tone === "internal"
                          ? "bg-[#fff2dc] text-[#bd7700]"
                          : "bg-[#e4f7ee] text-[#0f8751]"
                    }`}
                  >
                    {entry.tone === "requester" ? (
                      ticket.requesterAvatar
                    ) : entry.tone === "internal" ? (
                      <NotebookPen className="h-5 w-5" strokeWidth={2.1} />
                    ) : (
                      <Bot className="h-5 w-5" strokeWidth={2.1} />
                    )}
                  </span>
                  <ActivityCard activity={entry} />
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-[#dfe6f7] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf1f7] px-6 py-5">
                <div className="flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setReplyMode("public")}
                    className={`inline-flex items-center gap-2 text-[18px] font-bold ${
                      replyMode === "public" ? "text-[#0f8751]" : "text-[#67778f]"
                    }`}
                  >
                    <CheckSquare className="h-4.5 w-4.5" strokeWidth={2.1} />
                    Public Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyMode("internal")}
                    className={`inline-flex items-center gap-2 text-[18px] font-bold ${
                      replyMode === "internal" ? "text-[#0f8751]" : "text-[#67778f]"
                    }`}
                  >
                    <Lock className="h-4.5 w-4.5" strokeWidth={2.1} />
                    Internal Note
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[#5f7291]">
                  <button type="button" className="text-[15px] font-extrabold">B</button>
                  <button type="button" className="text-[15px] italic font-bold">I</button>
                  <Link2 className="h-4.5 w-4.5" strokeWidth={2.1} />
                  <Paperclip className="h-4.5 w-4.5" strokeWidth={2.1} />
                </div>
              </div>
              <textarea
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="min-h-[220px] w-full resize-none bg-white px-6 py-8 text-[18px] text-[#173257] outline-none placeholder:text-[#b0bacc]"
              />
              <div className="flex flex-col gap-3 border-t border-[#edf1f7] bg-[#fbfcff] px-6 py-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDraftMessage("")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#bfd9cb] bg-white px-6 text-[17px] font-semibold text-[#4b8a60]"
                >
                  <Save className="h-4.5 w-4.5" strokeWidth={2.1} />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmitUpdate}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#4b8a60] px-6 text-[17px] font-semibold text-white"
                >
                  <CalendarClock className="h-4.5 w-4.5" strokeWidth={2.1} />
                  Submit Update
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
              <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#172f54]">Properties</h3>

              <div className="mt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#7b89a0]">Status</p>
                <div className="relative mt-3">
                  <select
                    value={ticket.status}
                    onChange={(event) =>
                      updateTicket((currentTicket) => ({
                        ...currentTicket,
                        status: event.target.value as SupportStatus,
                        lastUpdated: "Just now",
                      }))
                    }
                    className="h-12 w-full appearance-none rounded-[12px] border border-[#dbe3f1] bg-white px-4 pr-10 text-[16px] font-semibold text-[#173257] outline-none"
                  >
                    {["Open", "In Progress", "Resolved", "On Hold"].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#7b89a0]">Priority</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {(["Low", "Med", "High"] as const).map((label) => {
                    const priorityValue: SupportPriority =
                      label === "Med" ? "Medium" : (label as Exclude<SupportPriority, "Urgent">);
                    const active = ticket.priority === priorityValue;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          updateTicket((currentTicket) => ({
                            ...currentTicket,
                            priority: priorityValue,
                            lastUpdated: "Just now",
                          }))
                        }
                        className={`h-11 rounded-[12px] border text-[16px] font-semibold ${
                          active ? "border-[#ffb2b2] bg-[#fff2f2] text-[#ff4a4a]" : "border-[#dbe3f1] text-[#60718f]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#7b89a0]">Assigned Agent</p>
                <div className="relative mt-3">
                  <select
                    value={ticket.assignedAgent}
                    onChange={(event) =>
                      updateTicket((currentTicket) => ({
                        ...currentTicket,
                        assignedAgent: event.target.value,
                        lastUpdated: "Just now",
                      }))
                    }
                    className="h-12 w-full appearance-none rounded-[12px] border border-[#dbe3f1] bg-white px-4 pr-10 text-[16px] font-semibold text-[#173257] outline-none"
                  >
                    {supportAgents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73839d]" strokeWidth={2} />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#7b89a0]">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[#f5f7fb] px-3 py-2 text-[13px] font-extrabold uppercase text-[#23324a]"
                    >
                      {tag}
                      <span className="text-[#7c8ba2]">×</span>
                    </span>
                  ))}
                  <button
                    type="button"
                    className="rounded-[8px] border border-dashed border-[#dbe3f1] px-3 py-2 text-[13px] font-extrabold text-[#23324a]"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#dfe6f7] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
              <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#7b89a0]">
                Technical Details
              </h3>
              <div className="mt-6 space-y-4 text-[16px]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b7d97]">IP Address</span>
                  <span className="font-semibold text-[#172f54]">{ticket.technicalDetails.ipAddress}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b7d97]">Session ID</span>
                  <span className="font-semibold text-[#172f54]">{ticket.technicalDetails.sessionId}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b7d97]">Org Code</span>
                  <span className="font-semibold text-[#172f54]">{ticket.technicalDetails.orgCode}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6b7d97]">Language</span>
                  <span className="font-semibold text-[#172f54]">{ticket.technicalDetails.language}</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#f1f4f6] text-[16px] font-semibold text-[#2d8a59]"
              >
                <Paperclip className="h-4.5 w-4.5" strokeWidth={2.1} />
                View Raw Logs
              </button>
            </article>

            <article className="rounded-[24px] border border-[#bfe9d3] bg-[#f3fff8] p-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]">
              <h3 className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#405063]">
                Requester Health
              </h3>
              <div className="mt-5 flex items-end gap-3">
                <p className="text-[44px] font-extrabold tracking-[-0.06em] text-[#101927]">
                  {ticket.requesterHealth.score}
                </p>
                <p className="pb-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#51647f]">
                  Satisfaction Score
                </p>
              </div>
              <p className="mt-5 text-[16px] leading-8 text-[#46556b]">{ticket.requesterHealth.statement}</p>
              <p className="mt-2 text-[16px] leading-8 text-[#46556b]">
                Most related to &quot;{ticket.requesterHealth.relatedTo}.&quot;
              </p>
              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#ddf2e4] text-[16px] font-semibold text-[#2d8a59]"
              >
                View Profile History
              </button>
            </article>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
