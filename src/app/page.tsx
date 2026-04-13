import {
  Building2,
  CalendarDays,
  Landmark,
  ShieldCheck,
  SquareActivity,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type StatCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  iconBox: string;
};

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  icon: LucideIcon;
  iconBox: string;
};

const stats: StatCard[] = [
  {
    label: "Total Schools",
    value: "140",
    delta: "+5.2%",
    icon: Landmark,
    iconBox: "bg-[#f1ebff] text-[#7f5af0]",
  },
  {
    label: "Total Students",
    value: "9,200",
    delta: "+12.4%",
    icon: Users,
    iconBox: "bg-[#e9f2ff] text-[#2d83ff]",
  },
  {
    label: "Active Subscriptions",
    value: "6,700",
    delta: "+8.1%",
    icon: CalendarDays,
    iconBox: "bg-[#edf4ef] text-[#55715c]",
  },
  {
    label: "Monthly Revenue",
    value: "$15,400",
    delta: "+15.3%",
    icon: WalletCards,
    iconBox: "bg-[#f4ebfb] text-[#8e63af]",
  },
];

const growthBars = [
  { day: "Mon", value: 24 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 79, highlight: true },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 35 },
  { day: "Sun", value: 24 },
];

const engagementTrend = [
  38, 40, 38, 39, 39, 40, 40, 42, 40, 43, 42, 44, 43, 45, 49, 51, 51, 49, 44,
  50, 52, 56, 57, 55, 51, 54, 52, 54, 56, 63,
];

const activities: ActivityItem[] = [
  {
    title: "New school joined: St. Patrick's Academy",
    detail: "Onboarded with 450 initial students and 15 staff members.",
    time: "10m ago",
    icon: Building2,
    iconBox: "bg-[#edf3ff] text-[#3567ff]",
  },
  {
    title: "Certificates Issued: Batch #204",
    detail: "25 minutes ago",
    time: "10m ago",
    icon: ShieldCheck,
    iconBox: "bg-[#edf9ef] text-[#2fa360]",
  },
  {
    title: "Subscription Renewed: Global Arts Institute",
    detail: "Enterprise annual plan renewed successfully. Invoice #INV-88902.",
    time: "10m ago",
    icon: WalletCards,
    iconBox: "bg-[#fff4ea] text-[#ef721e]",
  },
  {
    title: "System Maintenance Completed",
    detail: "Database optimization and security patches applied across all clusters.",
    time: "10m ago",
    icon: SquareActivity,
    iconBox: "bg-[#f5efff] text-[#9a57ff]",
  },
];

const planBreakdown = [
  { label: "Enterprise Plan", value: "70%", color: "#f1b64d" },
  { label: "Standard Plan", value: "25%", color: "#e05d3f" },
  { label: "Free Tier", value: "5%", color: "#1d23c7" },
];

const chartWidth = 620;
const chartHeight = 250;
const minTrend = Math.min(...engagementTrend);
const maxTrend = Math.max(...engagementTrend);
const trendRange = maxTrend - minTrend || 1;

const linePoints = engagementTrend
  .map((value, index) => {
    const x = 24 + (index * (chartWidth - 48)) / (engagementTrend.length - 1);
    const y = 190 - ((value - minTrend) / trendRange) * 68;
    return `${x},${y}`;
  })
  .join(" ");

const areaPoints = `24,210 ${linePoints} ${chartWidth - 24},210`;

