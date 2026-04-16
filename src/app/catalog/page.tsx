"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  EllipsisVertical,
  Eye,
  Save,
  Star,
  Tags,
  UploadCloud,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CourseModal } from "@/components/course-flow";

type CatalogRow = {
  id: number;
  title: string;
  code: string;
  category: string;
  visibility: "Global Public" | "Internal Only" | "Draft";
  featured: boolean;
};

const categoryTags = ["Entrepreneurship", "Business", "Marketing", "Tech"];

const initialCatalogRows: CatalogRow[] = [
  { id: 1, title: "Introduction to UI Design", code: "CRS-10293", category: "Entrepreneurship", visibility: "Global Public", featured: true },
  { id: 2, title: "Introduction to UI Design", code: "CRS-10293", category: "Business", visibility: "Internal Only", featured: true },
  { id: 3, title: "Introduction to UI Design", code: "CRS-10293", category: "Marketing", visibility: "Draft", featured: true },
  { id: 4, title: "Introduction to UI Design", code: "CRS-10293", category: "Tech", visibility: "Global Public", featured: true },
  { id: 5, title: "Introduction to UI Design", code: "CRS-10293", category: "DESIGN", visibility: "Global Public", featured: true },
  { id: 6, title: "Introduction to UI Design", code: "CRS-10293", category: "DESIGN", visibility: "Global Public", featured: true },
  { id: 7, title: "Introduction to UI Design", code: "CRS-10293", category: "DESIGN", visibility: "Global Public", featured: true },
  { id: 8, title: "Introduction to UI Design", code: "CRS-10293", category: "DESIGN", visibility: "Global Public", featured: true },
];

const visibilityOptions: CatalogRow["visibility"][] = ["Global Public", "Internal Only", "Draft"];

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#b7c2ff] bg-[#f8f9ff] px-4 py-2 text-[15px] font-medium text-[#4057d8]">
      {label}
      <X className="h-4 w-4" strokeWidth={2.1} />
    </span>
  );
}

