"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  Check,
  FilePenLine,
  Globe2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";
import { toast } from "sonner";
import Link from "next/link";

function VisibilityCard({
  icon,
  title,
  description,
  access,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  access: string;
  active?: boolean;
  onClick: () => void;
}) {
  const Icon = icon;

  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-[20px] border p-7 shadow-[0_18px_34px_rgba(180,193,229,0.06)] transition-all duration-200 ${
        active ? "border-[#4d63e1] bg-[#f8faff] ring-2 ring-[#4d63e1]/10" : "border-[#dfe8f3] bg-white hover:border-[#b4c5ff]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-14 w-14 items-center justify-center rounded-[12px] ${
          active ? "bg-[#4d63e1] text-white" : "bg-[#eef1ff] text-[#4d63e1]"
        }`}>
          <Icon className="h-7 w-7" strokeWidth={2.1} />
        </span>

        <span
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full border-2",
            active ? "border-[#4d63e1] bg-[#4d63e1]" : "border-[#b4c5ff] bg-white",
          ].join(" ")}
        >
          {active ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
        </span>
      </div>

      <h2 className="mt-7 text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">{title}</h2>
      <p className="mt-4 text-[16px] leading-8 text-[#72829a]">{description}</p>

      <div className="mt-8 border-t border-[#e8edf7] pt-6">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#4057d8]">
          {access}
        </p>
      </div>
    </article>
  );
}

function VisibilitySettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const { session } = useAuthSession();

  const [course, setCourse] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [visibility, setVisibility] = useState<"global_public" | "internal_only" | "draft">("draft");

  // Fetch all courses if no specific course is selected
  useEffect(() => {
    if (session?.token && !courseId) {
      setLoading(true);
      apiRequest<{ message: string; data: any[] }>(endpoints.courses.all, {
        authToken: session.token,
      })
        .then((res) => {
          setAllCourses(res.data ?? []);
        })
        .catch((err) => {
          console.error("Failed to load courses list:", err);
          toast.error("Failed to load courses for selection.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.token, courseId]);

  // Fetch course details if courseId is provided
  useEffect(() => {
    if (session?.token && courseId) {
      setLoading(true);
      apiRequest<{ message: string; data: any }>(endpoints.courses.byId(courseId), {
        authToken: session.token,
      })
        .then((res) => {
          const c = res.data;
          setCourse(c);
          setVisibility(c.visibility ?? "draft");
        })
        .catch((err) => {
          console.error("Failed to load course details:", err);
          toast.error("Failed to load course details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.token, courseId]);

  const handleSave = async () => {
    if (!courseId) return;
    setIsSaving(true);
    try {
      await apiRequest(endpoints.courses.update(courseId), {
        method: "PUT",
        authToken: session?.token,
        body: {
          visibility,
        },
      });
      toast.success("Visibility settings updated successfully!");
      router.push("/catalog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Catalog Management" activeSection="catalog">
        <div className="py-20 text-center text-[#72829a] font-medium text-[16px]">
          Loading details...
        </div>
      </AppShell>
    );
  }

  if (!courseId) {
    return (
      <AppShell title="Catalog Management" activeSection="catalog">
        <div className="mx-auto max-w-[800px] mt-12">
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="text-[#72829a] hover:text-[#16345d]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d]">
              Select Course
            </h1>
          </div>
          <p className="mt-2 text-[#72829a]">
            Please select a course from the catalog to configure its visibility settings.
          </p>

          <article className="mt-8 rounded-[24px] bg-white p-8 shadow-[0_18px_38px_rgba(180,193,229,0.07)] border border-[#dfe8f3]">
            <label className="block">
              <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
                Choose Course
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/catalog/visibility?courseId=${e.target.value}`);
                  }
                }}
                className="w-full rounded-[16px] border border-[#d7deee] bg-[#f8faff] px-5 py-4 text-[16px] text-[#264267] outline-none"
              >
                <option value="">-- Choose a Course --</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </article>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto ">
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex rounded-[10px] bg-[#eef1ff] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#4057d8]">
                Visibility Settings
              </span>
              <span className="text-[16px] font-extrabold uppercase tracking-[0.14em] text-[#1f3556]">
                ID: {course.id.substring(0, 8)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Visibility Settings"}
              <Save className="h-5 w-5" strokeWidth={2.1} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-5">
            <Link href="/catalog" className="text-[#72829a] hover:text-[#16345d]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
              {course.name}
            </h1>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <VisibilityCard
            icon={Globe2}
            title="Global Public"
            description="Course is discoverable by search engines and listed on all external portal pages. Open for guest viewing and external registration."
            access="Access Level: Unrestricted"
            active={visibility === "global_public"}
            onClick={() => setVisibility("global_public")}
          />
          <VisibilityCard
            icon={Building2}
            title="Internal Only"
            description="Only authenticated users from affiliated institutions can see and register for this course. Hidden from guest portals."
            access="Access Level: Authenticated"
            active={visibility === "internal_only"}
            onClick={() => setVisibility("internal_only")}
          />
          <VisibilityCard
            icon={FilePenLine}
            title="Draft"
            description="Course is invisible to all non-admin users. Use this state while curating content or finalizing institutional details."
            access="Access Level: Admin Only"
            active={visibility === "draft"}
            onClick={() => setVisibility("draft")}
          />
        </section>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="bg-[#f6f8fd] px-7 py-6 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
            Institutional Access Matrix
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-7 py-6">Entity Type</th>
                  <th className="px-6 py-6">Public Search</th>
                  <th className="px-6 py-6">Direct Access</th>
                  <th className="px-6 py-6">Admin Override</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Standard Institution", visibility === "global_public", true, true],
                  ["Partner Campus", visibility === "global_public" || visibility === "internal_only", true, true],
                  ["External Network", visibility === "global_public", false, true],
                ].map(([label, publicSearch, directAccess, adminOverride]) => (
                  <tr key={label as string} className="border-t border-[#eef2f8]">
                    <td className="px-7 py-6 text-[16px] font-bold text-[#203553]">{label}</td>
                    {[publicSearch, directAccess, adminOverride].map((value, index) => (
                      <td key={`${label}-${index}`} className="px-6 py-6">
                        {value ? (
                          <Check className="h-6 w-6 text-[#0f8751]" strokeWidth={2.5} />
                        ) : (
                          <span className="text-[28px] leading-none text-[#c2ccdd]">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function VisibilitySettingsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading visibility settings...</div>}>
      <VisibilitySettingsContent />
    </Suspense>
  );
}
