"use client";

import { useEffect, useMemo, useState } from "react";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  usePagination                                                      */
/*  Handles page state, clamping, and slicing for any array of items.  */
/* ------------------------------------------------------------------ */

export function usePagination<T>({
  items,
  pageSize,
  resetKey,
}: {
  items: readonly T[];
  pageSize: number;
  /** Optional value (e.g. a search query or filter) — page resets to 1 whenever this changes. */
  resetKey?: unknown;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, items.length);

  const paginatedItems = useMemo(
    () => items.slice(pageStartIndex, pageEndIndex),
    [items, pageStartIndex, pageEndIndex],
  );

  const showingLabel =
    items.length === 0
      ? "Showing 0 results"
      : `Showing ${pageStartIndex + 1}-${pageEndIndex} of ${items.length} result${
          items.length === 1 ? "" : "s"
        }`;

  return {
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    pageStartIndex,
    pageEndIndex,
    paginatedItems,
    showingLabel,
  };
}

/* ------------------------------------------------------------------ */
/*  buildPageList                                                      */
/*  Windowed page numbers: 1 … 4 5 6 … 20 (instead of every page).     */
/* ------------------------------------------------------------------ */

export function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++) pages.push(page);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

/* ------------------------------------------------------------------ */
/*  PaginationControls                                                 */
/*  Renders prev/next + windowed page buttons. Renders nothing when    */
/*  there's only one page.                                             */
/* ------------------------------------------------------------------ */

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-[0.95rem] font-semibold transition",
          currentPage <= 1
            ? "cursor-not-allowed border-[#edf1f6] bg-white text-[#c0cad7]"
            : "border-[#edf1f6] bg-white text-[#233955] hover:border-[#dce4ee]",
        )}
      >
        ‹
      </button>

      {buildPageList(currentPage, totalPages).map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[#8da0b7]">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border px-3 text-[0.95rem] font-semibold transition",
              page === currentPage
                ? "border-[#0b7e54] bg-[#0b7e54] text-white"
                : "border-transparent bg-white text-[#233955] hover:border-[#dce4ee]",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-[0.95rem] font-semibold transition",
          currentPage >= totalPages
            ? "cursor-not-allowed border-[#edf1f6] bg-white text-[#c0cad7]"
            : "border-[#edf1f6] bg-white text-[#233955] hover:border-[#dce4ee]",
        )}
      >
        ›
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PaginationFooter                                                   */
/*  Convenience wrapper: "Showing X-Y of Z" + controls, laid out the   */
/*  way it's used across the table footers in this codebase.          */
/* ------------------------------------------------------------------ */

export function PaginationFooter({
  label,
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  label: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-[#edf2f7] px-5 py-5 text-[0.95rem] text-[#64758d] sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8",
        className,
      )}
    >
      <p>{label}</p>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}