"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  headerActions?: ReactNode;
};

const maxWidthClass = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "lg",
  headerActions,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white dark:bg-gray-dark rounded-2xl w-full shadow-2xl border border-gray-100 dark:border-dark-3 max-h-[90vh] flex flex-col",
          maxWidthClass[maxWidth],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-dark-3 flex justify-between items-start gap-4 shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-dark-3 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto custom-scrollbar flex-1">{children}</div>

        {footer && (
          <div className="px-6 pb-5 pt-4 border-t border-gray-100 dark:border-dark-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
