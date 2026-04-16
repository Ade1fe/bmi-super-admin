import {
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lock,
  Maximize,
  Play,
  Search,
  Settings2,
  User,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseActionLink,
  CourseFlowStepper,
  CoursePageTitle,
} from "@/components/course-flow";

type PreviewModule = {
  title: string;
  duration: string;
  locked?: boolean;
  active?: boolean;
  expanded?: boolean;
};

const previewModules: PreviewModule[] = [
  { title: "Module 1: Foundations", duration: "2h 0 mins" },
  { title: "Module 2: Advanced UI Co...", duration: "2h 0 mins" },
  { title: "Module 3: Advanced UI Co...", duration: "2h 0 mins", active: true, expanded: true },
  { title: "Module 4: Advanced UI Co...", duration: "2h 0 mins", locked: true },
  { title: "Module 5: Advanced UI Co...", duration: "2h 0 mins", locked: true },
];

const currentLessons = [
  { label: "1. Intro to useState", time: "12:10" },
  { label: "2. State Management Rules", time: "12:10" },
  { label: "3. Market Research Basics", time: "Current", current: true },
];

const learnerTakeaways = [
  "Understanding the component lifecycle in functional components.",
  "Mastering the dependency array to control execution frequency.",
  "Best practices for fetching API data and managing state updates.",
];

