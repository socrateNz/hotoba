"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col">
          <Topbar />
          <div
            className={cn(
              "flex-1 overflow-y-auto px-6 py-6 lg:px-10",
              "bg-gradient-to-b from-slate-50/70 via-white to-slate-50 dark:from-slate-950/70 dark:via-slate-950 dark:to-slate-950"
            )}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

