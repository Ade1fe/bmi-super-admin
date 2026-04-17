import {
  CalendarDays,
  CircleAlert,
  Lightbulb,
  Save,
  Settings2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CoursePageTitle } from "@/components/course-flow";

type DetailMetric = {
  label: string;
  value: string;
  helper?: string;
  delta?: string;
  tone?: "positive" | "neutral";
  accent?: boolean;
};

type LessonRow = {
  id: string;
  title: string;
  subtitle: string;
  views: string;
  avgTime: string;
  quizSuccess: string;
  critical?: boolean;
};

type SidebarCard = {
  title: string;
  description: string;
};

const detailMetrics: DetailMetric[] = [
  {
    label: "TOTAL ENROLLMENT",
    value: "140",
    delta: "12%",
    tone: "positive",
  },
  {
    label: "COURSE COMPLETION",
    value: "88.4%",
    delta: "4%",
    tone: "positive",
  },
  {
    label: "AVG. GRADE",
    value: "3.8",
    helper: "/ 4.0",
    tone: "neutral",
  },
  {
    label: "REVENUE IMPACT",
    value: "$42.8k",
    helper: "NET PERFORMANCE INDEX",
    accent: true,
  },
];

const lessons: LessonRow[] = [
  {
    id: "01",
    title: "Market Validation",
    subtitle: "Module Foundations",
    views: "4,201",
    avgTime: "14m 20s",
    quizSuccess: "85%",
  },
  {
    id: "01",
    title: "Market Validation",
    subtitle: "Module Foundations",
    views: "4,201",
    avgTime: "14m 20s",
    quizSuccess: "45% (Critical)",
    critical: true,
  },
  {
    id: "01",
    title: "Market Validation",
    subtitle: "Module Foundations",
    views: "4,201",
    avgTime: "14m 20s",
    quizSuccess: "85%",
  },
  {
    id: "01",
    title: "Market Validation",
    subtitle: "Module Foundations",
    views: "4,201",
    avgTime: "14m 20s",
    quizSuccess: "85%",
  },
];

const bottleneckAlerts: SidebarCard[] = [
  {
    title: "Quiz Fatigue Detected",
    description: "Lesson 03 has a 55% dropout rate at Question 7. Review difficulty curve.",
  },
  {
    title: "Low Mobile Engagement",
    description:
      "82% of mobile users fail to complete the 'Financial Forecasting' interactive tool.",
  },
];

const growthInsights = [
  "Top 5% of students are using the 'Community Forum' 4x more than average.",
  "Videos under 15 mins have 2.5x higher completion rates in this category.",
];

function DetailMetricCard({ metric }: { metric: DetailMetric }) {
  return (
    <article className="rounded-[20px] border border-[#dfe6f7] bg-white px-6 py-6">
      <p
        className={`text-[15px] font-medium uppercase tracking-[0.06em] ${
          metric.accent ? "text-[#536bf0]" : "text-[#1e3b63]"
        }`}
      >
        {metric.label}
      </p>
      <div className="mt-10 flex items-end gap-3">
        <p className="text-[46px] font-extrabold tracking-[-0.06em] text-[#173257]">
          {metric.value}
        </p>
        {metric.helper && !metric.accent ? (
          <span className="pb-2 text-[18px] font-semibold text-[#233a5f]">{metric.helper}</span>
        ) : null}
        {metric.delta ? (
          <span className="inline-flex items-center rounded-full bg-[#e9f8ef] px-3 py-2 text-[15px] font-bold text-[#13a166]">
            +{metric.delta}
          </span>
        ) : null}
      </div>
      {metric.accent ? (
        <p className="mt-3 text-[14px] font-medium uppercase tracking-[0.04em] text-[#293957]">
          {metric.helper}
        </p>
      ) : null}
    </article>
  );
}

