import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const enrolledCourses = Array.from({ length: 5 }, (_, index) => ({
  name: "Mastering UI/UX Design",
  path: "Design Professional Path",
  progress: "85%",
  quizScore: "92/100",
  status: index % 2 === 0 ? "PENDING" : "ACTIVE",
  statusClassName:
    index % 2 === 0
      ? "bg-[#fff1d8] text-[#c88214]"
      : "bg-[#e4fae8] text-[#1b9a55]",
}));

const certificates = [
  { title: "Advanced React", meta: "2.PDF • 2.4 MB4 MB" },
  { title: "Advanced React", meta: "2.PDF • 2.4 MB4 MB" },
];

const achievements = [
  { title: "Fast Learner", emoji: "🏅" },
  { title: "7-Day Streak", emoji: "🏆" },
  { title: "7-Day Streak", emoji: "⭐" },
];

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7eafb] bg-white p-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
      <p className="text-[15px] font-medium text-[#334768]">{label}</p>
      <p className="mt-6 text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
      <p className="mt-6 text-[14px] font-medium text-[#19aa61]">{note}</p>
    </article>
  );
}

export default function StudentDetailPage() {
  return (
    <AppShell
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/students" className="text-[#223b61]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
          </Link>
          <span>Back to Students</span>
        </div>
      }
      activeSection="student"
    >
      <section className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.10)] sm:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#4355c7] text-[34px] font-extrabold text-white shadow-[inset_0_0_0_4px_rgba(255,255,255,0.1)]">
              JD
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d] sm:text-[24px]">
                  John Doe
                </h1>
                <span className="rounded-full bg-[#e4fae8] px-4 py-1.5 text-[14px] font-bold text-[#159558]">
                  Active
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-[#7d89a0]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" strokeWidth={2} />
                  Joined Jan 12, 2023
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                  john.doe@example.com
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" strokeWidth={2} />
                  john.doe@example.com
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/students/john-doe/edit"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-[10px] bg-[#edf5f1] px-10 text-[15px] font-semibold text-[#4b8a60]"
            >
              <Pencil className="h-4.5 w-4.5" strokeWidth={2.2} />
              Edit Profile
            </Link>
            <Link
              href="/students/john-doe/message"
              className="button-primary inline-flex h-14 items-center justify-center gap-3 rounded-[10px] bg-[#4b8a60] px-10 text-[15px] font-semibold text-white"
            >
              <MessageCircle className="h-4.5 w-4.5" strokeWidth={2.2} />
              Message Student
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-3">
        <StatCard label="Total Learning Time" value="124h 45m" note="↑ 12% from last month" />
        <StatCard label="Lessons Completed" value="48" note="of 62 total lessons" />
        <StatCard label="Last Login" value="Today, 09:12 AM" note="IP: 192.168.1.45" />
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.7fr_0.75fr]">
        <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.10)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Enrolled Courses
            </h2>
            <button type="button" className="text-[14px] font-bold text-[#15824d]">
              View All →
            </button>
          </div>

          <div className="mt-8 hidden grid-cols-[1.2fr_1.1fr_1fr_0.9fr_0.8fr] gap-6 text-[13px] font-bold uppercase tracking-[0.08em] text-[#8a97af] lg:grid">
            <span>Course Name</span>
            <span>Course Name</span>
            <span>Progress</span>
            <span>Quiz Score</span>
            <span>Status</span>
          </div>

          <div className="mt-4 space-y-4">
            {enrolledCourses.map((course, index) => (
              <div
                key={`${course.name}-${index}`}
                className="grid gap-4 rounded-[12px] border border-[#eef2f7] p-4 lg:grid-cols-[1.2fr_1.1fr_1fr_0.9fr_0.8fr] lg:items-center lg:rounded-none lg:border-0 lg:border-b lg:p-0 lg:py-5"
              >
                <span className="text-[16px] font-bold text-[#1b2d4b]">{course.name}</span>
                <span className="text-[16px] text-[#5c6d89]">{course.path}</span>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-full max-w-[110px] rounded-full bg-[#e6ecef]">
                    <div className="h-full w-[70%] rounded-full bg-[#0f7d49]" />
                  </div>
                  <span className="text-[16px] font-bold text-[#1b273b]">{course.progress}</span>
                </div>
                <span className="text-[16px] font-bold text-[#5c6d89]">{course.quizScore}</span>
                <span className={`inline-flex w-fit rounded-full px-4 py-2 text-[14px] font-bold ${course.statusClassName}`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-8">
          <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.10)] sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Certificates
            </h2>

            <div className="mt-8 space-y-6">
              {certificates.map((certificate, index) => (
                <div key={`${certificate.title}-${index}`} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#e6ebf7] bg-[#fffef4] text-[10px] font-bold text-[#7f8da8]">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-bold text-[#19355d]">{certificate.title}</p>
                    <p className="mt-1 text-[15px] text-[#8492aa]">{certificate.meta}</p>
                  </div>
                  <button type="button" className="text-[#5d6b85]">
                    <Download className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[14px] bg-white p-6 shadow-[0_18px_42px_rgba(182,192,227,0.10)] sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#19355d]">
              Certificates
            </h2>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title + achievement.emoji}
                  className="rounded-[12px] bg-[#f4f6ff] px-3 py-5 text-center"
                >
                  <div className="text-[42px] leading-none">{achievement.emoji}</div>
                  <p className="mt-4 text-[14px] font-semibold text-[#1b2d4b]">{achievement.title}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </AppShell>
  );
}
