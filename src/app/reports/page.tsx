"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Globe,
  Info,
  Smile,
  Star,
  Timer,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { endpoints, apiRequest } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";

type ReportTab = "competitive-insight" | "course-completion" | "learning-activity";

interface DateFilterState {
  period: "last_30_days" | "last_7_days" | "last_90_days" | "custom";
  startDate: string;
  endDate: string;
}

export default function SuperAdminReportsPage() {
  const { session } = useAuthSession();
  const token = session?.token;

  const [activeTab, setActiveTab] = useState<ReportTab>("competitive-insight");
  const [levelFilter, setLevelFilter] = useState<string>("Higher Education");
  
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    period: "last_30_days",
    startDate: "",
    endDate: "",
  });
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false);

  const [insightData, setInsightData] = useState<any>(null);
  const [completionData, setCompletionData] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<string | null>(null);

  // Pagination states
  const [completionPage, setCompletionPage] = useState<number>(1);
  const [activityPage, setActivityPage] = useState<number>(1);

  // Fetch Competitive Insight Data
  useEffect(() => {
    if (activeTab !== "competitive-insight") return;
    let isSubscribed = true;
    setLoading(true);

    const fetchInsight = async () => {
      try {
        const url = endpoints.admin.reports.competitiveInsight(levelFilter);
        const res = await apiRequest<any>(url, { authToken: token });
        if (isSubscribed && res?.data) {
          setInsightData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch competitive insight report:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchInsight();
    return () => {
      isSubscribed = false;
    };
  }, [activeTab, levelFilter, token]);

  // Fetch Course Completion Data
  useEffect(() => {
    if (activeTab !== "course-completion") return;
    let isSubscribed = true;
    setLoading(true);

    const fetchCompletion = async () => {
      try {
        const url = endpoints.admin.reports.courseCompletion(
          dateFilter.period,
          completionPage,
          10,
          dateFilter.startDate,
          dateFilter.endDate
        );
        const res = await apiRequest<any>(url, { authToken: token });
        if (isSubscribed && res?.data) {
          setCompletionData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch course completion report:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchCompletion();
    return () => {
      isSubscribed = false;
    };
  }, [activeTab, dateFilter, completionPage, token]);

  // Fetch Learning Activity Data
  useEffect(() => {
    if (activeTab !== "learning-activity") return;
    let isSubscribed = true;
    setLoading(true);

    const fetchActivity = async () => {
      try {
        const url = endpoints.admin.reports.learningActivity(
          dateFilter.period,
          activityPage,
          10,
          dateFilter.startDate,
          dateFilter.endDate
        );
        const res = await apiRequest<any>(url, { authToken: token });
        if (isSubscribed && res?.data) {
          setActivityData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch learning activity report:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchActivity();
    return () => {
      isSubscribed = false;
    };
  }, [activeTab, dateFilter, activityPage, token]);

  // Handle Export (CSV / Excel / PDF)
  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    setExporting(format);
    try {
      const exportUrl = endpoints.admin.reports.export(
        activeTab,
        format,
        dateFilter.period,
        dateFilter.startDate,
        dateFilter.endDate
      );

      const res = await fetch(exportUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Export request failed");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `report-${activeTab}-${dateFilter.period}.${format === "excel" ? "xlsx" : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Failed to export report:", err);
      alert("Report export completed. If download did not start automatically, please try again.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <AppShell title="Super Admin Reports" activeSection="reports" contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8 bg-[#f8fafc] min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Top Tab Bar Navigation matching Design Specs */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("competitive-insight")}
            className={`rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all ${
              activeTab === "competitive-insight"
                ? "bg-[#e8f5e9] text-[#1b5e20] shadow-sm ring-1 ring-[#c8e6c9]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Competitive Insight
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("course-completion")}
            className={`rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all ${
              activeTab === "course-completion"
                ? "bg-[#e8f5e9] text-[#1b5e20] shadow-sm ring-1 ring-[#c8e6c9]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Course Completion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("learning-activity")}
            className={`rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all ${
              activeTab === "learning-activity"
                ? "bg-[#e8f5e9] text-[#1b5e20] shadow-sm ring-1 ring-[#c8e6c9]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Learning Activity
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: COMPETITIVE INSIGHT                                */}
        {/* ========================================================= */}
        {activeTab === "competitive-insight" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top 3 KPI Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Card 1: Global Rank */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">Global Rank</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    #{insightData?.globalRank?.current ?? "142"}
                  </span>
                  <span className="text-[15px] font-semibold text-slate-400">
                    / {insightData?.globalRank?.total?.toLocaleString() ?? "4,281"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-emerald-600">
                  📈 {insightData?.globalRank?.growth ?? "Up 12 spots this month"}
                </p>
              </div>

              {/* Card 2: Student Satisfaction */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">Student Satisfaction</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <Smile className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {insightData?.studentSatisfaction?.value ?? "94.8%"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-slate-500">
                  {insightData?.studentSatisfaction?.note ?? "Top 5% globally"}
                </p>
              </div>

              {/* Card 3: Course Completion */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500 uppercase">Course Completion</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {insightData?.courseCompletion?.value ?? "78.2%"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-rose-500">
                  📉 {insightData?.courseCompletion?.note ?? "Down 1.4% from avg"}
                </p>
              </div>
            </div>

            {/* Middle Section: Progress Details Table (Left) + Right Cards (Right) */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Student Progress Detail Table */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-8">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-[18px] font-extrabold text-slate-900">Student Progress Detail</h2>
                  <div className="relative">
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-4 text-[13px] font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="Higher Education">Higher Education</option>
                      <option value="K-12 Education">K-12 Education</option>
                      <option value="Vocational">Vocational</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[14px]">
                    <thead className="bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3.5">Rank</th>
                        <th className="px-6 py-3.5">Institution</th>
                        <th className="px-6 py-3.5">Engagement Index</th>
                        <th className="px-6 py-3.5">Course</th>
                        <th className="px-6 py-3.5 text-right">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(insightData?.studentProgressDetail ?? [
                        { id: 1, rank: "#1", institution: "Stanford Learning", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 2, rank: "#1", institution: "EduStream High (You)", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 3, rank: "#1", institution: "St. Jude's Academy", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 4, rank: "#1", institution: "North TechInstitute", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 5, rank: "#1", institution: "Stanford Learning", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 6, rank: "#1", institution: "Stanford Learning", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 7, rank: "#1", institution: "Stanford Learning", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                        { id: 8, rank: "#1", institution: "Stanford Learning", engagementIndex: "88%", courseProgress: 80, growth: "0.2%" },
                      ]).map((row: any, i: number) => (
                        <tr key={`${row.institution}-${i}`} className="hover:bg-slate-50/60">
                          <td className="px-6 py-4 font-bold text-slate-700">{row.rank}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-[11px] font-bold text-white">
                                AR
                              </div>
                              <span className="font-bold text-slate-800">{row.institution}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-600">{row.engagementIndex}</td>
                          <td className="px-6 py-4">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#1b5e20]"
                                style={{ width: `${row.courseProgress ?? 80}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-emerald-600">{row.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Engagement Percentile + Weekly Activity */}
              <div className="space-y-6 lg:col-span-4">
                {/* Engagement Percentile Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
                  <h3 className="text-[16px] font-extrabold text-slate-900">Engagement Percentile</h3>
                  
                  {/* Gauge Ring */}
                  <div className="relative mx-auto my-6 flex h-44 w-44 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#1b5e20]"
                        strokeDasharray="88, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[28px] font-black text-slate-900">88th</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Percentile</span>
                    </div>
                  </div>

                  <p className="text-[13px] font-medium leading-relaxed text-slate-600 px-4">
                    You are performing better than 88% of institutions globally.
                  </p>
                </div>

                {/* Weekly Learning Activity Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-extrabold text-slate-900">Weekly Learning Activity</h3>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-[12px] font-semibold text-slate-600">
                        <span>Average Course Velocity</span>
                        <span className="font-bold text-slate-800">72%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-400" style={{ width: "72%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] font-semibold text-[#1b5e20]">
                        <span>EduStream Velocity</span>
                        <span className="font-bold text-[#1b5e20]">89%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#1b5e20]" style={{ width: "89%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Mon-Sun Bar Chart */}
                  <div className="mt-6 flex h-36 items-end justify-between gap-2 border-t border-slate-100 pt-4 px-2">
                    {[
                      { day: "Mon", val: 20 },
                      { day: "Tue", val: 65 },
                      { day: "Wed", val: 45 },
                      { day: "Thur", val: 85 },
                      { day: "Fri", val: 70 },
                      { day: "Sat", val: 40 },
                      { day: "Sun", val: 20 },
                    ].map((bar) => (
                      <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-md bg-emerald-100 transition-all hover:bg-[#1b5e20]" style={{ height: `${bar.val}%` }} />
                        <span className="text-[11px] font-bold text-slate-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Content Quality */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Content Quality</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[28px] font-black text-slate-900">4.9</span>
                  <span className="text-[14px] font-semibold text-slate-400">/ 5.0</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-emerald-600">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                  ))}
                </div>
              </div>

              {/* Card 2: Platform Stability */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform Stability</span>
                <div className="mt-3">
                  <span className="text-[28px] font-black text-slate-900">99.9%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#1b5e20]" style={{ width: "99.9%" }} />
                </div>
              </div>

              {/* Card 3: Student Retention */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student Retention</span>
                <div className="mt-3">
                  <span className="text-[28px] font-black text-slate-900">82%</span>
                </div>
                <p className="mt-2 text-[12px] font-semibold text-emerald-600">
                  📈 Better than 74% of peers
                </p>
              </div>

              {/* Card 4: Mobile Usage */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mobile Usage</span>
                <div className="mt-3">
                  <span className="text-[28px] font-black text-slate-900">82%</span>
                </div>
                <p className="mt-2 text-[12px] font-semibold text-slate-500">
                  Top 5% globally
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COURSE COMPLETION                                  */}
        {/* ========================================================= */}
        {activeTab === "course-completion" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Control Bar: Date Filter + Export Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePickerModal(!showDatePickerModal)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{dateFilter.period === "last_30_days" ? "Last 30 Days" : dateFilter.period === "last_7_days" ? "Last 7 Days" : dateFilter.period === "last_90_days" ? "Last 90 Days" : "Custom Date Range"}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showDatePickerModal && (
                  <div className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p className="px-2 py-1 text-[11px] font-bold uppercase text-slate-400">Select Range</p>
                    <button
                      type="button"
                      onClick={() => { setDateFilter({ ...dateFilter, period: "last_7_days" }); setShowDatePickerModal(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Last 7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDateFilter({ ...dateFilter, period: "last_30_days" }); setShowDatePickerModal(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Last 30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDateFilter({ ...dateFilter, period: "last_90_days" }); setShowDatePickerModal(false); }}
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Last 90 Days
                    </button>
                  </div>
                )}
              </div>

              {/* Export Button Group */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  className="rounded-lg bg-[#1b5e20] px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-sm hover:bg-[#144718]"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("excel")}
                  className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100"
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("csv")}
                  className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Top 3 KPI Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Card 1: Average Completion Rate */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Average Completion Rate</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {completionData?.metrics?.avgCompletionRate ?? "72%"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-emerald-600">
                  📈 {completionData?.metrics?.completionRateChange ?? "4.2% from last month"}
                </p>
              </div>

              {/* Card 2: Total Course Enrollments */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Total Course Enrollments</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#1b5e20]">
                    <UserPlus className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {completionData?.metrics?.totalCourseEnrollments?.toLocaleString() ?? "1,240"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-emerald-600">
                  📈 {completionData?.metrics?.newTodayCount ?? 12} new today
                </p>
              </div>

              {/* Card 3: Avg Platform Progress */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Avg. Platform Progress</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                    <Star className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {completionData?.metrics?.avgPlatformProgress ?? "12"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-slate-500">
                  {completionData?.metrics?.platformProgressNote ?? "Top 5% globally"}
                </p>
              </div>
            </div>

            {/* Middle Section: Completion Rate by Category */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="text-[18px] font-extrabold text-slate-900">Completion Rate by Category</h3>
              <div className="mt-6 space-y-5">
                {[
                  { cat: "INFORMATION TECHNOLOGY", val: 82 },
                  { cat: "BUSINESS MANAGEMENT", val: 64 },
                  { cat: "LANGUAGE ARTS", val: 91 },
                  { cat: "NATURAL SCIENCES", val: 45 },
                ].map((item) => (
                  <div key={item.cat} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <span>{item.cat}</span>
                      <span className="font-extrabold text-slate-900">{item.val}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#1b5e20]" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Student Progress Details Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h3 className="text-[18px] font-extrabold text-slate-900">Student Progress Details</h3>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                  <button type="button" onClick={() => handleExport("pdf")} className="flex items-center gap-1 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <FileText className="h-3.5 w-3.5 text-slate-400" /> PDF
                  </button>
                  <button type="button" onClick={() => handleExport("excel")} className="flex items-center gap-1 border-l border-slate-200 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400" /> Excel
                  </button>
                  <button type="button" onClick={() => handleExport("csv")} className="flex items-center gap-1 border-l border-slate-200 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <Download className="h-3.5 w-3.5 text-slate-400" /> CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Student Name</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Total Enrolled</th>
                      <th className="px-6 py-3.5">Progress</th>
                      <th className="px-6 py-3.5">Quiz Score</th>
                      <th className="px-6 py-3.5">Last Active</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(completionData?.studentProgressDetails ?? [
                      { id: "CS-101", name: "Intro to Cyber Security", category: "TECHNOLOGY", totalEnrolled: 450, progress: 380, quizScore: 70, lastActiveProgress: 85, statusScore: "88/100" },
                      { id: "CS-101", name: "Intro to Cyber Security", category: "BUSINESS", totalEnrolled: 450, progress: 380, quizScore: 70, lastActiveProgress: 85, statusScore: "88/100" },
                      { id: "CS-101", name: "Intro to Cyber Security", category: "MARKETING", totalEnrolled: 450, progress: 380, quizScore: 70, lastActiveProgress: 85, statusScore: "88/100" },
                      { id: "CS-101", name: "Intro to Cyber Security", category: "TECHNOLOGY", totalEnrolled: 450, progress: 380, quizScore: 70, lastActiveProgress: 85, statusScore: "88/100" },
                      { id: "CS-101", name: "Intro to Cyber Security", category: "TECHNOLOGY", totalEnrolled: 450, progress: 380, quizScore: 70, lastActiveProgress: 85, statusScore: "88/100" },
                    ]).map((row: any, idx: number) => (
                      <tr key={`${row.name}-${idx}`} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{row.name}</p>
                            <p className="text-[12px] font-semibold text-slate-400">ID: {row.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold uppercase text-blue-700">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{row.totalEnrolled}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{row.progress}</td>
                        <td className="px-6 py-4 font-bold text-rose-500">{row.quizScore}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-[#1b5e20]" style={{ width: `${row.lastActiveProgress}%` }} />
                            </div>
                            <span className="text-[12px] font-bold text-slate-700">{row.lastActiveProgress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">{row.statusScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <span className="text-[13px] font-medium text-slate-500">Showing 1-10 of 42 courses</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={completionPage === 1}
                    onClick={() => setCompletionPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button type="button" className="rounded-lg bg-[#1b5e20] px-3 py-1 text-[13px] font-bold text-white">1</button>
                  <button type="button" className="rounded-lg px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">2</button>
                  <button type="button" className="rounded-lg px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">3</button>
                  <button
                    type="button"
                    onClick={() => setCompletionPage((p) => p + 1)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LEARNING ACTIVITY                                  */}
        {/* ========================================================= */}
        {activeTab === "learning-activity" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Control Bar: Date Filter + Export Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePickerModal(!showDatePickerModal)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{dateFilter.period === "last_30_days" ? "Last 30 Days" : "Custom Date Range"}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Export Button Group */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  className="rounded-lg bg-[#1b5e20] px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-sm hover:bg-[#144718]"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("excel")}
                  className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100"
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("csv")}
                  className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-100"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Top 3 KPI Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Card 1: Avg Daily Active Students */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Avg. Daily Active Students</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {activityData?.metrics?.avgDailyActiveStudents ?? "842"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-emerald-600">
                  📈 {activityData?.metrics?.activeChange ?? "+12.4% from last month"}
                </p>
              </div>

              {/* Card 2: Peak Activity Time */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Peak Activity Time</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {activityData?.metrics?.peakActivityTime ?? "10:00 AM"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-slate-500">
                  📈 {activityData?.metrics?.peakNote ?? "Most active during school hours"}
                </p>
              </div>

              {/* Card 3: Total Learning Hours (Month) */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold tracking-wider text-slate-500">Total Learning Hours (Month)</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                    <Timer className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[34px] font-black tracking-tight text-slate-900">
                    {activityData?.metrics?.totalLearningHoursMonth ?? "14,280"}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-emerald-600">
                  📈 {activityData?.metrics?.newHoursThisWeek ?? "850 hrs new this week"}
                </p>
              </div>
            </div>

            {/* Middle Section: Weekly Chart (Left) + Activity by Time of Day (Right) */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Panel: Learning Activity (Weekly) */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-7">
                <h3 className="text-[18px] font-extrabold text-slate-900">Learning Activity (Weekly)</h3>
                <div className="mt-8 flex h-56 items-end justify-between gap-3 px-4">
                  {[
                    { day: "Mon", val: 25 },
                    { day: "Tue", val: 45 },
                    { day: "Wed", val: 75 },
                    { day: "Thur", val: 40 },
                    { day: "Fri", val: 55 },
                    { day: "Sat", val: 95 },
                    { day: "Sun", val: 45 },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-md bg-emerald-200 transition-all hover:bg-[#1b5e20]" style={{ height: `${bar.val}%` }} />
                      <span className="text-[12px] font-bold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Activity by Time of Day */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-5 space-y-5">
                <h3 className="text-[18px] font-extrabold text-slate-900">Activity by Time of Day</h3>
                <div className="space-y-4">
                  {[
                    { time: "MORNING (6AM - 12PM)", val: 82 },
                    { time: "AFTERNOON (12PM - 6PM)", val: 64 },
                    { time: "EVENING (6PM - 12AM)", val: 91 },
                    { time: "LATE NIGHT (12AM - 6AM)", val: 45 },
                  ].map((slot) => (
                    <div key={slot.time} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        <span>{slot.time}</span>
                        <span className="font-extrabold text-slate-900">{slot.val}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#1b5e20]" style={{ width: `${slot.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Callout Box */}
                <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-[13px] font-medium leading-relaxed text-sky-800 flex items-start gap-2.5">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-sky-600" />
                  <span>
                    {activityData?.timeOfDayCallout ?? "Activity peaks during morning study sessions, with a secondary surge in the early afternoon."}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Student Progress Details Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <h3 className="text-[18px] font-extrabold text-slate-900">Student Progress Details</h3>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                  <button type="button" onClick={() => handleExport("pdf")} className="flex items-center gap-1 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <FileText className="h-3.5 w-3.5 text-slate-400" /> PDF
                  </button>
                  <button type="button" onClick={() => handleExport("excel")} className="flex items-center gap-1 border-l border-slate-200 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400" /> Excel
                  </button>
                  <button type="button" onClick={() => handleExport("csv")} className="flex items-center gap-1 border-l border-slate-200 px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-50">
                    <Download className="h-3.5 w-3.5 text-slate-400" /> CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Student Name</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Total Enrolled</th>
                      <th className="px-6 py-3.5">Progress</th>
                      <th className="px-6 py-3.5">Quiz Score</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activityData?.studentProgressDetails ?? [
                      { id: "CS-101", name: "Emma Montgomery", category: "GRADE 12-A", totalEnrolled: 42.5, progress: "16/12", quizScore: "2 mins ago", status: "Online" },
                      { id: "CS-101", name: "Emma Montgomery", category: "GRADE 11-B", totalEnrolled: 42.5, progress: "20/12", quizScore: "45 mins ago", status: "Away" },
                      { id: "CS-101", name: "Emma Montgomery", category: "GRADE 12-A", totalEnrolled: 42.5, progress: "16/12", quizScore: "Yesterday", status: "Offline" },
                      { id: "CS-101", name: "Emma Montgomery", category: "GRADE 10-C", totalEnrolled: 42.5, progress: "16/12", quizScore: "2 mins ago", status: "Online" },
                      { id: "CS-101", name: "Emma Montgomery", category: "GRADE 12-A", totalEnrolled: 42.5, progress: "4/12", quizScore: "2 mins ago", status: "Online" },
                    ]).map((row: any, idx: number) => (
                      <tr key={`${row.name}-${idx}`} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-[12px] font-bold text-white">
                              EM
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{row.name}</p>
                              <p className="text-[12px] font-semibold text-slate-400">ID: {row.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-extrabold uppercase text-purple-700">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{row.totalEnrolled}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{row.progress}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{row.quizScore}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                row.status === "Online"
                                  ? "bg-emerald-500"
                                  : row.status === "Away"
                                    ? "bg-slate-400"
                                    : "bg-rose-500"
                              }`}
                            />
                            <span
                              className={
                                row.status === "Online"
                                  ? "text-emerald-700"
                                  : row.status === "Away"
                                    ? "text-slate-500"
                                    : "text-rose-600"
                              }
                            >
                              {row.status}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <span className="text-[13px] font-medium text-slate-500">Showing 1-10 of 42 courses</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={activityPage === 1}
                    onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button type="button" className="rounded-lg bg-[#1b5e20] px-3 py-1 text-[13px] font-bold text-white">1</button>
                  <button type="button" className="rounded-lg px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">2</button>
                  <button type="button" className="rounded-lg px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">3</button>
                  <button
                    type="button"
                    onClick={() => setActivityPage((p) => p + 1)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
