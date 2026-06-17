"use client";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
};

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: (number | "ellipsis")[] = [1];

  if (current > 3) range.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) range.push(i);

  if (current < total - 2) range.push("ellipsis");

  range.push(total);
  return range;
}

export function Pagination({ page, pages, onChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  const pageRange = getPageRange(page, pages);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 dark:border-dark-3",
        className,
      )}
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Page <span className="font-semibold text-gray-700 dark:text-gray-200">{page}</span> of{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{pages}</span>
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-dark-3"
          aria-label="Previous page"
        >
          ← Prev
        </button>

        {pageRange.map((n, i) =>
          n === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                n === page
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-3",
              )}
            >
              {n}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="h-8 px-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-dark-3"
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
