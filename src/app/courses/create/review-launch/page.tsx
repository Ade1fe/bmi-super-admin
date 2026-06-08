"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  GripVertical,
  ListChecks,
  Lock,
  Maximize,
  Play,
  Search,
  Settings2,
  User,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseActionLink,
  CourseFlowStepper,
  CoursePageTitle,
} from "@/components/course-flow";
import {
  getCourse,
  fetchModules,
  updateCourse,
  type Course,
  type CourseModule,
} from "@/lib/course-api";
import { useAuthSession } from "@/lib/auth-session";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatModuleNumber(order: number | undefined, index: number) {
  return String(order ?? index + 1).padStart(2, "0");
}

function totalLessonsCount(modules: CourseModule[]) {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

function totalQuizzesCount(modules: CourseModule[]) {
  return modules.filter((m) => m.quiz).length;
}

function difficultyLabel(level: string | undefined) {
  if (!level) return "—";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-[10px] bg-[#e8edf7]",
        className,
      ].join(" ")}
    />
  );
}

// ---------------------------------------------------------------------------
// Course summary card (top stats row)
// ---------------------------------------------------------------------------
function SummaryPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-[#e6ebf7] bg-white px-5 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef1fb] text-[#4b8a60]">
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </span>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8496b0]">{label}</p>
        <p className="text-[15px] font-extrabold text-[#1a2f51]">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Module row in the review list
