"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, EllipsisVertical, Link2, SendHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  buildSupportHref,
  initialLiveChatThreads,
  type LiveChatMessage,
  type LiveChatThread,
} from "@/app/support/support-flow";

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

function ChatBubble({ message }: { message: LiveChatMessage }) {
  const isAssistant = message.sender === "assistant";

  return (
    <div className={`flex gap-4 ${isAssistant ? "" : "justify-end"}`}>
      {isAssistant ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4f7ee] text-[#0f8751]">
          <Bot className="h-5 w-5" strokeWidth={2.1} />
        </span>
      ) : null}

      <div className={`max-w-[74%] ${isAssistant ? "" : "items-end"}`}>
        <div
          className={`rounded-[20px] px-5 py-4 text-[16px] leading-8 shadow-[0_12px_28px_rgba(188,198,225,0.08)] ${
            isAssistant ? "bg-[#0f8751] text-white" : "bg-white text-[#2f405d]"
          }`}
        >
          {message.body}
        </div>
        {message.attachment ? (
          <div className="mt-3 flex max-w-[380px] items-center gap-4 rounded-[14px] border border-[#dbe3f1] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(188,198,225,0.08)]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#efebff] text-[#6450ff]">
              <Link2 className="h-4.5 w-4.5" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-[15px] font-extrabold text-[#172f54]">{message.attachment.name}</p>
              <p className="mt-1 text-[14px] text-[#6c7d98]">{message.attachment.size}</p>
            </div>
          </div>
        ) : null}
        <p className={`mt-3 text-[15px] text-[#7a879e] ${isAssistant ? "" : "text-right"}`}>{message.timestamp}</p>
      </div>

      {!isAssistant ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe4ff] text-[14px] font-extrabold text-[#6f44ff]">
          SJ
        </span>
      ) : null}
    </div>
  );
}

export default function SupportLiveChatPage() {
  const [threads, setThreads] = useState<LiveChatThread[]>(initialLiveChatThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialLiveChatThreads[0].id);
  const [draft, setDraft] = useState("");

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? threads[0];

  const handleSend = () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              preview: trimmedDraft,
              lastSeen: "Just now",
              unread: false,
              messages: [
                ...thread.messages,
                {
                  id: `m-${thread.messages.length + 1}`,
                  sender: "assistant",
                  body: trimmedDraft,
                  timestamp: "Just now",
                },
              ],
            }
          : thread,
      ),
    );
    setDraft("");
  };

  return (
    <AppShell
      title="Support Center"
      activeSection="support"
      contentClassName="px-0 py-0 lg:px-0 lg:py-0"
    >
      <div className="flex h-full min-h-[calc(100vh-84px)] flex-col lg:min-h-0">
        <div className="border-b border-[#e7ebf7] bg-[#f5f6fd] px-4 py-2 sm:px-6 lg:px-9">
          <div className="flex flex-wrap items-center gap-4">
            <TopTabLink href={buildSupportHref("tickets")} label="Tickets" count={2} active={false} />
            <TopTabLink href={buildSupportHref("chat")} label="Live Chat" count={2} active />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[406px_minmax(0,1fr)]">
          <aside className="border-r border-[#e7ebf7] bg-white">
            <div className="border-b border-[#edf1f7] px-6 py-8">
              <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#172f54]">Live Chat Support Centre</h2>
            </div>

            <div className="overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full border-b border-[#edf1f7] px-6 py-6 text-left transition-colors ${
                    activeThreadId === thread.id ? "bg-[#fbfffd] shadow-[inset_0_0_0_2px_#4b8a60]" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${thread.avatarTone}`}>
                      {thread.participant
                        .split(" ")
                        .slice(0, 2)
                        .map((value) => value[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[17px] font-extrabold text-[#172f54]">{thread.participant}</p>
                          <p className="mt-1 text-[15px] text-[#74839d]">{thread.lastSeen}</p>
                        </div>
                        {thread.unread ? (
                          <span className="rounded-full bg-[#efebff] px-3 py-1 text-[14px] font-bold text-[#6e64ff]">
                            New
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 truncate text-[16px] text-[#2f405d]">{thread.preview}</p>
                      <span className="mt-4 inline-flex rounded-full bg-[#e7f8ef] px-3 py-1 text-[13px] font-extrabold text-[#258861]">
                        {thread.badge}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#edf1f7] px-6 py-6 lg:px-8">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e4f7ee] text-[#0f8751]">
                  <Bot className="h-6 w-6" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[22px] font-extrabold tracking-[-0.04em] text-[#172f54]">BMI City Assistant</p>
                  <p className="mt-1 text-[16px] text-[#665dff]">Active now</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#e6ebf6] text-[#8797ae]"
              >
                <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-8 lg:px-8">
              {activeThread.messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </div>

            <div className="border-t border-[#edf1f7] px-6 py-5 lg:px-8">
              <div className="flex items-center gap-4 rounded-[18px] border border-[#dfe6f7] bg-white px-4 py-3 shadow-[0_12px_26px_rgba(185,194,224,0.08)]">
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#e7ecf6] text-[#7f8ba3]"
                >
                  <Link2 className="h-5 w-5" strokeWidth={2.1} />
                </button>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  className="w-full bg-transparent text-[18px] text-[#173257] outline-none placeholder:text-[#9aa6bc]"
                  placeholder="Type a message"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0f8751] text-white"
                >
                  <SendHorizontal className="h-5 w-5" strokeWidth={2.1} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
