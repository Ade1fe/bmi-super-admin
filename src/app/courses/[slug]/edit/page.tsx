import Link from "next/link";
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

const courseTitles: Record<string, string> = {
  "advanced-react-nodejs": "Advanced React & Node.js",
  "introduction-to-ui-design": "Introduction to UI Design",
  "advanced-ux-research": "Advanced UX Research",
};

const editModules = [
  {
    number: "01",
    title: "Introduction to React Architecture",
    lessonCount: "4 Lessons",
    duration: "45 mins",
    lessons: [
      { number: "1.1", title: "Understanding the Virtual DOM", detail: "Video • 12:45", kind: "video" },
      {
        number: "1.2",
        title: "Core Principles of Declarative UI",
        detail: "Reading • 10 mins",
        kind: "reading",
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

function formatTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = courseTitles[slug] ?? formatTitle(slug);

  return (
    <AppShell
      title={<CoursePageTitle label="Edit Course" backHref="/courses" />}
      activeSection="courses"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              {title}
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-8 text-[#465b7d]">
              Track your growth and unlock new milestones.
            </p>
          </div>

          <CourseActionLink href="/courses/create/content-upload?modal=module-settings" className="min-w-[220px]">
            Add New Module
          </CourseActionLink>
        </div>

        <section className="mt-12">
          <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#182f53]">
            Course Structure
          </h2>

          <div className="mt-8 space-y-7">
            {editModules.map((module) => (
              <article
                key={module.number}
                className="overflow-hidden rounded-[22px] border border-[#dfe6f7] bg-white shadow-[0_18px_40px_rgba(182,192,227,0.09)]"
              >
                <div className="flex flex-col gap-4 bg-[#eef1fb] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <GripVertical className="h-5 w-5 shrink-0 text-[#98a6be]" strokeWidth={2.2} />
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#0f8751]">
                        Module {module.number}
                      </p>
                      <h3 className="truncate text-[24px] font-extrabold tracking-[-0.04em] text-[#1a2f51]">
                        {module.title}
                      </h3>
                      <p className="mt-1 text-[16px] text-[#667792]">
                        {module.lessonCount}
                        {module.duration ? ` • ${module.duration}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#6f7e96]">
                    {!module.empty ? (
                      <Link
                        href="/courses/create/content-upload?modal=module-settings"
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
                      href="/courses/create/content-upload?modal=lesson-editor"
                      className="mt-8 min-w-[190px]"
                    >
                      Create First Lesson
                    </CourseActionLink>
                  </div>
                ) : (
                  <div className="space-y-4 border-t border-[#e8edf7] bg-[#fbfcff] p-6">
                    {module.lessons?.map((lesson) => (
                      <article
                        key={lesson.number}
                        className="rounded-[18px] border border-[#e8edf7] bg-white px-5 py-5"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef8f1] text-[#0f8751]">
                            {lesson.kind === "video" ? (
                              <Video className="h-5 w-5" strokeWidth={2.1} />
                            ) : (
                              <BookOpen className="h-5 w-5" strokeWidth={2.1} />
                            )}
                          </span>
                          <div>
                            <h4 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#22314c]">
                              {lesson.number} {lesson.title}
                            </h4>
                            <p className="mt-1 text-[16px] text-[#6d7d98]">{lesson.detail}</p>
                          </div>
                        </div>
                      </article>
                    ))}

                    <Link
                      href="/courses/create/content-upload?modal=lesson-editor"
                      className="flex min-h-[58px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#dceadf] bg-white text-[18px] font-medium text-[#7687a2]"
                    >
                      + Add Lesson to Module {module.number}
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
