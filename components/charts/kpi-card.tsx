import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  helper?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: ReactNode;
}

export function KpiCard({
  label,
  value,
  helper,
  trend,
  trendPositive = true,
  icon,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-slate-200",
        "bg-gradient-to-br from-white via-slate-50 to-slate-100",
        "shadow-lg shadow-slate-200/50",
        "dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 dark:shadow-[0_18px_45px_rgba(15,23,42,0.9)]",
        "hover:-translate-y-0.5 hover:border-emerald-400 dark:hover:border-emerald-500/60 transition-all"
      )}
    >
      <div className="absolute inset-px rounded-[22px] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between p-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {value}
          </p>
          {helper && <p className="text-xs text-slate-500 dark:text-slate-500">{helper}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/80 dark:bg-slate-900/80 dark:text-emerald-400 dark:ring-slate-700/80">
              {icon}
            </div>
          )}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                trendPositive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/50"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/50"
              )}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

