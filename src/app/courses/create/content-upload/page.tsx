


"use client";

export const dynamic = "force-dynamic";

import type { ComponentType, ChangeEvent } from "react";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthSession } from "@/lib/auth-session";
import {
  createLesson,
  createModule,
  createQuiz,
  deleteLesson,
  deleteModule,
  deleteQuiz,
  fetchModules,
  updateLesson,
  updateModule,
  updateQuiz,
  type CourseLesson,
  type CourseModule,
  type CourseQuiz,
  type CreateQuizPayload,
  type UpdateLessonPayload,
  type UpdateModulePayload,
} from "@/lib/course-api";
import {
  BookOpen,
  Bold,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleDot,
  Clock3,
  Code,
  Eye,
  FileText,
  GripVertical,
  Image,
  Info,
  Italic,
  Link2,
  List,
  ListChecks,
  PenSquare,
  Play,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  Underline,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseActionLink,
  CourseFlowStepper,
  CourseModal,
  CoursePageTitle,
} from "@/components/course-flow";

type BuilderTab = "content" | "quiz";
type LessonTypeKey = "video" | "reading" | "quiz";

type LessonCardData = {
  id: string;
  number: string;
  title: string;
  summary: string;
  type: LessonTypeKey;
  metaOne: string;
  metaTwo: string;
  highlighted?: boolean;
};

type ModuleCardData = {
  id: string;
  number: string;
  title: string;
  description?: string;
  lessonCount: string;
  duration: string;
  lessons?: LessonCardData[];
  collapsed?: boolean;
  empty?: boolean;
};

type QuizQuestionData = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  selectedIndex: number;
};

const lessonTypeCards = [
  {
    title: "Video Lesson",
    detail: "MP4, YouTube, Vimeo, Wistia",
    icon: Play,
    accentClassName: "bg-[#eef4ff] text-[#2f66ff]",
  },
  {
    title: "Reading Material",
    detail: "Rich text, PDF, Web links",
    icon: FileText,
    accentClassName: "bg-[#eef8f1] text-[#16a05c]",
  },
  {
    title: "Interactive Quiz",
    detail: "Multiple choice, true/false",
    icon: ListChecks,
    accentClassName: "bg-[#fff3e7] text-[#f07f20]",
  },
];

function buildHref({
  tab = "content",
  modal,
  courseId,
  moduleId,
}: {
  tab?: "content" | "quiz";
  modal?: string;
  courseId?: string | null;
  moduleId?: string | null;
}) {
  const params = new URLSearchParams();
  if (tab === "quiz") params.set("tab", "quiz");
  if (modal) params.set("modal", modal);
  if (courseId) params.set("courseId", courseId);
  if (moduleId) params.set("moduleId", moduleId);
  const query = params.toString();
  return query
    ? `/courses/create/content-upload?${query}`
    : "/courses/create/content-upload";
}

function LessonVisual({ type }: { type: LessonTypeKey }) {
  if (type === "video") {
    return { icon: Play, wrapperClassName: "bg-[#eef4ff] text-[#2f66ff]" };
  }
  if (type === "quiz") {
    return { icon: ListChecks, wrapperClassName: "bg-[#fff3e7] text-[#f07f20]" };
  }
  return { icon: BookOpen, wrapperClassName: "bg-[#eef8f1] text-[#16a05c]" };
}

function normalizeLessonType(type: string | undefined): LessonTypeKey {
  const t = (type ?? "").toLowerCase();
  if (t.includes("video")) return "video";
  if (t.includes("quiz")) return "quiz";
  return "reading";
}

function formatModuleNumber(order: number | undefined, index: number) {
  return String(order ?? index + 1).padStart(2, "0");
}

function formatLessonNumber(
  moduleOrder: number | undefined,
  lesson: CourseLesson,
  index: number
) {
  return `${moduleOrder ?? 1}.${lesson.order ?? index + 1}`;
}

function mapLessonToCard(
  lesson: CourseLesson,
  index: number,
  moduleOrder: number | undefined
): LessonCardData {
  const type = normalizeLessonType(lesson.type);
  return {
    id: lesson.id,
    number: formatLessonNumber(moduleOrder, lesson, index),
    title: lesson.title,
    summary: lesson.content || "No lesson content added yet.",
    type,
    metaOne:
      type === "video"
        ? lesson.videoUrl || "Video"
        : lesson.estimatedReadingTime || "—",
    metaTwo: lesson.accessLevel || "Enrolled Students",
  };
}

