import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Save,
  Underline,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

function ToolButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[#556783] hover:bg-[#f5f7fb]"
    >
      {children}
    </button>
  );
}

export default function MessageStudentPage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/students/john-doe" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Message Student</span>
        </div>
      }
      activeSection="student"
    >
      <div className="mx-auto max-w-[1180px]">
        <section>
          <h1 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[32px]">
            Send Message
          </h1>
          <p className="mt-3 text-[16px] text-[#304a72] sm:text-[18px]">
            Compose a direct communication to a student as part of the support module.
          </p>
        </section>

        <section className="mt-10 rounded-[14px] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.12)]">
          <div className="space-y-7 p-8 sm:p-10">
            <label className="block">
              <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                To
              </span>
              <div className="flex min-h-[60px] items-center gap-3 rounded-[10px] border border-[#d9e0ef] bg-[#fbfcff] px-4">
                <UserRound className="h-4.5 w-4.5 shrink-0 text-[#8ea0bf]" strokeWidth={2.1} />
                <span className="min-w-0 flex-1 truncate text-[16px] text-[#51627f]">
                  Jordan Smith &lt;jordan.smith@university.edu&gt;
                </span>
                <span className="rounded-[8px] bg-[#e4fae8] px-3 py-2 text-[12px] font-bold tracking-[0.08em] text-[#258c5a]">
                  PRE-FILLED
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                Subject
              </span>
              <input
                defaultValue="Enter the subject of your message..."
                className="h-[60px] w-full rounded-[10px] border border-[#d9e0ef] bg-white px-5 text-[15px] text-[#7b88a1] outline-none"
              />
            </label>

            <div>
              <span className="mb-3 block text-[18px] font-bold tracking-[-0.02em] text-[#19355d]">
                Message Body
              </span>

              <div className="overflow-hidden rounded-[10px] border border-[#d9e0ef] bg-white">
                <div className="flex flex-wrap items-center gap-1 border-b border-[#e8edf7] px-3 py-3">
                  <ToolButton>
                    <Bold className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <ToolButton>
                    <Italic className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <ToolButton>
                    <Underline className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <div className="mx-1 h-6 w-px bg-[#dbe3f0]" />
                  <ToolButton>
                    <List className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <ToolButton>
                    <ListOrdered className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <div className="mx-1 h-6 w-px bg-[#dbe3f0]" />
                  <ToolButton>
                    <Link2 className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                  <ToolButton>
                    <ImageIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </ToolButton>
                </div>

                <textarea
                  defaultValue="Write your message here..."
                  className="min-h-[330px] w-full resize-none px-5 py-5 text-[16px] text-[#7b88a1] outline-none"
                />
              </div>

              <button
                type="button"
                className="mt-8 inline-flex items-center gap-3 text-[16px] font-semibold text-[#0f8751]"
              >
                <Paperclip className="h-5 w-5" strokeWidth={2.1} />
                Attach student files or reports
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e8edf7] bg-[#f9fbff] px-8 py-8 sm:flex-row sm:justify-end sm:px-10">
            <button
              type="button"
              className="inline-flex h-[64px] w-full items-center justify-center rounded-[10px] border border-[#cbdccd] bg-[#edf5f1] px-8 text-[16px] font-semibold text-[#4a8b61] sm:w-auto"
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-[64px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-9 text-[16px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] sm:w-auto"
            >
              <Save className="h-4.5 w-4.5" strokeWidth={2.2} />
              Save Message
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-[12px] border border-[#bfd0ff] bg-[#eef3ff] px-6 py-6 text-[18px] text-[#4e5f7c]">
          <span className="font-extrabold text-[#223b61]">Support &amp; Communication Module:</span>{" "}
          This message will be delivered to the student&apos;s registered email address and their
          internal platform inbox. A copy will be logged in the support history for Jordan Smith.
        </section>
      </div>
    </AppShell>
  );
}