function QuizProgress({ critical }: { critical?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-2.5 w-[104px] overflow-hidden rounded-full bg-[#f1f3f6]">
        <div
          className={critical ? "h-full w-[45%] rounded-full bg-[#ff4747]" : "h-full w-[85%] rounded-full bg-[#0b8a5b]"}
        />
      </div>
    </div>
  );
}

export default function EntrepreneurshipAnalyticsDetailPage() {
  return (
    <AppShell
      title={<CoursePageTitle label="Content Performance Analytics" backHref="/analytics" />}
      activeSection="analytics"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="mx-auto max-w-[1280px]">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[40px] font-extrabold tracking-[-0.06em] text-[#173257]">
              Entrepreneurship Fundamentals
            </h1>
            <p className="mt-3 text-[18px] text-[#455d82]">
              Enter the basic information and structure for your new course.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-[12px] border border-[#cfe0d7] bg-[#edf5f1] px-7 text-[16px] font-semibold text-[#4b8a60]"
            >
              <Settings2 className="h-5 w-5" strokeWidth={2} />
              Modules Setting
            </button>
            <button
              type="button"
              className="button-primary inline-flex h-14 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-7 text-[16px] font-semibold"
            >
              <Save className="h-5 w-5" strokeWidth={2} />
              Save as Draft
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-4 xl:grid-cols-4">
          {detailMetrics.map((metric) => (
            <DetailMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_380px]">
          <article className="rounded-[24px] bg-white px-6 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)] sm:px-8 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <h2 className="text-[24px] font-extrabold tracking-[-0.05em] text-[#173257]">
                Lesson Engagement
              </h2>

              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[14px] font-semibold text-[#2b4568]"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={2} />
                Last 30 days
              </button>
            </div>

            <div className="mt-8 overflow-hidden rounded-[20px] border border-[#e6edf7]">
              <div className="grid grid-cols-[minmax(240px,1.4fr)_0.8fr_0.8fr_1fr] gap-4 bg-[#fbfcff] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a98ae]">
                <span>Lesson Name</span>
                <span className="text-center">Views</span>
                <span className="text-center">Avg. Time</span>
                <span>Quiz Success</span>
              </div>

              {lessons.map((lesson, index) => (
                <div
                  key={`${lesson.title}-${index}`}
                  className={`grid grid-cols-1 gap-5 border-t border-[#e6edf7] px-6 py-6 lg:grid-cols-[minmax(240px,1.4fr)_0.8fr_0.8fr_1fr] lg:items-center ${
                    index === 0 ? "border-t-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#6d45ff_0%,#9e42ff_100%)] text-[17px] font-bold text-white">
                      {lesson.id}
                    </div>
                    <div>
                      <p className="text-[18px] font-extrabold tracking-[-0.04em] text-[#1e314f]">
                        {lesson.title}
                      </p>
                      <p className="mt-1 text-[15px] font-medium text-[#73819a]">{lesson.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-[16px] font-bold text-[#4a5b77] lg:text-center">{lesson.views}</p>
                  <p className="text-[16px] font-medium text-[#677790] lg:text-center">{lesson.avgTime}</p>
                  <div className="flex items-center gap-4">
                    <QuizProgress critical={lesson.critical} />
                    <span
                      className={`text-[16px] font-bold ${
                        lesson.critical ? "text-[#ff4747]" : "text-[#223552]"
                      }`}
                    >
                      {lesson.quizSuccess}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-8">
            <article className="rounded-[24px] bg-white px-6 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex items-center gap-3">
                <CircleAlert className="h-7 w-7 text-[#ff4a4a]" strokeWidth={2.1} />
                <h2 className="text-[22px] font-extrabold tracking-[-0.05em] text-[#ff4a4a]">
                  Bottle Neck Alerts
                </h2>
              </div>

              <div className="mt-6 space-y-6">
                {bottleneckAlerts.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[18px] border border-[#ffd8d8] bg-[#fff4f4] px-5 py-4"
                  >
                    <p className="text-[18px] font-extrabold tracking-[-0.04em] text-[#243450]">
                      {card.title}
                    </p>
                    <p className="mt-3 text-[15px] leading-8 text-[#75839c]">{card.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[24px] border border-[#dbe5ff] bg-white px-6 py-6 shadow-[0_18px_42px_rgba(182,192,227,0.08)]">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-7 w-7 text-[#536bf0]" strokeWidth={2.1} />
                <h2 className="text-[22px] font-extrabold tracking-[-0.05em] text-[#536bf0]">
                  Growth Insight
                </h2>
              </div>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-[#6d7e9a]">
                {growthInsights.map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-[11px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#536bf0]" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
