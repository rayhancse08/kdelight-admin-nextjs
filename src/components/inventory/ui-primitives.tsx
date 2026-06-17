import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Modal } from "./modal";

export function TabSwitcher<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { key: T; label: string; count?: number }[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex gap-1 p-1 rounded-xl bg-gray-100/80 dark:bg-dark-3 border border-gray-200/60 dark:border-dark-3",
        className,
      )}
    >
      {tabs.map(({ key, label, count }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            active === key
              ? "bg-white dark:bg-dark-2 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
          )}
        >
          {label}
          {count !== undefined && (
            <span
              className={cn(
                "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                active === key
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200/80 text-gray-500 dark:bg-dark-3 dark:text-gray-400",
              )}
            >
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function InventoryCard({
  children,
  className,
  title,
  badge,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  badge?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-dark rounded-2xl border border-gray-200/80 dark:border-dark-3 overflow-hidden shadow-sm",
        className,
      )}
    >
      {(title || badge) && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-3 flex justify-between items-center">
          {title && <span className="font-semibold text-gray-800 dark:text-white">{title}</span>}
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "primary" }) {
  return (
    <span
      className={cn(
        "text-xs px-2.5 py-1 rounded-full font-medium",
        variant === "primary"
          ? "bg-primary/10 text-primary border border-primary/20"
          : "bg-gray-50 text-gray-500 border border-gray-200 dark:bg-dark-3 dark:text-gray-400 dark:border-dark-3",
      )}
    >
      {children}
    </span>
  );
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark-2 px-3.5 py-2.5 rounded-xl text-sm w-56 outline-none",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400",
        props.className,
      )}
    />
  );
}

export function FormSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark-2 px-3.5 py-2.5 rounded-xl text-sm outline-none",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
        props.className,
      )}
    />
  );
}

export function FormLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <label className={cn("text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5", className)}>
      {children}
    </label>
  );
}

export function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark-2 rounded-xl px-3.5 py-2.5 w-full text-sm outline-none",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
        props.className,
      )}
    />
  );
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark-2 rounded-xl px-3.5 py-2.5 w-full text-sm outline-none resize-none",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
        props.className,
      )}
    />
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2",
        "hover:bg-primary/90 shadow-sm shadow-primary/25 disabled:opacity-60 transition-all",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-3 rounded-xl",
        "hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function AlertError({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-3 flex items-center justify-center text-2xl">
        📦
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </div>
  );
}

export function DeleteModal({
  label,
  onConfirm,
  onClose,
  loading,
}: {
  label: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`Delete ${label}?`}
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-3">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <DangerButton onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </DangerButton>
        </div>
      }
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This soft-deletes the record. Linked transactions and warehouse data remain unaffected.
      </p>
    </Modal>
  );
}
