"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { parseSchoolSummary, type SchoolSummary } from "@/lib/backend-models";
import { useAuthSession } from "@/lib/auth-session";

function buildSchoolCode(school: SchoolSummary) {
  const normalizedId = school.id.replace(/-/g, "").slice(0, 8).toUpperCase();
  return normalizedId ? `SCH-${normalizedId}` : "SCH-UNKNOWN";
}

function StatCard({
  label,
  value,
  change = "Live",
}: {
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[#e7eafb] bg-white px-6 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
      <p className="text-[15px] font-medium text-[#334768]">{label}</p>
      <div className="mt-7 flex items-end justify-between gap-3">
        <p className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
        <span className="inline-flex items-center gap-1 text-[14px] font-bold text-[#14985b]">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.3} />
          {change}
        </span>
      </div>
    </div>
  );
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const schoolId = Array.isArray(params?.schoolId) ? params.schoolId[0] : params?.schoolId;
  const { session } = useAuthSession();
  const [school, setSchool] = useState<SchoolSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState("Loading school details...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setErrorMessage("No school ID provided.");
      setIsLoading(false);
      return;
    }

    if (!session?.token) {
      setErrorMessage("Sign in to load school details.");
      setIsLoading(false);
      return;
    }

    const loadSchool = async () => {
      setIsLoading(true);
      setErrorMessage("Loading school details...");

      try {
        const response = await apiRequest(endpoints.admin.schoolById(schoolId), {
          authToken: session.token,
          cache: "no-store",
        });

        const payload = response && typeof response === "object" && !Array.isArray(response)
          ? (response as any).data ?? (response as any).school ?? response
          : response;

        const parsedSchool = parseSchoolSummary(payload);

        if (!parsedSchool) {
          throw new Error("School details could not be parsed.");
        }

        setSchool(parsedSchool);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load the selected school."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadSchool();
  }, [schoolId, session?.token]);

  return (
    <AppShell
      title={
        <div className="flex items-center gap-3">
          <Link href="/schools" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Greenfield Schools</span>
        </div>
      }
      activeSection="schools"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="rounded-[18px] border border-[#e4e8f7] bg-white px-6 py-10 text-center text-[15px] text-[#5b6d8b] shadow-[0_16px_34px_rgba(171,185,223,0.08)]">
            Loading school details...
          </div>
        ) : errorMessage ? (
          <div className="rounded-[18px] border border-[#ffd7df] bg-[#fff3f3] px-6 py-10 text-center text-[15px] text-[#b53a4c] shadow-[0_16px_34px_rgba(239,31,79,0.12)]">
            {errorMessage}
          </div>
        ) : school ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#4e7c5f] text-white">
                    <span className="text-[24px] font-bold">
                      {school.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-[24px] font-bold text-[#182c4e]">{school.name}</h1>
                    <p className="mt-1 text-[14px] text-[#7a88a2]">
                      {school.isActive ? "✓ Active Entity" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-[8px] border border-[#d1e0d6] bg-white px-4 py-3 text-[14px] font-semibold text-[#4e7c5f] hover:bg-[#f6faf8]">
                    Edit Profile
                  </button>
                  <button className="rounded-[8px] border border-[#14985b] bg-[#14985b] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#0d6a46]">
                    + Add New Student
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="TOTAL STUDENTS" value={school.population ?? 1240} />
              <StatCard label="ACTIVE STUDENTS" value={958} />
              <StatCard label="COURSE COMPLETION" value="78%" change="peak" />
              <StatCard label="LEARNING ACTIVITY" value="High" change="peak" />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Left Column - Assigned Courses */}
              <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)] xl:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#182c4e]">Assigned Courses</h2>
                  <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#dfe5ff]">
                        <TrendingUp className="h-5 w-5 text-[#4e63dd]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#182c4e]">
                          Computer Science 101
                        </p>
                        <p className="text-[13px] text-[#7a88a2]">3 Modules • 250 Students Enrolled</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
                  </div>

                  <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ffe5d5]">
                        <span className="text-[16px] font-bold text-[#f97316]">∑</span>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#182c4e]">
                          Advanced Mathematics
                        </p>
                        <p className="text-[13px] text-[#7a88a2]">8 Modules • 323 Students Enrolled</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
                  </div>

                  <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#f0e5ff]">
                        <span className="text-[16px] font-bold text-[#8b5cf6]">📚</span>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#182c4e]">English Literature</p>
                        <p className="text-[13px] text-[#7a88a2]">6 Modules • 193 Students Enrolled</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
                  </div>

                  <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ffe5f0]">
                        <span className="text-[16px] font-bold text-[#ec4899]">🏛️</span>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[#182c4e]">Government Studies</p>
                        <p className="text-[13px] text-[#7a88a2]">6 Modules • 450 Students Enrolled</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Right Column - Current Plan */}
              <div className="rounded-[16px] border border-[#14985b] bg-[#14985b] p-6 text-white shadow-[0_16px_34px_rgba(20,152,91,0.2)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold">CURRENT PLAN</h2>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <Building2 className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <p className="text-[14px] font-medium text-white/80">Plan Name</p>
                    <p className="mt-2 text-[22px] font-bold">Premium Enterprise</p>
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-white/80">Status:</p>
                    <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold">
                      <span className="inline-block h-2 w-2 rounded-full bg-white" />
                      Active
                    </p>
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-white/80">Expires:</p>
                    <p className="mt-1 text-[15px] font-semibold">Dec 31, 2024</p>
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-white/80">Auto-renew:</p>
                    <p className="mt-1 text-[15px] font-semibold">On</p>
                  </div>

                  <button className="w-full rounded-[10px] border border-white bg-white px-4 py-3 text-[16px] font-semibold text-[#14985b] hover:bg-white/90">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 xl:grid-cols-2">
              {/* Top Students */}
              <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#182c4e]">Top Students</h2>
                  <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
                    See Rankings
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-[8px] p-3 hover:bg-[#f6f8fd]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e9f7] font-semibold text-[#5a6986]">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#182c4e]">
                            Sarah Jenkins
                          </p>
                          <p className="text-[12px] text-[#b0bace]">AI/iPM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-[#182c4e]">88%</p>
                        <p className="text-[12px] text-[#b0bace]">Avg Progress</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Activity */}
              <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#182c4e]">Learning Activity</h2>
                  <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
                    View Stats
                  </button>
                </div>

                <div className="mt-6 flex items-end justify-between gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 rounded-[4px] bg-[#c4dcd4]"
                        style={{ height: `${[40, 50, 30, 60, 45, 35, 55][i]}px` }}
                      />
                      <p className="text-[12px] text-[#b0bace]">{day}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-[13px] text-[#9aa7bf]">
                  Learning peaks on Wednesdays with 2,450+ total interactions.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
