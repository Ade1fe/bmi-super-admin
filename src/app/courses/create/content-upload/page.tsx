"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Bold,
  Calendar,
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
  number: string;
  title: string;
  summary: string;
  type: LessonTypeKey;
  metaOne: string;
  metaTwo: string;
  highlighted?: boolean;
};

type ModuleCardData = {
  number: string;
  title: string;
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

const courseModules: ModuleCardData[] = [
  {
    number: "01",
    title: "Introduction to React Architecture",
    lessonCount: "4 Lessons",
    duration: "45 mins",
    lessons: [
      {
        number: "1.1",
        title: "Introduction to the Platform",
        summary: "A brief overview of the core features and dashboard layout.",
        type: "video",
        metaOne: "08:45",
        metaTwo: "Public",
      },
      {
        number: "1.2",
        title: "Core Principles & Values",
        summary: "Deep dive into the underlying philosophy of the course content.",
        type: "reading",
        metaOne: "08:45",
        metaTwo: "Public",
        highlighted: true,
      },
      {
        number: "1.3",
        title: "Knowledge Check",
        summary: "A short quiz to test your understanding of the first two lessons.",
        type: "quiz",
        metaOne: "10 Questions",
        metaTwo: "80% to pass",
      },
    ],
  },
  {
    number: "02",
    title: "Advanced State Management",
    lessonCount: "6 Lessons",
    duration: "1h 20mins",
    collapsed: true,
  },
  {
    number: "03",
    title: "Enter Module Title...",
    lessonCount: "New Module",
    duration: "",
    empty: true,
  },
];

const quizQuestions: QuizQuestionData[] = [
  {
    id: "Q1",
    title: "QUESTION TEXT",
    prompt: "What is the primary indicator of long-term economic growth according to the Solow Model?",
    options: ["Gold", "Silver", "Copper", "Copper"],
    selectedIndex: 0,
  },
  {
    id: "Q2",
    title: "QUESTION TEXT",
    prompt: "The Phillips Curve suggests a permanent trade-off between inflation ?",
    options: ["True", "False"],
    selectedIndex: 0,
  },
];

function buildHref({ tab = "content", modal }: { tab?: BuilderTab; modal?: string }) {
  const params = new URLSearchParams();

  if (tab === "quiz") {
    params.set("tab", "quiz");
  }

  if (modal) {
    params.set("modal", modal);
  }

  const query = params.toString();
  return query ? `/courses/create/content-upload?${query}` : "/courses/create/content-upload";
}

function LessonVisual({ type }: { type: LessonTypeKey }) {
  if (type === "video") {
    return {
      icon: Play,
      wrapperClassName: "bg-[#eef4ff] text-[#2f66ff]",
    };
  }

  if (type === "quiz") {
    return {
      icon: ListChecks,
      wrapperClassName: "bg-[#fff3e7] text-[#f07f20]",
    };
  }

  return {
    icon: BookOpen,
    wrapperClassName: "bg-[#eef8f1] text-[#16a05c]",
  };
}

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

function LessonCard({
  lesson,
  editHref,
}: {
  lesson: LessonCardData;
  editHref: string;
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

        <div className="flex shrink-0 items-center gap-2 text-[#7b899f]">
          {lesson.highlighted ? (
            <>
              <Link
                href={editHref}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
              >
                <PenSquare className="h-5 w-5" strokeWidth={2.1} />
              </Link>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
              >
                <Trash2 className="h-5 w-5" strokeWidth={2.1} />
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
          >
            <GripVertical className="h-5 w-5" strokeWidth={2.1} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ModuleCard({
  module,
  settingsHref,
  lessonEditorHref,
}: {
  module: ModuleCardData;
  settingsHref: string;
  lessonEditorHref: string;
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
          {!module.empty ? (
            <>
              <Link
                href={settingsHref}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
              >
                <Settings2 className="h-5 w-5" strokeWidth={2.1} />
              </Link>
              <Link
                href={lessonEditorHref}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
              >
                <PenSquare className="h-5 w-5" strokeWidth={2.1} />
              </Link>
            </>
          ) : null}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
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
            <LessonCard key={lesson.number} lesson={lesson} editHref={lessonEditorHref} />
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

function ContentSidebar({ settingsHref }: { settingsHref: string }) {
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
            <dt>Total Lessons</dt>
            <dd className="font-semibold text-[#22314c]">3</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt>Estimated Duration</dt>
            <dd className="font-semibold text-[#22314c]">45 mins</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-[#d5dff0] pb-4">
            <dt>Difficulty</dt>
            <dd className="rounded-full bg-[#edf8ef] px-3 py-1 text-[13px] font-bold uppercase tracking-[0.08em] text-[#0f8751]">
              Beginner
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#0f8751] text-white">
            ✓
          </span>
          <div>
            <p className="text-[16px] font-extrabold text-[#22314c]">Enable Drip Content</p>
            <p className="mt-2 text-[14px] italic text-[#72829a]">
              Release this module 7 days after enrollment.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function QuestionOption({
  label,
  selected,
}: {
  label: string;
  selected: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 rounded-[16px] border px-5 py-5 text-[16px] font-semibold transition-colors",
        selected ? "border-[#15985a] text-[#1a2f51]" : "border-[#e4ebf7] text-[#273a57]",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className={selected ? "text-[#15985a]" : "text-[#d3dceb]"}>
        {selected ? (
          <CircleDot className="h-6 w-6" strokeWidth={2.1} />
        ) : (
          <Circle className="h-6 w-6" strokeWidth={2.1} />
        )}
      </span>
    </div>
  );
}

function QuestionCard({
  question,
  settingsHref,
  editorHref,
}: {
  question: QuizQuestionData;
  settingsHref: string;
  editorHref: string;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.07)]">
      <div className="flex flex-col gap-4 bg-[#eef1fb] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
              {question.id}
            </p>
            <h2 className="truncate text-[16px] font-extrabold tracking-[-0.04em] text-[#8c9ab2] sm:text-[20px]">
              {question.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#66748b]">
          <Link
            href={settingsHref}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <Settings2 className="h-5 w-5" strokeWidth={2.1} />
          </Link>
          <Link
            href={editorHref}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <PenSquare className="h-5 w-5" strokeWidth={2.1} />
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
          >
            <ChevronDown className="h-5 w-5" strokeWidth={2.1} />
          </button>
        </div>
      </div>

      <div className="border-t border-[#e8edf7] bg-white p-4 sm:p-7">
        <div className="rounded-[20px] border border-[#dfe6f7] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-[760px] text-[17px] font-semibold leading-7 text-[#1d2f4b]">
              {question.prompt}
            </p>
            <GripVertical className="mt-1 h-5 w-5 shrink-0 text-[#c0cad9]" strokeWidth={2.1} />
          </div>

          <div className="mt-6 space-y-4">
            {question.options.map((option, index) => (
              <QuestionOption
                key={`${question.id}-${option}-${index}`}
                label={option}
                selected={index === question.selectedIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function QuizSidebar({ settingsHref }: { settingsHref: string }) {
  return (
    <div className="space-y-6">
      <aside className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Quiz Parameters
          </h2>
          <Link
            href={settingsHref}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#228352] hover:bg-[#f4f8f5]"
          >
            <Settings2 className="h-5 w-5" strokeWidth={2.1} />
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#44536d]">
            Passing Criteria
          </p>
          <div className="mt-5 rounded-[16px] bg-[#eef1fb] p-5">
            <div className="flex items-center justify-between gap-4 text-[15px] font-bold text-[#0f8751]">
              <span>Minimum Score</span>
              <span>75%</span>
            </div>
            <div className="mt-4 h-[6px] rounded-full bg-[#d6dff0]">
              <div className="h-full w-[75%] rounded-full bg-[#0f8751]" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-[15px] font-semibold text-[#66748b]">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#0f8751] text-white">
                ✓
              </span>
              <span>Allow partial credit</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#44536d]">
            Administration Settings
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-[16px] border border-[#e6ebf7] px-4 py-4">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#4b8a60]" strokeWidth={2.1} />
                <span className="text-[15px] font-bold text-[#22314c]">Time Limit</span>
              </div>
              <span className="text-[15px] font-bold text-[#0f8751]">45 min</span>
            </div>

            <div className="flex items-center justify-between rounded-[16px] border border-[#e6ebf7] px-4 py-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-[#4b8a60]" strokeWidth={2.1} />
                <span className="text-[15px] font-bold text-[#22314c]">Attempts</span>
              </div>
              <span className="text-[15px] font-bold text-[#0f8751]">02</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#44536d]">
            Visibility
          </p>
          <div className="mt-5 flex items-center justify-between rounded-[16px] bg-[#fff9e9] px-4 py-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#0f8751]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f8751]" />
              Draft Mode
            </span>
            <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-[#0f8751]">
              Publish Now
            </span>
          </div>
        </div>
      </aside>

      <aside className="rounded-[22px] border border-[#dfe6f7] bg-[#f6f8fd] p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#44536d]">
          Total Weighting
        </p>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-[46px] font-extrabold leading-none tracking-[-0.06em] text-[#0f8751]">
              12
            </p>
            <p className="mt-2 text-[15px] text-[#6a7b95]">questions</p>
          </div>

          <div className="text-right">
            <p className="text-[46px] font-extrabold leading-none tracking-[-0.06em] text-[#0f8751]">
              150
            </p>
            <p className="mt-2 text-[15px] text-[#6a7b95]">pts total</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ModalSelect({
  label,
  defaultValue,
  options,
}: {
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">{label}</span>
      <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] bg-white px-4">
        <select
          defaultValue={defaultValue}
          className="h-full w-full appearance-none bg-transparent pr-10 text-[15px] text-[#264267] outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
      </span>
    </label>
  );
}

function ModalInput({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">{label}</span>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-[54px] w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
      />
    </label>
  );
}

function ContentLessonEditorModal({
  closeHref,
}: {
  closeHref: string;
}) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[920px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Lesson Editor
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Configure the content, access level, and delivery details for this lesson.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <CourseActionLink href={closeHref} className="min-w-[176px] justify-between px-6">
            <span>Save Changes</span>
            <ContinueArrow />
          </CourseActionLink>
        </div>

        <div className="mt-10 rounded-[24px] border border-[#87a5d7] p-4 sm:p-6">
          <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <ModalSelect
                label="Lesson Type"
                defaultValue="Reading Material"
                options={["Reading Material", "Video Lesson", "Interactive Quiz"]}
              />
              <ModalInput label="Lesson Title" defaultValue="Core Principles & Values" />
            </div>

            <div>
              <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                Detail Description
              </span>
              <div className="overflow-hidden rounded-[16px] border border-[#d7deee]">
                <div className="flex flex-wrap gap-3 border-b border-[#e7edf8] px-4 py-3 text-[#5f6f8b]">
                  {[Bold, Italic, Underline, List, List, Link2, Image, Code].map(
                    (Icon, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#f3f6fb]"
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.1} />
                      </button>
                    ),
                  )}
                </div>
                <textarea
                  rows={5}
                  defaultValue="This module covers the core principles of institutional design and structural integrity within complex data environments. Students will explore the interplay between legacy frameworks and emergent standards."
                  className="w-full resize-none px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ModalInput label="Lesson Number" defaultValue="1.2" />
              <ModalSelect
                label="Access Level"
                defaultValue="Public"
                options={["Public", "Enrolled Students", "Private"]}
              />
              <ModalSelect
                label="Estimated Reading Time"
                defaultValue="10 minutes"
                options={["10 minutes", "20 minutes", "30 minutes"]}
              />
              <ModalInput label="Attachment Label" defaultValue="Reading Material PDF" />
            </div>

            <div>
              <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">Upload File</span>
              <label className="flex min-h-[126px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#bfe6d2] bg-[#f1fdf6] px-6 text-center">
                <Upload className="h-10 w-10 text-[#0f8751]" strokeWidth={2.1} />
                <span className="mt-4 text-[15px] font-semibold text-[#47617f]">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 text-[15px] text-[#72829a]">PDF, DOCX or MP4 (Max 50MB)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </CourseModal>
  );
}

function CourseSettingsModal({
  closeHref,
}: {
  closeHref: string;
}) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[760px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Course Setting
        </h2>
        <p className="mt-2 text-[16px] text-[#4b6182]">
          Configure the structural parameters and release rules for this course.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <CourseActionLink href={closeHref} className="min-w-[176px] justify-between px-6">
            <span>Save Changes</span>
            <ContinueArrow />
          </CourseActionLink>
        </div>

        <div className="mt-10 space-y-5">
          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Publishing Overview
            </h3>
            <dl className="mt-6 space-y-5 text-[15px] text-[#62718a]">
              <div className="flex items-center justify-between gap-4">
                <dt>Course Code</dt>
                <dd className="rounded-[10px] bg-white px-3 py-1.5 text-[13px] font-extrabold tracking-[0.08em] text-[#22314c]">
                  CRS-014
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Status</dt>
                <dd className="rounded-full bg-[#fff2cf] px-4 py-1.5 text-[13px] font-extrabold tracking-[0.08em] text-[#d88709]">
                  DRAFT MODE
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Estimated Duration</dt>
                <dd className="font-semibold text-[#22314c]">120 Minutes</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Access &amp; Prerequisites
            </h3>

            <div className="mt-6 rounded-[16px] border border-[#dce4f5] bg-white px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[16px] font-extrabold text-[#22314c]">
                    Module 03: Foundational Logic
                  </p>
                  <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7b89a2]">
                    Mandatory completion required
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9e1f3] text-[#0f8751]"
                >
                  ×
                </button>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-[#dceadf] bg-white text-[15px] font-semibold uppercase tracking-[0.12em] text-[#71819d]"
            >
              <Plus className="h-5 w-5" strokeWidth={2.1} />
              Add prerequisite requirement
            </button>
          </section>

          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Delivery Schedule
            </h3>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[16px] font-bold text-[#22314c]">Enable Drip Release</p>
                <p className="mt-1 text-[15px] text-[#6d7d98]">Release content on a timed interval</p>
              </div>
              <button type="button" className="flex h-8 w-16 items-center rounded-full bg-[#0f8751] px-1">
                <span className="ml-auto flex h-6 w-6 rounded-full bg-white" />
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Release Interval
                </span>
                <div className="flex h-[56px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267]">
                  <span>7</span>
                  <span className="text-[#72829a]">Days</span>
                </div>
                <p className="mt-2 text-[13px] text-[#7b89a2]">
                  Module will unlock exactly 7 days after course enrollment.
                </p>
              </label>

              <label>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">
                  Fixed Release Date
                </span>
                <div className="flex h-[56px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[15px] text-[#264267]">
                  <span>October 24, 2024</span>
                  <Calendar className="h-5 w-5 text-[#0f8751]" strokeWidth={2.1} />
                </div>
              </label>
            </div>
          </section>
        </div>
      </div>
    </CourseModal>
  );
}

function QuestionEditorModal({
  closeHref,
}: {
  closeHref: string;
}) {
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
                defaultValue="This module covers the core principles of institutional design and structural integrity within complex data environments. Students will explore the interplay between legacy frameworks and emergent emerald standards."
                className="w-full resize-none px-4 py-4 text-[15px] leading-6 text-[#264267] outline-none"
              />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {["Option 1", "Option 2", "Option 3", "Option 4"].map((label, index) => (
              <div key={label}>
                <span className="mb-3 block text-[14px] font-semibold text-[#51627f]">{label}</span>
                <div className="space-y-3">
                  <input
                    defaultValue="Reading"
                    className="h-[54px] w-full rounded-[14px] border border-[#d7deee] bg-white px-4 text-[15px] text-[#264267] outline-none"
                  />
                  <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] bg-white px-4">
                    <select
                      defaultValue={index === 0 ? "True" : "false"}
                      className="h-full w-full appearance-none bg-transparent pr-10 text-[15px] text-[#264267] outline-none"
                    >
                      <option>True</option>
                      <option>false</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
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

function QuizSettingsModal({
  closeHref,
}: {
  closeHref: string;
}) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[900px]">
      <div className="p-7 pr-14 sm:p-9 sm:pr-16">
        <h2 className="text-[28px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Quiz Parameters Setting
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

        <div className="mt-10 space-y-6">
          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              Passing Criteria
            </h3>
            <div className="mt-5 space-y-5">
              <ModalSelect
                label="Minimum Score"
                defaultValue="75%"
                options={["60%", "70%", "75%", "80%", "90%"]}
              />
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-bold text-[#22314c]">Allow Partial Credit</span>
                <button
                  type="button"
                  className="flex h-8 w-16 items-center rounded-full bg-[#0f8751] px-1"
                >
                  <span className="ml-auto flex h-6 w-6 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              Administrative Setting
            </h3>
            <div className="mt-5 grid gap-5">
              <ModalSelect
                label="Time Limit"
                defaultValue="45 min"
                options={["15 min", "30 min", "45 min", "60 min"]}
              />
              <ModalSelect
                label="Attempts"
                defaultValue="02"
                options={["01", "02", "03", "Unlimited"]}
              />
            </div>
          </section>

          <section className="rounded-[18px] bg-[#f6f8ff] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
                Visibility
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0c8] px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#d69008]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f4b51d]" />
                Draft Mode
              </span>
            </div>
          </section>
        </div>
      </div>
    </CourseModal>
  );
}

function ContentBuilderView({
  settingsHref,
  lessonEditorHref,
}: {
  settingsHref: string;
  lessonEditorHref: string;
}) {
  return (
    <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_294px]">
      <div>
        <div className="border-b border-[#dfe6f7]">
          <div className="flex gap-12">
            <TabButton href={buildHref({ tab: "content" })} label="Lessons & Content" active />
            <TabButton href={buildHref({ tab: "quiz" })} label="Quiz Builder" active={false} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Course Structure
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
          {courseModules.map((module) => (
            <ModuleCard
              key={module.number}
              module={module}
              settingsHref={settingsHref}
              lessonEditorHref={lessonEditorHref}
            />
          ))}
        </div>
      </div>

      <ContentSidebar settingsHref={settingsHref} />
    </section>
  );
}

function QuizBuilderView({
  settingsHref,
  editorHref,
}: {
  settingsHref: string;
  editorHref: string;
}) {
  return (
    <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="border-b border-[#dfe6f7]">
          <div className="flex gap-12">
            <TabButton href={buildHref({ tab: "content" })} label="Lessons & Content" active={false} />
            <TabButton href={buildHref({ tab: "quiz" })} label="Quiz Builder" active />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Course Structure
          </h2>
        </div>

        <div className="mt-8 space-y-7">
          {quizQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              settingsHref={settingsHref}
              editorHref={editorHref}
            />
          ))}

          <Link
            href={editorHref}
            className="flex min-h-[54px] items-center justify-center rounded-[14px] border-2 border-dashed border-[#dceadf] bg-white px-4 text-center text-[15px] font-medium text-[#7a8aa3]"
          >
            + Add Quiz Question
          </Link>
        </div>
      </div>

      <QuizSidebar settingsHref={settingsHref} />
    </section>
  );
}

export default function CourseContentUploadPage() {
  const searchParams = useSearchParams();
  const tab: BuilderTab = searchParams.get("tab") === "quiz" ? "quiz" : "content";
  const modal = searchParams.get("modal");

  const contentStateHref = buildHref({ tab: "content" });
  const quizStateHref = buildHref({ tab: "quiz" });
  const courseSettingsHref = buildHref({ tab: "content", modal: "course-settings" });
  const contentLessonEditorHref = buildHref({ tab: "content", modal: "lesson-editor" });
  const questionEditorHref = buildHref({ tab: "quiz", modal: "question-editor" });
  const quizSettingsHref = buildHref({ tab: "quiz", modal: "quiz-settings" });

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
          </div>

          {tab === "content" ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <CourseActionLink href={courseSettingsHref} variant="secondary" className="min-w-[208px]">
                Edit Course Setting
              </CourseActionLink>
              <CourseActionLink
                href="/courses/create/review-launch"
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
            settingsHref={courseSettingsHref}
            lessonEditorHref={contentLessonEditorHref}
          />
        ) : (
          <QuizBuilderView settingsHref={quizSettingsHref} editorHref={questionEditorHref} />
        )}
      </div>

      {modal === "course-settings" ? <CourseSettingsModal closeHref={contentStateHref} /> : null}
      {modal === "lesson-editor" ? <ContentLessonEditorModal closeHref={contentStateHref} /> : null}
      {modal === "question-editor" ? <QuestionEditorModal closeHref={quizStateHref} /> : null}
      {modal === "quiz-settings" ? <QuizSettingsModal closeHref={quizStateHref} /> : null}
    </AppShell>
  );
}
