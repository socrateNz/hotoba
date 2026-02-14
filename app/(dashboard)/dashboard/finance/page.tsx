"use client";

import { useEffect, useMemo, useState } from "react";
import { getDashboardToday, getAllTransactions, Transaction } from "@/lib/api-client";
import { KpiCard } from "@/components/charts/kpi-card";
import { CreditCard, Wallet, ArrowDownUp } from "lucide-react";

export default function FinancePage() {
  const [metrics, setMetrics] = useState<{
    revenue_today: number;
    occupancy_rate: number;
    arrivals: number;
    departures: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [m, tx] = await Promise.all([
          getDashboardToday().catch(() => null),
          getAllTransactions().catch(() => ({ transactions: [] })),
        ]);
        if (m) {
          setMetrics({
            revenue_today: m.revenue_today ?? 0,
            occupancy_rate: m.occupancy_rate ?? 0,
            arrivals: m.arrivals ?? 0,
            departures: m.departures ?? 0,
          });
        }
        setTransactions(tx.transactions ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { total, todayTotal, byType } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    let total = 0;
    let todayTotal = 0;
    const byType: Record<string, number> = {};
    for (const t of transactions) {
      total += t.amount;
      const d = t.created_at?.slice(0, 10);
      if (d === todayStr) {
        todayTotal += t.amount;
      }
      byType[t.type] = (byType[t.type] ?? 0) + t.amount;
    }
    return { total, todayTotal, byType };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Finances & encaissements
          </h2>
          <p className="text-sm text-slate-400">
            Vue consolidée des encaissements et des flux de trésorerie.
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="CA encaissé (jour)"
          value={`${(metrics?.revenue_today ?? 0).toLocaleString("fr-FR")} FCFA`}
          helper="Revenu de la journée tous canaux"
          trend="+12% vs N-1"
          icon={<CreditCard className="h-4 w-4" />}
          trendPositive
        />
        <KpiCard
          label="CA total encaissé"
          value={`${total.toLocaleString("fr-FR")} FCFA`}
          helper="Somme des transactions enregistrées"
          icon={<Wallet className="h-4 w-4" />}
          trend={todayTotal > 0 ? `+${todayTotal.toLocaleString("fr-FR")} FCFA aujourd'hui` : "Aucun encaissement aujourd'hui"}
          trendPositive={todayTotal > 0}
        />
        <KpiCard
          label="Nombre de transactions"
          value={transactions.length.toString()}
          helper="Dernières opérations en base"
          icon={<ArrowDownUp className="h-4 w-4" />}
          trend=""
        />
        <KpiCard
          label="Taux d'occupation"
          value={`${metrics?.occupancy_rate ?? 0}%`}
          helper="Impact direct sur les revenus hébergement"
          trend="+5 pts"
          icon={<ArrowDownUp className="h-4 w-4" />}
          trendPositive={(metrics?.occupancy_rate ?? 0) >= 80}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {/* Répartition par type de paiement */}
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-100">
            Répartition par mode de paiement
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {["CASH", "CARD", "TRANSFER", "OTHER"].map((t) => {
              const val = byType[t] ?? 0;
              if (total === 0 && val === 0) return null;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return (
                <li
                  key={t}
                  className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2"
                >
                  <span className="uppercase tracking-wide text-slate-400">
                    {t}
                  </span>
                  <span className="text-xs font-medium text-slate-100">
                    {val.toLocaleString("fr-FR")} FCFA{" "}
                    <span className="text-slate-500">({pct}%)</span>
                  </span>
                </li>
              );
            })}
            {total === 0 && (
              <li className="text-[11px] text-slate-500">
                Aucune transaction enregistrée pour le moment.
              </li>
            )}
          </ul>
        </div>

        {/* Dernières transactions */}
        <div className="lg:col-span-2 space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Dernières transactions
            </h3>
            <span className="text-xs text-slate-500">
              {transactions.length} transaction(s)
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90">
            <table className="min-w-full text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Réservation</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-[11px] text-slate-500"
                    >
                      Chargement des transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-[11px] text-slate-500"
                    >
                      Aucune transaction pour le moment.
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 50).map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-slate-800/70 hover:bg-slate-900/70"
                    >
                      <td className="px-3 py-2">
                        {new Date(t.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2 text-slate-400">
                        #{t.booking_id.slice(0, 8)}…
                      </td>
                      <td className="px-3 py-2">
                        {t.type}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-slate-100">
                        {t.amount.toLocaleString("fr-FR")} FCFA
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

