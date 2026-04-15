import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BookCopy,
  Building2,
  CalendarDays,
  ChevronRight,
  Code2,
  Mail,
  Pencil,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const overviewStats = [
  { label: "TOTAL STUDENTS", value: "1240", delta: "+12%", progress: 74 },
  { label: "ACTIVE STUDENTS", value: "958", delta: "+5%", progress: 76 },
  { label: "COURSE COMPLETION", value: "78%", delta: "+3%", progress: 75 },
  { label: "LEARNING ACTIVITY", value: "High", delta: "peak", progress: 78 },
];

const assignedCourses = [
  {
    name: "Computer Science 101",
    detail: "12 Modules • 450 Students Enrolled",
    tag: "Core",
    tagClassName: "bg-[#e7f8f1] text-[#19835b]",
    icon: <Code2 className="h-5 w-5" strokeWidth={2} />,
    iconClassName: "bg-[#eef1ff] text-[#6b6dff]",
  },
  {
    name: "Advanced Mathematics",
    detail: "8 Modules • 320 Students Enrolled",
    tag: "Elective",
    tagClassName: "bg-[#e8f0ff] text-[#3d70ff]",
    icon: <BookCopy className="h-5 w-5" strokeWidth={2} />,
    iconClassName: "bg-[#fff2e3] text-[#f0a440]",
  },
  {
    name: "English Literature",
    detail: "15 Modules • 580 Students Enrolled",
    tag: "Core",
    tagClassName: "bg-[#e7f8f1] text-[#19835b]",
    icon: <BadgeCheck className="h-5 w-5" strokeWidth={2} />,
    iconClassName: "bg-[#fff0f3] text-[#c81d3d]",
  },
  {
    name: "Government Studies",
    detail: "12 Modules • 450 Students Enrolled",
    tag: "Core",
    tagClassName: "bg-[#e7f8f1] text-[#19835b]",
    icon: <Building2 className="h-5 w-5" strokeWidth={2} />,
    iconClassName: "bg-[#eef4ff] text-[#3c6cff]",
  },
];

const topStudents = Array.from({ length: 6 }, (_, index) => ({
  name: "Sarah Jenkins",
  progress: "85%",
  grade: "A+ (98%)",
  colorClassName: [
    "from-[#2d2ad3] via-[#b83fd8] to-[#1ea7ff]",
    "from-[#4c7dff] via-[#7f39fb] to-[#ff5d85]",
    "from-[#1838d8] via-[#ca2be1] to-[#11c1a8]",
  ][index % 3],
}));

const learningBars = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 47 },
  { day: "Wed", value: 79, highlight: true },
  { day: "Thu", value: 40 },
  { day: "Fri", value: 61 },
  { day: "Sat", value: 24 },
  { day: "Sun", value: 66 },
];

