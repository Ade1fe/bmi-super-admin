import { AppShell } from "@/components/app-shell";
import { CoursePageTitle } from "@/components/course-flow";

export default function LoadingCourseEditPage() {
  return (
    <AppShell
      title={<CoursePageTitle label="Edit Course" backHref="/courses" />}
      activeSection="courses"
    >
      <div className="mx-auto max-w-[1320px] animate-pulse">
        <div className="h-12 w-80 rounded-2xl bg-[#e8edf7]" />
        <div className="mt-4 h-6 w-96 rounded-2xl bg-[#eef2f9]" />

        <div className="mt-12 space-y-6">
          <div className="h-56 rounded-[24px] bg-[#eef1fb]" />
          <div className="h-56 rounded-[24px] bg-[#eef1fb]" />
          <div className="h-56 rounded-[24px] bg-[#eef1fb]" />
        </div>
      </div>
    </AppShell>
  );
}
