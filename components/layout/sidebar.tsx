"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarClock,
  Users,
  UserCog,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/rooms", label: "Chambres", icon: BedDouble },
  { href: "/dashboard/bookings", label: "Réservations", icon: CalendarClock },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/staff", label: "RH", icon: UserCog },
  { href: "/dashboard/finance", label: "Finances", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800/70 px-6">
        <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40" />
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
            Hotel Touristique de Bana
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-500">PMS • Backoffice</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800/80",
                active &&
                  "bg-emerald-50 text-emerald-900 hover:bg-emerald-50 shadow-sm shadow-emerald-500/30 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-100"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300",
                  active && "border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-slate-200 dark:bg-slate-50 dark:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 dark:border-slate-800/70 px-4 py-4 text-xs text-slate-500 dark:text-slate-500">
        Taux d&apos;occupation en temps réel • <span className="text-emerald-500 dark:text-emerald-400">HTB</span>
      </div>
    </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   BedDouble,
//   CalendarClock,
//   Users,
//   UserCog,
//   CreditCard,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItems = [
//   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/dashboard/rooms", label: "Chambres", icon: BedDouble },
//   { href: "/dashboard/bookings", label: "Réservations", icon: CalendarClock },
//   { href: "/dashboard/clients", label: "Clients", icon: Users },
//   { href: "/dashboard/staff", label: "RH", icon: UserCog },
//   { href: "/dashboard/finance", label: "Finances", icon: CreditCard },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl">
//       <div className="flex h-16 items-center gap-2 border-b border-slate-800/60 px-6">
//         <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/30" />
//         <div>
//           <p className="text-sm font-semibold tracking-wide text-slate-50">
//             Hotel Touristique de Bana
//           </p>
//           <p className="text-xs text-slate-400">PMS • Backoffice</p>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 px-3 py-4">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
//                 "text-slate-400 hover:text-slate-50 hover:bg-slate-800/80",
//                 active &&
//                   "bg-slate-100 text-slate-900 hover:bg-slate-100 shadow-sm shadow-emerald-500/30"
//               )}
//             >
//               <span
//                 className={cn(
//                   "flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/60",
//                   active && "border-slate-200 bg-slate-50 text-slate-900"
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//               </span>
//               <span>{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="border-t border-slate-800/60 px-4 py-4 text-xs text-slate-500">
//         Occupation temps réel · <span className="text-emerald-400">HTB</span>
//       </div>
//     </aside>
//   );
// }