function PreviewShell() {
  return (
    <div className="mt-10 rounded-[24px] bg-[#2f2d2d] p-6 shadow-[0_30px_70px_rgba(22,31,52,0.18)] sm:p-10 lg:p-14">
      <div className="mx-auto overflow-x-auto rounded-[2px] bg-white">
        <div className="min-w-[1080px] bg-[#f6f8fd]">
          <div className="grid min-h-[760px] grid-cols-[178px_minmax(0,1fr)]">
            <aside className="border-r border-[#e3e9f5] bg-[#fbfffe]">
              <div className="h-[70px] border-b border-[#e3e9f5]" />

              <div className="px-4 py-5">
                <nav className="space-y-2">
                  {[
                    { label: "Dashboard", icon: BookOpen, active: false },
                    { label: "Courses", icon: BookOpen, active: true },
                    { label: "Certificates", icon: CheckCircle2, active: false },
                    { label: "Achievements", icon: CheckCircle2, active: false },
                    { label: "Profile", icon: User, active: false },
                    { label: "Notification", icon: Bell, active: false },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className={[
                          "flex h-9 items-center gap-3 rounded-[8px] px-3 text-[12px] font-medium",
                          item.active ? "bg-[#4b8a60] text-white" : "text-[#4d5c74]",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <section className="flex min-w-0 flex-col">
              <header className="flex h-[70px] items-center justify-between border-b border-[#e3e9f5] bg-white px-6">
                <h2 className="text-[16px] font-extrabold tracking-[-0.04em] text-[#16345d]">
                  Courses
                </h2>

                <div className="flex items-center gap-5">
                  <label className="flex h-10 w-[360px] items-center gap-3 rounded-[10px] bg-[#f3f6fb] px-4 text-[#95a0b4]">
                    <Search className="h-4 w-4" strokeWidth={2} />
                    <input
                      readOnly
                      value="Search students, courses or reports..."
                      className="w-full bg-transparent text-[12px] text-[#98a2b6] outline-none"
                    />
                  </label>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f8fafc] text-[#6e7688]"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" strokeWidth={2} />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d83d56] text-white">
                      <span className="text-[12px] font-bold">SA</span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1c3150]">Seun Ajibare</span>
                  </div>
                </div>
              </header>

              <div className="grid flex-1 grid-cols-[minmax(0,1fr)_290px] gap-4 p-5">
                <div className="rounded-[18px] bg-white p-4">
                  <div className="flex items-center gap-4 text-[12px] font-semibold">
                    <h3 className="text-[14px] font-extrabold tracking-[-0.03em] text-[#16345d]">
                      Market Research Basics
                    </h3>
                    <span className="uppercase tracking-[0.12em] text-[#58697f]">Module 3</span>
                    <span className="text-[#0f8751]">Lesson 4</span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[18px] border border-[#0d281b] bg-[radial-gradient(circle_at_20%_20%,rgba(39,92,63,0.24),transparent_22%),radial-gradient(circle_at_76%_28%,rgba(16,84,48,0.30),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(24,103,61,0.24),transparent_18%),linear-gradient(180deg,#07150e,#04110b)]">
                    <div className="flex h-[420px] items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f8751] text-white shadow-[0_18px_30px_rgba(15,135,81,0.25)]">
                        <Play className="ml-1 h-7 w-7 fill-current" strokeWidth={2.1} />
                      </div>
                    </div>

                    <div className="bg-black/70 px-4 py-3">
                      <div className="h-[4px] rounded-full bg-white/20">
                        <div className="h-full w-[46%] rounded-full bg-[#0f8751]" />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <Play className="h-4 w-4 fill-current" strokeWidth={2} />
                          <Volume2 className="h-4 w-4" strokeWidth={2} />
                          <span className="text-[12px] font-medium">12:45 / 28:30</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings2 className="h-4 w-4" strokeWidth={2} />
                          <Maximize className="h-4 w-4" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-b border-[#e5ebf6]">
                    <div className="flex gap-8 px-4">
                      {["Description", "Transcript", "Materials (4)", "Discussion"].map(
                        (label, index) => (
                          <div
                            key={label}
                            className={[
                              "border-b-2 pb-3 text-[12px] font-semibold",
                              index === 0
                                ? "border-[#0f8751] text-[#0f8751]"
                                : "border-transparent text-[#63748e]",
                            ].join(" ")}
                          >
                            {label}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-5">
                    <p className="max-w-[620px] text-[12px] leading-6 text-[#61758f]">
                      In this lesson, we explore the useEffect hook in depth. We&apos;ll cover
                      synchronization with external systems, handling cleanup functions to prevent
                      memory leaks, and the nuances of the dependency array.
                    </p>

                    <h4 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                      What you&apos;ll learn
                    </h4>

                    <div className="mt-4 space-y-3">
                      {learnerTakeaways.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="mt-1 text-[#0f8751]">
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </span>
                          <p className="max-w-[620px] text-[13px] leading-6 text-[#61758f]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#d4e5da] bg-[#eef6f1] text-[12px] font-semibold text-[#4b8a60]"
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.1} />
                      Mark Complete
                    </button>
                    <button
                      type="button"
                      className="button-primary flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#4b8a60] text-[12px] font-semibold text-white"
                    >
                      Next Lesson
                      <ChevronRight className="h-4 w-4" strokeWidth={2.1} />
                    </button>
                  </div>

                  <div className="rounded-[18px] bg-white p-4">
                    <h4 className="text-[18px] font-extrabold tracking-[-0.04em] text-[#182f53]">
                      Course Content
                    </h4>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[12px] font-semibold text-[#5f7088]">
                        <span>Your Progress</span>
                        <span className="text-[#0f8751]">45%</span>
                      </div>
                      <div className="mt-2 h-[6px] rounded-full bg-[#d9e4f1]">
                        <div className="h-full w-[45%] rounded-full bg-[#0f8751]" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {previewModules.map((module) => (
                        <div
                          key={module.title}
                          className={[
                            "overflow-hidden rounded-[14px] border",
                            module.active
                              ? "border-[#cfe4d7] bg-[#eff9f2]"
                              : "border-[#e1e8f4] bg-[#fafcff]",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3 px-4 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className={[
                                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                                  module.locked
                                    ? "bg-[#eff3fb] text-[#9ca9bc]"
                                    : module.active
                                      ? "bg-white text-[#0f8751]"
                                      : "bg-white text-[#4b8a60]",
                                ].join(" ")}
                              >
                                {module.locked ? (
                                  <Lock className="h-4 w-4" strokeWidth={2.1} />
                                ) : module.active ? (
                                  <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={2.1} />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" strokeWidth={2.1} />
                                )}
                              </span>

                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold text-[#22314c]">
                                  {module.title}
                                </p>
                                <p className="mt-1 text-[11px] text-[#7a8ca5]">{module.duration}</p>
                              </div>
                            </div>

                            {module.expanded ? (
                              <ChevronDown className="h-4 w-4 shrink-0 text-[#1f3a5f]" strokeWidth={2.2} />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0 text-[#1f3a5f]" strokeWidth={2.2} />
                            )}
                          </div>

                          {module.expanded ? (
                            <div className="border-t border-[#dce9e1] bg-[#f6fffa] px-4 py-3">
                              <div className="space-y-3">
                                {currentLessons.map((lesson) => (
                                  <div
                                    key={lesson.label}
                                    className="flex items-center justify-between gap-3 text-[12px] text-[#53657e]"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      <CheckCircle2
                                        className="h-4 w-4 shrink-0 text-[#0f8751]"
                                        strokeWidth={2.1}
                                      />
                                      <span className="truncate">{lesson.label}</span>
                                    </div>
                                    <span
                                      className={
                                        lesson.current ? "font-semibold text-[#0f8751]" : "text-[#98a6ba]"
                                      }
                                    >
                                      {lesson.time}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewAndLaunchPage() {
  return (
    <AppShell title={<CoursePageTitle label="Create New Course" />} activeSection="courses">
      <div className="mx-auto max-w-[1320px]">
        <CourseFlowStepper currentStep={3} />

        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              Preview Course ( Admin View)
            </h1>
            <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#465b7d]">
              Enter the basic information and structure for your new course.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <CourseActionLink href="/courses" variant="secondary" className="min-w-[156px]">
              Save as Draft
            </CourseActionLink>
            <CourseActionLink href="/courses" className="min-w-[184px] justify-between px-6">
              <span>Publish Course</span>
              <ContinueArrow />
            </CourseActionLink>
          </div>
        </div>

        <PreviewShell />
      </div>
    </AppShell>
  );
}
