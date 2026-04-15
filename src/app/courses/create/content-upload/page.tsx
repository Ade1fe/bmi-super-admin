"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bold,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock3,
  Code,
  EllipsisVertical,
  Eye,
  GripVertical,
  Image,
  Italic,
  Link2,
  List,
  Lock,
  PenSquare,
  Plus,
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

type LessonCardData = {
  number: string;
  title: string;
  summary: string;
  typeLabel: string;
  accentClassName: string;
  metaOne: string;
  metaTwo: string;
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
        typeLabel: "Video",
        accentClassName: "bg-[#eaf0ff] text-[#3060ff]",
        metaOne: "08:45",
        metaTwo: "Public",
      },
      {
        number: "1.2",
        title: "Core Principles & Values",
        summary: "Deep dive into the underlying philosophy of the course content.",
        typeLabel: "Reading",
        accentClassName: "bg-[#eef8f1] text-[#11814a]",
        metaOne: "08:45",
        metaTwo: "Public",
      },
      {
        number: "1.3",
        title: "Knowledge Check",
        summary: "A short quiz to test your understanding of the first two lessons.",
        typeLabel: "Quiz",
        accentClassName: "bg-[#fff3e7] text-[#ea7c13]",
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

function buildHref({
  ready,
  configured,
  modal,
}: {
  ready?: boolean;
  configured?: boolean;
  modal?: string;
}) {
  const params = new URLSearchParams();

  if (configured) {
    params.set("configured", "1");
  } else if (ready) {
    params.set("ready", "1");
  }

  if (modal) {
    params.set("modal", modal);
  }

  const query = params.toString();
  return query ? `/courses/create/content-upload?${query}` : "/courses/create/content-upload";
}

function LessonCard({
  lesson,
  editHref,
}: {
  lesson: LessonCardData;
  editHref: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#e8edf7] bg-white p-6 shadow-[0_12px_24px_rgba(205,214,235,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <span
            className={[
              "mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[15px] font-extrabold",
              lesson.accentClassName,
            ].join(" ")}
          >
            {lesson.typeLabel.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[20px] font-extrabold tracking-[-0.03em] text-[#1a2f51]">
              {lesson.number} {lesson.title}
            </h3>
            <p className="mt-2 text-[16px] leading-7 text-[#6d7d98]">{lesson.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-[10px] bg-[#f5f7fb] px-3 py-1.5 text-[14px] font-semibold text-[#576a88]">
                <Clock3 className="h-4 w-4" strokeWidth={2.1} />
                {lesson.metaOne}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[10px] bg-[#f5f7fb] px-3 py-1.5 text-[14px] font-semibold text-[#576a88]">
                <Eye className="h-4 w-4" strokeWidth={2.1} />
                {lesson.metaTwo}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#7d89a0]">
          <Link href={editHref} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3f6fb]">
            <PenSquare className="h-5 w-5" strokeWidth={2.1} />
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f3f6fb]"
          >
            <EllipsisVertical className="h-5 w-5" strokeWidth={2.1} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ModuleCard({
  module,
  moduleSettingsHref,
  editLessonHref,
}: {
  module: ModuleCardData;
  moduleSettingsHref: string;
  editLessonHref: string;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.09)]">
      <div className="flex flex-col gap-4 bg-[#eef1fb] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
              Module {module.number}
            </p>
            <h2 className="truncate text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              {module.title}
            </h2>
            <p className="mt-1 text-[16px] text-[#667792]">
              {module.lessonCount}
              {module.duration ? ` • ${module.duration}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#6f7e96]">
          {!module.empty ? (
            <Link
              href={moduleSettingsHref}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
            >
              <Settings2 className="h-5 w-5" strokeWidth={2.1} />
            </Link>
          ) : null}
          {!module.empty ? (
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
            >
              <PenSquare className="h-5 w-5" strokeWidth={2.1} />
            </button>
          ) : null}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.1} />
          </button>
          {!module.empty ? (
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
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
        <div className="border-t border-[#e8edf7] bg-[#f7f9fd] px-8 py-12 text-center text-[18px] italic text-[#7e8da6]">
          Contents are hidden
        </div>
      ) : module.empty ? (
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
            href={editLessonHref}
            className="mt-8 min-w-[190px]"
          >
            Create First Lesson
          </CourseActionLink>
        </div>
      ) : (
        <div className="space-y-5 border-t border-[#e8edf7] bg-[#fbfcff] p-6">
          {module.lessons?.map((lesson) => (
            <LessonCard key={lesson.number} lesson={lesson} editHref={editLessonHref} />
          ))}

          <Link
            href={editLessonHref}
            className="flex min-h-[58px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#dceadf] bg-white text-[18px] font-medium text-[#7687a2]"
          >
            + Add Lesson to Module {module.number}
          </Link>
        </div>
      )}
    </article>
  );
}

function RightSidebar({ ready, configured }: { ready: boolean; configured: boolean }) {
  if (!ready) {
    return (
      <div className="space-y-6">
        <aside className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Lesson Types
          </h2>
          <p className="mt-8 text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
            No data yet
          </p>
          <p className="mt-4 text-[16px] leading-7 text-[#72829a]">
            Finish setting up your course to see data
          </p>
        </aside>

        <aside className="rounded-[22px] border border-[#dfe6f7] bg-[#eef1fb] p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#0f8751]">
            Module Stats
          </h2>
          <p className="mt-8 text-[22px] font-extrabold tracking-[-0.04em] text-[#22314c]">
            No data yet
          </p>
          <p className="mt-4 text-[16px] leading-7 text-[#72829a]">
            Finish setting up your course to see data
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <aside className="rounded-[22px] border border-[#dfe6f7] bg-white p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182f53]">
          Lesson Types
        </h2>

        <div className="mt-7 space-y-4">
          <div className="rounded-[16px] border border-[#e6ebf7] px-4 py-4">
            <p className="text-[18px] font-extrabold text-[#22314c]">Video Lesson</p>
            <p className="mt-1 text-[14px] text-[#72829a]">MP4, YouTube, Vimeo, Wistia</p>
          </div>
          <div className="rounded-[16px] border border-[#e6ebf7] px-4 py-4">
            <p className="text-[18px] font-extrabold text-[#22314c]">Reading Material</p>
            <p className="mt-1 text-[14px] text-[#72829a]">Rich text, PDF, Web links</p>
          </div>
          <div className="rounded-[16px] border border-[#e6ebf7] px-4 py-4">
            <p className="text-[18px] font-extrabold text-[#22314c]">Interactive Quiz</p>
            <p className="mt-1 text-[14px] text-[#72829a]">Multiple choice, true/false</p>
          </div>
        </div>
      </aside>

      <aside className="rounded-[22px] border border-[#dfe6f7] bg-[#eef1fb] p-6 shadow-[0_18px_35px_rgba(180,193,229,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#0f8751]">
            Module Stats
          </h2>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0f8751]/20 text-[#0f8751]">
            i
          </span>
        </div>

        <dl className="mt-7 space-y-4 text-[18px] text-[#576a88]">
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
            <p className="text-[18px] font-extrabold text-[#22314c]">Enable Drip Content</p>
            <p className="mt-2 text-[14px] italic text-[#72829a]">
              {configured
                ? "Release this module 7 days after enrollment."
                : "Continue to save module settings."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function LessonEditorModal({
  closeHref,
  saveHref,
}: {
  closeHref: string;
  saveHref: string;
}) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[920px]">
      <div className="p-8 sm:p-10">
        <h2 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Lesson Editor
        </h2>
        <p className="mt-2 text-[18px] text-[#4b6182]">
          Configure the structural parameters for this module
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <CourseActionLink href={saveHref} className="min-w-[176px] justify-between px-6">
            <span>Save Changes</span>
            <ContinueArrow />
          </CourseActionLink>
        </div>

        <div className="mt-10 rounded-[24px] border border-[#87a5d7] p-4 sm:p-6">
          <div className="grid gap-6">
            <label>
              <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                Lesson Type
              </span>
              <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] px-5">
                <select
                  defaultValue="Reading"
                  className="h-full w-full appearance-none bg-transparent text-[16px] text-[#264267] outline-none"
                >
                  <option>Reading</option>
                  <option>Video</option>
                  <option>Quiz</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
              </span>
            </label>

            <div>
              <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
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
                  defaultValue="This module covers the core principles of institutional design and structural integrity within complex data environments. Students will explore the interplay between legacy frameworks and emergent standards."
                  className="w-full resize-none px-4 py-4 text-[16px] leading-7 text-[#264267] outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  Lesson Number
                </span>
                <input
                  defaultValue="1.2"
                  className="h-[56px] w-full rounded-[14px] border border-[#d7deee] px-4 text-[16px] text-[#264267] outline-none"
                />
              </label>
              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  lesson Title
                </span>
                <input
                  defaultValue="Core Principles & Values"
                  className="h-[56px] w-full rounded-[14px] border border-[#d7deee] px-4 text-[16px] text-[#264267] outline-none"
                />
              </label>
              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  Estimated Reading Time
                </span>
                <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] px-4">
                  <select
                    defaultValue="10 minutes"
                    className="h-full w-full appearance-none bg-transparent text-[16px] text-[#264267] outline-none"
                  >
                    <option>10 minutes</option>
                    <option>20 minutes</option>
                    <option>30 minutes</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
                </span>
              </label>
              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  Access Level
                </span>
                <span className="relative flex h-[56px] items-center rounded-[14px] border border-[#d7deee] px-4">
                  <select
                    defaultValue="Enrolled Students"
                    className="h-full w-full appearance-none bg-transparent text-[16px] text-[#264267] outline-none"
                  >
                    <option>Enrolled Students</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8c98b1]" strokeWidth={2.1} />
                </span>
              </label>
            </div>

            <div>
              <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">Upload PDF</span>
              <label className="flex min-h-[126px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#bfe6d2] bg-[#f1fdf6] px-6 text-center">
                <Upload className="h-10 w-10 text-[#0f8751]" strokeWidth={2.1} />
                <span className="mt-4 text-[16px] font-semibold text-[#47617f]">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 text-[15px] text-[#72829a]">JPG, PNG (Max 5MB)</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-5 text-[14px] text-[#61718d]">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0f8751]" />
                Enable PDF Download
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0f8751]" />
                Enable Comments
              </label>
            </div>
          </div>
        </div>
      </div>
    </CourseModal>
  );
}

function WarningModal({ settingsHref, closeHref }: { settingsHref: string; closeHref: string }) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[420px]">
      <div className="px-8 py-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#ffdbdb] text-[58px] font-extrabold text-[#f34d4d]">
          i
        </div>
        <h2 className="mt-8 text-[34px] font-extrabold tracking-[-0.05em] text-[#162f54]">
          Complete Modules Setting
        </h2>
        <p className="mt-4 text-[18px] leading-8 text-[#657691]">
          You have not set modules parameters, this will affect the course outlook
        </p>
        <CourseActionLink href={settingsHref} variant="secondary" className="mt-8 w-full">
          Go to modules setting
        </CourseActionLink>
      </div>
    </CourseModal>
  );
}

function ModuleSettingsModal({
  closeHref,
  saveHref,
}: {
  closeHref: string;
  saveHref: string;
}) {
  return (
    <CourseModal closeHref={closeHref} maxWidthClassName="max-w-[760px]">
      <div className="p-8 sm:p-10">
        <h2 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">
          Module Settings
        </h2>
        <p className="mt-2 text-[18px] text-[#4b6182]">
          Configure the structural parameters for this module
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CourseActionLink href={closeHref} variant="secondary" className="min-w-[136px]">
            Discard
          </CourseActionLink>
          <CourseActionLink href={saveHref} className="min-w-[176px] justify-between px-6">
            <span>Save Changes</span>
            <ContinueArrow />
          </CourseActionLink>
        </div>

        <div className="mt-10 space-y-5">
          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              System Meta Data
            </h3>
            <dl className="mt-6 space-y-5 text-[17px] text-[#62718a]">
              <div className="flex items-center justify-between gap-4">
                <dt>Module</dt>
                <dd className="rounded-[10px] bg-white px-3 py-1.5 text-[13px] font-extrabold tracking-[0.08em] text-[#22314c]">
                  MOD-04-SYS
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
            <h3 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Access &amp; Prerequisites
            </h3>

            <div className="mt-6 rounded-[16px] border border-[#dce4f5] bg-white px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Lock className="mt-1 h-5 w-5 text-[#0f8751]" strokeWidth={2.1} />
                  <div>
                    <p className="text-[18px] font-extrabold text-[#22314c]">
                      Module 03: Foundational Logic
                    </p>
                    <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7b89a2]">
                      Mandatory completion required
                    </p>
                  </div>
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
              className="mt-5 flex min-h-[60px] w-full items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-[#dceadf] bg-white text-[16px] font-semibold uppercase tracking-[0.12em] text-[#71819d]"
            >
              <Plus className="h-5 w-5" strokeWidth={2.1} />
              Add prerequisite requirement
            </button>
          </section>

          <section className="rounded-[20px] bg-[#f8faff] p-6">
            <h3 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
              Delivery Schedule
            </h3>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[18px] font-bold text-[#22314c]">Enable Drip Release</p>
                <p className="mt-1 text-[15px] text-[#6d7d98]">Release content on a timed interval</p>
              </div>
              <button type="button" className="flex h-8 w-16 items-center rounded-full bg-[#0f8751] px-1">
                <span className="ml-auto flex h-6 w-6 rounded-full bg-white" />
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  Release Interval
                </span>
                <div className="flex h-[58px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267]">
                  <span>7</span>
                  <span className="text-[#72829a]">Days</span>
                </div>
                <p className="mt-2 text-[13px] text-[#7b89a2]">
                  Module will unlock exactly 7 days after course enrollment.
                </p>
              </label>

              <label>
                <span className="mb-3 block text-[16px] font-semibold text-[#51627f]">
                  Fixed Release Date
                </span>
                <div className="flex h-[58px] items-center justify-between rounded-[14px] border border-[#d7deee] bg-white px-5 text-[16px] text-[#264267]">
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

export default function CourseContentUploadPage() {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const configured = searchParams.get("configured") === "1";
  const ready = configured || searchParams.get("ready") === "1";

  const stateHref = buildHref({ ready, configured });
  const lessonEditorHref = buildHref({ ready, configured, modal: "lesson-editor" });
  const settingsHref = buildHref({ ready, configured, modal: "module-settings" });
  const warningHref = buildHref({ ready, configured, modal: "warning" });
  const readyHref = buildHref({ ready: true });
  const configuredHref = buildHref({ configured: true });

  return (
    <AppShell title={<CoursePageTitle label="Create New Course" />} activeSection="courses">
      <div className="mx-auto max-w-[1360px]">
        <CourseFlowStepper currentStep={2} />

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              Course Builder
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-8 text-[#465b7d]">
              Enter the basic information and structure for your new course.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {configured ? (
              <CourseActionLink href={settingsHref} variant="secondary" className="min-w-[208px]">
                Edit Course Setting
              </CourseActionLink>
            ) : ready ? null : (
              <CourseActionLink href={settingsHref} variant="secondary" className="min-w-[186px]">
                Modules Setting
              </CourseActionLink>
            )}

            <CourseActionLink href="/courses" variant="secondary" className="min-w-[172px]">
              Save as Draft
            </CourseActionLink>

            {ready ? (
              <CourseActionLink
                href={configured ? "/courses/create/review-launch" : warningHref}
                className="min-w-[220px] justify-between px-7"
              >
                <span>Save &amp; Continue</span>
                <ContinueArrow />
              </CourseActionLink>
            ) : null}
          </div>
        </div>

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_294px]">
          <div>
            <div className="border-b border-[#dfe6f7]">
              <div className="flex gap-12">
                <button
                  type="button"
                  className="border-b-[3px] border-[#0f8751] pb-4 text-[18px] font-extrabold text-[#4b8a60]"
                >
                  Lessons &amp; Content
                </button>
                <button type="button" className="border-b-[3px] border-transparent pb-4 text-[18px] font-semibold text-[#667792]">
                  Quiz Builder
                </button>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                Course Structure
              </h2>
              <Link
                href={settingsHref}
                className="inline-flex items-center gap-3 text-[18px] font-extrabold text-[#0f8751]"
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
                  moduleSettingsHref={settingsHref}
                  editLessonHref={lessonEditorHref}
                />
              ))}
            </div>
          </div>

          <RightSidebar ready={ready} configured={configured} />
        </section>
      </div>

      {modal === "lesson-editor" ? (
        <LessonEditorModal closeHref={stateHref} saveHref={configured ? configuredHref : readyHref} />
      ) : null}

      {modal === "warning" ? (
        <WarningModal settingsHref={settingsHref} closeHref={stateHref} />
      ) : null}

      {modal === "module-settings" ? (
        <ModuleSettingsModal closeHref={stateHref} saveHref={configuredHref} />
      ) : null}
    </AppShell>
  );
}
