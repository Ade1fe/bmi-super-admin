"use client";

import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  ContinueArrow,
  CourseFlowStepper,
  CoursePageTitle,
  CourseSelectField,
  CourseTextArea,
  CourseTextField,
} from "@/components/course-flow";
import { useAuthSession } from "@/lib/auth-session";
import {
  createCourse,
  getCategories,
  type ApiCourseCategory,
  type CourseDifficultyLevel,
} from "@/lib/course-api";

const defaultThumbnail =
  "https://res.cloudinary.com/dhvct8axq/image/upload/v1780333350/Frame_2147225028_rkfdtg.png";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractCreatedCourseId(response: unknown) {
  const payload = isRecord(response) && "data" in response ? response.data : response;
  const nestedPayload = isRecord(payload) && "data" in payload ? payload.data : payload;

  if (!isRecord(nestedPayload)) {
    return "";
  }

  return typeof nestedPayload.id === "string" ? nestedPayload.id : "";
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { session, isHydrated } = useAuthSession();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<CourseDifficultyLevel>("beginner");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<ApiCourseCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseCategories() {
      if (!isHydrated) {
        return;
      }

      setLoadingCategories(true);
      try {
        const fetchedCategories = await getCategories(session?.token);
        setCategories(fetchedCategories);
        if (fetchedCategories.length && !categoryId) {
          setCategoryId(fetchedCategories[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCourseCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, session?.token]);

  async function handleSaveCourse(continueToContent = false) {
    if (!name.trim()) {
      setError("Please enter a course title.");
      return;
    }

    if (!categoryId) {
      setError("Please select a course category.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const response = await createCourse(
        {
          name: name.trim(),
          categoryId,
          difficultyLevel,
          description: description.trim(),
          status: "draft",
          thumbnailUrl: thumbnailUrl.trim() || defaultThumbnail,
        },
        session?.token
      );

      const courseId = extractCreatedCourseId(response);

      if (!courseId) {
        throw new Error("Unable to read course ID from the backend response.");
      }

      if (continueToContent) {
        router.push(`/courses/create/content-upload?courseId=${encodeURIComponent(courseId)}`);
        return;
      }

      router.push("/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

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
            <button
              type="button"
              onClick={() => handleSaveCourse(false)}
              disabled={isSaving}
              className="inline-flex h-14 min-w-[190px] items-center justify-center rounded-[10px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSaveCourse(true)}
              disabled={isSaving}
              className="inline-flex h-14 min-w-[234px] items-center justify-between rounded-[10px] bg-[#4b8a60] px-7 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isSaving ? "Saving…" : "Save & Continue"}</span>
              <ContinueArrow />
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-[18px] border border-[#f8d6d6] bg-[#fff1f1] px-5 py-4 text-[15px] text-[#a42f2f]">
            {error}
          </div>
        ) : null}

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
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <CourseSelectField
                label="Category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                options={
                  loadingCategories
                    ? ["Loading categories..."]
                    : categories.length
                      ? categories.map((category) => ({
                          label: category.name,
                          value: category.id,
                        }))
                      : [{ label: "Uncategorized", value: "" }]
                }
              />
              <CourseSelectField
                label="Difficulty Level"
                value={difficultyLevel}
                onChange={(event) =>
                  setDifficultyLevel(event.target.value as CourseDifficultyLevel)
                }
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ]}
              />
              <div className="md:col-span-2">
                <CourseTextArea
                  label="Course Description"
                  placeholder="Describe what students will learn..."
                  rows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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

              <div className="mt-6">
                <CourseTextField
                  label="Thumbnail URL"
                  placeholder="Paste the image URL"
                  value={thumbnailUrl}
                  onChange={(event) => setThumbnailUrl(event.target.value)}
                />
              </div>
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