function mapModuleToCard(module: CourseModule, index: number): ModuleCardData {
  const moduleNumber = formatModuleNumber(module.order, index);
  return {
    id: module.id,
    number: moduleNumber,
    title: module.title,
    description: module.description,
    lessonCount: `${module.lessons.length} ${
      module.lessons.length === 1 ? "Lesson" : "Lessons"
    }`,
    duration: module.releaseInterval
      ? `${module.releaseInterval} day drip`
      : "",
    lessons: module.lessons.map((lesson, lessonIndex) =>
      mapLessonToCard(lesson, lessonIndex, module.order ?? index + 1)
    ),
    empty: module.lessons.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Shared small components
// ---------------------------------------------------------------------------

function TabButton({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "border-b-[3px] pb-4 text-[16px] transition-colors",
        active
          ? "border-[#0f8751] font-extrabold text-[#228352]"
          : "border-transparent font-semibold text-[#667792]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function LessonMeta({
  icon,
  value,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string;
}) {
  const Icon = icon;
  return (
    <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#f4f7fb] px-3 py-1.5 text-[14px] font-medium text-[#5e708d]">
      <Icon className="h-4 w-4" strokeWidth={2.1} />
      {value}
    </span>
  );
}

type ModalSelectOption = string | { label: string; value: string };

function ModalSelect({
  label,
  value,
  defaultValue,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  options: ModalSelectOption[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label>
      <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">{label}</span>
      <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] bg-white px-4">
        <select
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className="h-full w-full appearance-none bg-transparent pr-10 text-[15px] text-[#264267] outline-none"
        >
          {options.map((opt) => {
            const v = typeof opt === "string" ? opt : opt.value;
            const l = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]"
          strokeWidth={2.1}
        />
      </span>
    </label>
  );
}

function ModalInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label>
      <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[54px] w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
      />
    </label>
  );
}

function StatCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-[#e6ebf7] px-4 py-4">
      <Icon className="h-5 w-5 shrink-0 text-[#4b8a60]" strokeWidth={2.1} />
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#7e8da6]">{label}</p>
        <p className="text-[15px] font-bold text-[#0f8751]">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonCard
// ---------------------------------------------------------------------------
function LessonCard({
  lesson,
  onEditLesson,
  onDeleteLesson,
}: {
  lesson: LessonCardData;
  onEditLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
}) {
  const visual = LessonVisual({ type: lesson.type });
  const Icon = visual.icon;

  return (
    <article
      className={[
        "rounded-[20px] border bg-white px-5 py-5 shadow-[0_12px_24px_rgba(205,214,235,0.06)] transition-colors sm:px-6",
        lesson.highlighted ? "border-[#1da565] shadow-none" : "border-[#e4ebf7]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <span
            className={[
              "mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]",
              visual.wrapperClassName,
            ].join(" ")}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1b2d4b]">
              {lesson.number} {lesson.title}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#6c7d96]">{lesson.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <LessonMeta icon={Clock3} value={lesson.metaOne} />
              <LessonMeta icon={Eye} value={lesson.metaTwo} />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[#7b899f]">
          <button
            type="button"
            aria-label="Edit lesson"
            title="Edit lesson"
            onClick={() => onEditLesson?.(lesson.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
          >
            <PenSquare className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            aria-label="Delete lesson"
            title="Delete lesson"
            onClick={() => onDeleteLesson?.(lesson.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#fff1f1] hover:text-[#c0392b]"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            aria-label="Drag to reorder"
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full hover:bg-[#f3f6fb]"
          >
            <GripVertical className="h-5 w-5" strokeWidth={2.1} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// ModuleCard
// ---------------------------------------------------------------------------
function ModuleCard({
  module,
  settingsHref,
  lessonEditorHref,
  onDeleteModule,
  onEditModule,
  onDeleteLesson,
  onEditLesson,
  disabled,
}: {
  module: ModuleCardData;
  settingsHref: string;
  lessonEditorHref: string;
  onDeleteModule?: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onEditLesson?: (lessonId: string) => void;
  disabled?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.07)]">
      <div className="flex flex-col gap-4 bg-[#eef1fb] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
              Module {module.number}
            </p>
            <h2
              className={[
                "truncate text-[16px] tracking-[-0.04em] sm:text-[20px]",
                module.empty
                  ? "font-medium italic text-[#9aa7ba]"
                  : "font-extrabold text-[#1a2f51]",
              ].join(" ")}
            >
              {module.title}
            </h2>
            <p className="mt-1 text-[14px] text-[#667792]">
              {module.lessonCount}
              {module.duration ? ` • ${module.duration}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#66748b]">
          <button
            type="button"
            onClick={() => onEditModule?.(module.id)}
            aria-label="Edit module"
            title="Edit module"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <PenSquare className="h-5 w-5" strokeWidth={2.1} />
          </button>

          {!module.empty ? (
            <Link
              href={settingsHref}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
            >
              <Settings2 className="h-5 w-5" strokeWidth={2.1} />
            </Link>
          ) : null}

          <button
            type="button"
            disabled={disabled}
            onClick={() => onDeleteModule?.(module.id)}
            aria-label="Delete module"
            title="Delete module"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white disabled:opacity-60 disabled:hover:bg-transparent"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>

          {!module.empty ? (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
            >
              {module.collapsed ? (
                <ChevronUp className="h-5 w-5" strokeWidth={2.1} />
              ) : (
                <ChevronDown className="h-5 w-5" strokeWidth={2.1} />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {module.collapsed ? (
        <div className="border-t border-[#e8edf7] bg-[#f7f9fd] px-8 py-12 text-center text-[16px] italic text-[#7e8da6]">
          Contents are hidden
        </div>
      ) : module.empty ? (
        <div className="border-t border-[#e8edf7] bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1ff] text-[#9eb0ff] sm:h-20 sm:w-20">
            <Plus className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.9} />
          </div>
          <h3 className="mt-8 text-[20px] font-extrabold tracking-[-0.04em] text-[#22314c]">
            This module is empty
          </h3>
          <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-6 text-[#71819d]">
            Start by adding your first lesson or resource
          </p>
          <CourseActionLink href={lessonEditorHref} className="mt-8 min-w-[190px]">
            Create First Lesson
          </CourseActionLink>
        </div>
      ) : (
        <div className="space-y-6 border-t border-[#e8edf7] bg-[#fbfcff] p-4 sm:p-6">
          {module.lessons?.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
            />
          ))}
          <Link
            href={lessonEditorHref}
            className="flex min-h-[54px] items-center justify-center rounded-[14px] border-2 border-dashed border-[#dceadf] bg-white px-4 text-center text-[15px] font-medium text-[#7a8aa3]"
          >
            + Add Lesson to Module {module.number}
          </Link>
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// EditModuleModal
// ---------------------------------------------------------------------------
function EditModuleModal({
  module,
  onSave,
  isSaving,
  onClose,
}: {
  module: CourseModule;
  onSave: (payload: {
    title: string;
    description: string;
    order: number;
    status: string;
    enableDripRelease: boolean;
    releaseInterval?: number;
  }) => Promise<void>;
  isSaving?: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description || "");
  const [order, setOrder] = useState(String(module.order || 1));
  const [status, setStatus] = useState(module.status || "draft");
  const [enableDripRelease, setEnableDripRelease] = useState(
    Boolean(module.enableDripRelease)
  );
  const [releaseInterval, setReleaseInterval] = useState(
    String(module.releaseInterval || 7)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError("Enter a module title.");
      return;
    }
    const parsedOrder = Number.parseInt(order, 10);
    if (!Number.isFinite(parsedOrder) || parsedOrder < 1) {
      setError("Module order must be a number greater than zero.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        order: parsedOrder,
        status,
        enableDripRelease,
        releaseInterval: enableDripRelease
          ? Number.parseInt(releaseInterval, 10) || 7
          : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save module.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseModal closeHref="#" maxWidthClassName="max-w-[700px]">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#7b899f] hover:bg-[#f3f6fb]"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="p-8">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Edit Module
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Update the title, description, order and release settings for this module.
        </p>

        {error ? (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 space-y-5">
          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Module Details
            </h3>
            <div className="mt-5 grid gap-5">
              <ModalInput
                label="Module Title"
                placeholder="Enter module title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Module Description
                </span>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter module description"
                  className="w-full resize-none rounded-[14px] border border-[#d7deee] bg-white px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none placeholder:text-[#8d99b1]"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <ModalInput
                  label="Module Order"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <ModalSelect
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Delivery Schedule
            </h3>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[16px] font-bold text-[#22314c]">Enable Drip Release</p>
                <p className="mt-1 text-[15px] text-[#6d7d98]">
                  Release content on a timed interval
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnableDripRelease((v) => !v)}
                className={[
                  "flex h-8 w-16 items-center rounded-full px-1 transition-colors",
                  enableDripRelease ? "bg-[#0f8751]" : "bg-[#cbd5e1]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 rounded-full bg-white transition-transform",
                    enableDripRelease ? "translate-x-8" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>

            {enableDripRelease ? (
              <div className="mt-5">
                <label>
                  <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                    Release Interval
                  </span>
                  <div className="flex h-[56px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267]">
                    <input
                      value={releaseInterval}
                      onChange={(e) => setReleaseInterval(e.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent outline-none"
                    />
                    <span className="text-[#72829a]">Days</span>
                  </div>
                  <p className="mt-2 text-[13px] text-[#7b89a2]">
                    Module will unlock {releaseInterval} days after enrollment.
                  </p>
                </label>
              </div>
            ) : null}
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-[136px] items-center justify-center rounded-[12px] border border-[#d7deee] px-6 py-3 text-[15px] font-semibold text-[#4b6182] transition-colors hover:bg-[#f8faff]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || isSaving}
            onClick={handleSave}
            className="inline-flex min-w-[176px] items-center justify-between rounded-[12px] bg-[#4b8a60] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting || isSaving ? "Saving…" : "Save Changes"}</span>
            <ContinueArrow />
          </button>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// EditLessonModal
// ---------------------------------------------------------------------------
function EditLessonModal({
  lesson,
  modules,
  onSave,
  isSaving,
  onClose,
}: {
  lesson: CourseLesson;
  modules: CourseModule[];
  onSave: (lessonId: string, payload: UpdateLessonPayload) => Promise<void>;
  isSaving?: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content || "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [type, setType] = useState(
    lesson.type === "video"
      ? "Video Lesson"
      : lesson.type === "quiz"
        ? "Interactive Quiz"
        : "Reading Material"
  );
  const [accessLevel, setAccessLevel] = useState(lesson.accessLevel || "Enrolled Students");
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(
    lesson.estimatedReadingTime || "10 mins"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError("Enter a lesson title.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave(lesson.id, {
        title: title.trim(),
        content: content.trim(),
        videoUrl: videoUrl.trim() || undefined,
        type:
          type === "Video Lesson"
            ? "video"
            : type === "Interactive Quiz"
              ? "quiz"
              : "reading",
        estimatedReadingTime,
        accessLevel,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save lesson.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseModal closeHref="#" maxWidthClassName="max-w-[920px]">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#7b899f] hover:bg-[#f3f6fb]"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Edit Lesson
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Update the content, access level, and delivery details for this lesson.
        </p>

        {error ? (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-[136px] items-center justify-center rounded-[12px] border border-[#d7deee] px-6 py-3 text-[15px] font-semibold text-[#4b6182] transition-colors hover:bg-[#f8faff]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || isSaving}
            className="inline-flex min-w-[176px] items-center justify-between rounded-[12px] bg-[#4b8a60] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting || isSaving ? "Saving…" : "Save Changes"}</span>
            <ContinueArrow />
          </button>
        </div>

        <div className="mt-10 rounded-[24px] border border-[#87a5d7] p-4 sm:p-6">
          <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <ModalSelect
                label="Lesson Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={["Reading Material", "Video Lesson", "Interactive Quiz"]}
              />
              <ModalSelect
                label="Access Level"
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                options={["Public", "Enrolled Students", "Private"]}
              />
            </div>

            <ModalInput
              label="Lesson Title"
              placeholder="Enter lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {type === "Video Lesson" ? (
              <ModalInput
                label="Video URL"
                placeholder="https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            ) : null}

            <div>
              <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                Detail Description
              </span>
              <div className="overflow-hidden rounded-[16px] border border-[#d7deee]">
                <div className="flex flex-wrap gap-3 border-b border-[#e7edf8] px-4 py-3 text-[#5f6f8b]">
                  {[Bold, Italic, Underline, List, List, Link2, Image, Code].map((Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#f3f6fb]"
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.1} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter lesson description..."
                  className="w-full resize-none px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none placeholder:text-[#8d99b1]"
                />
              </div>
            </div>

            <ModalSelect
              label="Estimated Reading Time"
              value={estimatedReadingTime}
              onChange={(e) => setEstimatedReadingTime(e.target.value)}
              options={["10 mins", "20 mins", "30 mins"]}
            />
          </div>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// ContentLessonEditorModal
// ---------------------------------------------------------------------------
function ContentLessonEditorModal({
  closeHref,
  courseId,
  modules,
  selectedModuleId,
  onSaveLesson,
  isSaving,
}: {
  closeHref: string;
  courseId?: string | null;
  modules: CourseModule[];
  selectedModuleId?: string | null;
  onSaveLesson?: (payload: {
    title: string;
    content: string;
    videoUrl?: string;
    type: string;
    estimatedReadingTime: string;
    accessLevel: string;
    order: number;
    moduleId: string;
  }) => Promise<void>;
  isSaving?: boolean;
}) {
  const [lessonType, setLessonType] = useState("Reading Material");
  const [lessonTitle, setLessonTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [accessLevel, setAccessLevel] = useState("Enrolled Students");
  const [estimatedReadingTime, setEstimatedReadingTime] = useState("10 mins");
  const [lessonOrder, setLessonOrder] = useState("1");
  const [moduleId, setModuleId] = useState(selectedModuleId || modules[0]?.id || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!moduleId && (selectedModuleId || modules[0]?.id)) {
      setModuleId(selectedModuleId || modules[0]?.id || "");
    }
  }, [moduleId, modules, selectedModuleId]);

  async function handleSave() {
    if (!onSaveLesson) return;
    if (!moduleId) {
      setError("Create or select a module before saving a lesson.");
      return;
    }
    if (!lessonTitle.trim()) {
      setError("Enter a lesson title.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSaveLesson({
        title: lessonTitle.trim(),
        content: content.trim(),
        videoUrl: videoUrl.trim() || undefined,
        type:
          lessonType === "Video Lesson"
            ? "video"
            : lessonType === "Interactive Quiz"
              ? "quiz"
              : "reading",
        estimatedReadingTime,
        accessLevel,
        order: Number.parseInt(lessonOrder, 10) || 1,
        moduleId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[920px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Lesson Editor
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Configure the content, access level, and delivery details for this lesson.
        </p>

        {courseId && (
          <p className="mt-3 text-[13px] text-[#4b8a60]">
            Course: <span className="font-semibold">{courseId}</span>
          </p>
        )}

        {error ? (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || isSaving}
            className="inline-flex min-w-[176px] items-center justify-between rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? "Saving…" : "Save Changes"}</span>
            <ContinueArrow />
          </button>
        </div>

        <div className="mt-10 rounded-[24px] border border-[#87a5d7] p-4 sm:p-6">
          <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <ModalSelect
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                label="Module"
                options={
                  modules.length
                    ? modules.map((module, index) => ({
                        label: `Module ${formatModuleNumber(module.order, index)}: ${module.title}`,
                        value: module.id,
                      }))
                    : [{ label: "Create a module first", value: "" }]
                }
              />
              <ModalSelect
                label="Lesson Type"
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                options={["Reading Material", "Video Lesson", "Interactive Quiz"]}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ModalInput
                label="Lesson Title"
                placeholder="Enter lesson title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
              <ModalInput
                label="Video URL"
                placeholder="https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div>
              <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                Detail Description
              </span>
              <div className="overflow-hidden rounded-[16px] border border-[#d7deee]">
                <div className="flex flex-wrap gap-3 border-b border-[#e7edf8] px-4 py-3 text-[#5f6f8b]">
                  {[Bold, Italic, Underline, List, List, Link2, Image, Code].map((Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#f3f6fb]"
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.1} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter lesson description..."
                  className="w-full resize-none px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none placeholder:text-[#8d99b1]"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ModalInput
                label="Lesson Order"
                value={lessonOrder}
                onChange={(e) => setLessonOrder(e.target.value)}
              />
              <ModalSelect
                label="Access Level"
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                options={["Public", "Enrolled Students", "Private"]}
              />
              <ModalSelect
                label="Estimated Reading Time"
                value={estimatedReadingTime}
                onChange={(e) => setEstimatedReadingTime(e.target.value)}
                options={["10 mins", "20 mins", "30 mins"]}
              />
              <ModalInput label="Attachment Label" placeholder="e.g. Reading Material PDF" />
            </div>

            <div>
              <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                Upload File
              </span>
              <label className="flex min-h-[126px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#bfe6d2] bg-[#f1fdf6] px-6 text-center">
                <Upload className="h-10 w-10 text-[#0f8751]" strokeWidth={2.1} />
                <span className="mt-4 text-[15px] font-semibold text-[#47617f]">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 text-[15px] text-[#72829a]">
                  PDF, DOCX or MP4 (Max 50MB)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// CourseSettingsModal  (create module)
// ---------------------------------------------------------------------------
function CourseSettingsModal({
  closeHref,
  courseId,
  nextModuleOrder,
  onSaveModule,
  isSaving,
}: {
  closeHref: string;
  courseId?: string | null;
  nextModuleOrder: number;
  onSaveModule?: (payload: {
    title: string;
    description: string;
    order: number;
    status: string;
    enableDripRelease: boolean;
    releaseInterval?: number;
    fixedReleaseDate?: string;
  }) => Promise<void>;
  isSaving?: boolean;
}) {
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState(String(nextModuleOrder));
  const [moduleStatus, setModuleStatus] = useState("draft");
  const [enableDripRelease, setEnableDripRelease] = useState(false);
  const [releaseInterval, setReleaseInterval] = useState("7");
  const [fixedReleaseDate, setFixedReleaseDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setModuleOrder(String(nextModuleOrder));
  }, [nextModuleOrder]);

  async function handleSave() {
    if (!onSaveModule) return;
    if (!courseId) {
      setError("Create the course before adding modules.");
      return;
    }
    if (!moduleTitle.trim()) {
      setError("Enter a module title.");
      return;
    }
    const parsedOrder = Number.parseInt(moduleOrder, 10);
    if (!Number.isFinite(parsedOrder) || parsedOrder < 1) {
      setError("Module order must be a number greater than zero.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSaveModule({
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        order: parsedOrder,
        status: moduleStatus,
        enableDripRelease,
        releaseInterval: enableDripRelease ? Number.parseInt(releaseInterval, 10) || 7 : undefined,
        fixedReleaseDate: fixedReleaseDate.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save module settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[760px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Course Setting
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Configure the structural parameters and release rules for this course.
        </p>

        {courseId && (
          <p className="mt-3 text-[13px] text-[#4b8a60]">
            Course: <span className="font-semibold">{courseId}</span>
          </p>
        )}

        {error ? (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || isSaving}
            className="inline-flex min-w-[176px] items-center justify-between rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? "Saving…" : "Save Changes"}</span>
            <ContinueArrow />
          </button>
        </div>

        <div className="mt-10 space-y-5">
          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Module Details
            </h3>
            <div className="mt-6 grid gap-5">
              <ModalInput
                label="Module Title"
                placeholder="Enter module title"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Module Description
                </span>
                <textarea
                  rows={4}
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  placeholder="Enter module description"
                  className="w-full resize-none rounded-[14px] border border-[#d7deee] bg-white px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none placeholder:text-[#8d99b1]"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <ModalInput
                  label="Module Order"
                  value={moduleOrder}
                  onChange={(e) => setModuleOrder(e.target.value)}
                />
                <ModalSelect
                  label="Status"
                  value={moduleStatus}
                  onChange={(e) => setModuleStatus(e.target.value)}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Delivery Schedule
            </h3>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[16px] font-bold text-[#22314c]">Enable Drip Release</p>
                <p className="mt-1 text-[15px] text-[#6d7d98]">
                  Release content on a timed interval
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnableDripRelease((v) => !v)}
                className={[
                  "flex h-8 w-16 items-center rounded-full px-1 transition-colors",
                  enableDripRelease ? "bg-[#0f8751]" : "bg-[#cbd5e1]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 rounded-full bg-white transition-transform",
                    enableDripRelease ? "translate-x-8" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>
            <div className="mt-6 grid gap-5">
              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Release Interval
                </span>
                <div className="flex h-[56px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267]">
                  <input
                    value={releaseInterval}
                    onChange={(e) => setReleaseInterval(e.target.value)}
                    disabled={!enableDripRelease}
                    className="h-full min-w-0 flex-1 bg-transparent outline-none disabled:text-[#9aa7ba]"
                  />
                  <span className="text-[#72829a]">Days</span>
                </div>
                <p className="mt-2 text-[13px] text-[#7b89a2]">
                  Module will unlock exactly {releaseInterval} days after enrollment.
                </p>
              </label>
              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Fixed Release Date
                </span>
                <input
                  type="date"
                  value={fixedReleaseDate}
                  onChange={(e) => setFixedReleaseDate(e.target.value)}
                  className="h-[56px] w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// QuestionEditorModal
// ---------------------------------------------------------------------------
function QuestionEditorModal({ closeHref }: { closeHref: string }) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[960px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Quiz Builder
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">Set your quiz questions here</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <CourseActionLink href={closeHref} className="min-w-[176px] justify-between px-6">
            <span>Save Changes</span>
            <ContinueArrow />
          </CourseActionLink>
        </div>
        <div className="mt-10 rounded-[18px] border border-[#cfd9ee] p-4 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <ModalSelect
              label="Weighted Score"
              defaultValue="10 marks"
              options={["5 marks", "10 marks", "15 marks", "20 marks"]}
            />
            <ModalSelect
              label="Question Types"
              defaultValue="Multiple Choice Question"
              options={[
                "Multiple Choice Question",
                "True / False",
                "Single Answer",
                "Essay Question",
              ]}
            />
          </div>
          <div className="mt-6">
            <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
              Q1 Text Question
            </span>
            <div className="overflow-hidden rounded-[16px] border border-[#d7deee]">
              <div className="flex flex-wrap gap-3 border-b border-[#e7edf8] px-4 py-3 text-[#5f6f8b]">
                {[Bold, Italic, Underline, List, List, Link2, Image, Code].map((Icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#f3f6fb]"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.1} />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                placeholder="Enter question text..."
                className="w-full resize-none px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none placeholder:text-[#8d99b1]"
              />
            </div>
          </div>
          <div className="mt-6 space-y-5">
            {["Option 1", "Option 2", "Option 3", "Option 4"].map((label, index) => (
              <div key={label}>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  {label}
                </span>
                <div className="space-y-3">
                  <input
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="h-[54px] w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
                  />
                  <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] bg-white px-4">
                    <select
                      defaultValue={index === 0 ? "True" : "False"}
                      className="h-full w-full appearance-none bg-transparent pr-10 text-[15px] text-[#264267] outline-none"
                    >
                      <option>True</option>
                      <option>False</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]"
                      strokeWidth={2.1}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// QuizSettingsModal  (single definition — create or edit)
// ---------------------------------------------------------------------------
function QuizSettingsModal({
  module,
  existingQuiz,
  onSave,
  onClose,
}: {
  module: CourseModule;
  existingQuiz: CourseQuiz | null;
  onSave: (
    moduleId: string,
    payload: CreateQuizPayload,
    existingQuizId?: string
  ) => Promise<void>;
  onClose: () => void;
}) {
  const isEditing = Boolean(existingQuiz);

  const [title, setTitle] = useState(existingQuiz?.title ?? "");
  const [passMark, setPassMark] = useState(String(existingQuiz?.passMark ?? 75));
  const [allowPartialCredit, setAllowPartialCredit] = useState(
    existingQuiz?.allowPartialCredit ?? true
  );
  const [timeLimit, setTimeLimit] = useState(String(existingQuiz?.timeLimit ?? 45));
  const [attempts, setAttempts] = useState(String(existingQuiz?.attempts ?? 2));
  const [visibility, setVisibility] = useState(existingQuiz?.visibility ?? "publish");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError("Enter a quiz title.");
      return;
    }

    const payload: CreateQuizPayload = {
      title: title.trim(),
      passMark: Number.parseInt(passMark, 10) || 75,
      allowPartialCredit,
      timeLimit: Number.parseInt(timeLimit, 10) || 45,
      attempts: Number.parseInt(attempts, 10) || 2,
      visibility,
    };

    setError(null);
    setIsSubmitting(true);
    try {
      await onSave(module.id, payload, existingQuiz?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save quiz.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CourseModal closeHref="#" maxWidthClassName="max-w-[900px]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#7b899f] hover:bg-[#f3f6fb]"
      >
        ✕
      </button>

      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          {isEditing ? "Edit Quiz" : "Add Quiz"}
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          {isEditing ? "Update" : "Configure"} quiz settings for{" "}
          <span className="font-semibold">{module.title}</span>.
        </p>

        {error ? (
          <div className="mt-5 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-[136px] items-center justify-center rounded-[12px] border border-[#d7deee] px-6 py-3 text-[15px] font-semibold text-[#4b6182] transition-colors hover:bg-[#f8faff]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="inline-flex min-w-[176px] items-center justify-between rounded-[12px] bg-[#4b8a60] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Quiz"}</span>
            <ContinueArrow />
          </button>
        </div>

        <div className="mt-10 space-y-6">
          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              Quiz Details
            </h3>
            <div className="mt-5">
              <ModalInput
                label="Quiz Title"
                placeholder="e.g. Module 1 Assessment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </section>

          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              Passing Criteria
            </h3>
            <div className="mt-5 space-y-5">
              <ModalSelect
                label="Minimum Pass Mark"
                value={passMark}
                onChange={(e) => setPassMark(e.target.value)}
                options={[
                  { label: "60%", value: "60" },
                  { label: "70%", value: "70" },
                  { label: "75%", value: "75" },
                  { label: "80%", value: "80" },
                  { label: "90%", value: "90" },
                ]}
              />
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-bold text-[#22314c]">Allow Partial Credit</span>
                <button
                  type="button"
                  onClick={() => setAllowPartialCredit((v) => !v)}
                  className={[
                    "flex h-8 w-16 items-center rounded-full px-1 transition-colors",
                    allowPartialCredit ? "bg-[#0f8751]" : "bg-[#cbd5e1]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-6 w-6 rounded-full bg-white transition-transform",
                      allowPartialCredit ? "translate-x-8" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              Administrative Settings
            </h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ModalSelect
                label="Time Limit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                options={[
                  { label: "15 min", value: "15" },
                  { label: "30 min", value: "30" },
                  { label: "45 min", value: "45" },
                  { label: "60 min", value: "60" },
                ]}
              />
              <ModalSelect
                label="Max Attempts"
                value={attempts}
                onChange={(e) => setAttempts(e.target.value)}
                options={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                ]}
              />
            </div>
          </section>

          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
                Visibility
              </h3>
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.08em]",
                  visibility === "publish"
                    ? "bg-[#e6f7ee] text-[#0f8751]"
                    : "bg-[#fff0c8] text-[#d69008]",
                ].join(" ")}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
                {visibility === "publish" ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-5">
              <ModalSelect
                label="Status"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                options={[
                  { label: "Publish", value: "publish" },
                  { label: "Draft", value: "draft" },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </CourseModal>
  );
}

// ---------------------------------------------------------------------------
// QuizSidebar  (single definition)
// ---------------------------------------------------------------------------
function QuizSidebar({ modules }: { modules: CourseModule[] }) {
  const quizCount = modules.filter((m) => m.quiz).length;
  const withoutQuiz = modules.length - quizCount;

  return (
    <div className="space-y-6">
      <aside className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#182f53]">
          Quiz Overview
        </h2>
        <dl className="mt-7 space-y-4 text-[16px] text-[#576a88]">
          <div className="flex items-center justify-between gap-4">
            <dt>Total Modules</dt>
            <dd className="font-semibold text-[#22314c]">{modules.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt>Quizzes Added</dt>
            <dd className="font-semibold text-[#22314c]">{quizCount}</dd>
          </div>
          {withoutQuiz > 0 && (
            <div className="flex items-center justify-between gap-4 rounded-[12px] bg-[#fff8ec] px-3 py-2">
              <dt className="text-[#c87b00]">Modules without quiz</dt>
              <dd className="font-semibold text-[#c87b00]">{withoutQuiz}</dd>
            </div>
          )}
        </dl>
      </aside>

      <aside className="rounded-[22px] border border-[#dfe6f7] bg-[#eef1fb] p-6">
        <h2 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#0f8751]">
          How quizzes work
        </h2>
        <ul className="mt-5 space-y-3 text-[14px] leading-6 text-[#576a88]">
          <li>• One quiz per module — set pass mark, time limit, and attempts.</li>
          <li>
            • Quizzes marked <strong>Draft</strong> are hidden from students.
          </li>
          <li>• Use the edit (✏) icon to update quiz settings at any time.</li>
        </ul>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LiveQuizCard
// ---------------------------------------------------------------------------
function LiveQuizCard({
  module,
  moduleIndex,
  quiz,
  onEdit,
  onDelete,
  isDeleting,
}: {
  module: CourseModule;
  moduleIndex: number;
  quiz: CourseQuiz;
  onEdit: (module: CourseModule) => void;
  onDelete: (module: CourseModule) => void;
  isDeleting: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.07)]">
      <div className="flex flex-col gap-4 bg-[#eef1fb] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
              Module {formatModuleNumber(module.order, moduleIndex)} Quiz
            </p>
            <h2 className="truncate text-[16px] font-extrabold tracking-[-0.04em] text-[#1a2f51] sm:text-[20px]">
              {quiz.title || "Untitled Quiz"}
            </h2>
            <p className="mt-1 text-[13px] text-[#667792]">
              Pass mark: {quiz.passMark}% · {quiz.attempts} attempt
              {quiz.attempts !== 1 ? "s" : ""} · {quiz.timeLimit} min
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#66748b]">
          <button
            type="button"
            title="Edit quiz"
            aria-label="Edit quiz"
            onClick={() => onEdit(module)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <PenSquare className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            title="Delete quiz"
            aria-label="Delete quiz"
            disabled={isDeleting}
            onClick={() => onDelete(module)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            aria-label={collapsed ? "Expand" : "Collapse"}
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            {collapsed ? (
              <ChevronDown className="h-5 w-5" strokeWidth={2.1} />
            ) : (
              <ChevronUp className="h-5 w-5" strokeWidth={2.1} />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="border-t border-[#e8edf7] bg-white p-4 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCell icon={ListChecks} label="Pass Mark" value={`${quiz.passMark}%`} />
            <StatCell
              icon={ListChecks}
              label="Partial Credit"
              value={quiz.allowPartialCredit ? "Yes" : "No"}
            />
            <StatCell icon={Clock3} label="Time Limit" value={`${quiz.timeLimit} min`} />
            <StatCell icon={RotateCcw} label="Attempts" value={String(quiz.attempts)} />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.08em]",
                quiz.visibility === "publish"
                  ? "bg-[#e6f7ee] text-[#0f8751]"
                  : "bg-[#fff0c8] text-[#d69008]",
              ].join(" ")}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {quiz.visibility === "publish" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// EmptyQuizCard
// ---------------------------------------------------------------------------
function EmptyQuizCard({
  module,
  moduleIndex,
  onAdd,
}: {
  module: CourseModule;
  moduleIndex: number;
  onAdd: (module: CourseModule) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-dashed border-[#dceadf] bg-white">
      <div className="bg-[#eef1fb] px-5 py-4 sm:px-6">
        <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#9aa7ba]">
          Module {formatModuleNumber(module.order, moduleIndex)}: {module.title}
        </p>
      </div>
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1ff] text-[#9eb0ff]">
          <ListChecks className="h-7 w-7" strokeWidth={1.9} />
        </div>
        <h3 className="mt-5 text-[18px] font-extrabold tracking-[-0.04em] text-[#22314c]">
          No quiz for this module yet
        </h3>
        <p className="mx-auto mt-2 max-w-[380px] text-[14px] leading-6 text-[#71819d]">
          Add a quiz to test students on the content of this module.
        </p>
        <button
          type="button"
          onClick={() => onAdd(module)}
          className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-[#4b8a60] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Add Quiz
        </button>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// ContentSidebar
// ---------------------------------------------------------------------------
function ContentSidebar({
  settingsHref,
  modules,
}: {
  settingsHref: string;
  modules: CourseModule[];
}) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      <aside className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#182f53]">
          Lesson Types
        </h2>
        <div className="mt-7 space-y-4">
          {lessonTypeCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-[16px] border border-[#e6ebf7] px-4 py-4"
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]",
                    item.accentClassName,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[16px] font-extrabold text-[#22314c]">{item.title}</p>
                  <p className="mt-1 text-[14px] text-[#72829a]">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <aside className="rounded-[22px] border border-[#dfe6f7] bg-[#eef1fb] p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#0f8751]">
            Module Stats
          </h2>
          <Link
            href={settingsHref}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0f8751]/20 text-[#0f8751]"
          >
            <Info className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
        <dl className="mt-7 space-y-4 text-[16px] text-[#576a88]">
          <div className="flex items-center justify-between gap-4">
            <dt>Total Modules</dt>
            <dd className="font-semibold text-[#22314c]">{modules.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-[#d5dff0] pb-4">
            <dt>Total Lessons</dt>
            <dd className="font-semibold text-[#22314c]">{totalLessons}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContentBuilderView
// ---------------------------------------------------------------------------
function ContentBuilderView({
  courseId,
  settingsHref,
  modules,
  isLoadingModules,
  modulesError,
  onDeleteModule,
  onEditModule,
  isDeletingModule,
  onDeleteLesson,
  onEditLesson,
}: {
  courseId?: string | null;
  settingsHref: string;
  modules: CourseModule[];
  isLoadingModules: boolean;
  modulesError: string | null;
  onDeleteModule?: (moduleId: string) => void;
  onEditModule?: (moduleId: string) => void;
  isDeletingModule: boolean;
  onDeleteLesson?: (lessonId: string) => void;
  onEditLesson?: (lessonId: string) => void;
}) {
  const visibleModules = modules.map((m, i) => mapModuleToCard(m, i));

  return (
    <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_294px]">
      <div>
        <div className="border-b border-[#dfe6f7]">
          <div className="flex gap-12">
            <TabButton
              href={buildHref({ tab: "content", courseId })}
              label="Lessons & Content"
              active
            />
            <TabButton
              href={buildHref({ tab: "quiz", courseId })}
              label="Quiz Builder"
              active={false}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Course Structure 101
          </h2>
          <Link
            href={settingsHref}
            className="inline-flex items-center gap-3 text-[16px] font-extrabold text-[#0f8751]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </span>
            Add New Module
          </Link>
        </div>

        <div className="mt-8 space-y-7">
          {modulesError ? (
            <div className="rounded-[16px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-4 text-[15px] text-[#a42f2f]">
              {modulesError}
            </div>
          ) : null}

          {isLoadingModules ? (
            <div className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-10 text-center text-[16px] text-[#62718a]">
              Loading course modules...
            </div>
          ) : null}

          {!isLoadingModules && !courseId ? (
            <div className="rounded-[22px] border border-dashed border-[#dceadf] bg-white px-6 py-14 text-center">
              <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
                No course selected
              </h3>
              <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-6 text-[#71819d]">
                Go back and select or create a course first.
              </p>
            </div>
          ) : !isLoadingModules && visibleModules.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#dceadf] bg-white px-6 py-14 text-center">
              <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
                No modules yet
              </h3>
              <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-6 text-[#71819d]">
                Add the first module before creating lessons or quizzes.
              </p>
              <CourseActionLink href={settingsHref} className="mt-8 min-w-[190px]">
                Add Module
              </CourseActionLink>
            </div>
          ) : null}

          {!isLoadingModules
            ? visibleModules.map((module) => {
                const lessonEditorHref = buildHref({
                  tab: "content",
                  modal: "lesson-editor",
                  courseId,
                  moduleId: module.id,
                });
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    settingsHref={settingsHref}
                    lessonEditorHref={lessonEditorHref}
                    onDeleteModule={onDeleteModule}
                    onEditModule={onEditModule}
                    onDeleteLesson={onDeleteLesson}
                    onEditLesson={onEditLesson}
                    disabled={isDeletingModule}
                  />
                );
              })
            : null}
        </div>
      </div>

      <ContentSidebar settingsHref={settingsHref} modules={modules} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// QuizBuilderView  (single definition — state-driven, no URL modals)
// ---------------------------------------------------------------------------
export function QuizBuilderView({
  courseId,
  modules,
  isLoadingModules,
  session,
  onRefresh,
}: {
  courseId?: string | null;
  modules: CourseModule[];
  isLoadingModules: boolean;
  session?: { token?: string } | null;
  onRefresh: () => Promise<void>;
}) {
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const contentHref = buildHref({ tab: "content", courseId });
  const quizHref = buildHref({ tab: "quiz", courseId });

  async function handleDeleteQuiz(module: CourseModule) {
    if (!module.quiz) return;
    if (!window.confirm(`Delete the quiz for "${module.title}"? This cannot be undone.`)) return;

    setIsDeletingQuiz(true);
    setQuizError(null);
    try {
      await deleteQuiz(module.id, session?.token);
      await onRefresh();
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : "Unable to delete quiz.");
    } finally {
      setIsDeletingQuiz(false);
    }
  }

  async function handleSaveQuiz(
    moduleId: string,
    payload: CreateQuizPayload,
    existingQuizId?: string
  ) {
    if (existingQuizId) {
      await updateQuiz(moduleId, payload, session?.token);
    } else {
      await createQuiz(moduleId, payload, session?.token);
    }
    await onRefresh();
    setEditingModule(null);
  }

  return (
    <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_294px]">
      <div>
        <div className="border-b border-[#dfe6f7]">
          <div className="flex gap-12">
            <Link
              href={contentHref}
              className="border-b-[3px] border-transparent pb-4 text-[16px] font-semibold text-[#667792] transition-colors"
            >
              Lessons &amp; Content
            </Link>
            <span className="border-b-[3px] border-[#0f8751] pb-4 text-[16px] font-extrabold text-[#228352]">
              Quiz Builder
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Module Quizzes
          </h2>
          <CourseActionLink href={quizHref} className="min-w-[216px] gap-4 px-7">
            <span>Save Assessment</span>
            <Save className="h-5 w-5" strokeWidth={2.1} />
          </CourseActionLink>
        </div>

        {quizError ? (
          <div className="mt-4 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#a42f2f]">
            {quizError}
          </div>
        ) : null}

        <div className="mt-8 space-y-7">
          {isLoadingModules ? (
            <div className="rounded-[18px] border border-[#dfe6f7] bg-white px-6 py-10 text-center text-[16px] text-[#62718a]">
              Loading modules…
            </div>
          ) : modules.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#dceadf] bg-white px-6 py-14 text-center">
              <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
                No modules yet
              </h3>
              <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-6 text-[#71819d]">
                Create at least one module on the Lessons tab before adding quizzes.
              </p>
              <CourseActionLink href={contentHref} className="mt-8 min-w-[190px]">
                Go to Lessons
              </CourseActionLink>
            </div>
          ) : (
            modules.map((module, i) =>
              module.quiz ? (
                <LiveQuizCard
                  key={module.id}
                  module={module}
                  moduleIndex={i}
                  quiz={module.quiz}
                  onEdit={(m) => setEditingModule(m)}
                  onDelete={handleDeleteQuiz}
                  isDeleting={isDeletingQuiz}
                />
              ) : (
                <EmptyQuizCard
                  key={module.id}
                  module={module}
                  moduleIndex={i}
                  onAdd={(m) => setEditingModule(m)}
                />
              )
            )
          )}
        </div>
      </div>

      <QuizSidebar modules={modules} />

      {editingModule ? (
        <QuizSettingsModal
          module={editingModule}
          existingQuiz={editingModule.quiz ?? null}
          onSave={handleSaveQuiz}
          onClose={() => setEditingModule(null)}
        />
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// CourseContentUploadContent — main page, all state lives here
// ---------------------------------------------------------------------------
function CourseContentUploadContent() {
  const router = useRouter();
  const { session, isHydrated } = useAuthSession();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const selectedModuleId = searchParams.get("moduleId");
  const tab: BuilderTab = searchParams.get("tab") === "quiz" ? "quiz" : "content";
  const modal = searchParams.get("modal");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);

  const contentStateHref = buildHref({ tab: "content", courseId });
  const quizStateHref = buildHref({ tab: "quiz", courseId });
  const courseSettingsHref = buildHref({ tab: "content", modal: "course-settings", courseId });
  const questionEditorHref = buildHref({
    tab: "quiz",
    modal: "question-editor",
    courseId,
    moduleId: selectedModuleId,
  });

  async function loadCourseModules() {
    if (!courseId || !isHydrated) return;
    setIsLoadingModules(true);
    setModulesError(null);
    try {
      const fetched = await fetchModules(courseId, session?.token);
      setModules(fetched);
    } catch (err) {
      setModulesError(err instanceof Error ? err.message : "Unable to load modules.");
    } finally {
      setIsLoadingModules(false);
    }
  }

  useEffect(() => {
    loadCourseModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isHydrated, session?.token]);

  function handleOpenEditModule(moduleId: string) {
    const found = modules.find((m) => m.id === moduleId);
    if (found) setEditingModule(found);
  }

  function handleOpenEditLesson(lessonId: string) {
    for (const mod of modules) {
      const found = mod.lessons.find((l) => l.id === lessonId);
      if (found) {
        setEditingLesson(found);
        return;
      }
    }
  }

  async function handleUpdateLesson(lessonId: string, payload: UpdateLessonPayload) {
    setIsSaving(true);
    try {
      await updateLesson(lessonId, payload, session?.token);
      await loadCourseModules();
      setEditingLesson(null);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!lessonId) return;
    if (!window.confirm("Delete this lesson? This cannot be undone.")) return;
    setIsDeletingLesson(true);
    setModulesError(null);
    try {
      await deleteLesson(lessonId, session?.token);
      await loadCourseModules();
    } catch (err) {
      setModulesError(err instanceof Error ? err.message : "Unable to delete lesson.");
      console.error(err);
    } finally {
      setIsDeletingLesson(false);
    }
  }

  async function handleUpdateModule(payload: {
    title: string;
    description: string;
    order: number;
    status: string;
    enableDripRelease: boolean;
    releaseInterval?: number;
  }) {
    if (!editingModule) return;
    setIsSaving(true);
    try {
      await updateModule(
        editingModule.id,
        {
          title: payload.title,
          description: payload.description,
          enableDripRelease: payload.enableDripRelease,
          releaseInterval: payload.enableDripRelease ? payload.releaseInterval : undefined,
        } as UpdateModulePayload,
        session?.token
      );
      await loadCourseModules();
      setEditingModule(null);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveModule(payload: {
    title: string;
    description: string;
    order: number;
    status: string;
    enableDripRelease: boolean;
    releaseInterval?: number;
    fixedReleaseDate?: string;
  }) {
    if (!courseId) throw new Error("Course ID is required to save a module.");
    setIsSaving(true);
    try {
      await createModule(
        {
          title: payload.title,
          description: payload.description,
          order: payload.order,
          courseId,
          status: payload.status,
          enableDripRelease: payload.enableDripRelease,
          releaseInterval: payload.releaseInterval,
          fixedReleaseDate: payload.fixedReleaseDate,
        },
        session?.token
      );
      await loadCourseModules();
      router.push(contentStateHref);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveLesson(payload: {
    title: string;
    content: string;
    videoUrl?: string;
    type: string;
    estimatedReadingTime: string;
    accessLevel: string;
    order: number;
    moduleId: string;
  }) {
    if (!courseId) throw new Error("Course ID is required to save a lesson.");
 // Remove the instructorId guard — it's optional
  const instructorId = session?.user?.id;
   

    setIsSaving(true);
    try {
      await createLesson(
       {
        title: payload.title,
        content: payload.content,
        videoUrl: payload.videoUrl,
        type: payload.type,
        order: payload.order,
        moduleId: payload.moduleId,
        estimatedReadingTime: payload.estimatedReadingTime,
        accessLevel: payload.accessLevel,
        ...(instructorId ? { instructorId } : {}),  // only include if present
      },
        session?.token
      );
      await loadCourseModules();
      router.push(contentStateHref);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteModule(moduleId: string) {
    if (!moduleId) return;
    if (!window.confirm("Delete this module? This cannot be undone.")) return;
    setIsDeletingModule(true);
    setModulesError(null);
    try {
      await deleteModule(moduleId, session?.token);
      await loadCourseModules();
    } catch (err) {
      setModulesError(err instanceof Error ? err.message : "Unable to delete module.");
      console.error(err);
    } finally {
      setIsDeletingModule(false);
    }
  }

  return (
    <AppShell title={<CoursePageTitle label="Create New Course" />} activeSection="courses">
      <div className="mx-auto max-w-[1320px]">
        <CourseFlowStepper currentStep={2} />

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              Course Builder
            </h1>
            <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#465b7d]">
              Enter the basic information and structure for your new course.
            </p>
            {courseId ? (
              <p className="mt-3 text-[14px] text-[#4b8a60]">
                Connected course ID: <span className="font-semibold">{courseId}</span>
              </p>
            ) : null}
          </div>

          {tab === "content" ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <CourseActionLink
                href={courseSettingsHref}
                variant="secondary"
                className="min-w-[208px]"
              >
                Add Module
              </CourseActionLink>
              <CourseActionLink
                href={
                  courseId
                    ? `/courses/create/review-launch?courseId=${encodeURIComponent(courseId)}`
                    : "/courses/create/review-launch"
                }
                className="min-w-[220px] justify-between px-7"
              >
                <span>Save &amp; Continue</span>
                <ContinueArrow />
              </CourseActionLink>
            </div>
          ) : (
            <CourseActionLink href={quizStateHref} className="min-w-[216px] gap-4 px-7">
              <span>Save Assessment</span>
              <Save className="h-5 w-5" strokeWidth={2.1} />
            </CourseActionLink>
          )}
        </div>

        {tab === "content" ? (
          <ContentBuilderView
            courseId={courseId}
            settingsHref={courseSettingsHref}
            modules={modules}
            isLoadingModules={isLoadingModules}
            modulesError={modulesError}
            isDeletingModule={isDeletingModule}
            onDeleteModule={handleDeleteModule}
            onEditModule={handleOpenEditModule}
            onDeleteLesson={handleDeleteLesson}
            onEditLesson={handleOpenEditLesson}
          />
        ) : (
          <QuizBuilderView
            courseId={courseId}
            modules={modules}
            isLoadingModules={isLoadingModules}
            session={session}
            onRefresh={loadCourseModules}
          />
        )}
      </div>

      {/* URL-driven modals */}
      {modal === "course-settings" ? (
        <CourseSettingsModal
          closeHref={contentStateHref}
          courseId={courseId}
          nextModuleOrder={modules.length + 1}
          onSaveModule={handleSaveModule}
          isSaving={isSaving}
        />
      ) : null}
      {modal === "lesson-editor" ? (
        <ContentLessonEditorModal
          closeHref={contentStateHref}
          courseId={courseId}
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSaveLesson={handleSaveLesson}
          isSaving={isSaving}
        />
      ) : null}
      {modal === "question-editor" ? (
        <QuestionEditorModal closeHref={quizStateHref} />
      ) : null}

      {/* State-driven modals */}
      {editingModule ? (
        <EditModuleModal
          module={editingModule}
          onSave={handleUpdateModule}
          isSaving={isSaving}
          onClose={() => setEditingModule(null)}
        />
      ) : null}
      {editingLesson ? (
        <EditLessonModal
          lesson={editingLesson}
          modules={modules}
          onSave={handleUpdateLesson}
          isSaving={isSaving}
          onClose={() => setEditingLesson(null)}
        />
      ) : null}
    </AppShell>
  );
}

export default function CourseContentUploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseContentUploadContent />
    </Suspense>
  );
}