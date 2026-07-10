"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarDays, CirclePlus, Info, UserRound, Eye, Zap, Goal, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";
import { toast } from "sonner";
import Link from "next/link";

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

function FeaturedSettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const { session } = useAuthSession();

  const [course, setCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [featured, setFeatured] = useState(false);
  const [featuredPriority, setFeaturedPriority] = useState<"crucial" | "normal" | "low">("normal");
  const [featuredBadgeText, setFeaturedBadgeText] = useState("");
  const [featuredStartDate, setFeaturedStartDate] = useState("");
  const [featuredEndDate, setFeaturedEndDate] = useState("");
  const [emailStudents, setEmailStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all courses if no specific course is selected
  useEffect(() => {
    if (session?.token && !courseId) {
      setLoading(true);
      apiRequest<{ message: string; data: any[] }>(endpoints.courses.all, {
        authToken: session.token,
      })
        .then((res) => {
          setAllCourses(res.data ?? []);
        })
        .catch((err) => {
          console.error("Failed to load courses list:", err);
          toast.error("Failed to load courses for selection.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.token, courseId]);

  // Fetch course details if courseId is provided
  useEffect(() => {
    if (session?.token && courseId) {
      setLoading(true);
      apiRequest<{ message: string; data: any }>(endpoints.courses.byId(courseId), {
        authToken: session.token,
      })
        .then((res) => {
          const c = res.data;
          setCourse(c);
          setFeatured(c.featured ?? false);
          setFeaturedPriority(c.featuredPriority ?? "normal");
          setFeaturedBadgeText(c.featuredBadgeText ?? "");
          setFeaturedStartDate(c.featuredStartDate ? new Date(c.featuredStartDate).toISOString().split("T")[0] : "");
          setFeaturedEndDate(c.featuredEndDate ? new Date(c.featuredEndDate).toISOString().split("T")[0] : "");
          setEmailStudents(c.emailStudentsOfCategory ?? false);
        })
        .catch((err) => {
          console.error("Failed to load course details:", err);
          toast.error("Failed to load course details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.token, courseId]);

  const handleSave = async () => {
    if (!courseId) return;
    setIsSaving(true);
    try {
      await apiRequest(endpoints.courses.update(courseId), {
        method: "PUT",
        authToken: session?.token,
        body: {
          featured,
          featuredPriority,
          featuredBadgeText: featuredBadgeText.trim() || null,
          featuredStartDate: featuredStartDate ? new Date(featuredStartDate) : null,
          featuredEndDate: featuredEndDate ? new Date(featuredEndDate) : null,
          emailStudentsOfCategory: emailStudents,
        },
      });
      toast.success("Featured settings updated successfully!");
      router.push("/catalog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update featured settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (course) {
      setFeatured(course.featured ?? false);
      setFeaturedPriority(course.featuredPriority ?? "normal");
      setFeaturedBadgeText(course.featuredBadgeText ?? "");
      setFeaturedStartDate(course.featuredStartDate ? new Date(course.featuredStartDate).toISOString().split("T")[0] : "");
      setFeaturedEndDate(course.featuredEndDate ? new Date(course.featuredEndDate).toISOString().split("T")[0] : "");
      setEmailStudents(course.emailStudentsOfCategory ?? false);
      toast.info("Changes reset to original settings.");
    }
  };

  if (loading) {
    return (
      <AppShell title="Catalog Management" activeSection="catalog">
        <div className="py-20 text-center text-[#72829a] font-medium text-[16px]">
          Loading details...
        </div>
      </AppShell>
    );
  }

  if (!courseId) {
    return (
      <AppShell title="Catalog Management" activeSection="catalog">
        <div className="mx-auto max-w-[800px] mt-12">
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="text-[#72829a] hover:text-[#16345d]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d]">
              Select Course
            </h1>
          </div>
          <p className="mt-2 text-[#72829a]">
            Please select a course from the catalog to configure its featured status and settings.
          </p>

          <article className="mt-8 rounded-[24px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)] border border-[#dfe8f3]">
            <label className="block">
              <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
                Choose Course
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/catalog/featured?courseId=${e.target.value}`);
                  }
                }}
                className="w-full rounded-[16px] border border-[#d7deee] bg-[#f8faff] px-5 py-4 text-[16px] text-[#264267] outline-none"
              >
                <option value="">-- Choose a Course --</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </article>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto ">
        <section className="mt-12">
          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-[#72829a] hover:text-[#16345d]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              Featured Settings
            </h1>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[470px_minmax(0,1fr)]">
          <article className="rounded-[24px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)] border border-[#dfe8f3]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Quick Insight
            </h2>

            <div className="mt-8 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,rgba(25,7,6,0.98),rgba(79,13,9,0.82)),radial-gradient(circle_at_18%_18%,rgba(232,119,78,0.35),transparent_24%)]">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.name}
                  className="h-[380px] w-full object-cover opacity-90"
                />
              ) : (
                <div className="h-[380px] bg-[radial-gradient(circle_at_22%_22%,rgba(255,255,255,0.26),transparent_16%),linear-gradient(90deg,rgba(255,255,255,0.12)_0_34%,transparent_34%)]" />
              )}
            </div>

            <h3 className="mt-8 text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
              {course.name}
            </h3>
            <p className="mt-4 text-[16px] leading-8 text-[#667792]">
              {course.description || "No description provided for this course."}
            </p>

            <div className="mt-8 flex items-center gap-3 text-[16px] font-semibold text-[#11814a]">
              <UserRound className="h-5 w-5" strokeWidth={2.1} />
              <span>Category: {course.category?.name || "Uncategorized"}</span>
            </div>
          </article>

          <article className="overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="p-8">
              <div className="flex items-center justify-between border-b border-[#e8edf7] pb-6 mb-8">
                <div>
                  <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                    Featured Mode Status
                  </h2>
                  <p className="text-[14px] text-[#72829a] mt-1">
                    Toggle to display this course on the featured shelves.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`flex h-9 w-16 items-center rounded-full px-1 transition-colors duration-200 ${
                    featured ? "bg-[#0f8751]" : "bg-[#c2ccdd]"
                  }`}
                >
                  <span className={`flex h-7 w-7 rounded-full bg-white transition-transform duration-200 ${
                    featured ? "transform translate-x-7" : ""
                  }`} />
                </button>
              </div>

              <div className={`transition-opacity duration-200 ${featured ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                      Feature Priority
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      {[
                        { number: "01", label: "CRUCIAL", value: "crucial" as const },
                        { number: "02", label: "NORMAL", value: "normal" as const },
                        { number: "03", label: "LOW", value: "low" as const },
                      ].map((priority) => {
                        const active = featuredPriority === priority.value;
                        return (
                          <button
                            key={priority.number}
                            type="button"
                            onClick={() => setFeaturedPriority(priority.value)}
                            className={[
                              "rounded-[16px] border px-4 py-6 text-center transition-colors",
                              active
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
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                      Promotional Badge Text
                    </p>
                    <div className="mt-4 rounded-[16px] bg-[#f5f8fb] border border-[#d7deee] px-6 py-4">
                      <input
                        type="text"
                        maxLength={15}
                        value={featuredBadgeText}
                        onChange={(e) => setFeaturedBadgeText(e.target.value)}
                        placeholder="TRENDING NOW"
                        className="w-full bg-transparent text-[20px] font-extrabold tracking-[0.12em] text-[#202c3f] outline-none placeholder:text-[#b4c0d3]"
                      />
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
                    <div className="flex h-[66px] items-center gap-4 rounded-[16px] bg-[#f5f8fb] border border-[#d7deee] px-5">
                      <CalendarDays className="h-6 w-6 text-[#7584a1]" strokeWidth={2.1} />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#7584a1]">Start Date</span>
                        <input
                          type="date"
                          value={featuredStartDate}
                          onChange={(e) => setFeaturedStartDate(e.target.value)}
                          className="bg-transparent text-[16px] font-bold text-[#203553] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex h-[66px] items-center gap-4 rounded-[16px] bg-[#f5f8fb] border border-[#d7deee] px-5">
                      <CalendarDays className="h-6 w-6 text-[#7584a1]" strokeWidth={2.1} />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-[#7584a1]">End Date</span>
                        <input
                          type="date"
                          value={featuredEndDate}
                          onChange={(e) => setFeaturedEndDate(e.target.value)}
                          className="bg-transparent text-[16px] font-bold text-[#203553] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#e8edf7] pt-8">
                  <div>
                    <h3 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                      Email Students of Category
                    </h3>
                    <p className="mt-2 text-[16px] text-[#72829a]">
                      Notify students interested in &quot;{course.category?.name || "this category"}&quot;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEmailStudents(!emailStudents)}
                    className={`flex h-9 w-16 items-center rounded-full px-1 transition-colors ${
                      emailStudents ? "bg-[#0f8751]" : "bg-[#c2ccdd]"
                    }`}
                  >
                    <span className={`flex h-7 w-7 rounded-full bg-white transition-transform ${
                      emailStudents ? "transform translate-x-7" : ""
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e8edf7] bg-[#f8fbfa] px-8 py-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Confirm Featured Status"}
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

export default function FeaturedSettingsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading featured settings...</div>}>
      <FeaturedSettingsContent />
    </Suspense>
  );
}
