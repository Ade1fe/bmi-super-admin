import { Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseActionLink,
  CourseFlowStepper,
  CoursePageTitle,
  CourseSelectField,
  CourseTextArea,
  CourseTextField,
} from "@/components/course-flow";

export default function CreateCoursePage() {
  return (
    <AppShell title={<CoursePageTitle label="Create New Course" />} activeSection="courses">
      <div className="mx-auto max-w-[1320px]">
        <CourseFlowStepper currentStep={1} />

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
            <CourseActionLink href="/courses" variant="secondary" className="min-w-[190px]">
              Save as Draft
            </CourseActionLink>
            <CourseActionLink
              href="/courses/create/content-upload"
              className="min-w-[234px] justify-between px-7"
            >
              <span>Save &amp; Continue</span>
              <ContinueArrow />
            </CourseActionLink>
          </div>
        </div>

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_45px_rgba(169,183,217,0.10)] sm:p-10">
            <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#182f53]">
              General Information
            </h2>

            <div className="mt-10 grid gap-7 md:grid-cols-2">
              <CourseTextField
                label="Course Title"
                placeholder="e.g. Advanced UI Design Patterns"
                fullWidth
              />
              <CourseSelectField
                label="Category"
                defaultValue="Product Design"
                options={["Product Design", "Development", "Business", "Data Science"]}
              />
              <CourseSelectField
                label="Difficulty Level"
                defaultValue="Beginner"
                options={["Beginner", "Intermediate", "Advanced"]}
              />
              <div className="md:col-span-2">
                <CourseTextArea
                  label="Course Description"
                  placeholder="Describe what students will learn..."
                  rows={8}
                />
              </div>
            </div>
          </article>

          <aside className="rounded-[28px] bg-[#f4f6ff] p-6 shadow-[0_20px_45px_rgba(169,183,217,0.10)]">
            <div className="rounded-[24px] bg-white p-6">
              <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                Course Thumbnail
              </h2>

              <label className="mt-8 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#bfe6d2] bg-[#f1fdf6] px-6 text-center">
                <Upload className="h-12 w-12 text-[#0f8751]" strokeWidth={2.2} />
                <span className="mt-5 text-[18px] font-semibold text-[#41597c]">
                  Click to upload or drag and drop
                </span>
                <span className="mt-2 text-[16px] text-[#72829a]">JPG, PNG (Max 5MB)</span>
              </label>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#f0deab] bg-[#fff9ea] p-6">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1bf] text-[18px] font-bold text-[#be7a00]">
                  !
                </span>
                <div>
                  <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#9a6504]">
                    Tip
                  </p>
                  <p className="mt-3 text-[18px] leading-8 text-[#a16b09]">
                    A clear course name and logical module structure increases student enrollment
                    by 40%.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
