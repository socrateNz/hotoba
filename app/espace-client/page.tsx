"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarClock,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
  BedDouble,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getBookings, getTransactionsByBooking, Booking, Transaction } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function EspaceClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/espace-client");
      return;
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "USER") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      loadBookings();
    }
  }, [status, session, router]);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (bookingId: string) => {
    setLoadingTransactions(true);
    try {
      const data = await getTransactionsByBooking(bookingId);
      setTransactions(data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const statusBadge = (status: Booking["status"]) => {
    const config: Record<Booking["status"], { label: string; className: string }> = {
      PENDING: {
        label: "En attente",
        className: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
      },
      CONFIRMED: {
        label: "Confirmée",
        className: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
      },
      CANCELLED: {
        label: "Annulée",
        className: "bg-slate-600/20 text-slate-300 ring-1 ring-slate-500/40",
      },
      CHECKED_IN: {
        label: "En séjour",
        className: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/40",
      },
      CHECKED_OUT: {
        label: "Clôturée",
        className: "bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/40",
      },
    };
    const { label, className } = config[status];
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium", className)}>
        <CalendarClock className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const calculateBalance = (booking: Booking, txs: Transaction[]) => {
    // Estimation basée sur le prix moyen (à améliorer avec room.price)
    const nights = Math.max(
      1,
      Math.round(
        (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    // Montant pour la chambre
    const estimatedTotal = 50000 * nights;
    const paid = txs.reduce((sum, t) => sum + t.amount, 0);
    return { estimatedTotal, paid, balance: estimatedTotal - paid };
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-50">
                Hotel Touristique de Bana
              </p>
              <p className="text-[11px] text-slate-500">Mon espace client</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">
              {(session?.user as any)?.full_name ?? session?.user?.email}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-50 md:text-4xl">
            Mon espace client
          </h1>
          <p className="text-slate-400">Consultez vos réservations et factures</p>
        </div>

        {/* Historique des séjours */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Historique des séjours</h2>
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-8 text-center">
              <BedDouble className="mx-auto mb-3 h-12 w-12 text-slate-600" />
              <p className="text-sm text-slate-400">Aucune réservation enregistrée</p>
              <Link
                href="/reservation"
                className="mt-4 inline-block rounded-2xl bg-emerald-500 px-6 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Réserver maintenant
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const balance = calculateBalance(booking, []);
                return (
                  <div
                    key={booking.id}
                    className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition-all hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <BedDouble className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-semibold text-slate-100">
                            Chambre {booking.rooms?.number ?? "?"}
                          </span>
                          {statusBadge(booking.status)}
                        </div>
                        <p className="mb-1 text-xs text-slate-400">
                          {new Date(booking.start_date).toLocaleDateString("fr-FR")} →{" "}
                          {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                        </p>
                        <button
                          onClick={() => {
                            if (selectedBooking?.id === booking.id) {
                              setSelectedBooking(null);
                              setTransactions([]);
                            } else {
                              setSelectedBooking(booking);
                              loadTransactions(booking.id);
                            }
                          }}
                          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          {selectedBooking?.id === booking.id ? "Masquer" : "Voir les détails"}
                        </button>
                      </div>
                    </div>

                    {/* Détails de la réservation */}
                    {selectedBooking?.id === booking.id && (
                      <div className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                        <div className="grid gap-3 text-xs md:grid-cols-2">
                          <div>
                            <p className="text-slate-500 text-[11px]">Période</p>
                            <p className="text-slate-100">
                              {new Date(booking.start_date).toLocaleDateString("fr-FR")} →{" "}
                              {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[11px]">Statut</p>
                            {statusBadge(booking.status)}
                          </div>
                        </div>

                        {/* Transactions */}
                        {loadingTransactions ? (
                          <p className="text-xs text-slate-400">Chargement des paiements...</p>
                        ) : transactions.length === 0 ? (
                          <p className="text-xs text-slate-400">Aucun paiement enregistré</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-300">Paiements reçus</p>
                            {transactions.map((tx) => (
                              <div
                                key={tx.id}
                                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                              >
                                <div>
                                  <p className="text-[11px] text-slate-400">
                                    {new Date(tx.created_at).toLocaleDateString("fr-FR")} - {tx.type}
                                  </p>
                                </div>
                                <span className="text-xs font-medium text-emerald-300">
                                  {tx.amount.toLocaleString("fr-FR")} FCFA
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Factures impayées */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Factures impayées
          </h2>
          {bookings.filter((b) => {
            // Simplification : considérer comme impayé si PENDING ou CONFIRMED sans transaction complète
            return b.status === "PENDING" || b.status === "CONFIRMED";
          }).length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
              <p className="text-sm text-slate-400">Aucune facture impayée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings
                .filter((b) => b.status === "PENDING" || b.status === "CONFIRMED")
                .map((booking) => {
                  const balance = calculateBalance(booking, []);
                  return (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-sm font-semibold text-slate-100">
                            Chambre {booking.rooms?.number ?? "?"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(booking.start_date).toLocaleDateString("fr-FR")} →{" "}
                            {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Montant estimé</p>
                          <p className="text-sm font-semibold text-amber-300">
                            {balance.estimatedTotal.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-400">
                        Le paiement se fera à l&apos;arrivée. Vous recevrez une confirmation par email une fois la réservation validée.
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