function SummaryCard({ card }: { card: StatCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-[18px] border border-[#e8eafb] bg-white px-8 py-9 shadow-[0_18px_34px_rgba(154,168,213,0.06)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[15px] font-medium text-[#344769]">{card.label}</p>
          <div className="mt-10 flex items-center gap-3">
            <p className="text-[29px] font-extrabold tracking-[-0.04em] text-[#16345d]">
              {card.value}
            </p>
            <span className="rounded-full bg-[#e8fbf0] px-3 py-1.5 text-[14px] font-bold text-[#19b873]">
              {card.delta}
            </span>
          </div>
        </div>

        <div className={`rounded-xl p-3.5 ${card.iconBox}`}>
          <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <AppShell title="Dashboard" activeSection="dashboard">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <SummaryCard key={card.label} card={card} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:mt-10 lg:gap-8 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-[20px] bg-white p-5 shadow-[0_20px_48px_rgba(190,198,233,0.14)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#16345d]">
                New Schools Growth
              </h2>
              <p className="mt-1 text-[15px] font-medium text-[#8090a8]">
                School registration trends over last 6 months
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#dfe4f1] px-4 text-[14px] font-semibold text-[#223c60]"
            >
              <CalendarDays className="h-4 w-4" strokeWidth={2} />
              Last 6 month
            </button>
          </div>

          <div className="mt-10 grid h-[250px] grid-cols-7 items-end gap-3 sm:mt-14 sm:h-[330px] sm:gap-7">
            {growthBars.map((bar) => (
              <div key={bar.day} className="flex h-full flex-col items-center justify-end gap-3">
                <div className="flex h-full w-full items-end">
                  <div
                    className={[
                      "w-full rounded-t-[6px] bg-[#c9ded8]",
                      bar.highlight
                        ? "bg-[linear-gradient(180deg,#5ea68b_0%,#58a486_70%,#dfffee_100%)]"
                        : "",
                    ].join(" ")}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="text-[14px] font-medium text-[#7f88a0]">{bar.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] bg-white p-5 shadow-[0_20px_48px_rgba(190,198,233,0.14)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#16345d]">
                Engagement Trends
              </h2>
              <p className="mt-1 text-[15px] font-medium text-[#8090a8]">
                New student sign-ups across all schools
              </p>
            </div>

            <div className="flex items-center gap-2 text-[14px] font-bold text-[#223c60]">
              <span className="h-3 w-3 rounded-full bg-[#16804f]" />
              Monthly Target
            </div>
          </div>

          <div className="mt-10">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-[220px] w-full sm:h-[314px]"
              preserveAspectRatio="none"
              aria-label="Engagement trends"
            >
              <defs>
                <linearGradient id="engagement-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4b8b62" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#4b8b62" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#engagement-fill)" />
              <polyline
                points={linePoints}
                fill="none"
                stroke="#4b8b62"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-medium text-[#7f88a0] sm:text-[14px]">
              {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:mt-8 lg:gap-8 xl:grid-cols-[1.18fr_0.88fr]">
        <article className="rounded-[20px] bg-white p-5 shadow-[0_20px_48px_rgba(190,198,233,0.14)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#16345d]">
              Weekly Learning Activity
            </h2>
            <button type="button" className="text-[14px] font-bold text-[#4d63e9]">
              View All
            </button>
          </div>

          <div className="mt-7 space-y-6 sm:mt-9 sm:space-y-8">
            {activities.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3 sm:gap-4">
                  <div className={`rounded-full p-4 ${item.iconBox}`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-bold leading-6 text-[#19355d]">{item.title}</p>
                    <p className="mt-1 text-[15px] font-medium leading-6 text-[#596883]">
                      {item.detail}
                    </p>
                  </div>
                  <p className="hidden pt-2 text-[14px] font-medium text-[#a3acbe] sm:block">
                    {item.time}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-[20px] bg-white p-5 shadow-[0_20px_48px_rgba(190,198,233,0.14)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#16345d]">
              Student Registrations
            </h2>
            <button type="button" className="text-right text-[14px] font-bold text-[#4d63e9]">
              Generate Full Report
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-10">
            <div className="relative flex h-[240px] w-[240px] items-center justify-center sm:h-[288px] sm:w-[288px]">
              <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
                <circle cx="130" cy="130" r="82" fill="none" stroke="#eef1fa" strokeWidth="36" />
                <circle
                  cx="130"
                  cy="130"
                  r="82"
                  fill="none"
                  stroke="#1d23c7"
                  strokeWidth="36"
                  strokeDasharray="350 515"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="82"
                  fill="none"
                  stroke="#f0b750"
                  strokeWidth="36"
                  strokeDasharray="95 515"
                  strokeDashoffset="-352"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="82"
                  fill="none"
                  stroke="#df603d"
                  strokeWidth="36"
                  strokeDasharray="70 515"
                  strokeDashoffset="-447"
                />
              </svg>

              <div className="absolute inset-[48px] rounded-full bg-white sm:inset-[57px]" />
              <div className="absolute text-center">
                <p className="text-[42px] font-extrabold tracking-[-0.05em] text-[#3c4048] sm:text-[54px]">
                  6.7k
                </p>
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#7f879a]">
                  Active Users
                </p>
              </div>

              <span className="absolute left-1 top-9 rounded-2xl bg-[#25272f] px-3 py-2 text-[14px] font-bold text-white sm:left-4 sm:top-12 sm:text-[15px]">
                45%
              </span>
              <span className="absolute right-0 top-[92px] rounded-2xl bg-[#25272f] px-3 py-2 text-[14px] font-bold text-white sm:right-[8px] sm:top-[116px] sm:text-[15px]">
                79%
              </span>
              <span className="absolute bottom-5 left-0 rounded-2xl bg-[#25272f] px-3 py-2 text-[14px] font-bold text-white sm:bottom-8 sm:left-2 sm:text-[15px]">
                45%
              </span>
            </div>

            <div className="w-full space-y-5">
              {planBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="text-[15px] font-bold text-[#19355d]">{item.label}</span>
                  </div>
                  <span className="text-[18px] font-extrabold text-[#16345d]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
