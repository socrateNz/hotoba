"use client";

import { useEffect, useState } from "react";
import {
  Booking,
  BookingStatus,
  createBooking,
  createTransaction,
  getBookings,
  getProfiles,
  getRooms,
  getTransactionsByBooking,
  updateBooking,
  Profile,
  Room,
  Transaction,
  TransactionType,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CreditCard,
  AlertTriangle,
  Check,
  Plus,
  X,
} from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("CASH");
  const [paying, setPaying] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [detailTransactions, setDetailTransactions] = useState<Transaction[]>(
    []
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [form, setForm] = useState<{
    guest_id: string;
    room_id: string;
    start_date: string;
    end_date: string;
    status: BookingStatus;
  }>({
    guest_id: "",
    room_id: "",
    start_date: "",
    end_date: "",
    status: "CONFIRMED",
  });

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    (async () => {
      setLoadingRooms(true);
      setLoadingClients(true);
      try {
        const [roomsData, profilesData] = await Promise.all([
          getRooms(),
          getProfiles(),
        ]);
        setRooms(roomsData.rooms);
        setClients(profilesData.profiles);
      } finally {
        setLoadingRooms(false);
        setLoadingClients(false);
      }
    })();
  }, []);

  const statusBadge = (status: BookingStatus) => {
    const label: Record<BookingStatus, string> = {
      PENDING: "En attente",
      CONFIRMED: "Confirmée",
      CANCELLED: "Annulée",
      CHECKED_IN: "En séjour",
      CHECKED_OUT: "Clôturée",
    };
    const color: Record<BookingStatus, string> = {
      PENDING: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
      CONFIRMED: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
      CANCELLED: "bg-slate-600/20 text-slate-300 ring-1 ring-slate-500/40",
      CHECKED_IN: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/40",
      CHECKED_OUT: "bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/40",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
          color[status]
        )}
      >
        <CalendarClock className="h-3 w-3" />
        {label[status]}
      </span>
    );
  };

  const openPayment = (booking: Booking) => {
    setPaymentBooking(booking);
    setAmount("");
    setType("CASH");
  };

  const handlePayment = async () => {
    if (!paymentBooking || !amount) return;
    setPaying(true);
    try {
      await createTransaction({
        booking_id: paymentBooking.id,
        amount: Number(amount),
        type,
      });
      setPaymentBooking(null);
      await reload();
    } finally {
      setPaying(false);
    }
  };

  const openDetails = async (booking: Booking) => {
    setDetailBooking(booking);
    setDetailTransactions([]);
    setDetailLoading(true);
    try {
      const data = await getTransactionsByBooking(booking.id);
      setDetailTransactions(data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.guest_id || !form.room_id || !form.start_date || !form.end_date) {
      setCreateError(
        "Veuillez sélectionner un client, une chambre et renseigner les dates."
      );
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await createBooking({
        guest_id: form.guest_id,
        room_id: form.room_id,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
      });
      setCreateOpen(false);
      setForm({
        guest_id: "",
        room_id: "",
        start_date: "",
        end_date: "",
        status: "CONFIRMED",
      });
      await reload();
    } catch (e: any) {
      setCreateError(e.message ?? "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Gestion des réservations
          </h2>
          <p className="text-sm text-slate-400">
            Vue liste des séjours avec statut et encaissements manuels.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateError(null);
            setForm({
              guest_id: clients[0]?.id ?? "",
              room_id: rooms[0]?.id ?? "",
              start_date: "",
              end_date: "",
              status: "CONFIRMED",
            });
            setCreateOpen(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-2xl bg-emerald-500 px-3 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle réservation
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-100">
            Réservations
          </h3>
          <span className="text-xs text-slate-500">
            {bookings.length} réservation(s)
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="min-w-full text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Chambre</th>
                <th className="px-4 py-3 text-left">Période</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Chargement des réservations...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Aucune réservation enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-slate-800/70 hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col">
                        <span className="text-slate-100">
                          {b.profiles?.full_name ?? "Client inconnu"}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          #{b.guest_id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col">
                        <span>Chambre {b.rooms?.number ?? "?"}</span>
                        <span className="text-[11px] text-slate-500">
                          ID {b.room_id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {new Date(b.start_date).toLocaleDateString("fr-FR")}{" "}
                      <span className="text-slate-500">→</span>{" "}
                      {new Date(b.end_date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">{statusBadge(b.status)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        className="inline-flex h-8 items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 text-[11px] font-medium text-slate-200 hover:bg-slate-800"
                        onClick={() => openDetails(b)}
                      >
                        Voir
                      </button>
                      {b.status === "PENDING" && (
                        <>
                          <button
                            className="inline-flex h-8 items-center gap-1 rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20"
                            onClick={async () => {
                              await updateBooking(b.id, { status: "CONFIRMED" });
                              await reload();
                            }}
                          >
                            Accepter
                          </button>
                          <button
                            className="inline-flex h-8 items-center gap-1 rounded-xl border border-rose-500/60 bg-rose-500/10 px-3 text-[11px] font-medium text-rose-300 hover:bg-rose-500/20"
                            onClick={async () => {
                              await updateBooking(b.id, { status: "CANCELLED" });
                              await reload();
                            }}
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      <button
                        className="inline-flex h-8 items-center gap-1 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20"
                        onClick={() => openPayment(b)}
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        Encaisser
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de création de réservation */}
      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">

            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Créer une réservation
                </h3>
                <p className="text-xs text-slate-500">
                  Saisie rapide d&apos;une réservation backoffice (anti-surbooking actif).
                </p>
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
                onClick={() => setCreateOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* FORM */}
            <div className="grid gap-3 md:grid-cols-2">

              {/* CLIENT */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Client
                </label>
                <select
                  value={form.guest_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, guest_id: e.target.value }))
                  }
                  disabled={loadingClients}
                  className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none ${!form.guest_id ? "text-slate-500" : "text-slate-100"
                    }`}
                >
                  <option value="" disabled>
                    {loadingClients
                      ? "Chargement des clients..."
                      : "Sélectionner un client"}
                  </option>

                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} • {c.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* CHAMBRE */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Chambre
                </label>
                <select
                  value={form.room_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, room_id: e.target.value }))
                  }
                  disabled={loadingRooms}
                  className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none ${!form.room_id ? "text-slate-500" : "text-slate-100"
                    }`}
                >
                  <option value="" disabled>
                    {loadingRooms
                      ? "Chargement des chambres..."
                      : "Sélectionner une chambre"}
                  </option>

                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number} • {r.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE ARRIVEE */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Date d&apos;arrivée
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_date: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* DATE DEPART */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Date de départ
                </label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_date: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="mt-3 space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Statut initial
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as BookingStatus,
                  }))
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="CHECKED_IN">En séjour</option>
              </select>
            </div>

            {/* ERROR */}
            {createError && (
              <p className="mt-2 text-[11px] text-rose-400">{createError}</p>
            )}

            {/* ACTIONS */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-2xl border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
                onClick={() => setCreateOpen(false)}
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={creating}
                onClick={() => {
                  if (!form.guest_id || !form.room_id) {
                    setCreateError("Veuillez sélectionner un client et une chambre.");
                    return;
                  }
                  handleCreate();
                }}
                className="rounded-2xl bg-emerald-500 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
              >
                {creating ? "Création..." : "Créer la réservation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal encaissement manuel */}
      {paymentBooking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Encaissement manuel
                </h3>
                <p className="text-xs text-slate-400">
                  {paymentBooking.profiles?.full_name ?? "Client"} • Chambre{" "}
                  {paymentBooking.rooms?.number ?? "?"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Montant encaissé (FCFA)
                </label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex : 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Mode de paiement
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                >
                  <option value="CASH">Espèces</option>
                  <option value="CARD">Carte</option>
                  <option value="TRANSFER">Virement</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <p className="flex items-start gap-2 text-[11px] text-slate-500">
                <AlertTriangle className="mt-[1px] h-3.5 w-3.5 text-amber-400" />
                Cet encaissement mettra à jour le solde de la réservation dans
                les rapports financiers.
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-2xl border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
                onClick={() => setPaymentBooking(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={paying}
                onClick={handlePayment}
                className="inline-flex items-center gap-1 rounded-2xl bg-emerald-500 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
              >
                {paying ? (
                  "Encaissement..."
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Valider l&apos;encaissement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détail réservation */}
      {detailBooking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Détail de la réservation
                </h3>
                <p className="text-xs text-slate-500">
                  {detailBooking.profiles?.full_name ?? "Client inconnu"} •
                  Chambre {detailBooking.rooms?.number ?? "?"}
                </p>
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
                onClick={() => setDetailBooking(null)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 text-xs text-slate-300 mb-4">
              <div className="space-y-1">
                <p className="text-slate-500 text-[11px]">Client</p>
                <p className="font-medium">
                  {detailBooking.profiles?.full_name ?? "Client inconnu"}
                </p>
                <p className="text-[11px] text-slate-500">
                  ID {detailBooking.guest_id.slice(0, 8)}…
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[11px]">Chambre</p>
                <p className="font-medium">
                  {detailBooking.rooms?.number ?? "?"}
                </p>
                <p className="text-[11px] text-slate-500">
                  ID {detailBooking.room_id.slice(0, 8)}…
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[11px]">Période</p>
                <p>
                  {new Date(
                    detailBooking.start_date
                  ).toLocaleDateString("fr-FR")}{" "}
                  <span className="text-slate-500">→</span>{" "}
                  {new Date(
                    detailBooking.end_date
                  ).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[11px]">Statut</p>
                {statusBadge(detailBooking.status)}
              </div>
            </div>

            {/* Bloc financier */}
            {(() => {
              const room = rooms.find((r) => r.id === detailBooking.room_id);
              const nights =
                (new Date(detailBooking.end_date).getTime() -
                  new Date(detailBooking.start_date).getTime()) /
                  (1000 * 60 * 60 * 24) || 0;
              const nbNights = Math.max(1, Math.round(nights));
              const totalTheorique =
                (room?.price ?? 0) * (isNaN(nbNights) ? 1 : nbNights);
              const totalEncaisse = detailTransactions.reduce(
                (sum, t) => sum + t.amount,
                0
              );
              const solde = totalTheorique - totalEncaisse;

              return (
                <div className="mb-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">
                      Montant séjour ({nbNights} nuitée{nbNights > 1 ? "s" : ""})
                    </span>
                    <span className="font-medium text-slate-100">
                      {totalTheorique.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">
                      Déjà encaissé
                    </span>
                    <span className="font-medium text-emerald-300">
                      {totalEncaisse.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">
                      Solde restant
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        solde <= 0 ? "text-emerald-300" : "text-amber-300"
                      )}
                    >
                      {solde.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Liste des encaissements */}
            <div className="space-y-2 text-xs">
              <p className="text-[11px] font-medium text-slate-300">
                Historique des encaissements
              </p>
              {detailLoading ? (
                <p className="text-[11px] text-slate-500">
                  Chargement des transactions...
                </p>
              ) : detailTransactions.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  Aucun encaissement enregistré pour cette réservation.
                </p>
              ) : (
                <div className="max-h-48 space-y-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
                  {detailTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-xl px-2 py-1 hover:bg-slate-900"
                    >
                      <span className="text-[11px] text-slate-400">
                        {new Date(t.created_at).toLocaleDateString("fr-FR")} -{" "}
                        {t.type}
                      </span>
                      <span className="text-xs font-medium text-slate-100">
                        {t.amount.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

