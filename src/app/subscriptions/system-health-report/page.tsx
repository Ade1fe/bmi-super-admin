import Link from "next/link";
import {
  CalendarDays,
  CirclePlus,
  Database,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type HealthMetric = {
  label: string;
  value: string;
  helper: string;
  tone?: "positive" | "critical";
};

type ClusterMetric = {
  label: string;
  value: number;
};

type LogRow = {
  time: string;
  component: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  detail: string;
};

const healthMetrics: HealthMetric[] = [
  { label: "Server Uptime", value: "1240", helper: "+0.02% from last week", tone: "positive" },
  { label: "Active Session", value: "12,482", helper: "Current peak load: 84%", tone: "positive" },
  { label: "Average Response Time", value: "142ms", helper: "Optimal performance", tone: "positive" },
  { label: "Average Response Time", value: "24 /4CRITICAL", helper: "Last critical: 2h ago", tone: "critical" },
];

const clusterMetrics: ClusterMetric[] = [
  { label: "Disk Usage", value: 45 },
  { label: "White Latency", value: 45 },
  { label: "Cache Hit Rate", value: 45 },
];

const infraLine = [66, 68, 67, 68, 68, 69, 68, 70, 69, 70, 71, 70, 71, 74, 76, 77, 77, 75, 71, 76, 78, 79, 81, 82, 81, 78, 80, 79, 78, 80, 81, 86, 86];

const logRows: LogRow[] = [
  {
    time: "14:12:05",
    component: "Auth Service",
    severity: "CRITICAL",
    detail: "Cache hit ratio dropped below 85%",
  },
  {
    time: "13:58:22",
    component: "Media CDN",
    severity: "WARNING",
    detail: "Cache hit ratio dropped below 85%",
  },
  {
    time: "14:12:05",
    component: "System Audit",
    severity: "CRITICAL",
    detail: "Automated daily backup successful",
  },
  {
    time: "14:12:05",
    component: "Local Balancer",
    severity: "INFO",
    detail: "Cache hit ratio dropped below 85%",
  },
  {
    time: "13:58:22",
    component: "Media CDN",
    severity: "WARNING",
    detail: "Cache hit ratio dropped below 85%",
  },
  {
    time: "13:58:22",
    component: "Media CDN",
    severity: "WARNING",
    detail: "Cache hit ratio dropped below 85%",
  },
];

const chartWidth = 660;
const chartHeight = 240;
const minValue = Math.min(...infraLine);
const maxValue = Math.max(...infraLine);
const range = maxValue - minValue || 1;
const linePoints = infraLine
  .map((value, index) => {
    const x = 22 + (index * (chartWidth - 44)) / (infraLine.length - 1);
    const y = 170 - ((value - minValue) / range) * 78;
    return `${x},${y}`;
  })
  .join(" ");
const areaPoints = `22,188 ${linePoints} ${chartWidth - 22},188`;

function severityClass(severity: LogRow["severity"]) {
  if (severity === "CRITICAL") {
    return "bg-[#fff0f0] text-[#d93939]";
  }

  if (severity === "WARNING") {
    return "bg-[#fff0dc] text-[#d77a18]";
  }

  return "bg-[#edf1f7] text-[#1f2d43]";
}

function MetricCard({ metric }: { metric: HealthMetric }) {
  return (
    <article className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-7">
      <p className="text-[18px] font-extrabold tracking-[-0.04em] text-[#173257]">{metric.label}</p>
      <p className="mt-7 text-[54px] font-extrabold tracking-[-0.06em] text-[#173257]">{metric.value}</p>
      <p
        className={`mt-3 text-[14px] font-semibold ${
          metric.tone === "critical" ? "text-[#f24b4b]" : "text-[#0f8751]"
        }`}
      >
        {metric.helper}
      </p>
    </article>
  );
}

export default function SystemHealthReportPage() {
  return (
    <AppShell
      title="System Health Report"
      activeSection="subscriptions"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto max-w-[1288px]">
        <div className="flex justify-end">
          <Link
            href="/subscriptions/create-plan"
            className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-6 text-[16px] font-semibold text-white"
          >
            <CirclePlus className="h-5 w-5" strokeWidth={2.2} />
            Create New Plan
          </Link>
        </div>

        <section className="mt-8 grid gap-4 xl:grid-cols-4">
          {healthMetrics.map((metric) => (
            <MetricCard key={`${metric.label}-${metric.value}`} metric={metric} />
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
          <article className="rounded-[22px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Infrastructure Performance
                </h2>
                <p className="mt-1 text-[15px] text-[#7c8ba3]">
                  New student sign-ups across all schools
                </p>
              </div>
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#233654]">
                <span className="h-3 w-3 rounded-full bg-[#0f8751]" />
                Monthly Target
              </div>
            </div>

            <div className="mt-8 rounded-[18px] border border-[#eef2f7] p-4">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                {[0, 25, 50, 75, 100].map((level, index) => {
                  const y = 18 + (index * 170) / 4;
                  return (
                    <g key={level}>
                      <line x1="22" y1={y} x2={chartWidth - 22} y2={y} stroke="#edf1f7" strokeWidth="1" />
                      <text x="0" y={y + 4} fill="#a0aec2" fontSize="12" fontWeight="600">
                        {100 - level}%
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <linearGradient id="infraArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5aa688" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#5aa688" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#infraArea)" />
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#4d8f6c"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="mt-3 grid grid-cols-7 text-center text-[14px] font-medium text-[#73839d]">
                {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[22px] bg-white p-6 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Database Cluster
            </h2>
            <div className="mt-7 space-y-8">
              {clusterMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[16px] font-bold text-[#203250]">{metric.label}</p>
                    <p className="text-[16px] font-extrabold text-[#162540]">{metric.value}%</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e2eeec]">
                    <div
                      className="h-full rounded-full bg-[#0f8751]"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-3 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4d63e1]">
              <Database className="h-5 w-5" strokeWidth={2.1} />
              PostgreSQL Cluster Healthy
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <article className="rounded-[22px] bg-white p-6 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Regional Connectivity Map
            </h2>

            <div className="mt-6 overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_center,_rgba(53,196,133,0.35),_rgba(4,20,47,0.96)_60%)] p-4">
              <div className="relative flex h-[380px] items-center justify-center rounded-[14px] border border-[#10294a] bg-[radial-gradient(circle_at_center,_rgba(22,180,122,0.16),_rgba(7,22,44,0.96)_72%)]">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(17,44,74,0.65)_95%),linear-gradient(90deg,transparent_95%,rgba(17,44,74,0.65)_95%)] bg-[size:28px_28px] opacity-45" />
                <div className="absolute h-[210px] w-[210px] rounded-full border border-[#2ef0b4]/35 bg-[#29d493]/10 blur-2xl" />
                <div className="absolute left-16 top-20 h-2.5 w-2.5 rounded-full bg-[#59ffca] shadow-[0_0_16px_rgba(89,255,202,0.95)]" />
                <div className="absolute left-32 bottom-24 h-2.5 w-2.5 rounded-full bg-[#59ffca] shadow-[0_0_16px_rgba(89,255,202,0.95)]" />
                <div className="absolute right-24 top-24 h-2.5 w-2.5 rounded-full bg-[#59ffca] shadow-[0_0_16px_rgba(89,255,202,0.95)]" />
                <div className="absolute right-32 bottom-16 h-2.5 w-2.5 rounded-full bg-[#59ffca] shadow-[0_0_16px_rgba(89,255,202,0.95)]" />
                <div className="rounded-full bg-white/18 px-8 py-5 text-center text-white shadow-[0_18px_44px_rgba(6,20,42,0.34)] backdrop-blur">
                  <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-white/85">
                    All Service Nominal Global Load: 42%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#7b8ca7]">
                  North America
                </p>
                <p className="mt-2 text-[16px] font-extrabold text-[#0f8751]">Optimal</p>
              </div>
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#7b8ca7]">
                  Europe
                </p>
                <p className="mt-2 text-[16px] font-extrabold text-[#0f8751]">Optimal</p>
              </div>
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#7b8ca7]">
                  Asia
                </p>
                <p className="mt-2 text-[16px] font-extrabold text-[#ff7f1f]">Latency Warning</p>
              </div>
            </div>
          </article>

          <article className="rounded-[22px] bg-white p-6 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Lesson Engagement
              </h2>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[14px] font-semibold text-[#314868]"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={2} />
                Last 30 days
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[18px] border border-[#e9edf6]">
              <div className="grid grid-cols-[0.9fr_1fr_0.8fr_1fr] gap-4 bg-[#fbfcff] px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#97a5ba]">
                <span>Timestamp</span>
                <span>Component</span>
                <span>Severity</span>
                <span>Avg. Time</span>
              </div>
              {logRows.map((row, index) => (
                <div
                  key={`${row.time}-${index}`}
                  className={`grid grid-cols-[0.9fr_1fr_0.8fr_1fr] gap-4 border-t border-[#edf1f7] px-5 py-5 text-[15px] text-[#50607d] ${
                    index === 0 ? "border-t-0" : ""
                  }`}
                >
                  <span className="font-bold text-[#243450]">{row.time}</span>
                  <span className="font-bold text-[#243450]">{row.component}</span>
                  <span>
                    <span className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${severityClass(row.severity)}`}>
                      {row.severity}
                    </span>
                  </span>
                  <span>{row.detail}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
