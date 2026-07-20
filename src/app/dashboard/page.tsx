"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  LineChart,
  Mail,
  MailWarning,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession, getSessionProfileName } from "@/lib/auth-session";
import { apiRequest, endpoints } from "@/lib/endpoints";

type KPICardData = {
  value: number | string;
  growth: string;
};

type NotificationItem = {
  id: number;
  title: string;
  time: string;
  type: string;
};

type StudentAtRisk = {
  id: number;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  status: string;
};

export default function DashboardPage() {
  const { session } = useAuthSession();
  const token = session?.token;
  const profileName = getSessionProfileName(session) || "Alex";

  const [period, setPeriod] = useState<string>("last_7_days");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState<boolean>(false);

  const [kpiCards, setKpiCards] = useState({
    totalStudents: { value: 5660, growth: "+2.4%" },
    activeThisWeek: { value: 874, growth: "+2.4%" },
    availableSubjects: { value: 12, growth: "-0%" },
    averageProgress: { value: 72, growth: "+5.4%" },
  });

  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: "Mon", value: 24, highlight: false },
    { day: "Tue", value: 68, highlight: false },
    { day: "Wed", value: 30, highlight: false },
    { day: "Thur", value: 79, highlight: true },
    { day: "Fri", value: 68, highlight: false },
    { day: "Sat", value: 35, highlight: false },
    { day: "Sun", value: 24, highlight: false },
  ]);

  const [completionRate, setCompletionRate] = useState({
    totalNumber: 1124,
    completed: 794,
    completedPercentage: 79,
    inProgress: 432,
    inProgressPercentage: 45,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "New student registered for SS2 Science",
      time: "2 minutes ago",
      type: "register",
    },
    {
      id: 2,
      title: "James Wilson completed Entrepreneurship 101",
      time: "25 minutes ago",
      type: "completion",
    },
    {
      id: 3,
      title: "Quiz Submission: History of Modern Arts (12 students)",
      time: "2 hours ago",
      type: "quiz",
    },
    {
      id: 4,
      title: "Course Update: Advanced Physics content added",
      time: "25 minutes ago",
      type: "update",
    },
  ]);

  const [studentsAtRisk, setStudentsAtRisk] = useState<StudentAtRisk[]>([
    {
      id: 1,
      name: "Sarah Miller",
      avatar: "SM",
      course: "Calculus II",
      progress: 12,
      status: "12% Completed",
    },
    {
      id: 2,
      name: "David Kalu",
      avatar: "DK",
      course: "Bio-Chemistry",
      progress: 18,
      status: "18% Completed",
    },
    {
      id: 3,
      name: "Sandra Duke",
      avatar: "SD",
      course: "Fine Arts",
      progress: 18,
      status: "18% Completed",
    },
    {
      id: 4,
      name: "Sandra Duke",
      avatar: "SD",
      course: "World Literature",
      progress: 28,
      status: "28% Completed",
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const url = `${endpoints.admin.analytics.overview}?period=${period}`;
        const res = await apiRequest<any>(url, { authToken: token });

        if (isSubscribed && res?.data) {
          if (res.data.kpiCards) {
            setKpiCards(res.data.kpiCards);
          }
          if (Array.isArray(res.data.weeklyLearningActivity)) {
            setWeeklyActivity(res.data.weeklyLearningActivity);
          }
          if (res.data.courseCompletionRate) {
            setCompletionRate(res.data.courseCompletionRate);
          }
          if (Array.isArray(res.data.notifications)) {
            setNotifications(res.data.notifications);
          }
          if (Array.isArray(res.data.studentsAtRisk)) {
            setStudentsAtRisk(res.data.studentsAtRisk);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard overview analytics:", err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isSubscribed = false;
    };
  }, [period, token]);

  return (
    <AppShell
      title="Overview"
      activeSection="dashboard"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8 bg-[#f8fafc] min-h-screen"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header Banner */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#16345d] sm:text-[30px]">
              Welcome back, {profileName.split(" ")[0]}!
            </h1>
            <p className="mt-1 text-[15px] font-medium text-[#708099]">
              Here is a summary of today&apos;s academic performance and school activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-[12px] border border-[#dbe3f0] bg-white px-5 py-2.5 text-[14px] font-bold text-[#354c6c] hover:bg-slate-50 shadow-sm"
            >
              View Guide
            </button>
            <button
              type="button"
              className="rounded-[12px] bg-[#3d6e52] px-5 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-[#325a43]"
            >
              Support center
            </button>
          </div>
        </section>

        {/* Top 4 KPI Cards */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Total Students */}
          <article className="rounded-[20px] border border-[#eef2f9] bg-white p-6 shadow-[0_14px_30px_rgba(180,190,220,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[15px] font-medium text-[#495b78]">Total Students</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f0eeff] text-[#855eff]">
                <Users className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[36px] font-extrabold tracking-[-0.05em] text-[#173257]">
                {kpiCards.totalStudents.value.toLocaleString()}
              </span>
              <span className="text-[14px] font-bold text-[#109059]">
                ↑{kpiCards.totalStudents.growth}
              </span>
            </div>
          </article>

          {/* Card 2: Active This week */}
          <article className="rounded-[20px] border border-[#eef2f9] bg-white p-6 shadow-[0_14px_30px_rgba(180,190,220,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[15px] font-medium text-[#495b78]">Active This week</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e5f3ff] text-[#3295ff]">
                <Zap className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[36px] font-extrabold tracking-[-0.05em] text-[#173257]">
                {kpiCards.activeThisWeek.value.toLocaleString()}
              </span>
              <span className="text-[14px] font-bold text-[#109059]">
                ↑{kpiCards.activeThisWeek.growth}
              </span>
            </div>
          </article>

          {/* Card 3: Available Subject */}
          <article className="rounded-[20px] border border-[#eef2f9] bg-white p-6 shadow-[0_14px_30px_rgba(180,190,220,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[15px] font-medium text-[#495b78]">Available Subject</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#edf7f1] text-[#3fb977]">
                <BookOpen className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[36px] font-extrabold tracking-[-0.05em] text-[#173257]">
                {kpiCards.availableSubjects.value.toLocaleString()}
              </span>
              <span className="text-[14px] font-medium text-[#7c8aa0]">
                {kpiCards.availableSubjects.growth}
              </span>
            </div>
          </article>

          {/* Card 4: Average Progress */}
          <article className="rounded-[20px] border border-[#eef2f9] bg-white p-6 shadow-[0_14px_30px_rgba(180,190,220,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[15px] font-medium text-[#495b78]">Average Progress</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#fdf0f7] text-[#eb58a7]">
                <LineChart className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[36px] font-extrabold tracking-[-0.05em] text-[#173257]">
                {kpiCards.averageProgress.value}
              </span>
              <span className="text-[14px] font-bold text-[#109059]">
                ↑{kpiCards.averageProgress.growth}
              </span>
            </div>
          </article>
        </section>

        {/* Middle Section: Weekly Learning Activity (Left 60%) & Course Completion Rate (Right 40%) */}
        <section className="mt-7 grid gap-7 xl:grid-cols-[1.5fr_1fr]">
          {/* Weekly Learning Activity */}
          <article className="rounded-[22px] border border-[#dfe6f2] bg-white p-7 shadow-[0_16px_36px_rgba(180,190,220,0.07)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                  Weekly Learning Activity
                </h2>
                <p className="mt-1 text-[14px] text-[#7d8ca3]">
                  Hours spent by students across all courses
                </p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#dce3f0] bg-[#f8fafc] px-3.5 text-[13px] font-semibold text-[#374c6b] hover:bg-slate-100"
                >
                  <CalendarDays className="h-4 w-4" strokeWidth={2} />
                  {period === "last_7_days"
                    ? "Last 7 days"
                    : period === "last_30_days"
                      ? "Last 30 days"
                      : "Last 90 days"}
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                </button>

                {showPeriodDropdown && (
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={() => { setPeriod("last_7_days"); setShowPeriodDropdown(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Last 7 days
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPeriod("last_30_days"); setShowPeriodDropdown(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Last 30 days
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPeriod("last_90_days"); setShowPeriodDropdown(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Last 90 days
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="mt-12 grid h-[240px] grid-cols-7 items-end gap-4 sm:gap-6">
              {weeklyActivity.map((bar) => (
                <div key={bar.day} className="flex h-full flex-col items-center justify-end gap-3">
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className={`w-full max-w-[56px] rounded-[10px] transition-all duration-300 ${
                        bar.highlight
                          ? "bg-[linear-gradient(180deg,#3b8260_0%,#4fa37a_60%,#c9edd8_100%)] shadow-md"
                          : "bg-[#d3e5dc]"
                      }`}
                      style={{ height: `${bar.value}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-[#8090a7]">{bar.day}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Course Completion Rate Donut Chart */}
          <article className="rounded-[22px] border border-[#dfe6f2] bg-white p-7 shadow-[0_16px_36px_rgba(180,190,220,0.07)]">
            <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Course Completion Rate
            </h2>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex h-[210px] w-[210px] items-center justify-center">
                <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="110"
                    cy="110"
                    r="76"
                    fill="none"
                    stroke="#00bba7"
                    strokeWidth="32"
                  />
                  {/* In Progress Segment (Coral) */}
                  <circle
                    cx="110"
                    cy="110"
                    r="76"
                    fill="none"
                    stroke="#e86549"
                    strokeWidth="32"
                    strokeDasharray="210 477"
                    strokeDashoffset="-235"
                  />
                </svg>

                {/* Center Badge Labels */}
                <div className="absolute inset-[36px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                  <p className="text-[32px] font-extrabold tracking-[-0.04em] text-[#173257]">
                    {completionRate.totalNumber}
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8696ad]">
                    Total Number
                  </p>
                </div>

                {/* Tag Badges */}
                <span className="absolute right-3 top-7 rounded-full bg-[#1b2533] px-2.5 py-1 text-[12px] font-bold text-white shadow-md">
                  79%
                </span>
                <span className="absolute bottom-10 left-3 rounded-full bg-[#1b2533] px-2.5 py-1 text-[12px] font-bold text-white shadow-md">
                  45%
                </span>
              </div>

              {/* Legend List */}
              <div className="mt-8 w-full space-y-4 border-t border-[#f0f4f9] pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-[5px] bg-[#00bba7]" />
                    <span className="text-[15px] font-bold text-[#354a6b]">Completed</span>
                  </div>
                  <span className="text-[17px] font-extrabold text-[#173257]">
                    {completionRate.completed}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-[5px] bg-[#e86549]" />
                    <span className="text-[15px] font-bold text-[#354a6b]">In Progress</span>
                  </div>
                  <span className="text-[17px] font-extrabold text-[#173257]">
                    {completionRate.inProgress}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Bottom Section: Notification (Left 45%) & Students At Risk (Right 55%) */}
        <section className="mt-7 grid gap-7 xl:grid-cols-[1fr_1.25fr]">
          {/* Notifications */}
          <article className="rounded-[22px] border border-[#dfe6f2] bg-white p-7 shadow-[0_16px_36px_rgba(180,190,220,0.07)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Notification
              </h2>
              <button type="button" className="text-[14px] font-bold text-[#0f8751] hover:underline">
                View All
              </button>
            </div>

            <div className="mt-7 space-y-6">
              {notifications.map((item) => {
                let iconEl = <UserPlus className="h-5 w-5 text-[#2ca266]" strokeWidth={2} />;
                let iconBoxBg = "bg-[#eef8f2]";

                if (item.type === "completion") {
                  iconEl = <CheckCircle2 className="h-5 w-5 text-[#3295ff]" strokeWidth={2} />;
                  iconBoxBg = "bg-[#eaf4ff]";
                } else if (item.type === "quiz") {
                  iconEl = <FileSpreadsheet className="h-5 w-5 text-[#8855ff]" strokeWidth={2} />;
                  iconBoxBg = "bg-[#f2ecff]";
                } else if (item.type === "update") {
                  iconEl = <MailWarning className="h-5 w-5 text-[#d98218]" strokeWidth={2} />;
                  iconBoxBg = "bg-[#fff5e8]";
                }

                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBoxBg}`}
                    >
                      {iconEl}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold leading-5 text-[#1b3457]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-[#7f8da4]">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Students At Risk */}
          <article className="overflow-hidden rounded-[22px] border border-[#dfe6f2] bg-white p-7 shadow-[0_16px_36px_rgba(180,190,220,0.07)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                Students At Risk
              </h2>
              <span className="inline-flex items-center rounded-full bg-[#fde8e8] px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#e04545]">
                Immediate Action Required
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-[#edf2fa] text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#7a8aa3]">
                    <th className="py-4 font-extrabold">Student</th>
                    <th className="px-4 py-4 font-extrabold">Course</th>
                    <th className="px-4 py-4 font-extrabold">Progress</th>
                    <th className="py-4 text-right font-extrabold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsAtRisk.map((student) => (
                    <tr key={student.id} className="border-b border-[#f3f6fc] text-[14px]">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8eef8] text-[13px] font-bold text-[#2d4366]">
                            {student.avatar}
                          </div>
                          <span className="font-bold text-[#1b3457]">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-[#465978]">{student.course}</td>
                      <td className="px-4 py-4">
                        <div className="w-36">
                          <div className="h-2 w-full rounded-full bg-[#f0f4fa]">
                            <div
                              className="h-2 rounded-full bg-[#e54545]"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="mt-1 block text-[12px] font-bold text-[#e54545]">
                            {student.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Mail className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
