"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  EllipsisVertical,
  Eye,
  Save,
  Star,
  Tags,
  UploadCloud,
  X,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CourseModal } from "@/components/course-flow";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";
import { toast } from "sonner";

type CatalogRow = {
  id: string;
  title: string;
  code: string;
  category: string;
  visibility: "global_public" | "internal_only" | "draft";
  featured: boolean;
};

const visibilityLabels: Record<string, string> = {
  global_public: "Global Public",
  internal_only: "Internal Only",
  draft: "Draft",
};

const visibilityOptions: Array<"global_public" | "internal_only" | "draft"> = [
  "global_public",
  "internal_only",
  "draft",
];

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#b7c2ff] bg-[#f8f9ff] px-4 py-2 text-[15px] font-medium text-[#4057d8]">
      {label}
      <X className="h-4 w-4" strokeWidth={2.1} />
    </span>
  );
}

function SummaryCard({
  href,
  icon,
  title,
  value,
  detail,
  iconClassName,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  value: string;
  detail: string;
  iconClassName: string;
}) {
  const Icon = icon;
  const content = (
    <article className="rounded-[20px] border border-[#e1e8f4] bg-white p-6 shadow-[0_18px_34px_rgba(180,193,229,0.06)]">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${iconClassName}`}>
          <Icon className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <h3 className="text-[16px] font-extrabold text-[#1f3556]">{title}</h3>
      </div>
      <p className="mt-7 text-[54px] font-extrabold tracking-[-0.06em] text-[#16345d]">{value}</p>
      <p className="mt-2 text-[15px] leading-6 text-[#72829a]">{detail}</p>
    </article>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

function ReviewPendingChangesModal({
  onClose,
  editedCourses,
  courses,
  onConfirm,
  onDiscard,
}: {
  onClose: () => void;
  editedCourses: Record<string, { visibility?: "global_public" | "internal_only" | "draft"; featured?: boolean }>;
  courses: any[];
  onConfirm: () => Promise<void>;
  onDiscard: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const manifest = Object.entries(editedCourses).map(([courseId, edits]) => {
    const course = courses.find((c) => c.id === courseId);
    const title = course ? course.name : "Unknown Course";
    const changes: string[] = [];
    if (edits.visibility !== undefined) {
      changes.push(`VISIBILITY: ${visibilityLabels[edits.visibility] || edits.visibility}`);
    }
    if (edits.featured !== undefined) {
      changes.push(edits.featured ? "FEATURED" : "UNFEATURED");
    }
    return { title, changes: changes.join(", ") };
  });

  const visibilityCount = Object.values(editedCourses).filter((e) => e.visibility !== undefined).length;
  const featuredCount = Object.values(editedCourses).filter((e) => e.featured !== undefined).length;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      // Toast message handles the display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CourseModal closeHref="/catalog" onClose={onClose} maxWidthClassName="max-w-[620px]">
      <div className="p-8 pr-14 sm:p-10 sm:pr-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1ff] text-[#4d63e1]">
          <UploadCloud className="h-6 w-6" strokeWidth={2.1} />
        </div>

        <h2 className="mt-6 text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
          Review Pending Changes
        </h2>
        <p className="mt-3 max-w-[500px] text-[16px] leading-8 text-[#72829a]">
          You are about to synchronize your local edits with the production catalog. These
          changes will be live immediately across all institutional portals.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[18px] bg-[#f4f6ff] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#0f8751]">
                  Visibility Updates
                </p>
                <p className="mt-2 text-[18px] font-bold text-[#243756]">
                  {visibilityCount} visibility {visibilityCount === 1 ? "update" : "updates"} pending
                </p>
              </div>
              <span className="text-[#b4bfd7]">
                <Eye className="h-6 w-6" strokeWidth={2} />
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#e2e8f4] bg-[#f8faff] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
                Featured Content
              </p>
              <p className="mt-2 text-[18px] font-bold text-[#243756]">
                {featuredCount} {featuredCount === 1 ? "course" : "courses"} modified
              </p>
            </div>
            <div className="rounded-[18px] border border-[#e2e8f4] bg-[#f8faff] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
                Total Modifications
              </p>
              <p className="mt-2 text-[18px] font-bold text-[#243756]">
                {Object.keys(editedCourses).length} total
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#e2e8f4]">
            <div className="bg-[#f8faff] px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
              Change Manifest
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {manifest.length === 0 ? (
                <div className="px-5 py-4 text-center text-[#72829a] text-[15px]">
                  No pending changes.
                </div>
              ) : (
                manifest.map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-4 border-t border-[#edf1f7] px-5 py-4">
                    <span className="text-[16px] font-medium text-[#213655]">{item.title}</span>
                    <span className="text-[14px] font-bold text-[#0f8751]">{item.changes}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 bg-[#f8fbfa] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              onDiscard();
              onClose();
            }}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || Object.keys(editedCourses).length === 0}
            className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
          >
            {isSubmitting ? "Confirming..." : "Confirm & Apply"}
          </button>
        </div>
      </div>
    </CourseModal>
  );
}

export default function CatalogManagementPage() {
  const { session } = useAuthSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({ publicCourses: 0, featured: 0, globalCategories: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  // Edits state
  const [editedCourses, setEditedCourses] = useState<Record<string, { visibility?: "global_public" | "internal_only" | "draft"; featured?: boolean }>>({});
  const [openVisibilityRow, setOpenVisibilityRow] = useState<string | null>(null);
  const [openActionRow, setOpenActionRow] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch Courses
  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const url = `${endpoints.courses.all}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await apiRequest<{ message: string; data: any[]; meta: any }>(url, {
        authToken: session?.token,
      });
      setCourses(res.data || []);
      if (res.meta) {
        setMeta({
          total: res.meta.total,
          totalPages: res.meta.totalPages,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch Categories
  async function fetchCategories() {
    setLoadingCategories(true);
    try {
      const res = await apiRequest<{ message: string; data: any[] }>(endpoints.courses.categories.all, {
        authToken: session?.token,
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }

  // Fetch Stats
  async function fetchStats() {
    setLoadingStats(true);
    try {
      const res = await apiRequest<{ message: string; data: any }>(endpoints.courses.settingsStats, {
        authToken: session?.token,
      });
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch settings stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    if (session?.token) {
      fetchCourses();
      fetchCategories();
      fetchStats();
    }
  }, [session?.token, page, search]);

  const toggleFeatured = (courseId: string, currentFeatured: boolean) => {
    setEditedCourses((prev) => {
      const next = { ...prev };
      if (!next[courseId]) next[courseId] = {};

      const course = courses.find((c) => c.id === courseId);
      const baselineFeatured = course ? course.featured : false;

      const newVal = !currentFeatured;
      if (newVal === baselineFeatured) {
        delete next[courseId].featured;
        if (Object.keys(next[courseId]).length === 0) {
          delete next[courseId];
        }
      } else {
        next[courseId].featured = newVal;
      }
      return next;
    });
  };

  const updateLocalVisibility = (courseId: string, visibility: "global_public" | "internal_only" | "draft") => {
    setEditedCourses((prev) => {
      const next = { ...prev };
      if (!next[courseId]) next[courseId] = {};

      const course = courses.find((c) => c.id === courseId);
      const baselineVisibility = course ? course.visibility : "draft";

      if (visibility === baselineVisibility) {
        delete next[courseId].visibility;
        if (Object.keys(next[courseId]).length === 0) {
          delete next[courseId];
        }
      } else {
        next[courseId].visibility = visibility;
      }
      return next;
    });
    setOpenVisibilityRow(null);
  };

  const handleDiscardChanges = () => {
    setEditedCourses({});
    toast.info("Changes discarded.");
  };

  const handleConfirmChanges = async () => {
    const updates = Object.entries(editedCourses).map(([courseId, edits]) => ({
      courseId,
      ...edits,
    }));

    try {
      await apiRequest(endpoints.courses.bulkUpdateSettings, {
        method: "PUT",
        authToken: session?.token,
        body: { updates },
      });
      toast.success("Catalog settings synchronized successfully!");
      setEditedCourses({});
      fetchCourses();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply changes.");
      throw err;
    }
  };

  // Helper to get effective featured status (local edit or database baseline)
  const getEffectiveFeatured = (course: any) => {
    if (editedCourses[course.id] && editedCourses[course.id].featured !== undefined) {
      return editedCourses[course.id].featured!;
    }
    return course.featured;
  };

  // Helper to get effective visibility status (local edit or database baseline)
  const getEffectiveVisibility = (course: any) => {
    if (editedCourses[course.id] && editedCourses[course.id].visibility !== undefined) {
      return editedCourses[course.id].visibility!;
    }
    return course.visibility;
  };

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto ">
        <section className="mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
                Course Categories
              </h1>
            </div>

            <Link
              href="/catalog/categories"
              className="inline-flex items-center gap-2 text-[16px] font-bold text-[#4057d8]"
            >
              <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
              Manage Categories
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {loadingCategories ? (
              <span className="text-[15px] text-[#72829a]">Loading categories...</span>
            ) : categories.length === 0 ? (
              <span className="text-[15px] text-[#72829a]">No categories defined yet.</span>
            ) : (
              categories.map((cat) => (
                <CategoryPill key={cat.id} label={cat.name} />
              ))
            )}
            <Link
              href="/catalog/categories"
              className="inline-flex items-center rounded-full border border-dashed border-[#b7c2ff] px-5 py-2 text-[15px] font-semibold text-[#4057d8]"
            >
              + Add New
            </Link>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-7 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d] whitespace-nowrap mr-4">
                Course Visibility &amp; Featured Settings
              </h2>
              {/* Search bar inside the catalog header for high premium feel */}
              <div className="relative flex items-center h-10 w-full sm:w-[280px] rounded-[10px] border border-[#d7deee] bg-[#f8faff] px-3">
                <Search className="h-4 w-4 text-[#8d99b1] mr-2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-[14px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {Object.keys(editedCourses).length > 0 && (
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
                >
                  Discard
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                disabled={Object.keys(editedCourses).length === 0}
                className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] disabled:opacity-50"
              >
                Apply Changes
                <Save className="h-5 w-5" strokeWidth={2.1} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f6f8fd]">
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-7 py-6">Course Name</th>
                  <th className="px-6 py-6">Category</th>
                  <th className="px-6 py-6">Featured</th>
                  <th className="px-6 py-6">Visibility</th>
                  <th className="px-6 py-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-7 py-16 text-center text-[#72829a] font-medium text-[16px]">
                      Loading courses...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-7 py-16 text-center text-red-500 font-medium text-[16px]">
                      {error}
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-7 py-16 text-center text-[#72829a] font-medium text-[16px]">
                      No courses found matching search.
                    </td>
                  </tr>
                ) : (
                  courses.map((row) => {
                    const effectiveFeatured = getEffectiveFeatured(row);
                    const effectiveVisibility = getEffectiveVisibility(row);
                    const isModified = !!editedCourses[row.id];

                    return (
                      <tr key={row.id} className={`border-t border-[#eef2f8] align-top transition-colors ${isModified ? "bg-[#fcfcff]" : ""}`}>
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-4">
                            <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#7a31ff,#a94cff)] text-[15px] font-bold text-white uppercase">
                              {row.name.substring(0, 2)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[16px] font-bold text-[#1f3556]">{row.name}</p>
                                {isModified && (
                                  <span className="inline-flex rounded bg-[#fff0e6] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-[#ff8000]">
                                    Edited
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[14px] text-[#72829a]">ID: {row.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-[#deebff] px-4 py-2 text-[14px] font-bold text-[#2463e7]">
                            {row.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => toggleFeatured(row.id, effectiveFeatured)}
                            className={`flex h-8 w-14 items-center rounded-full px-1 transition-colors duration-200 ${
                              effectiveFeatured ? "bg-[#0f8751]" : "bg-[#c2ccdd]"
                            }`}
                            aria-label={`Toggle featured for ${row.name}`}
                          >
                            <span className={`flex h-6 w-6 rounded-full bg-white transition-transform duration-200 ${
                              effectiveFeatured ? "transform translate-x-6" : ""
                            }`} />
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenVisibilityRow((current) => (current === row.id ? null : row.id))
                              }
                              className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors ${
                                effectiveVisibility === "global_public"
                                  ? "bg-[#e2f7e8] text-[#1f8a5c]"
                                  : effectiveVisibility === "internal_only"
                                  ? "bg-[#e9f0ff] text-[#2463e7]"
                                  : "bg-[#f1f3f7] text-[#6c7c95]"
                              }`}
                            >
                              <span>{visibilityLabels[effectiveVisibility] || effectiveVisibility}</span>
                              <ChevronDown className="h-4 w-4" strokeWidth={2.1} />
                            </button>

                            {openVisibilityRow === row.id ? (
                              <div className="absolute left-0 top-[calc(100%+12px)] z-10 w-[216px] overflow-hidden rounded-[12px] border border-[#edf1f7] bg-white shadow-[0_26px_50px_rgba(34,54,84,0.16)]">
                                {visibilityOptions.map((option, index) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => updateLocalVisibility(row.id, option)}
                                    className={[
                                      "block w-full px-5 py-4 text-left text-[16px] font-medium transition-colors hover:bg-[#f8faff]",
                                      effectiveVisibility === option
                                        ? "bg-[#f8faff] text-[#4057d8]"
                                        : "text-[#6a79a5]",
                                      index !== 0 ? "border-t border-[#edf1f7]" : "",
                                    ].join(" ")}
                                  >
                                    {visibilityLabels[option]}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenActionRow((current) => (current === row.id ? null : row.id))}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-[#8b98ae] hover:bg-[#f4f7fb]"
                              aria-label={`Open actions for ${row.name}`}
                            >
                              <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                            </button>

                            {openActionRow === row.id ? (
                              <div className="absolute right-0 top-[calc(100%+10px)] z-10 w-[200px] overflow-hidden rounded-[12px] border border-[#edf1f7] bg-white shadow-[0_18px_32px_rgba(34,54,84,0.12)]">
                                <Link
                                  href={`/catalog/visibility?courseId=${row.id}`}
                                  className="block px-5 py-4 text-[16px] font-medium text-[#2b3f60] hover:bg-[#f7f9fd]"
                                >
                                  View Visibility Setting
                                </Link>
                                <Link
                                  href={`/catalog/featured?courseId=${row.id}`}
                                  className="block px-5 py-4 text-[16px] font-medium text-[#2b3f60] hover:bg-[#f7f9fd] border-t border-[#edf1f7]"
                                >
                                  Featured Settings
                                </Link>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-5 border-t border-[#e8edf7] px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[15px] font-semibold text-[#667792]">
              Showing {courses.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, meta.total)} of {meta.total} courses
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dfe6f1] text-[#9aa7ba] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.1} />
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    "flex h-9 min-w-9 items-center justify-center rounded-[8px] px-3 text-[15px] font-semibold",
                    p === page ? "bg-[#0f8751] text-white" : "text-[#233654] border border-[#dfe6f1]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dfe6f1] text-[#9aa7ba] disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <SummaryCard
            icon={Eye}
            title="Public Courses"
            value={loadingStats ? "…" : stats.publicCourses.toString()}
            detail="Visible to all registered platform users"
            iconClassName="bg-[#f3eeff] text-[#6a4dff]"
          />
          <SummaryCard
            href="/catalog/featured"
            icon={Star}
            title="Featured"
            value={loadingStats ? "…" : stats.featured.toString()}
            detail="Prioritized in marketplace search results"
            iconClassName="bg-[#ecf8ef] text-[#11814a]"
          />
          <SummaryCard
            href="/catalog/categories"
            icon={Tags}
            title="Global Categories"
            value={loadingStats ? "…" : stats.globalCategories.toString()}
            detail="Active taxonomies for organization"
            iconClassName="bg-[#f7ecff] text-[#bd55f7]"
          />
        </section>
      </div>

      {showReviewModal ? (
        <ReviewPendingChangesModal
          onClose={() => setShowReviewModal(false)}
          editedCourses={editedCourses}
          courses={courses}
          onConfirm={handleConfirmChanges}
          onDiscard={() => setEditedCourses({})}
        />
      ) : null}
    </AppShell>
  );
}
