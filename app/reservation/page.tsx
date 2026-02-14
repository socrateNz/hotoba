"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle, BedDouble, MapPin } from "lucide-react";
import { getAvailableRooms, checkRoomAvailability, Room } from "@/lib/api-client-public";
import { createBooking } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function ReservationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/reservation");
      return;
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "USER") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      (async () => {
        try {
          const data = await getAvailableRooms();
          setRooms(data.rooms);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [status, session, router]);

  const handleCheckAvailability = async () => {
    if (!selectedRoom || !startDate || !endDate) {
      setError("Veuillez sélectionner une chambre et des dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("La date de départ doit être après la date d'arrivée");
      return;
    }

    setChecking(true);
    setError(null);
    try {
      const result = await checkRoomAvailability(selectedRoom.id, startDate, endDate);
      setAvailable(result.available);
      if (!result.available) {
        setError("Cette chambre n'est pas disponible pour ces dates");
      }
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de la vérification");
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !startDate || !endDate) {
      setError("Veuillez sélectionner une chambre et des dates");
      return;
    }

    if (available === false) {
      setError("Veuillez vérifier la disponibilité avant de réserver");
      return;
    }

    if (!session?.user || (session.user as any).role !== "USER") {
      setError("Vous devez être connecté pour réserver");
      router.push("/login?callbackUrl=/reservation");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        guest_id: (session.user as any).id,
        room_id: selectedRoom.id,
        start_date: startDate,
        end_date: endDate,
        status: "PENDING",
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de la réservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && !session)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-20 md:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950/90 p-12 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-4 ring-emerald-500/20">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-50">Réservation confirmée !</h1>
            <p className="mb-8 text-slate-400">
              Votre demande de réservation a été enregistrée avec succès. Vous recevrez une confirmation par email une fois que notre équipe aura validé votre réservation.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/espace-client"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition-colors"
              >
                Mon espace client
              </Link>
            </div>
          </div>
        </div>
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
              <p className="text-[11px] text-slate-500">Réservation</p>
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-slate-50 md:text-4xl">Réserver votre séjour</h1>
          <p className="text-slate-400">Sélectionnez une chambre et vos dates de séjour</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection chambre */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <label className="mb-4 block text-sm font-semibold text-slate-100">
              Choisir une chambre
            </label>
            {loading ? (
              <p className="text-sm text-slate-400">Chargement des chambres...</p>
            ) : rooms.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune chambre disponible pour le moment</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoom(room);
                      setAvailable(null);
                      setError(null);
                    }}
                    className={cn(
                      "group rounded-2xl border p-4 text-left transition-all",
                      selectedRoom?.id === room.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-950/50 hover:border-slate-600"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-slate-100">
                          Chambre {room.number}
                        </span>
                      </div>
                      {selectedRoom?.id === room.id && (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="mb-2 text-xs text-slate-400">{room.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-300">
                        {room.price.toLocaleString("fr-FR")} FCFA/nuit
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {room.equipments.length} équipement{room.equipments.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <label className="mb-3 block text-sm font-semibold text-slate-100">
                Date d&apos;arrivée
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setAvailable(null);
                  setError(null);
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <label className="mb-3 block text-sm font-semibold text-slate-100">
                Date de départ
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setAvailable(null);
                  setError(null);
                }}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Vérification disponibilité */}
          {selectedRoom && startDate && endDate && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checking}
                className="w-full rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-60 transition-colors"
              >
                {checking ? "Vérification..." : "Vérifier la disponibilité"}
              </button>
              {available !== null && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  {available ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-emerald-300">Chambre disponible pour ces dates</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-rose-400" />
                      <span className="text-sm text-rose-300">Chambre non disponible pour ces dates</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Informations client */}
          {available === true && session?.user && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">Vos informations</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={(session.user as any).full_name ?? session.user.email ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={session.user.email ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Ces informations proviennent de votre compte. Pour les modifier, rendez-vous dans votre{" "}
                <Link href="/espace-client" className="text-emerald-400 hover:text-emerald-300">
                  espace client
                </Link>
                .
              </p>
            </div>
          )}

          {/* Résumé et prix */}
          {selectedRoom && startDate && endDate && available === true && (
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950/90 p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">Résumé de votre réservation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Chambre {selectedRoom.number}</span>
                  <span>{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>
                    {new Date(startDate).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(endDate).toLocaleDateString("fr-FR")}
                  </span>
                  <span>
                    {Math.max(
                      1,
                      Math.round(
                        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                      )
                    )}{" "}
                    nuitée
                    {Math.max(
                      1,
                      Math.round(
                        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                      )
                    ) > 1
                      ? "s"
                      : ""}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-emerald-500/20 pt-4">
                  <span className="font-semibold text-slate-100">Total</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {(
                      selectedRoom.price *
                      Math.max(
                        1,
                        Math.round(
                          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                    ).toLocaleString("fr-FR")}{" "}
                    FCFA
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  Le paiement se fera à l&apos;arrivée. Vous recevrez une confirmation par email.
                </p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            </div>
          )}

          {/* Bouton submit */}
          {available === true && session?.user && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Traitement..." : "Confirmer la réservation"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
