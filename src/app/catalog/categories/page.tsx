"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  ChartBar,
  CirclePlus,
  FlaskConical,
  Megaphone,
  MonitorSmartphone,
  Rocket,
  Save,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CourseModal } from "@/components/course-flow";

type CategoryRow = {
  name: string;
  description: string;
  courses: string;
  enrollment: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const categoryRows: CategoryRow[] = [
  {
    name: "Entrepreneurship",
    description: "Foundations of venture building",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: Rocket,
  },
  {
    name: "Business",
    description: "Corporate strategy & leadership",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: BriefcaseBusiness,
  },
  {
    name: "Marketing",
    description: "Digital and traditional outreach",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: Megaphone,
  },
  {
    name: "Tech",
    description: "Development, AI, and Data",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: MonitorSmartphone,
  },
  {
    name: "Entrepreneurship",
    description: "Foundations of venture building",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: Rocket,
  },
  {
    name: "Entrepreneurship",
    description: "Foundations of venture building",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: Rocket,
  },
  {
    name: "Entrepreneurship",
    description: "Foundations of venture building",
    courses: "48 Courses",
    enrollment: "4,821",
    icon: Rocket,
  },
];

const iconChoices = [
  { key: "rocket", icon: Rocket },
  { key: "business", icon: BriefcaseBusiness },
  { key: "marketing", icon: Megaphone },
  { key: "tech", icon: MonitorSmartphone },
  { key: "insight", icon: ChartBar },
  { key: "lab", icon: FlaskConical },
];

function AddCategoryModal({
  onClose,
  selectedIcon,
  onSelectIcon,
}: {
  onClose: () => void;
  selectedIcon: string;
  onSelectIcon: (key: string) => void;
}) {
  return (
    <CourseModal
      closeHref="/catalog/categories"
      onClose={onClose}
      maxWidthClassName="max-w-[680px]"
    >
      <div className="p-8 pr-14 sm:p-10 sm:pr-16">
        <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
          Add New Category
        </h2>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
              Category Name
            </span>
            <span className="relative flex h-[58px] items-center rounded-[16px] border border-[#d7deee] bg-white px-5">
              <input
                defaultValue="e.g. Advanced UI Design Patterns"
                className="w-full bg-transparent text-[16px] text-[#264267] outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
              Category Description
            </span>
            <textarea
              rows={5}
              defaultValue="Briefly describe the purpose of this category..."
              className="w-full rounded-[16px] border border-[#d7deee] bg-white px-5 py-4 text-[16px] leading-7 text-[#264267] outline-none"
            />
          </label>

          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
              Select Icon
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
              {iconChoices.map((item) => {
                const Icon = item.icon;
                const selected = selectedIcon === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onSelectIcon(item.key)}
                    className={[
                      "flex h-20 items-center justify-center rounded-[12px] border transition-colors",
                      selected
                        ? "border-[#4d63e1] bg-[#eef1ff] text-[#4d63e1]"
                        : "border-[#e2e8f4] bg-white text-[#212733]",
                    ].join(" ")}
                  >
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#e8edf7] pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
          >
            Create Category
          </button>
        </div>
      </div>
    </CourseModal>
  );
}

export default function CatalogCategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("rocket");

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto max-w-[1320px]">
        <section className="mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
                Categories
              </h1>
              <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#465b7d]">
                Organize and analyze course performance across institutional disciplines.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex h-12 items-center justify-center gap-2 text-[16px] font-bold text-[#4057d8]"
              >
                <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
                Add New Category
              </button>
              <button
                type="button"
                className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
              >
                Save Changes
                <Save className="h-5 w-5" strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
          <article className="rounded-[24px] bg-white p-7 shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Quick Insight
            </h2>

            <div className="mt-10">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                Total Enrollment
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[60px] font-extrabold leading-none tracking-[-0.06em] text-[#16345d]">
                  12,482
                </span>
                <span className="mb-2 text-[16px] font-extrabold text-[#0f8751]">+12%</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[#eef1ff] p-5">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#6f7e96]">
                  Active Courses
                </p>
                <p className="mt-5 text-[42px] font-extrabold tracking-[-0.05em] text-[#16345d]">
                  156
                </p>
              </div>
              <div className="rounded-[18px] bg-[#eef1ff] p-5">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#6f7e96]">
                  Taxonomies
                </p>
                <p className="mt-5 text-[42px] font-extrabold tracking-[-0.05em] text-[#16345d]">
                  42
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#edf1f7] pt-8">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                Distribution
              </p>

              {[
                ["Entrepreneurship", "45%"],
                ["Business", "45%"],
              ].map(([label, value]) => (
                <div key={label} className="mt-7">
                  <div className="flex items-center justify-between gap-4 text-[15px] font-bold text-[#203553]">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-4 h-[12px] rounded-full bg-[#deece7]">
                    <div className="h-full w-[45%] rounded-full bg-[#0f8751]" />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#f6f8fd]">
                  <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                    <th className="px-8 py-6">Category Name</th>
                    <th className="px-6 py-6">Courses</th>
                    <th className="px-6 py-6">Enrolment</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((row, index) => {
                    const Icon = row.icon;

                    return (
                      <tr key={`${row.name}-${index}`} className="border-t border-[#eef2f8]">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <span className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#eef1ff] text-[#4d63e1]">
                              <Icon className="h-7 w-7" strokeWidth={2.1} />
                            </span>
                            <div>
                              <p className="text-[16px] font-bold text-[#1f3556]">{row.name}</p>
                              <p className="mt-1 text-[15px] text-[#72829a]">{row.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-[#deebff] px-4 py-2 text-[14px] font-bold text-[#2463e7]">
                            {row.courses}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[18px] font-extrabold text-[#16345d]">
                          {row.enrollment}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            ["PROMOTED TRACK", "Advanced Entrepreneurship", "New curriculum available for Q4"],
            ["TRENDING TRACK", "AI Foundations", "High demand in Tech category"],
          ].map(([label, title, detail]) => (
            <article
              key={title}
              className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,rgba(25,7,6,0.94),rgba(76,14,9,0.82)),radial-gradient(circle_at_15%_18%,rgba(205,74,43,0.36),transparent_22%)] p-7 text-white shadow-[0_18px_38px_rgba(180,193,229,0.08)]"
            >
              <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#4af0a6]">
                {label}
              </p>
              <h3 className="mt-5 max-w-[260px] text-[28px] font-extrabold leading-[1.1] tracking-[-0.05em]">
                {title}
              </h3>
              <p className="mt-4 max-w-[300px] text-[16px] leading-7 text-white/78">{detail}</p>
            </article>
          ))}
        </section>
      </div>

      {showAddModal ? (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          selectedIcon={selectedIcon}
          onSelectIcon={setSelectedIcon}
        />
      ) : null}
    </AppShell>
  );
}