function SummaryCard({
  href,
  icon,
  title,
  value,
  detail,
  iconClassName,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  value: string;
  detail: string;
  iconClassName: string;
}) {
  const Icon = icon;
  const content = (
    <article className="rounded-[20px] border border-[#e1e8f4] bg-white p-6 shadow-[0_18px_34px_rgba(180,193,229,0.06)]">
      <div className="flex items-center gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${iconClassName}`}>
          <Icon className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <h3 className="text-[16px] font-extrabold text-[#1f3556]">{title}</h3>
      </div>
      <p className="mt-7 text-[54px] font-extrabold tracking-[-0.06em] text-[#16345d]">{value}</p>
      <p className="mt-2 text-[15px] leading-6 text-[#72829a]">{detail}</p>
    </article>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

function ReviewPendingChangesModal({ onClose }: { onClose: () => void }) {
  return (
    <CourseModal closeHref="/catalog" onClose={onClose} maxWidthClassName="max-w-[620px]">
      <div className="p-8 pr-14 sm:p-10 sm:pr-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1ff] text-[#4d63e1]">
          <UploadCloud className="h-6 w-6" strokeWidth={2.1} />
        </div>

        <h2 className="mt-6 text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
          Review Pending Changes
        </h2>
        <p className="mt-3 max-w-[500px] text-[16px] leading-8 text-[#72829a]">
          You are about to synchronize your local edits with the production catalog. These
          changes will be live immediately across all institutional portals.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[18px] bg-[#f4f6ff] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#0f8751]">
                  Visibility Updates
                </p>
                <p className="mt-2 text-[18px] font-bold text-[#243756]">3 visibility updates pending</p>
              </div>
              <span className="text-[#b4bfd7]">
                <Eye className="h-6 w-6" strokeWidth={2} />
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#e2e8f4] bg-[#f8faff] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
                Featured Content
              </p>
              <p className="mt-2 text-[18px] font-bold text-[#243756]">1 course added</p>
            </div>
            <div className="rounded-[18px] border border-[#e2e8f4] bg-[#f8faff] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
                Metadata
              </p>
              <p className="mt-2 text-[18px] font-bold text-[#243756]">8 tags modified</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#e2e8f4]">
            <div className="bg-[#f8faff] px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#7a8aa6]">
              Change Manifest
            </div>
            {[
              ["Strategic Governance 101", "UNPUBLISH"],
              ["Quantum Computing", "PUBLIC"],
              ["Design Ethics", "FEATURED"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-t border-[#edf1f7] px-5 py-4">
                <span className="text-[16px] font-medium text-[#213655]">{label}</span>
                <span className="text-[16px] font-bold text-[#0f8751]">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 bg-[#f8fbfa] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
          >
            Confirm &amp; Apply
          </button>
        </div>
      </div>
    </CourseModal>
  );
}

export default function CatalogManagementPage() {
  const [catalogRows, setCatalogRows] = useState(initialCatalogRows);
  const [openVisibilityRow, setOpenVisibilityRow] = useState<number | null>(3);
  const [openActionRow, setOpenActionRow] = useState<number | null>(1);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const updateVisibility = (rowId: number, visibility: CatalogRow["visibility"]) => {
    setCatalogRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, visibility } : row)),
    );
    setOpenVisibilityRow(null);
  };

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto max-w-[1320px]">
        <section className="mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[30px] font-extrabold tracking-[-0.05em] text-[#16345d] sm:text-[36px]">
                Course Categories
              </h1>
            </div>

            <Link
              href="/catalog/categories"
              className="inline-flex items-center gap-2 text-[16px] font-bold text-[#4057d8]"
            >
              <CirclePlus className="h-5 w-5" strokeWidth={2.1} />
              Manage Categories
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categoryTags.map((tag) => (
              <CategoryPill key={tag} label={tag} />
            ))}
            <Link
              href="/catalog/categories"
              className="inline-flex items-center rounded-full border border-dashed border-[#b7c2ff] px-5 py-2 text-[15px] font-semibold text-[#4057d8]"
            >
              + Add New
            </Link>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-[#dfe8f3] bg-white shadow-[0_18px_38px_rgba(180,193,229,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#e8edf7] px-7 py-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#16345d]">
              Course Visibility &amp; Featured Settings
            </h2>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="button-primary inline-flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)]"
            >
              Apply Changes
              <Save className="h-5 w-5" strokeWidth={2.1} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f6f8fd]">
                <tr className="text-left text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#72829a]">
                  <th className="px-7 py-6">Course Name</th>
                  <th className="px-6 py-6">Category</th>
                  <th className="px-6 py-6">Featured</th>
                  <th className="px-6 py-6">Visibility</th>
                  <th className="px-6 py-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {catalogRows.map((row) => (
                  <tr key={row.id} className="border-t border-[#eef2f8] align-top">
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#7a31ff,#a94cff)] text-[15px] font-bold text-white">
                          UI
                        </span>
                        <div>
                          <p className="text-[16px] font-bold text-[#1f3556]">{row.title}</p>
                          <p className="mt-1 text-[14px] text-[#72829a]">ID: {row.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-[#deebff] px-4 py-2 text-[14px] font-bold text-[#2463e7]">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="flex h-8 w-14 items-center rounded-full bg-[#0f8751] px-1"
                        aria-label={`Toggle featured for ${row.title}`}
                      >
                        <span className="ml-auto flex h-6 w-6 rounded-full bg-white" />
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenVisibilityRow((current) => (current === row.id ? null : row.id))
                          }
                          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#e2f7e8] px-4 text-[15px] font-semibold text-[#1f8a5c]"
                        >
                          <span>{row.visibility}</span>
                          <ChevronDown className="h-4 w-4" strokeWidth={2.1} />
                        </button>

                        {openVisibilityRow === row.id ? (
                          <div className="absolute left-0 top-[calc(100%+12px)] z-10 w-[216px] overflow-hidden rounded-[12px] border border-[#edf1f7] bg-white shadow-[0_26px_50px_rgba(34,54,84,0.16)]">
                            {visibilityOptions.map((option, index) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => updateVisibility(row.id, option)}
                                className={[
                                  "block w-full px-5 py-5 text-left text-[18px] font-medium transition-colors hover:bg-[#f8faff]",
                                  row.visibility === option
                                    ? "bg-[#f8faff] text-[#4057d8]"
                                    : "text-[#6a79a5]",
                                  index !== 0 ? "border-t border-[#edf1f7]" : "",
                                ].join(" ")}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenActionRow((current) => (current === row.id ? null : row.id))}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-[#8b98ae] hover:bg-[#f4f7fb]"
                          aria-label={`Open actions for ${row.title}`}
                        >
                          <EllipsisVertical className="h-5 w-5" strokeWidth={2.2} />
                        </button>

                        {openActionRow === row.id ? (
                          <div className="absolute right-0 top-[calc(100%+10px)] z-10 w-[200px] overflow-hidden rounded-[12px] border border-[#edf1f7] bg-white shadow-[0_18px_32px_rgba(34,54,84,0.12)]">
                            <Link
                              href="/catalog/visibility"
                              className="block px-5 py-4 text-[16px] font-medium text-[#2b3f60] hover:bg-[#f7f9fd]"
                            >
                              View Visibility Setting
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-5 border-t border-[#e8edf7] px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[15px] font-semibold text-[#667792]">
              Showing 1 to 5 of 12,840 certificates
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dfe6f1] text-[#9aa7ba]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.1} />
              </button>
              {["1", "2", "3", "...", "256"].map((page, index) => (
                <button
                  key={page}
                  type="button"
                  className={[
                    "flex h-9 min-w-9 items-center justify-center rounded-[8px] px-3 text-[15px] font-semibold",
                    index === 0 ? "bg-[#0f8751] text-white" : "text-[#233654]",
                  ].join(" ")}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#dfe6f1] text-[#9aa7ba]"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <SummaryCard
            icon={Eye}
            title="Public Courses"
            value="16"
            detail="Visible to all registered platform users"
            iconClassName="bg-[#f3eeff] text-[#6a4dff]"
          />
          <SummaryCard
            href="/catalog/featured"
            icon={Star}
            title="Featured"
            value="5"
            detail="Prioritized in marketplace search results"
            iconClassName="bg-[#ecf8ef] text-[#11814a]"
          />
          <SummaryCard
            href="/catalog/categories"
            icon={Tags}
            title="Global Categories"
            value="4"
            detail="Active taxonomies for organization"
            iconClassName="bg-[#f7ecff] text-[#bd55f7]"
          />
        </section>
      </div>

      {showReviewModal ? <ReviewPendingChangesModal onClose={() => setShowReviewModal(false)} /> : null}
    </AppShell>
  );
}
