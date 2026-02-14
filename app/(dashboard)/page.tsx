import { getBookings, getRooms, getProfiles } from "@/lib/api-client";
import { KpiCard } from "@/components/charts/kpi-card";
import {
  BedDouble,
  CreditCard,
  Users,
  AlertTriangle,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getDashboardToday } from "@/lib/services/dashboard.service";
import { requireAuth, requireRole } from "@/lib/api-auth";

async function getDashboardMetrics() {
  const auth = await requireAuth();
  if (auth.error || !auth.user) return null;

  const forbidden = requireRole(auth.user, ["ADMIN", "MANAGER"]);
  if (forbidden) return null;

  try {
    return await getDashboardToday();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [metrics, bookingsRes, roomsRes, profilesRes] = await Promise.all([
    getDashboardMetrics(),
    getBookings().catch(() => ({ bookings: [] })),
    getRooms().catch(() => ({ rooms: [] })),
    getProfiles().catch(() => ({ profiles: [] })),
  ]);

  const revenue = metrics?.revenue_today ?? 0;
  const occupancy = metrics?.occupancy_rate ?? 0;
  const arrivals = metrics?.arrivals ?? 0;
  const departures = metrics?.departures ?? 0;

  const bookings = bookingsRes.bookings ?? [];
  const rooms = roomsRes.rooms ?? [];
  const profiles = profilesRes.profiles ?? [];

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const today = new Date();
  const inHouseCount = bookings.filter((b) => {
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);
    const activeStatus =
      b.status === "CHECKED_IN" || b.status === "CONFIRMED";
    return activeStatus && start <= today && end > today;
  }).length;
  const clientsCount = profiles.filter((p) => p.role === "USER").length;
  const staffCount = profiles.filter((p) => p.role !== "USER").length;
  const debtorsCount = (metrics as any)?.debtors?.length ?? 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Bonjour, Admin
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vue consolidée des arrivées, départs et encaissements pour
            aujourd&apos;hui.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            Taux d&apos;occupation : {occupancy}%
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Arrivées : {arrivals}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Départs : {departures}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="CA encaissé (jour)"
          value={`${revenue.toLocaleString("fr-FR")} FCFA`}
          helper="Inclut extras & taxes"
          trend="+12% vs. N-1"
          icon={<CreditCard className="h-4 w-4" />}
          trendPositive
        />
        <KpiCard
          label="Taux d'occupation"
          value={`${occupancy}%`}
          helper={`${occupancy >= 85 ? "Très bon taux" : "Peut être optimisé"}`}
          trend="+5 pts"
          icon={<BedDouble className="h-4 w-4" />}
          trendPositive={occupancy >= 80}
        />
        <KpiCard
          label="Réservations en attente"
          value={pendingCount.toString()}
          helper="Demandes à traiter"
          trend={pendingCount > 0 ? `${pendingCount} en file` : "Aucune en attente"}
          icon={<AlertTriangle className="h-4 w-4" />}
          trendPositive={pendingCount === 0}
        />
        <KpiCard
          label="Clients en séjour"
          value={inHouseCount.toString()}
          helper="Réservations en statut EN SÉJOUR"
          trend="+3"
          icon={<Users className="h-4 w-4" />}
          trendPositive
        />
        <KpiCard
          label="Clients & staff"
          value={`${clientsCount} / ${staffCount}`}
          helper="Clients (USER) • Staff (ADMIN / MANAGER / STAFF)"
          trend="Base actifs"
          icon={<Users className="h-4 w-4" />}
          trendPositive
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 space-y-3 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Arrivées & départs du jour
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-500">
              {arrivals} arrivées • {departures} départs
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80 p-0 text-xs text-slate-600 dark:text-slate-500 overflow-hidden">
            <table className="min-w-full text-[11px] text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 text-[10px] uppercase text-slate-600 dark:bg-slate-900/90 dark:text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Chambre</th>
                  <th className="px-3 py-2 text-left">Période</th>
                  <th className="px-3 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-[11px] text-slate-500 dark:text-slate-500"
                    >
                      Aucune réservation pour aujourd&apos;hui.
                    </td>
                  </tr>
                ) : (
                  bookings
                    .slice(0, 8)
                    .map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-slate-200 hover:bg-slate-100 dark:border-slate-800/70 dark:hover:bg-slate-900/70"
                      >
                        <td className="px-3 py-2">
                          {b.profiles?.full_name ?? "Client"}
                        </td>
                        <td className="px-3 py-2">
                          {b.rooms?.number ?? "?"}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                          {new Date(
                            b.start_date
                          ).toLocaleDateString("fr-FR")}{" "}
                          →{" "}
                          {new Date(
                            b.end_date
                          ).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                          {b.status}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Alertes opérationnelles
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/80">
              <span>{debtorsCount} clients débiteurs</span>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                À suivre
              </span>
            </li>
            <li className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/80">
              <span>Suivi ménage & maintenance</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                Prochain sprint
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}