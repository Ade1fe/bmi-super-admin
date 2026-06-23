"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  GripVertical,
  PenSquare,
  Plus,
  Settings2,
  Trash2,
  Video,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CourseActionLink, CoursePageTitle } from "@/components/course-flow";
import { useAuthSession } from "@/lib/auth-session";
import {
  deleteModule,
  fetchModules,
  getCourseBySlug,
  type Course,
  type CourseModule,
  createObjective,
  updateObjective,
  deleteObjective,
  fetchObjectives,
  type CourseObjective,
} from "@/lib/course-api";
import { apiRequest, endpoints } from "@/lib/endpoints";

function formatTitle(slug: string) {
  if (!slug) return "Course";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { session, isHydrated } = useAuthSession();
  const { slug } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseStatus, setCourseStatus] = useState("");

  // ═══════════════════════════════════════════════════════════════════════
  // OBJECTIVES STATE
  // ═══════════════════════════════════════════════════════════════════════
  const [objectives, setObjectives] = useState<CourseObjective[]>([]);
  const [isObjectivesModalOpen, setIsObjectivesModalOpen] = useState(false);
  const [isRefreshingObjectives, setIsRefreshingObjectives] = useState(false);
  const [objectivesError, setObjectivesError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for new/editing objective
  const [objectiveText, setObjectiveText] = useState("");
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(null);
  const [isSavingObjective, setIsSavingObjective] = useState(false);
  const [isDeletingObjective, setIsDeletingObjective] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════
  // Load course data
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let active = true;

    async function loadCourseData() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const fetchedCourse = await getCourseBySlug(slug, session?.token);

        if (!active) {
          return;
        }

        if (!fetchedCourse) {
          throw new Error("Course not found.");
        }

        const fetchedModules = await fetchModules(fetchedCourse.id, session?.token);

        // ✅ Extract objectives from course response
        setObjectives(fetchedCourse.learningObjectives ?? []);

        if (!active) {
          return;
        }

        setCourse(fetchedCourse);
        setCourseName(fetchedCourse.name ?? "");
        setCourseDescription(fetchedCourse.description ?? "");
        setCourseStatus(fetchedCourse.status ?? "");
        setModules(fetchedModules);
      } catch (err) {
        if (!active) {
          return;
        }

        setFetchError(err instanceof Error ? err.message : "Unable to load course.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCourseData();

    return () => {
      active = false;
    };
  }, [slug, isHydrated, session?.token]);

  // ═══════════════════════════════════════════════════════════════════════
  // Refresh objectives from API
  // ═══════════════════════════════════════════════════════════════════════

  async function refreshObjectives() {
    if (!course?.id) return;

    setIsRefreshingObjectives(true);
    try {
      const freshObjectives = await fetchObjectives(course.id, session?.token);
      setObjectives(freshObjectives);
    } catch (err) {
      console.error("[OBJECTIVES] Failed to refresh:", err);
    } finally {
      setIsRefreshingObjectives(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // OBJECTIVES HANDLERS --
  // ═══════════════════════════════════════════════════════════════════════

  async function handleSaveObjective() {
    if (!course?.id || !objectiveText.trim()) {
      setObjectivesError("Objective text is required");
      return;
    }

    setIsSavingObjective(true);
    setObjectivesError(null);
    setSuccessMessage(null);

    try {
      if (editingObjectiveId) {
        // UPDATE
        const updated = await updateObjective(
          editingObjectiveId,
          { objective: objectiveText },
          session?.token
        );
        if (updated) {
          setObjectives((prev) =>
            prev.map((obj) => (obj.id === editingObjectiveId ? updated : obj))
          );
          setSuccessMessage("Objective updated successfully!");
        }
      } else {
        // CREATE
        const created = await createObjective(
          course.id,
          { objective: objectiveText },
          session?.token
        );
        if (created) {
          setObjectives((prev) => [...prev, created]);
          setSuccessMessage("Objective added successfully!");
        }
      }

      setObjectiveText("");
      setEditingObjectiveId(null);

      // Auto-dismiss success message
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save objective";
      setObjectivesError(errorMsg);
      console.error("[OBJECTIVES]", errorMsg);
    } finally {
      setIsSavingObjective(false);
    }
  }

  async function handleDeleteObjective(objectiveId: string, objectiveText: string) {
    if (!window.confirm(`Delete "${objectiveText}"? This cannot be undone.`)) {
      return;
    }

    setIsDeletingObjective(true);
    setObjectivesError(null);
    setSuccessMessage(null);

    try {
      await deleteObjective(objectiveId, session?.token);
      setObjectives((prev) => prev.filter((obj) => obj.id !== objectiveId));
      setSuccessMessage("Objective deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete objective";
      setObjectivesError(errorMsg);
      console.error("[OBJECTIVES]", errorMsg);
    } finally {
      setIsDeletingObjective(false);
    }
  }

  function handleEditObjective(objective: CourseObjective) {
    setEditingObjectiveId(objective.id);
    setObjectiveText(objective.objective);
    setObjectivesError(null);
    setSuccessMessage(null);
  }

  function handleCancelEditObjective() {
    setEditingObjectiveId(null);
    setObjectiveText("");
    setObjectivesError(null);
  }

  async function handleDeleteModule(moduleId: string) {
    if (!moduleId) {
      return;
    }

    if (!window.confirm("Delete this module? This cannot be undone.")) {
      return;
    }

    setIsDeletingModule(true);

    try {
      await deleteModule(moduleId, session?.token);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unable to delete module.");
      console.error(err);
    } finally {
      setIsDeletingModule(false);
    }
  }

  async function handleUpdateCourse() {
    if (!course?.id) return;

    try {
      setIsUpdatingCourse(true);

      const updatedCourse = await apiRequest<Course>(
        endpoints.courses.update(course.id),
        {
          method: "PUT",
          authToken: session?.token,
          body: {
            name: courseName,
            description: courseDescription,
            status: courseStatus,
          },
        }
      );

      setCourse(updatedCourse);
      setIsEditCourseOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to update course"
      );
    } finally {
      setIsUpdatingCourse(false);
    }
  }

  async function handleDeleteCourse() {
    if (!course?.id) return;
    if (!window.confirm(`Permanently delete "${course.name}"? This cannot be undone.`))
      return;

    setIsDeletingCourse(true);
    try {
      await apiRequest(
        endpoints.admin.courses.delete(course.id),
        { method: "DELETE", authToken: session?.token }
      );
      window.location.href = "/courses";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete course.");
    } finally {
      setIsDeletingCourse(false);
    }
  }

  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [modules]
  );

  const title = course?.name ?? formatTitle(slug);
  const addModuleHref = course?.id
    ? `/courses/create/content-upload?courseId=${course.id}&modal=module-settings`
    : "/courses/create/content-upload?modal=module-settings";

  return (
    <AppShell
      title={<CoursePageTitle label={`Edit Course: ${title}`} backHref="/courses" />}
      activeSection="courses"
    >
      <div className="mx-auto ">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HEADER                                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              {title}
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-8 text-[#465b7d]">
              Track your growth and unlock new milestones.
            </p>
          </div>

          <div className="flex gap-2 flex-end">
            <button
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
              className="flex h-12 items-center rounded-xl bg-[#ef1f4f] px-5 text-white transition hover:bg-[#c91840] disabled:opacity-60"
            >
              {isDeletingCourse ? "Deleting…" : "Delete Course"}
            </button>

            <button
              onClick={() => setIsObjectivesModalOpen(true)}
              className="flex h-12 items-center gap-2 rounded-xl bg-[#4b8a60] px-5 text-white transition hover:bg-[#3d6d4b]"
            >
              <Target className="h-5 w-5" strokeWidth={2} />
              Objectives ({objectives.length})
            </button>

            <button
              onClick={() => setIsEditCourseOpen(true)}
              className="flex h-12 items-center rounded-xl bg-[#16345d] px-5 text-white transition hover:bg-[#102846]"
            >
              Edit Course
            </button>

            <CourseActionLink href={addModuleHref} className="min-w-[220px]">
              Add New Module
            </CourseActionLink>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* OBJECTIVES SECTION (Inline Display)                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {objectives.length > 0 && (
          <section className="mt-10 rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_40px_rgba(182,192,227,0.09)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-[#4b8a60]" strokeWidth={2} />
                <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
                  Learning Objectives
                </h2>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4b8a60]/10 text-xs font-bold text-[#4b8a60]">
                  {objectives.length}
                </span>
              </div>

              <button
                onClick={refreshObjectives}
                disabled={isRefreshingObjectives}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-50"
                title="Refresh objectives"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshingObjectives ? "animate-spin" : ""}`}
                  strokeWidth={2}
                />
              </button>
            </div>

            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div
                  key={objective.id}
                  className="flex items-start gap-4 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4b8a60]/10 text-sm font-bold text-[#4b8a60]">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-[#1e293b]">
                      {objective.objective}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsObjectivesModalOpen(true)}
                    className="shrink-0 rounded-lg p-2 text-[#64748b] hover:bg-white hover:text-[#4b8a60]"
                    title="Edit objectives"
                  >
                    <PenSquare className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODULES SECTION                                                 */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="mt-12">
          <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Course Structure
          </h2>

          {isLoading ? (
            <p className="mt-8 text-[#66748b]">Loading course structure…</p>
          ) : fetchError ? (
            <p className="mt-8 text-[#d32f2f]">{fetchError}</p>
          ) : sortedModules.length === 0 ? (
            <div className="mt-8 rounded-[22px] border border-[#dfe6f7] bg-white p-10 text-center">
              <p className="text-[18px] text-[#455d7b]">
                No modules have been added to this course yet.
              </p>
              <CourseActionLink href={addModuleHref} className="mt-6 inline-block">
                Add First Module
              </CourseActionLink>
            </div>
          ) : (
            <div className="mt-8 space-y-7">
              {sortedModules.map((module, moduleIndex) => {
                const isEmpty = module.lessons.length === 0;
                const lessonCountText = isEmpty
                  ? "New Module"
                  : `${module.lessons.length} Lesson${
                      module.lessons.length === 1 ? "" : "s"
                    }`;
                const statusTag = module.status ? module.status : "";
                const moduleNumber = String(moduleIndex + 1).padStart(2, "0");
                const sortedLessons = [...module.lessons].sort(
                  (a, b) => (a.order ?? 0) - (b.order ?? 0)
                );

                return (
                  <article
                    key={module.id}
                    className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.09)]"
                  >
                    <div className="flex flex-col gap-4 bg-[#eef1fb] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <GripVertical
                          className="h-5 w-5 shrink-0 text-[#98a6be]"
                          strokeWidth={2.2}
                        />
                        <div className="min-w-0">
                          <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
                            Module {moduleNumber}
                          </p>
                          <h3 className="truncate text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
                            {module.title}
                          </h3>
                          <p className="mt-1 text-[16px] text-[#667792]">
                            {lessonCountText}
                            {statusTag ? ` • ${statusTag}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[#6f7e96]">
                        <Link
                          href={`/courses/create/content-upload?courseId=${course?.id}&modal=module-settings&moduleId=${module.id}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
                        >
                          <Settings2 className="h-5 w-5" strokeWidth={2.1} />
                        </Link>
                        <button
                          type="button"
                          disabled={isDeletingModule}
                          onClick={() => handleDeleteModule(module.id)}
                          aria-label="Delete module"
                          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white disabled:opacity-60 disabled:hover:bg-transparent"
                        >
                          <Trash2 className="h-5 w-5" strokeWidth={2.1} />
                        </button>
                        {!isEmpty ? (
                          <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
                          >
                            <ChevronDown className="h-5 w-5" strokeWidth={2.1} />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {isEmpty ? (
                      <div className="border-t border-[#e8edf7] bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef1ff] text-[#8594e7]">
                          <Plus className="h-10 w-10" strokeWidth={1.9} />
                        </div>
                        <h3 className="mt-8 text-[24px] font-extrabold tracking-[-0.04em] text-[#22314c]">
                          This module is empty
                        </h3>
                        <p className="mx-auto mt-3 max-w-[440px] text-[17px] leading-7 text-[#71819d]">
                          Start by adding your first lesson or resource
                        </p>
                        <CourseActionLink
                          href={`/courses/create/content-upload?courseId=${course?.id}&moduleId=${module.id}&modal=lesson-editor`}
                          className="mt-8 min-w-[190px]"
                        >
                          Create First Lesson
                        </CourseActionLink>
                      </div>
                    ) : (
                      <div className="space-y-4 border-t border-[#e8edf7] bg-[#fbfcff] p-6">
                        {sortedLessons.map((lesson, lessonIndex) => {
                          const lessonNumber = `${moduleNumber}.${
                            lesson.order ?? lessonIndex + 1
                          }`;
                          const detailText = lesson.estimatedReadingTime
                            ? `${lesson.type === "video" ? "Video" : "Reading"} • ${lesson.estimatedReadingTime}`
                            : lesson.type === "video"
                            ? "Video"
                            : "Reading";

                          return (
                            <article
                              key={lesson.id}
                              className="rounded-[18px] border border-[#e8edf7] bg-white px-5 py-5"
                            >
                              <div className="flex items-center gap-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef8f1] text-[#0f8751]">
                                  {lesson.type === "video" ? (
                                    <Video className="h-5 w-5" strokeWidth={2.1} />
                                  ) : (
                                    <BookOpen
                                      className="h-5 w-5"
                                      strokeWidth={2.1}
                                    />
                                  )}
                                </span>
                                <div>
                                  <h4 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#22314c]">
                                    {lessonNumber} {lesson.title}
                                  </h4>
                                  <p className="mt-1 text-[16px] text-[#6d7d98]">
                                    {detailText}
                                  </p>
                                </div>
                              </div>
                            </article>
                          );
                        })}

                        <Link
                          href={`/courses/create/content-upload?courseId=${course?.id}&moduleId=${module.id}&modal=lesson-editor`}
                          className="flex min-h-[58px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#dceadf] bg-white text-[18px] font-medium text-[#7687a2]"
                        >
                          + Add Lesson to Module {moduleNumber}
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* EDIT COURSE MODAL                                                 */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isEditCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#16345d]">Edit Course</h2>

              <button
                onClick={() => setIsEditCourseOpen(false)}
                className="text-2xl text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Course Name
                </label>

                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#16345d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#16345d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Status
                </label>

                <select
                  value={courseStatus}
                  onChange={(e) => setCourseStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#16345d]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsEditCourseOpen(false)}
                  className="rounded-xl border px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateCourse}
                  disabled={isUpdatingCourse}
                  className="rounded-xl bg-[#16345d] px-5 py-3 text-white disabled:opacity-50"
                >
                  {isUpdatingCourse ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* OBJECTIVES MODAL                                                  */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isObjectivesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-[#4b8a60]" strokeWidth={2} />
                <h2 className="text-2xl font-bold text-[#16345d]">
                  Course Objectives
                </h2>
              </div>

              <button
                onClick={() => {
                  setIsObjectivesModalOpen(false);
                  handleCancelEditObjective();
                  setObjectivesError(null);
                  setSuccessMessage(null);
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                <CheckCircle className="h-5 w-5 shrink-0" strokeWidth={2} />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {objectivesError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={2} />
                {objectivesError}
              </div>
            )}

            {/* Add/Edit Form */}
            <div className="mb-8 rounded-xl bg-[#f8fafc] p-5 border border-[#e2e8f0]">
              <h3 className="mb-4 text-lg font-semibold text-[#16345d]">
                {editingObjectiveId ? "Edit Objective" : "Add New Objective"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#334155]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={objectiveText}
                    onChange={(e) => setObjectiveText(e.target.value)}
                    placeholder="e.g., Understand the fundamentals of UI design"
                    className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2 outline-none focus:border-[#4b8a60] focus:ring-2 focus:ring-[#4b8a60]/20"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  {editingObjectiveId && (
                    <button
                      onClick={handleCancelEditObjective}
                      className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#f1f5f9]"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveObjective}
                    disabled={isSavingObjective || !objectiveText.trim()}
                    className="rounded-lg bg-[#4b8a60] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d6d4b] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingObjective
                      ? "Saving..."
                      : editingObjectiveId
                      ? "Update"
                      : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Objectives List */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#16345d]">
                Learning Objectives ({objectives.length})
              </h3>

              {objectives.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] py-8 text-center">
                  <Target
                    className="mx-auto mb-3 h-8 w-8 text-[#94a3b8]"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-[#64748b]">
                    No objectives added yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <div
                      key={objective.id}
                      className="rounded-lg border border-[#e2e8f0] bg-white p-4 hover:border-[#cbd5e1] transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4b8a60]/10 text-xs font-bold text-[#4b8a60]">
                              {index + 1}
                            </span>
                            <p className="text-sm text-[#1e293b]">
                              {objective.objective}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditObjective(objective)}
                            disabled={isSavingObjective || isDeletingObjective}
                            className="rounded-lg p-2 hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#4b8a60] disabled:opacity-50"
                            title="Edit"
                          >
                            <PenSquare className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteObjective(objective.id, objective.objective)
                            }
                            disabled={isDeletingObjective || isSavingObjective}
                            className="rounded-lg p-2 hover:bg-red-50 text-[#64748b] hover:text-red-600 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={refreshObjectives}
                disabled={isRefreshingObjectives}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-50"
              >
                {isRefreshingObjectives ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={() => {
                  setIsObjectivesModalOpen(false);
                  handleCancelEditObjective();
                  setObjectivesError(null);
                  setSuccessMessage(null);
                }}
                className="rounded-lg bg-[#16345d] px-4 py-2 text-sm font-medium text-white hover:bg-[#102846]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}