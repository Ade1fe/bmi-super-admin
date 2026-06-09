"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Archive,
  BookOpen,
  ChartColumn,
  Download,
  FilePenLine,
  Filter,
  PenSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuthSession } from "@/lib/auth-session";
import { getCourses, type Course } from "@/lib/course-api";

type CourseTab = "all" | "published" | "drafts" | "archived";

type CourseRow = {
  id: string | number;
  slug: string;
  title: string;
  code: string;
  category: string;
  categoryClassName: string;
  lessons: string;
  students: string;
  instructor: string;
  instructorInitials: string;
  instructorAvatarClassName: string;
  status: string;
  statusClassName: string;
  lastEdited: string;
  archivedDate: string;
};

const tabs: { key: CourseTab; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "published", label: "Published" },
  { key: "drafts", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

function formatStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "published") {
    return "bg-[#e5f7ef] text-[#0f8a4f]";
  }

  if (normalized === "draft") {
    return "bg-[#fff2cf] text-[#d88709]";
  }

  if (normalized === "archived") {
    return "bg-[#edf1f7] text-[#70809d]";
  }

  return "bg-[#eef1ff] text-[#5b6d8a]";
}

function mapCourseToRow(course: Course): CourseRow {
  return {
    id: course.id,
    slug: course.slug || course.id,
    title: course.name,
    code: course.id.slice(0, 8).toUpperCase(),
    category: course.categoryName ?? "Uncategorized",
    categoryClassName: "bg-[#deebff] text-[#2463e7]",
    lessons: `${course.totalLessons ?? 0} ${(course.totalLessons ?? 0) === 1 ? "Lesson" : "Lessons"}`,
    students: String(course.totalStudents ?? 0),
//     lessons: course.totalLessons
//   ? `${course.totalLessons} ${course.totalLessons === 1 ? "Lesson" : "Lessons"}`
//   : "—",
// students: course.totalStudents ? String(course.totalStudents) : "—",
    instructor: "Course Admin",
    instructorInitials: course.name
      .split(" ")
      .map((token) => token[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join(""),
    instructorAvatarClassName: "from-[#2b2ad4] via-[#bf39dc] to-[#18c0ff]",
    status: (course.status ?? "draft").toUpperCase(),
    statusClassName: formatStatusClass(course.status ?? "draft"),
    lastEdited: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "Unknown",
    archivedDate: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "Unknown",
  };
}

function CourseSummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  iconClassName: string;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] font-medium uppercase text-[#334768]">{label}</p>
        <span className={`flex h-12 w-12 items-center justify-center rounded-[10px] ${iconClassName}`}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-9 text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
    </article>
  );
}

function getSummaryCards(activeTab: CourseTab) {
  if (activeTab === "drafts") {
    return [
      {
        label: "ACTIVE DRAFTS",
        value: "12",
        icon: FilePenLine,
        iconClassName: "bg-[#eef1ff] text-[#6354e8]",
      },
      {
        label: "TOTAL AUTHORS",
        value: "08",
        icon: Users,
        iconClassName: "bg-[#eef8f1] text-[#5b8368]",
      },
      {
        label: "AWAITING REVIEW",
        value: "04",
        icon: ChartColumn,
        iconClassName: "bg-[#f8e8ff] text-[#cc55f7]",
      },
    ];
  }

  if (activeTab === "archived") {
    return [
      {
        label: "ARCHIVED COURSES",
        value: "09",
        icon: Archive,
        iconClassName: "bg-[#edf1f7] text-[#6d7c97]",
      },
      {
        label: "RESTORE READY",
        value: "06",
        icon: PenSquare,
        iconClassName: "bg-[#eef8f1] text-[#5b8368]",
      },
      {
        label: "LAST ARCHIVED",
        value: "Oct 24",
        icon: ChartColumn,
        iconClassName: "bg-[#f8e8ff] text-[#cc55f7]",
      },
    ];
  }

  return [
    {
      label: "ACTIVE STUDENTS",
      value: "12.5k",
      icon: Users,
      iconClassName: "bg-[#eef1ff] text-[#6354e8]",
    },
    {
      label: "TOTAL COURSES",
      value: "42",
      icon: BookOpen,
      iconClassName: "bg-[#eef8f1] text-[#5b8368]",
    },
    {
      label: "AVG. COMPLETION",
      value: "78%",
      icon: ChartColumn,
      iconClassName: "bg-[#f8e8ff] text-[#cc55f7]",
    },
  ];
}

