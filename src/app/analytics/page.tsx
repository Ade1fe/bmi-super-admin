import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Lightbulb,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type OverviewMetric = {
  label: string;
  value: string;
  helper: string;
  delta: string;
  tone: "positive" | "negative";
};

type DropoffBar = {
  label: string;
  value: number;
  highlight?: boolean;
};

const overviewMetrics: OverviewMetric[] = [
  {
    label: "Most Completed Courses",
    value: "1240",
    delta: "12%",
    helper: "Since last month",
    tone: "positive",
  },
  {
    label: "Avg. Watch Time",
    value: "42m 15s",
    delta: "5%",
    helper: "Total session duration avg.",
    tone: "positive",
  },
  {
    label: "Quiz Success Rate",
    value: "84%",
    delta: "2%",
    helper: "Passing score average",
    tone: "negative",
  },
];

const dropoffBars: DropoffBar[] = [
  { label: "Mon", value: 52 },
  { label: "", value: 84 },
  { label: "Tue", value: 89 },
  { label: "", value: 72 },
  { label: "Wed", value: 44 },
  { label: "Thur", value: 89, highlight: true },
  { label: "Fri", value: 29 },
  { label: "", value: 67 },
  { label: "Sat", value: 84 },
  { label: "Sun", value: 44 },
];

function OverviewMetricCard({ metric }: { metric: OverviewMetric }) {
  const deltaClassName =
    metric.tone === "negative" ? "text-[#f04f64]" : "text-[#14a467]";
  const DeltaIcon = metric.tone === "negative" ? ArrowDownRight : ArrowUpRight;

  return (
    <article className="rounded-[20px] border border-[#dfe6f7] bg-white px-6 py-7 sm:px-7 sm:py-8">
      <p className="text-[18px] font-extrabold tracking-[-0.04em] text-[#173257]">
        {metric.label}
      </p>
      <div className="mt-9 flex items-center gap-4">
        <p className="text-[42px] font-extrabold tracking-[-0.06em] text-[#173257]">
          {metric.value}
        </p>
        <span className={`inline-flex items-center gap-1 text-[16px] font-bold ${deltaClassName}`}>
          <DeltaIcon className="h-4.5 w-4.5" strokeWidth={2.3} />
          {metric.delta}
        </span>
      </div>
      <p className="mt-3 text-[14px] font-medium text-[#7f8ba1]">{metric.helper}</p>
    </article>
  );
}

function OverviewFilter({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-11 items-center gap-3 rounded-[12px] border px-4 text-[14px] font-semibold transition-colors",
        active
          ? "border-[#d1e3d8] bg-[#dcefe3] text-[#2d7a53]"
          : "border-[#dbe3f1] bg-[#f8fbff] text-[#2a4568]",
      ].join(" ")}
    >
      {label}
      {!active ? <ChevronDown className="h-4 w-4" strokeWidth={2} /> : null}
    </button>
  );
}

export default function AnalyticsOverviewPage() {
  return (
    <AppShell
      title="Content Performance Analytics"
      activeSection="analytics"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto ">
        <section className="grid gap-4 xl:grid-cols-3">
          {overviewMetrics.map((metric) => (
            <OverviewMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-8 rounded-[24px] bg-white px-6 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#173257]">
                Course Drop-off Points Analysis
              </h2>
              <p className="mt-2 text-[15px] font-medium text-[#7b89a0]">
                Percentage of students continuing at each lesson milestone
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <OverviewFilter label="By Category" />
              <OverviewFilter label="All Courses" active />
            </div>
          </div>

          <div className="mt-10 grid h-[330px] grid-cols-5 gap-4 sm:grid-cols-10 sm:gap-6">
            {dropoffBars.map((bar) => (
              <div key={`${bar.label}-${bar.value}`} className="flex h-full flex-col items-center justify-end gap-3">
                <span
                  className={`text-[13px] font-bold ${
                    bar.highlight ? "text-[#f04f64]" : "text-[#7c88a0]"
                  }`}
                >
                  95%
                </span>
                <div className="relative flex h-full w-full items-end justify-center">
                  {bar.highlight ? (
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-[#e92e50] px-4 py-2 text-[13px] font-bold text-white shadow-[0_14px_24px_rgba(233,46,80,0.28)]">
                      Major Bottleneck
                    </span>
                  ) : null}
                  <div
                    className={[
                      "w-full max-w-[78px] rounded-t-[8px]",
                      bar.highlight
                        ? "bg-[linear-gradient(180deg,#ff4747_0%,#9a2626_100%)]"
                        : "bg-[#cfe1da]",
                    ].join(" ")}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="text-[14px] font-medium text-[#7a879d]">
                  {bar.label || "\u00A0"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[24px] bg-white px-6 py-8 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-8">
          <div className="grid gap-10 xl:grid-cols-[460px_minmax(0,1fr)] xl:items-center">
            <div className="mx-auto flex h-[320px] w-[320px] items-center justify-center rounded-full bg-[conic-gradient(#1718c9_0deg_259deg,#f5bf58_259deg_318deg,#e06443_318deg_360deg)] p-3 shadow-[inset_0_0_0_6px_rgba(255,255,255,0.82)]">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(195,204,229,0.22)]">
                <span className="text-[58px] font-extrabold tracking-[-0.06em] text-[#2e3442]">
                  72%
                </span>
                <span className="text-[17px] font-semibold tracking-[0.12em] text-[#78849a]">
                  COMPLETION
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-[#1f8d63]" strokeWidth={2.1} />
                <h2 className="text-[24px] font-medium tracking-[-0.04em] text-[#1c2c47] sm:text-[28px]">
                  Entrepreneurship Course Insight
                </h2>
              </div>

              <p className="mt-6 max-w-[720px] text-[18px] leading-9 text-[#5d708d]">
                While completion remains healthy at{" "}
                <span className="font-bold text-[#1d9d63]">72%</span>, analytics show a
                significant bottleneck at{" "}
                <span className="rounded-[10px] bg-[#e6eef8] px-3 py-1.5 font-semibold text-[#1c8c62]">
                  Lesson 5: Financial Modeling
                </span>
                . Over 40% of the students who don&apos;t finish the course drop off at this
                specific module.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 rounded-[14px] border border-[#f4d8dc] bg-white px-4 py-3 text-[15px] font-semibold text-[#243450]">
                  <AlertTriangle className="h-4 w-4 text-[#f04f64]" strokeWidth={2.2} />
                  Bottleneck: Lesson 5
                </span>
                <span className="inline-flex items-center gap-2 rounded-[14px] border border-[#d8eedd] bg-white px-4 py-3 text-[15px] font-semibold text-[#243450]">
                  <Target className="h-4 w-4 text-[#1d9d63]" strokeWidth={2.2} />
                  72% Progress Stability
                </span>
              </div>

              <Link
                href="/analytics/entrepreneurship-fundamentals"
                className="button-primary mt-10 inline-flex h-14 items-center justify-center rounded-[10px] bg-[#4b8a60] px-8 text-[16px] font-semibold shadow-[0_18px_32px_rgba(75,138,96,0.20)]"
              >
                View Full Course Report
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
