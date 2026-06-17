import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "primary" | "green" | "blue" | "red" | "amber" | "indigo";
  icon?: ReactNode;
  className?: string;
};

const accentMap = {
  primary: "from-primary/20 to-primary/5 border-primary/20 text-primary",
  green: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-600",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-600",
  red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-600",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-600",
  indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-600",
};

const barMap = {
  primary: "bg-primary",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
};

export function KpiCard({ label, value, sub, accent = "primary", icon, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-dark-2",
        accentMap[accent],
        className,
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-1", barMap[accent])} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 dark:bg-dark-3/60", accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