// ---------------------------------------------------------------------------
function ReviewModuleRow({
  module,
  index,
}: {
  module: CourseModule;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const lessonCount = module.lessons.length;
  const hasQuiz = Boolean(module.quiz);

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#dfe6f7] bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 bg-[#eef1fb] px-5 py-4 text-left sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
          <div className="min-w-0">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
              Module {formatModuleNumber(module.order, index)}
            </p>
            <h3 className="truncate text-[15px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              {module.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-[#667792]">
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              {hasQuiz ? " · Quiz included" : ""}
              {module.releaseInterval ? ` · ${module.releaseInterval}-day drip` : ""}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[#66748b]">
          {expanded ? (
            <ChevronDown className="h-5 w-5" strokeWidth={2.1} />
          ) : (
            <ChevronRight className="h-5 w-5" strokeWidth={2.1} />
          )}
        </span>
      </button>

      {expanded && lessonCount > 0 && (
        <div className="divide-y divide-[#edf0f7] border-t border-[#e8edf7] bg-white">
          {module.lessons.map((lesson, li) => {
            const type = lesson.type?.toLowerCase();
            const Icon =
              type === "video" ? Play : type === "quiz" ? ListChecks : FileText;
            const iconClass =
              type === "video"
                ? "bg-[#eef4ff] text-[#2f66ff]"
                : type === "quiz"
                  ? "bg-[#fff3e7] text-[#f07f20]"
                  : "bg-[#eef8f1] text-[#16a05c]";

            return (
              <div
                key={lesson.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[12px]",
                    iconClass,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#22314c]">
                    {index + 1}.{lesson.order ?? li + 1} {lesson.title}
                  </p>
                  {lesson.estimatedReadingTime && (
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#8496b0]">
                      <Clock3 className="h-3 w-3" strokeWidth={2} />
                      {lesson.estimatedReadingTime}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-[#e6f7ee] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f8751]">
                  {lesson.accessLevel ?? "Enrolled"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {expanded && hasQuiz && (
        <div className="flex items-center gap-3 border-t border-[#dce9e1] bg-[#f6fffa] px-6 py-4">
          <ListChecks className="h-5 w-5 shrink-0 text-[#0f8751]" strokeWidth={2.1} />
          <div>
            <p className="text-[14px] font-semibold text-[#22314c]">
              {module.quiz!.title || "Module Quiz"}
            </p>
            <p className="text-[12px] text-[#8496b0]">
              Pass mark: {module.quiz!.passMark}% · {module.quiz!.attempts} attempt
              {module.quiz!.attempts !== 1 ? "s" : ""} · {module.quiz!.timeLimit} min
            </p>
          </div>
          <span
            className={[
              "ml-auto shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]",
              module.quiz!.visibility === "publish"
                ? "bg-[#e6f7ee] text-[#0f8751]"
                : "bg-[#fff0c8] text-[#d69008]",
            ].join(" ")}
          >
            {module.quiz!.visibility === "publish" ? "Published" : "Draft"}
          </span>
        </div>
      )}

      {expanded && lessonCount === 0 && !hasQuiz && (
        <div className="border-t border-[#e8edf7] px-6 py-6 text-center text-[14px] italic text-[#8496b0]">
          No lessons added yet
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Course info panel
// ---------------------------------------------------------------------------
function CourseInfoPanel({ course }: { course: Course }) {
  return (
    <div className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
      <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#182f53]">
        Course Details
      </h2>

      {course.thumbnailUrl && (
        <div className="mt-5 overflow-hidden rounded-[14px]">
          <img
            src={course.thumbnailUrl}
            alt={course.name}
            className="h-[160px] w-full object-cover"
          />
        </div>
      )}

      <dl className="mt-5 space-y-4 text-[14px]">
        {[
          { label: "Category", value: course.categoryName || "—" },
          { label: "Difficulty", value: difficultyLabel(course.difficultyLevel) },
          { label: "Status", value: (course.status ?? "draft").toUpperCase() },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-[#7e8da6]">{label}</dt>
            <dd className="font-extrabold text-[#22314c]">{value}</dd>
          </div>
        ))}
      </dl>

      {course.description && (
        <div className="mt-5 border-t border-[#e8edf7] pt-5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8496b0]">
            Description
          </p>
          <p className="mt-2 text-[14px] leading-6 text-[#4b6182]">{course.description}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------
function ReviewAndLaunchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, isHydrated } = useAuthSession();

  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const backHref = courseId
    ? `/courses/create/content-upload?courseId=${encodeURIComponent(courseId)}`
    : "/courses/create/content-upload";

  useEffect(() => {
    if (!isHydrated) return;
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    Promise.all([
      getCourse(courseId, session?.token),
      fetchModules(courseId, session?.token),
    ])
      .then(([courseData, modulesData]) => {
        setCourse(courseData);
        setModules(modulesData);
      })
      .catch((err) => {
        setLoadError(
          err instanceof Error ? err.message : "Unable to load course data."
        );
      })
      .finally(() => setIsLoading(false));
  }, [courseId, isHydrated, session?.token]);

  async function handlePublish() {
    if (!courseId) return;
    setIsPublishing(true);
    setActionError(null);
    try {
      await updateCourse(courseId, { status: "published" }, session?.token);
      router.push("/courses");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to publish course."
      );
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleSaveDraft() {
    if (!courseId) return;
    setIsSavingDraft(true);
    setActionError(null);
    try {
      await updateCourse(courseId, { status: "draft" }, session?.token);
      router.push("/courses");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to save draft."
      );
    } finally {
      setIsSavingDraft(false);
    }
  }

  const totalLessons = totalLessonsCount(modules);
  const totalQuizzes = totalQuizzesCount(modules);

  return (
    <AppShell
      title={
        <CoursePageTitle
          label="Create New Course"
          backHref={backHref}
        />
      }
      activeSection="courses"
    >
      <div className="mx-auto max-w-[1320px]">
        <CourseFlowStepper currentStep={3} courseId={courseId} />

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              Review &amp; Launch
            </h1>
            <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#465b7d]">
              Review your course structure before publishing. Everything looks good? Hit Publish.
            </p>
            {courseId && (
              <p className="mt-2 text-[13px] text-[#4b8a60]">
                Course ID: <span className="font-semibold">{courseId}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPublishing || !courseId}
              className="inline-flex h-12 min-w-[156px] items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-5 text-[15px] font-semibold text-[#4b8a60] transition-colors hover:bg-[#dff0e8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingDraft ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || isSavingDraft || !courseId}
              className="inline-flex h-12 min-w-[184px] items-center justify-between gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors hover:bg-[#3d7450] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isPublishing ? "Publishing…" : "Publish Course"}</span>
              <ContinueArrow />
            </button>
          </div>
        </div>

        {/* Error banner */}
        {(loadError || actionError) && (
          <div className="mt-6 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-4 text-[15px] text-[#a42f2f]">
            {loadError || actionError}
          </div>
        )}

        {/* No course ID guard */}
        {!courseId && !isLoading && (
          <div className="mt-10 rounded-[22px] border border-dashed border-[#dceadf] bg-white px-6 py-14 text-center">
            <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
              No course selected
            </h3>
            <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-6 text-[#71819d]">
              Go back and create or select a course first.
            </p>
            <CourseActionLink
              href="/courses/create"
              className="mt-8 min-w-[190px]"
            >
              Back to Start
            </CourseActionLink>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-10 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonBlock key={i} className="h-[80px]" />
              ))}
            </div>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <SkeletonBlock key={i} className="h-[72px]" />
                ))}
              </div>
              <SkeletonBlock className="h-[320px]" />
            </div>
          </div>
        )}

        {/* Main content */}
        {!isLoading && courseId && course && (
          <>
            {/* Stats row */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryPill
                icon={BookOpen}
                label="Modules"
                value={String(modules.length)}
              />
              <SummaryPill
                icon={FileText}
                label="Lessons"
                value={String(totalLessons)}
              />
              <SummaryPill
                icon={ListChecks}
                label="Quizzes"
                value={String(totalQuizzes)}
              />
              <SummaryPill
                icon={Check}
                label="Status"
                value={(course.status ?? "draft").toUpperCase()}
              />
            </div>

            {/* Main grid */}
            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
              {/* Left: module list */}
              <div>
                <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                  Course Structure
                </h2>
                <p className="mt-1 text-[14px] text-[#667792]">
                  {modules.length} module{modules.length !== 1 ? "s" : ""} · {totalLessons} lesson
                  {totalLessons !== 1 ? "s" : ""}
                </p>

                <div className="mt-5 space-y-4">
                  {modules.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-[#dceadf] bg-white px-6 py-10 text-center">
                      <p className="text-[15px] text-[#71819d]">
                        No modules added yet.{" "}
                        <a
                          href={backHref}
                          className="font-semibold text-[#0f8751] underline"
                        >
                          Go back to add modules.
                        </a>
                      </p>
                    </div>
                  ) : (
                    modules.map((module, i) => (
                      <ReviewModuleRow key={module.id} module={module} index={i} />
                    ))
                  )}
                </div>
              </div>

              {/* Right: course info */}
              <div className="space-y-6">
                <CourseInfoPanel course={course} />

                <div className="rounded-[22px] border border-[#dfe6f7] bg-[#eef1fb] p-6">
                  <h2 className="text-[16px] font-extrabold tracking-[-0.04em] text-[#0f8751]">
                    Publishing checklist
                  </h2>
                  <ul className="mt-4 space-y-3 text-[14px] text-[#576a88]">
                    {[
                      { label: "Course title set", done: Boolean(course.name) },
                      { label: "Category assigned", done: Boolean(course.categoryName) },
                      { label: "At least one module", done: modules.length > 0 },
                      { label: "At least one lesson", done: totalLessons > 0 },
                    ].map(({ label, done }) => (
                      <li key={label} className="flex items-center gap-3">
                        <span
                          className={[
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            done
                              ? "bg-[#0f8751] text-white"
                              : "border-2 border-[#cbd5e1]",
                          ].join(" ")}
                        >
                          {done && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                        <span className={done ? "text-[#22314c]" : "text-[#9aa7ba]"}>
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function ReviewAndLaunchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewAndLaunchContent />
    </Suspense>
  );
}