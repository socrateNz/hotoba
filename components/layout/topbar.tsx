"use client";

import { Bell, SunMedium, Moon, UserCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 px-4 lg:px-8 backdrop-blur-xl">
      <div>
        <h1 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
          Tableau de bord HTB
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Suivi en temps réel des opérations de l&apos;hôtel.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? (
            <SunMedium className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
          <UserCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <div className="hidden text-left sm:block">
            <p className="text-[11px] font-medium text-slate-900 dark:text-slate-100">Admin HTB</p>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400">ADMIN</p>
          </div>
        </button>
      </div>
    </header>
  );
}

