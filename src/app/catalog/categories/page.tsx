"use client";

import { useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  ChartBar,
  CirclePlus,
  FlaskConical,
  Megaphone,
  MonitorSmartphone,
  Pencil,
  Rocket,
  Save,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CourseModal } from "@/components/course-flow";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { useAuthSession } from "@/lib/auth-session";
import { toast } from "sonner";

// Matches actual API response shape from GET /courses/get-categories
type ApiCategory = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  onSuccess,
  selectedIcon,
  onSelectIcon,
}: {
  onClose: () => void;
  onSuccess: () => void;
  selectedIcon: string;
  onSelectIcon: (key: string) => void;
}) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuthSession();

  async function handleCreate() {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest(endpoints.courses.categories.create, {
        method: "POST",
        authToken: session?.token,
        body: {
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        },
      });
      toast.success("Category created successfully!");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Advanced UI Design Patterns"
                className="w-full bg-transparent text-[16px] text-[#264267] outline-none placeholder:text-[#8d99b1]"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
              Category Description
            </span>
            <textarea
              rows={5}
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Briefly describe the purpose of this category..."
              className="w-full rounded-[16px] border border-[#d7deee] bg-white px-5 py-4 text-[16px] leading-7 text-[#264267] outline-none placeholder:text-[#8d99b1]"
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
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white shadow-[0_20px_38px_rgba(75,138,96,0.18)] disabled:opacity-60"
          >
            {isSubmitting ? "Creating…" : "Create Category"}
          </button>
        </div>
      </div>
    </CourseModal>
  );
}

export default function CatalogCategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("rocket");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const { session } = useAuthSession();
  const [editingCategory, setEditingCategory] =
    useState<ApiCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchCategories() {
    setLoadingCategories(true);
    setCategoriesError(null);
    try {
      const data = await apiRequest<{ message: string; data: ApiCategory[] }>(
        endpoints.courses.categories.all,
        { authToken: session?.token }
      );
      setCategories(data.data ?? []);
    } catch (err) {
      setCategoriesError(
        err instanceof Error ? err.message : "Failed to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  function handleSuccess() {
    setShowAddModal(false);
    fetchCategories();
  }

  async function handleDeleteCategory(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await apiRequest(endpoints.courses.categories.delete(id), {
        method: "DELETE",
        authToken: session?.token,
      });

      toast.success("Category deleted successfully!");

      if (editingCategory?.id === id) {
        setEditingCategory(null);
      }

      await fetchCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function EditCategoryModal({
    category,
    onClose,
    onSuccess,
  }: {
    category: ApiCategory;
    onClose: () => void;
    onSuccess: () => void;
  }) {
    const [categoryName, setCategoryName] = useState(category.name);
    const [categoryDescription, setCategoryDescription] = useState(
      category.description ?? ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { session } = useAuthSession();

    async function handleUpdate() {
      if (!categoryName.trim()) {
        toast.error("Please enter a category name.");
        return;
      }

      setIsSubmitting(true);

      try {
        await apiRequest(endpoints.courses.categories.update(category.id), {
          method: "PUT",
          authToken: session?.token,
          body: {
            name: categoryName.trim(),
            description: categoryDescription.trim(),
          },
        });

        toast.success("Category updated successfully!");
        onSuccess();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update category."
        );
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <CourseModal
        closeHref="/catalog/categories"
        onClose={onClose}
        maxWidthClassName="max-w-[680px]"
      >
        <div className="p-8 pr-14 sm:p-10 sm:pr-16">
          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#16345d]">
            Update Category
          </h2>

          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="mb-3 block text-[16px] font-semibold text-[#1f3556]">
                Category Name
              </span>

              <span className="relative flex h-[58px] items-center rounded-[16px] border border-[#d7deee] bg-white px-5">
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full rounded-[16px] border border-[#d7deee] bg-white px-5 py-4 text-[16px] leading-7 text-[#264267] outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#e8edf7] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#cadfd5] bg-[#edf5f1] px-6 text-[15px] font-semibold text-[#4b8a60]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="button-primary inline-flex h-12 items-center justify-center rounded-[12px] bg-[#4b8a60] px-6 text-[15px] font-semibold text-white"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </div>
      </CourseModal>
    );
  }

  return (
    <AppShell title="Catalog Management" activeSection="catalog">
      <div className="mx-auto ">
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
                  {loadingCategories ? "…" : categories.length}
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
                    <th className="px-6 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCategories ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-[15px] text-[#72829a]">
                        Loading…
                      </td>
                    </tr>
                  ) : categoriesError ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-[15px] text-red-500">
                        {categoriesError}
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-[15px] text-[#72829a]">
                        No categories yet.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-t border-[#eef2f8]">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <span className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#eef1ff] text-[#4d63e1]">
                              <Rocket className="h-7 w-7" strokeWidth={2.1} />
                            </span>
                            <div>
                              <p className="text-[16px] font-bold text-[#1f3556]">{cat.name}</p>
                              <p className="mt-1 text-[15px] text-[#72829a]">{cat.description ?? ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-[#deebff] px-4 py-2 text-[14px] font-bold text-[#2463e7]">
                            —
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[18px] font-extrabold text-[#16345d]">
                          —
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => setEditingCategory(cat)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe3f0] text-[#4057d8]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              disabled={deletingId === cat.id}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#ffd9d9] text-red-500 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
          onSuccess={handleSuccess}
          selectedIcon={selectedIcon}
          onSelectIcon={setSelectedIcon}
        />
      ) : null}

      {editingCategory ? (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      ) : null}
    </AppShell>
  );
}