export default function CoursesPage() {
  const { session, isHydrated } = useAuthSession();
  const [activeTab, setActiveTab] = useState<CourseTab>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  console.log("SESSION", session);
console.log("USER", session?.user);
console.log("USER ID", session?.user?.id);
console.log("ROLE", session?.role);

  useEffect(() => {
    async function loadCourses() {
      if (!isHydrated) {
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const statusFilter =
          activeTab === "all"
            ? undefined
            : activeTab === "drafts"
              ? "draft"
              : activeTab;

        const response = await getCourses(
          {
            page: 1,
            limit: 20,
            status: statusFilter,
            search: searchTerm || undefined,
          },
          session?.token
        );

        setCourses(response.courses);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Unable to load courses.");
      } finally {
        setIsLoading(false);
      }
    }
 console.log("COURSES", courses);
    loadCourses();
  }, [activeTab, isHydrated, searchTerm, session?.token]);

  const rows = courses.map(mapCourseToRow);
  const summaryCards = getSummaryCards(activeTab);
  const resultSummary = isLoading
    ? "Loading courses..."
    : `Showing ${rows.length} ${rows.length === 1 ? "course" : "courses"}`;

    console.log("rows", rows);

   

  return (
    <AppShell title="Course Management" activeSection="courses">
      <section className="flex justify-stretch sm:justify-end">
        <Link
          href="/courses/create"
          className="button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] sm:w-auto"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Create New Course
        </Link>
      </section>

      <section className="mt-8 border-b border-[#e4e8f4]">
        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "border-b-[3px] px-1 pb-3 text-[16px] font-bold transition-colors",
                  activeTab === tab.key
                    ? "border-[#0f8751] text-[#4b8a60]"
                    : "border-transparent text-[#6e7c98]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[14px] border border-[#e4ece9] bg-white shadow-[0_18px_42px_rgba(182,192,227,0.10)]">
        <div className="flex flex-col gap-4 border-b border-[#eef2f7] px-6 py-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
            Course Management Details
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#dce3f2] bg-[#fbfcff] px-4 text-[#95a0b4] sm:min-w-[360px]">
              <Search className="h-4.5 w-4.5" strokeWidth={2} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-[15px] text-[#274267] outline-none placeholder:text-[#98a2b6]"
                placeholder="Search by name, ID or course..."
              />
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#f5f7fb] px-5 text-[15px] font-semibold text-[#5d6b85]"
            >
              <Filter className="h-4.5 w-4.5" strokeWidth={2} />
              Filter
            </button>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#f5f7fb] text-[#5d6b85]"
            >
              <Download className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {fetchError ? (
          <div className="mx-6 mt-6 rounded-[14px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-4 text-[15px] text-[#a42f2f]">
            {fetchError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mx-6 mt-6 rounded-[14px] border border-[#dfe6f7] bg-[#fbfcff] px-5 py-8 text-center text-[15px] font-semibold text-[#62718a]">
            Loading courses from the backend...
          </div>
        ) : null}

        {!isLoading && !fetchError && rows.length === 0 ? (
          <div className="mx-6 mt-6 rounded-[14px] border border-dashed border-[#dceadf] bg-[#fbfcff] px-5 py-10 text-center">
            <h3 className="text-[20px] font-extrabold tracking-[-0.04em] text-[#22314c]">
              No courses found
            </h3>
            <p className="mt-2 text-[15px] text-[#71819d]">
              Create a course or adjust the current filters.
            </p>
          </div>
        ) : null}

        <div className="space-y-4 p-4 xl:hidden">
          {rows.map((row) => (
            <article key={row.id} className="rounded-[12px] border border-[#edf0f7] bg-[#fbfcff] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#8a3ffc] text-[15px] font-bold text-white">
                    UI
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                      {row.title}
                    </p>
                    <p className="mt-1 text-[14px] text-[#7f8cab]">ID: {row.code}</p>
                  </div>
                </div>
                <Link
                  href={`/courses/${row.slug}/edit`}
                  className="text-[15px] font-bold text-[#0f8751]"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-5 grid gap-3 rounded-[12px] bg-white p-4 text-[14px] text-[#61708b]">
                {activeTab === "drafts" ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Last Edited</span>
                      <span className="text-[#40516f]">{row.lastEdited}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Author</span>
                      <span className="text-[#40516f]">{row.instructor}</span>
                    </div>
                  </>
                ) : activeTab === "archived" ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Archived Date</span>
                      <span className="text-[#40516f]">{row.archivedDate}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Author</span>
                      <span className="text-[#40516f]">{row.instructor}</span>
                    </div>
                  </>
                ) : activeTab === "published" ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Category</span>
                      <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${row.categoryClassName}`}>
                        {row.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Instructor</span>
                      <span className="text-[#40516f]">{row.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Enrollment</span>
                      <span className="font-semibold text-[#40516f]">{row.students}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Category</span>
                      <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${row.categoryClassName}`}>
                        {row.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Lessons</span>
                      <span className="font-semibold text-[#40516f]">{row.lessons}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-[#8b97ad]">Student Enrolled</span>
                      <span className="font-semibold text-[#40516f]">{row.students} Students</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#8b97ad]">Status</span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-bold ${row.statusClassName}`}>
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    {row.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="overflow-x-auto">
          {activeTab === "drafts" ? (
            <table className="w-full border-separate border-spacing-0">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[16%]" />
                <col className="w-[22%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                  <th className="rounded-tl-[14px] px-8 py-5">Course Name</th>
                  <th className="px-6 py-5">Last Edited</th>
                  <th className="px-6 py-5">Author</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="rounded-tr-[14px] px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="text-[15px] text-[#6f7d98]">
                    <td className="border-b border-[#edf0f7] px-8 py-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#8a3ffc] text-[15px] font-bold text-white">
                          UI
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                            {row.title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#7f8cab]">ID: {row.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 text-[#40516f]">{row.lastEdited}</td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2e7ff] text-[15px] font-bold text-[#23314d]">
                          SM
                        </span>
                        <span className="font-semibold text-[#22314c]">{row.instructor}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${row.statusClassName}`}>
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <Link
                        href={`/courses/${row.slug}/edit`}
                        className="text-[15px] font-bold text-[#0f8751]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === "published" ? (
            <table className="w-full border-separate border-spacing-0">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[16%]" />
                <col className="w-[23%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                  <th className="rounded-tl-[14px] px-8 py-5">Course Name</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Instructor</th>
                  <th className="px-6 py-5">Enrollment</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="rounded-tr-[14px] px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="text-[15px] text-[#6f7d98]">
                    <td className="border-b border-[#edf0f7] px-8 py-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#8a3ffc] text-[15px] font-bold text-white">
                          UI
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                            {row.title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#7f8cab]">ID: {row.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex rounded-full px-4 py-1.5 text-[13px] font-bold ${row.categoryClassName}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <div className="flex items-center gap-4">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${row.instructorAvatarClassName} text-[12px] font-bold text-white`}>
                          {row.instructorInitials}
                        </span>
                        <span className="font-semibold text-[#22314c]">{row.instructor}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 font-semibold text-[#40516f]">
                      ↗ {row.students}
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${row.statusClassName}`}>
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <Link
                        href={`/courses/${row.slug}/edit`}
                        className="text-[15px] font-bold text-[#0f8751]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === "archived" ? (
            <table className="min-w-[1120px] w-full table-fixed border-separate border-spacing-0">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                  <th className="rounded-tl-[14px] px-8 py-5">Course Name</th>
                  <th className="px-6 py-5">Archived Date</th>
                  <th className="px-6 py-5">Author</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="rounded-tr-[14px] px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="text-[15px] text-[#6f7d98]">
                    <td className="border-b border-[#edf0f7] px-8 py-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#8a3ffc] text-[15px] font-bold text-white">
                          UI
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                            {row.title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#7f8cab]">ID: {row.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 text-[#40516f]">{row.archivedDate}</td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2e7ff] text-[15px] font-bold text-[#23314d]">
                          SM
                        </span>
                        <span className="font-semibold text-[#22314c]">{row.instructor}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${row.statusClassName}`}>
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <Link
                        href={`/courses/${row.slug}/edit`}
                        className="text-[15px] font-bold text-[#0f8751]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-separate border-spacing-0">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[16%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[11%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#f5f7fb] text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#70809d]">
                  <th className="rounded-tl-[14px] px-8 py-5">Course Name</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Lessons</th>
                  <th className="px-6 py-5">Student Enrolled</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="rounded-tr-[14px] px-6 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="text-[15px] text-[#6f7d98]">
                    <td className="border-b border-[#edf0f7] px-8 py-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#8a3ffc] text-[15px] font-bold text-white">
                          UI
                        </span>
                        <p className="truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                          {row.title}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex rounded-full px-4 py-1.5 text-[13px] font-bold ${row.categoryClassName}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 font-semibold text-[#5d6f8f]">{row.lessons}</td>
                    <td className="border-b border-[#edf0f7] px-6 py-7 font-semibold text-[#5d6f8f]">{row.students} Students</td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${row.statusClassName}`}>
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-[#edf0f7] px-6 py-7">
                      <Link
                        href={`/courses/${row.slug}/edit`}
                        className="text-[15px] font-bold text-[#0f8751]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-[#edf0f7] px-6 py-5 text-[15px] font-semibold text-[#6e7c98] sm:flex-row sm:items-center sm:justify-between">
          <p>{resultSummary}</p>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7]">
              ‹
            </button>
            <button className="button-primary flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0f8751] text-[15px] font-bold text-white">
              1
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">3</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#93a0b7]">…</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#22314c]">256</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#dfe4f0] text-[#93a0b7]">
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <CourseSummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconClassName={card.iconClassName}
          />
        ))}
      </section>
    </AppShell>
  );
}