function OverviewCard({
  label,
  value,
  delta,
  progress,
}: {
  label: string;
  value: string;
  delta: string;
  progress: number;
}) {
  return (
    <article className="rounded-[14px] border border-[#e5e9f7] bg-white p-7 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
      <p className="text-[15px] font-medium uppercase text-[#243c63]">{label}</p>
      <div className="mt-6 flex items-end gap-4">
        <p className="text-[36px] font-extrabold tracking-[-0.05em] text-[#17345d]">{value}</p>
        <span className="pb-2 text-[14px] font-bold text-[#1dc46d]">{delta}</span>
      </div>
      <div className="mt-7 h-2 rounded-full bg-[#e1edeb]">
        <div
          className="h-full rounded-full bg-[#157c4a]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}

export default function SchoolDetailPage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/schools" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Greenfield Schools</span>
        </div>
      }
      activeSection="schools"
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {overviewStats.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            progress={item.progress}
          />
        ))}
      </section>

      <section className="mt-8 rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#5a7b35] text-center text-white shadow-[inset_0_0_0_4px_rgba(255,255,255,0.1)] sm:h-28 sm:w-28">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.18em]">GREENFIELD</p>
                <p className="text-[9px] opacity-80">School Hub</p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
                Greenfield School
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-[#7d89a0]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" strokeWidth={2} />
                  Joined Jan 12, 2023
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                  amara.okafor@school.edu
                </span>
              </div>
              <p className="mt-2 inline-flex items-center gap-2 text-[15px] font-bold text-[#3250ff]">
                <BadgeCheck className="h-4 w-4" strokeWidth={2.2} />
                Active Entity
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/schools/greenfield-schools/edit-profile"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-[10px] bg-[#edf5f1] px-9 text-[15px] font-semibold text-[#4b8a60] sm:w-auto"
            >
              <Pencil className="h-4 w-4" strokeWidth={2.2} />
              Edit Profile
            </Link>
            <Link
              href="/schools/greenfield-schools/add-students"
              className="button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-9 text-[15px] font-semibold text-white sm:w-auto"
            >
              <Plus className="h-5 w-5" strokeWidth={2.4} />
              Add New Students
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.7fr_0.95fr]">
        <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Assigned Courses
            </h3>
            <button type="button" className="text-[14px] font-bold text-[#4d63e9]">
              View All
            </button>
          </div>

          <div className="mt-8 space-y-7">
            {assignedCourses.map((course) => (
              <div key={course.name} className="flex flex-wrap items-center gap-4">
                <div className={`rounded-full p-4 ${course.iconClassName}`}>{course.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold text-[#18345c]">{course.name}</p>
                  <p className="mt-1 text-[15px] text-[#596883]">{course.detail}</p>
                </div>
                <span className={`rounded-lg px-4 py-2 text-[14px] font-bold ${course.tagClassName}`}>
                  {course.tag}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[14px] bg-[#0f6f38] p-7 text-white shadow-[0_18px_42px_rgba(17,101,58,0.22)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[16px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Current Plan
            </p>
            <div className="rounded-[12px] bg-white/14 p-4">
              <BadgeCheck className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>

          <h3 className="mt-10 text-[22px] font-extrabold tracking-[-0.04em]">
            Premium Enterprise
          </h3>

          <dl className="mt-10 space-y-6 text-[17px] sm:mt-14 sm:text-[19px]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-white/78">Status:</dt>
              <dd className="font-bold">● Active</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-white/78">Expires:</dt>
              <dd className="font-bold">Dec 31, 2024</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-white/78">Auto-renew:</dt>
              <dd className="font-bold">On</dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-12 flex h-16 w-full items-center justify-center rounded-[12px] bg-white text-[18px] font-bold text-[#0f7d49]"
          >
            Manage Subscription
          </button>
        </article>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_1.1fr]">
        <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Top Students
            </h3>
            <button type="button" className="text-[14px] font-bold text-[#4d63e9]">
              See Rankings
            </button>
          </div>

          <div className="mt-9 hidden grid-cols-[1.4fr_1.2fr_0.9fr] gap-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#8a97af] sm:grid">
            <span>Students</span>
            <span>Progress</span>
            <span>Average Grade %</span>
          </div>

          <div className="mt-4 space-y-6">
            {topStudents.map((student, index) => (
              <div
                key={`${student.name}-${index}`}
                className="grid gap-4 sm:grid-cols-[1.4fr_1.2fr_0.9fr] sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${student.colorClassName} text-[13px] font-bold text-white`}
                  >
                    SJ
                  </div>
                  <span className="text-[17px] font-bold text-[#18345c]">{student.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-2 w-full max-w-[120px] rounded-full bg-[#e6ecef]">
                    <div className="h-full w-[72%] rounded-full bg-[#0f7d49]" />
                  </div>
                  <span className="text-[17px] font-bold text-[#1b273b]">{student.progress}</span>
                </div>

                <span className="text-[16px] font-bold text-[#0c8e4f]">{student.grade}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.12)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Learning Activity
            </h3>
            <button type="button" className="text-[#15824d]">
              <ChevronRight className="h-5 w-5" strokeWidth={2.3} />
            </button>
          </div>

          <div className="mt-10 grid h-[290px] grid-cols-7 items-end gap-4 sm:gap-6">
            {learningBars.map((bar) => (
              <div key={bar.day} className="flex h-full flex-col items-center justify-end gap-4">
                <div className="flex h-full w-full items-end">
                  <div
                    className={[
                      "w-full rounded-t-[8px] bg-[#c9ded8]",
                      bar.highlight ? "bg-[#0f7d49]" : "",
                      bar.day === "Sun" ? "bg-[#79b69d]" : "",
                    ].join(" ")}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="text-[14px] font-medium text-[#8a97af]">{bar.day}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[15px] italic text-[#6f7f99]">
            Learning peaks on Wednesdays with 2,450+ total interactions.
          </p>
        </article>
      </section>
    </AppShell>
  );
}
