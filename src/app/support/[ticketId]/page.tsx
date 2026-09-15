"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { Image as ImageIcon, Loader2, Lock, Send, TableProperties } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  loadStoredSupportTickets,
  mapApiTicketToUi,
  type ReplyMode,
  type SupportTicket,
  type TicketActivity,
} from "@/app/support/support-flow";
import { addTicketActivity, getSupportTicketDetails } from "@/lib/support-api";
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
  const [replyMode, setReplyMode] = useState<ReplyMode>("public");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const loadTicket = useCallback(
    (hasCache: boolean) => {
      if (!params.ticketId || !authToken) return;
      setLoading(true);
      setError(null);

      getSupportTicketDetails(params.ticketId, authToken)
        .then((apiTicket) => {
          // The API may return the ticket wrapped in data or directly
          const raw = (apiTicket as { data?: typeof apiTicket }).data ?? apiTicket;
          setTicket(mapApiTicketToUi(raw as Parameters<typeof mapApiTicketToUi>[0]));
        })
        .catch((err) => {
          // If API fails but we have cached data, just keep it silently
          if (!hasCache) {
            setError(err instanceof Error ? err.message : "Failed to load ticket.");
          }
        })
        .finally(() => setLoading(false));
    },
    [params.ticketId, authToken],
  );

  useEffect(() => {
    if (!params.ticketId) return;

    // Try localStorage first for instant render
    const stored = loadStoredSupportTickets();
    const cached = stored.find((t) => t.id === params.ticketId);
    if (cached) setTicket(cached);

    if (!authToken) {
      if (!cached) setLoading(false);
      return;
    }
    loadTicket(Boolean(cached));
  }, [params.ticketId, authToken, loadTicket]);

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = replyText.trim();
    if (!content || !ticket || !authToken || sending) return;
    setSending(true);
    try {
      await addTicketActivity(
        ticket.id,
        { content, isInternalNote: replyMode === "internal" },
        authToken,
      );
      setReplyText("");
      toast.success(
        replyMode === "internal"
          ? "Internal note saved. The requester will not see it."
          : `Reply sent to ${ticket.requesterName}.`,
      );
      loadTicket(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post the reply.");
    } finally {
      setSending(false);
    }
  }

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

            <h2 className="mt-12 text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">
              Conversation
            </h2>
            <p className="mt-2 text-[15px] text-[#7c8ba2]">
              Replies to the requester appear in their Help &amp; Support screen. Internal notes stay
              between agents.
            </p>

            <div className="mt-6 space-y-5">
              {ticket.activity.length === 0 ? (
                <p className="rounded-[16px] border border-dashed border-[#dfe6f7] px-6 py-8 text-center text-[16px] text-[#8391a8]">
                  No messages yet.
                </p>
              ) : (
                ticket.activity.map((entry) => <ActivityCard key={entry.id} entry={entry} />)
              )}
            </div>

            <form
              onSubmit={handleReply}
              className="mt-8 rounded-[24px] border border-[#dfe6f7] bg-white px-6 py-6 shadow-[0_16px_34px_rgba(171,185,223,0.05)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <ReplyModeButton
                  active={replyMode === "public"}
                  onClick={() => setReplyMode("public")}
                  label="Reply to requester"
                />
                <ReplyModeButton
                  active={replyMode === "internal"}
                  onClick={() => setReplyMode("internal")}
                  label="Internal note"
                  icon={<Lock className="h-3.5 w-3.5" strokeWidth={2.2} />}
                />
              </div>
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={4}
                maxLength={5000}
                placeholder={
                  replyMode === "internal"
                    ? "Add a private note for the support team…"
                    : `Write a reply to ${ticket.requesterName}…`
                }
                aria-label={replyMode === "internal" ? "Internal note" : "Reply to requester"}
                className={`mt-4 w-full rounded-[16px] border px-5 py-4 text-[16px] leading-7 text-[#172f54] outline-none placeholder:text-[#9aa6bc] focus:ring-4 ${
                  replyMode === "internal"
                    ? "border-[#f3d9a4] bg-[#fffaf0] focus:border-[#d27400] focus:ring-[#ffe9c7]"
                    : "border-[#dfe6f7] bg-[#f8fafd] focus:border-[#4b8a60] focus:ring-[#dcefe2]"
                }`}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] text-[#8391a8]">
                  {replyMode === "internal"
                    ? "Hidden from the requester."
                    : ticket.status === "Resolved"
                      ? "This ticket is resolved; the requester can reopen it by replying."
                      : "⌘/Ctrl + Enter to send."}
                </p>
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className={`inline-flex h-12 items-center gap-2 rounded-[12px] px-6 text-[15px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    replyMode === "internal"
                      ? "bg-[#d27400] hover:bg-[#b56400]"
                      : "bg-[#4b8a60] hover:bg-[#3f7752]"
                  }`}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" strokeWidth={2.2} />
                  )}
                  {sending ? "Posting…" : replyMode === "internal" ? "Save note" : "Send reply"}
                </button>
              </div>
            </form>
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
const ACTIVITY_TONE: Record<TicketActivity["tone"], { card: string; badge: string }> = {
  requester: {
    card: "border-[#dfe6f7] bg-white",
    badge: "bg-[#eef2f7] text-[#23324a]",
  },
  agent: {
    card: "border-[#cfe9db] bg-[#f4fbf7]",
    badge: "bg-[#e7f8ef] text-[#258861]",
  },
  internal: {
    card: "border-[#f3d9a4] bg-[#fffaf0]",
    badge: "bg-[#ffe9c7] text-[#b56400]",
  },
};

function ActivityCard({ entry }: { entry: TicketActivity }) {
  const tone = ACTIVITY_TONE[entry.tone];
  return (
    <article className={`rounded-[20px] border px-6 py-5 shadow-[0_10px_24px_rgba(171,185,223,0.05)] ${tone.card}`}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[17px] font-extrabold text-[#172f54]">{entry.author}</p>
        <span className={`inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.1em] ${tone.badge}`}>
          {entry.tone === "internal" ? <Lock className="h-3 w-3" strokeWidth={2.4} /> : null}
          {entry.badge}
        </span>
        <span className="text-[14px] font-medium text-[#8391a8]">{entry.timestamp}</span>
      </div>
      <div className="mt-3 space-y-3 text-[16px] leading-8 text-[#2f405d]">
        {entry.body.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
        ))}
      </div>
      {entry.attachment ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-[#d9ebe4] bg-[#fbfffd] px-3 py-2 text-[14px] font-bold text-[#0f8751]">
          <ImageIcon className="h-4 w-4" strokeWidth={2.1} />
          {entry.attachment.name}
        </p>
      ) : null}
    </article>
  );
}

function ReplyModeButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-10 items-center gap-2 rounded-[10px] border px-4 text-[14px] font-bold transition ${
        active
          ? "border-[#172f54] bg-[#172f54] text-white"
          : "border-[#dfe6f7] bg-white text-[#536781] hover:bg-[#f4f7fb]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
