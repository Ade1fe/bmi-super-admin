"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  GripVertical,
  PenSquare,
  Plus,
  Settings2,
  Trash2,
  Video,
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

const [courseName, setCourseName] = useState("");
const [courseDescription, setCourseDescription] = useState("");
const [courseStatus, setCourseStatus] = useState("");

// Add this state near the other state declarations:
const [isDeletingCourse, setIsDeletingCourse] = useState(false);


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
      error instanceof Error
        ? error.message
        : "Failed to update course"
    );
  } finally {
    setIsUpdatingCourse(false);
  }
}

  const sortedModules = useMemo(
    () =>
      [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [modules]
  );

  const title = course?.name ?? formatTitle(slug);
  const addModuleHref = course?.id
    ? `/courses/create/content-upload?courseId=${course.id}&modal=module-settings`
    : "/courses/create/content-upload?modal=module-settings";



// Add this handler near handleUpdateCourse:
async function handleDeleteCourse() {
  if (!course?.id) return;
  if (!window.confirm(`Permanently delete "${course.name}"? This cannot be undone.`)) return;

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

    
  return (
    <AppShell
      title={<CoursePageTitle label={`Edit Course: ${title}`} backHref="/courses" />}
      activeSection="courses"
    >
      <div className="mx-auto ">
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
              <p className="text-[18px] text-[#455d7b]">No modules have been added to this course yet.</p>
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
                  : `${module.lessons.length} Lesson${module.lessons.length === 1 ? "" : "s"}`;
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
                        <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
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
                          const lessonNumber = `${moduleNumber}.${lesson.order ?? lessonIndex + 1}`;
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
                                    <BookOpen className="h-5 w-5" strokeWidth={2.1} />
                                  )}
                                </span>
                                <div>
                                  <h4 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#22314c]">
                                    {lessonNumber} {lesson.title}
                                  </h4>
                                  <p className="mt-1 text-[16px] text-[#6d7d98]">{detailText}</p>
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

      {isEditCourseOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#16345d]">
          Edit Course
        </h2>

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
    </AppShell>
  );
}
