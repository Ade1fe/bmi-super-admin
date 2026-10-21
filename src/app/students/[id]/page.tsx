'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Download,
  Pencil,
  MessageSquare,
  Loader2,
  ChevronRight,
} from "lucide-react";

import { getStudentProfile, Student } from "@/lib/students-api";
import { useAuthSession } from "@/lib/auth-session";
import { AppShell } from "@/components/app-shell";

function useAuthToken(): string {
  const { session } = useAuthSession();
  return session?.token ?? "";
}

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "completed";
  const label = isActive ? "COMPLETED" : "IN PROGRESS";
  return (
    <span
      style={{
        backgroundColor: isActive ? "#e6f7ef" : "#fff8ec",
        color: isActive ? "#0f8751" : "#d88314",
      }}
      className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold tracking-wide"
    >
      {label}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e4ece9]">
        <div
          className="h-full rounded-full bg-[#0f8751]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[14px] font-semibold text-[#40516f]">{value}%</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const authToken = useAuthToken();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !authToken) return;

    async function fetchStudent() {
      try {
        setLoading(true);
        const data = await getStudentProfile(studentId, authToken);
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load student profile");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [studentId, authToken]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4b8a60]" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow">
          <p className="text-red-500">{error || "Student not found"}</p>
          <Link href="/students" className="mt-4 inline-block text-green-600">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(student.user.firstName, student.user.lastName);
  const fullName = `${student.user.firstName} ${student.user.lastName}`;
  const insights = student.insights;
  const courses = insights?.courses ?? [];
  const certificates = insights?.certificates ?? [];
  const badges = insights?.badges ?? [];
  const stats = [
    {
      label: "Courses Enrolled",
      value: String(insights?.coursesEnrolled ?? 0),
      sub: "Active enrolments",
      subColor: "#6b7894",
    },
    {
      label: "Lessons Completed",
      value: String(insights?.lessonsCompleted ?? 0),
      sub: `of ${insights?.totalLessons ?? 0} total lessons`,
      subColor: "#6b7894",
    },
    {
      label: "Avg. Quiz Score",
      value:
        insights?.avgQuizScore != null ? `${insights.avgQuizScore}%` : "—",
      sub: insights?.lastActivityAt
        ? `Last activity ${formatDateTime(insights.lastActivityAt)}`
        : "No activity yet",
      subColor: "#6b7894",
    },
  ];

  return (
       <AppShell title="Individual Students" activeSection="student">
         <div className="min-h-screen bg-[#f5f7fb] p-6">
      <div className="mx-auto">

        {/* Back nav */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#182c4e] hover:text-[#0f8751] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
            Back to Students
          </Link>
        </div>

        {/* Profile hero card */}
        <div className="bg-white rounded-[16px] shadow-[0_8px_30px_rgba(182,192,227,0.12)] p-6 mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: avatar + info */}
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-[22px] font-extrabold text-white shadow-[0_8px_24px_rgba(75,138,96,0.3)]"
                style={{ background: "linear-gradient(135deg, #4b8a60 0%, #0f8751 100%)" }}
              >
                {initials}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#182c4e]">
                    {fullName}
                  </h1>
                <span
  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold ${
    student.user.isActive !== false
      ? "bg-[#e6f7ef] text-[#0f8751]"
      : "bg-[#f0f3f9] text-[#76839b]"
  }`}
>
  <span
    className={`h-1.5 w-1.5 rounded-full ${
      student.user.isActive !== false ? "bg-[#0f8751]" : "bg-[#76839b]"
    }`}
  />
  {student.user.isActive !== false ? "Active" : "Inactive"}
</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] text-[#7f8cab]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" strokeWidth={1.8} />
                    Joined {formatDate(student.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" strokeWidth={1.8} />
                    {student.user.email}
                  </span>
<span className="flex items-center gap-1.5">
  <MapPin className="h-4 w-4" strokeWidth={1.8} />
  {student.school?.name ?? "—"}
</span>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-[#dce3f2] bg-white px-5 text-[15px] font-semibold text-[#3e5172] shadow-[0_2px_8px_rgba(182,192,227,0.10)] hover:bg-[#f5f7fb] transition-colors"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
                Edit Profile
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#0f8751] px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(15,135,81,0.22)] hover:bg-[#0a7244] transition-colors"
              >
                <MessageSquare className="h-4 w-4" strokeWidth={2} />
                Message Student
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[16px] bg-white p-6 shadow-[0_8px_30px_rgba(182,192,227,0.10)]"
            >
              <p className="text-[14px] font-medium text-[#7f8cab]">{stat.label}</p>
              <p className="mt-3 text-[30px] font-extrabold tracking-[-0.05em] text-[#182c4e]">
                {stat.value}
              </p>
              <p className="mt-2 text-[13px] font-semibold" style={{ color: stat.subColor }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom two-column layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">

          {/* Enrolled Courses table */}
          <div className="rounded-[16px] bg-white shadow-[0_8px_30px_rgba(182,192,227,0.10)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#edf0f7] px-6 py-5">
              <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                Enrolled Courses
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#0f8751] hover:underline"
              >
                View All <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#f5f7fb] text-left text-[12px] font-bold uppercase tracking-[0.07em] text-[#7f8cab]">
                    <th className="px-6 py-4">Course Name</th>
                    <th className="px-6 py-4">Lessons</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Quiz Score</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-[14px] text-[#7f8cab]">
                        This student is not enrolled in any courses yet.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.courseId} className="border-b border-[#f0f3f9] last:border-0">
                        <td className="px-6 py-4 text-[14px] font-semibold text-[#182c4e]">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#6b7894]">
                          {course.completedLessons}/{course.totalLessons}
                        </td>
                        <td className="px-6 py-4">
                          <ProgressBar value={course.progress} />
                        </td>
                        <td className="px-6 py-4 text-[14px] font-semibold text-[#182c4e]">
                          {course.quizAverage != null ? `${course.quizAverage}%` : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={course.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Certificates (PDF list) */}
            <div className="rounded-[16px] bg-white shadow-[0_8px_30px_rgba(182,192,227,0.10)] p-6">
              <h2 className="mb-4 text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                Certificates
              </h2>
              <div className="flex flex-col gap-3">
                {certificates.length === 0 ? (
                  <p className="text-[14px] text-[#7f8cab]">No certificates yet.</p>
                ) : (
                  certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between rounded-[10px] bg-[#f5f7fb] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e8edf5]">
                          <BookOpen className="h-5 w-5 text-[#5a6986]" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#182c4e]">{cert.courseName}</p>
                          <p className="text-[12px] capitalize text-[#8b97ad]">
                            {cert.status} • {formatDate(cert.date)}
                          </p>
                        </div>
                      </div>
                      {cert.certificateUrl ? (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#7f8cab] shadow-[0_2px_6px_rgba(182,192,227,0.18)] hover:text-[#0f8751] transition-colors"
                        >
                          <Download className="h-4 w-4" strokeWidth={2} />
                        </a>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="rounded-[16px] bg-white shadow-[0_8px_30px_rgba(182,192,227,0.10)] p-6">
              <h2 className="mb-4 text-[18px] font-extrabold tracking-[-0.03em] text-[#182c4e]">
                Badges
              </h2>
              <div className="flex gap-4 flex-wrap">
                {badges.length === 0 ? (
                  <p className="text-[14px] text-[#7f8cab]">No badges earned yet.</p>
                ) : (
                  badges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f5f7fb] shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                        {badge.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={badge.imageUrl} alt={badge.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[28px]">🏅</span>
                        )}
                      </div>
                      <p className="text-[12px] font-semibold text-[#6b7894] text-center leading-tight">
                        {badge.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
         </AppShell>
   
  );
}