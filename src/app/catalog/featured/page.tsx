import { CalendarDays, CirclePlus, Info, UserRound, Eye, Zap, Goal } from "lucide-react";
import { AppShell } from "@/components/app-shell";

function MetricCard({
  icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  iconClassName: string;
}) {
  const Icon = icon;

  return (
    <article className="rounded-[20px] border border-[#e1e8f4] bg-white p-6 shadow-[0_18px_34px_rgba(180,193,229,0.06)]">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${iconClassName}`}>
          <Icon className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#72829a]">
          {label}
        </p>
      </div>
      <p className="mt-5 text-[22px] font-extrabold tracking-[-0.04em] text-[#16345d]">{value}</p>
    </article>
  );
}

export default function FeaturedSettingsPage() {
  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto max-w-[1320px]">
        <section className="mt-12">
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              Featured Settings
            </h1>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-[#4057d8]"
              aria-label="Add featured item"
            >
              <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[470px_minmax(0,1fr)]">
          <article className="rounded-[24px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Quick Insight
            </h2>

            <div className="mt-8 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,rgba(25,7,6,0.98),rgba(79,13,9,0.82)),radial-gradient(circle_at_18%_18%,rgba(232,119,78,0.35),transparent_24%)]">
              <div className="h-[380px] bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.26),transparent_16%),linear-gradient(90deg,rgba(255,255,255,0.12)_0_34%,transparent_34%)]" />
            </div>

            <h3 className="mt-8 text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
              Startup Fundamentals
            </h3>
            <p className="mt-4 text-[16px] leading-8 text-[#667792]">
              Master the lean methodology and venture capital foundations in this 12-week
              comprehensive track.
            </p>

            <div className="mt-8 flex items-center gap-3 text-[16px] font-semibold text-[#11814a]">
              <UserRound className="h-5 w-5" strokeWidth={2.1} />
              <span>Instructor: Dr. Sarah Aris</span>
            </div>
          </article>

          <article className="overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="p-8">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Configuration
              </h2>

              <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                    Feature Priority
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {[
                      { number: "01", label: "CRUCIAL", active: true },
                      { number: "02", label: "NORMAL", active: false },
                      { number: "03", label: "LOW", active: false },
                    ].map((priority) => (
                      <button
                        key={priority.number}
                        type="button"
                        className={[
                          "rounded-[16px] border px-4 py-6 text-center",
                          priority.active
                            ? "border-[#4d63e1] bg-[#eef1ff] text-[#4d63e1]"
                            : "border-[#dfe6f4] bg-white text-[#6c7c95]",
                        ].join(" ")}
                      >
                        <p className="text-[24px] font-extrabold tracking-[-0.04em]">
                          {priority.number}
                        </p>
                        <p className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.08em]">
                          {priority.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                    Promotional Badge Text
                  </p>
                  <div className="mt-4 rounded-[16px] bg-[#f5f8fb] px-6 py-5 text-[20px] font-extrabold tracking-[0.12em] text-[#202c3f]">
                    TRENDING NOW
                  </div>
                  <p className="mt-3 text-[14px] italic text-[#7b89a2]">
                    Max 15 characters. Appears on the thumbnail corner.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  Duration Settings
                </p>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  {["Oct 24, 2023", "Jan 24, 2024"].map((date) => (
                    <div
                      key={date}
                      className="flex h-[66px] items-center gap-4 rounded-[16px] bg-[#f5f8fb] px-5 text-[18px] font-medium text-[#203553]"
                    >
                      <CalendarDays className="h-6 w-6 text-[#7584a1]" strokeWidth={2.1} />
                      <span>{date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#e8edf7] pt-8">
                <div>
                  <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                    Email Students of Category
                  </h3>
                  <p className="mt-2 text-[16px] text-[#72829a]">
                    Notify students interested in &quot;Entrepreneurship&quot;
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-16 items-center rounded-full bg-[#0f8751] px-1"
                >
                  <span className="ml-auto flex h-7 w-7 rounded-full bg-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e8edf7] bg-[#f8fbfa] px-8 py-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
              >
                Discard Changes
              </button>
              <button
                type="button"
                className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
              >
                Confirm Featured Status
              </button>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[470px_minmax(0,1fr)]">
          <article className="rounded-[24px] border border-[#dfe8f3] bg-[#f8fbfa] p-7 shadow-[0_18px_38px_rgba(180,193,229,0.05)]">
            <div className="flex items-center gap-3 text-[#0f8751]">
              <Info className="h-6 w-6" strokeWidth={2.1} />
              <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#203553]">
                Promotion Logic
              </p>
            </div>
            <p className="mt-7 text-[16px] leading-8 text-[#72829a]">
              Featured courses are displayed at the top of the course catalog and student
              dashboard. Priority 1 items appear in the hero carousel. High duration featured
              items will be auto-reviewed by the registrar.
            </p>
          </article>

          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard icon={Eye} label="Projected Views" value="12.4K" iconClassName="bg-[#ecf8ef] text-[#11814a]" />
            <MetricCard icon={Zap} label="Impression Lift" value="+42%" iconClassName="bg-[#fff1d7] text-[#ef8b1c]" />
            <MetricCard icon={Goal} label="CTR Forecast" value="8.1%" iconClassName="bg-[#eef1ff] text-[#4d63e1]" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
