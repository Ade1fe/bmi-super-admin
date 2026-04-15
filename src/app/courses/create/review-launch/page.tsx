import { Check, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseActionLink,
  CourseFlowStepper,
  CoursePageTitle,
} from "@/components/course-flow";

const checklist = [
  "Course title, category, and thumbnail are ready.",
  "Module delivery settings are configured.",
  "Lesson types include video, reading, and quiz content.",
  "Review status is still in draft until you launch.",
];

const launchCards = [
  {
    title: "Learner Access",
    detail: "Visible to enrolled students immediately after publication.",
    icon: Globe,
  },
  {
    title: "Compliance Check",
    detail: "Certificates and grading rules remain attached to the published version.",
    icon: ShieldCheck,
  },
  {
    title: "Growth Signal",
    detail: "Drip schedule and module sequencing improve course completion rate.",
    icon: Sparkles,
  },
];

export default function ReviewAndLaunchPage() {
  return (
    <AppShell title={<CoursePageTitle label="Create New Course" />} activeSection="courses">
      <div className="mx-auto max-w-[1320px]">
        <CourseFlowStepper currentStep={3} />

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[42px]">
              Review &amp; Launch
            </h1>
            <p className="mt-3 max-w-[760px] text-[18px] leading-8 text-[#465b7d]">
              Confirm the structure, learner experience, and release settings before publishing.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <CourseActionLink
              href="/courses/create/content-upload?configured=1"
              variant="secondary"
              className="min-w-[200px]"
            >
              Back to Content
            </CourseActionLink>
            <CourseActionLink href="/courses" className="min-w-[204px] justify-between px-7">
              <span>Launch Course</span>
              <ContinueArrow />
            </CourseActionLink>
          </div>
        </div>

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[28px] bg-white p-8 shadow-[0_20px_45px_rgba(169,183,217,0.10)] sm:p-10">
            <div className="flex flex-col gap-8 border-b border-[#e8edf7] pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-[#0f8751]">
                  Course Summary
                </p>
                <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.05em] text-[#182f53]">
                  Advanced React &amp; Node.js
                </h2>
                <p className="mt-4 max-w-[680px] text-[18px] leading-8 text-[#63748e]">
                  A production-focused curriculum covering architecture decisions, platform
                  fundamentals, state management, and applied knowledge checks.
                </p>
              </div>

              <div className="rounded-[22px] bg-[#f4f8f5] px-5 py-4">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#4b8a60]">
                  Status
                </p>
                <p className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                  Draft Ready
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#e6ebf7] bg-[#fbfcff] p-6">
                <p className="text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  Course Configuration
                </p>
                <dl className="mt-5 space-y-4 text-[17px] text-[#5d6f8f]">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Category</dt>
                    <dd className="font-semibold text-[#22314c]">Development</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Difficulty</dt>
                    <dd className="font-semibold text-[#22314c]">Beginner</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Modules</dt>
                    <dd className="font-semibold text-[#22314c]">3</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Estimated Duration</dt>
                    <dd className="font-semibold text-[#22314c]">45 mins</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[22px] border border-[#e6ebf7] bg-[#fbfcff] p-6">
                <p className="text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  Delivery Rules
                </p>
                <dl className="mt-5 space-y-4 text-[17px] text-[#5d6f8f]">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Module Prerequisite</dt>
                    <dd className="font-semibold text-[#22314c]">Module 03 required</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Drip Release</dt>
                    <dd className="font-semibold text-[#22314c]">Enabled</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Release Interval</dt>
                    <dd className="font-semibold text-[#22314c]">7 days</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Launch Date</dt>
                    <dd className="font-semibold text-[#22314c]">October 24, 2024</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 rounded-[22px] border border-[#dfe6f7] bg-[#f8fafc] p-6">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                Launch Checklist
              </p>
              <div className="mt-5 space-y-4">
                {checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#0f8751] text-white">
                      <Check className="h-4 w-4" strokeWidth={2.6} />
                    </span>
                    <p className="text-[17px] leading-7 text-[#4f627f]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <article className="rounded-[28px] bg-white p-6 shadow-[0_20px_45px_rgba(169,183,217,0.10)]">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                Preview Card
              </p>
              <div className="mt-5 rounded-[24px] bg-[linear-gradient(135deg,#203a61,#4b8a60)] p-6 text-white">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white/70">
                  Beginner Series
                </p>
                <h3 className="mt-3 text-[30px] font-extrabold tracking-[-0.05em]">
                  Advanced React &amp; Node.js
                </h3>
                <p className="mt-4 text-[16px] leading-7 text-white/80">
                  3 modules • 45 mins • video, reading, and quiz content.
                </p>
              </div>
            </article>

            {launchCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[24px] border border-[#dfe6f7] bg-[#fbfcff] p-6 shadow-[0_18px_38px_rgba(180,193,229,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef3ff] text-[#5168e2]">
                      <Icon className="h-6 w-6" strokeWidth={2.1} />
                    </span>
                    <div>
                      <h3 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#22314c]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[16px] leading-7 text-[#677892]">{card.detail}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
