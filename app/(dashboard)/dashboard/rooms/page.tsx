"use client";

import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  Room,
  RoomStatus,
} from "@/lib/api-client";
import { BadgeCheck, Pencil, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    number: "",
    type: "",
    price: "",
    equipments: "",
  });
  const [editForm, setEditForm] = useState({
    number: "",
    type: "",
    price: "",
    equipments: "",
    status: "AVAILABLE" as RoomStatus,
  });

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data.rooms);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setEditForm({
      number: room.number,
      type: room.type,
      price: String(room.price),
      equipments: room.equipments.join(", "),
      status: room.status,
    });
  };

  const handleUpdate = async () => {
    if (!editingRoom || !editingRoom.id) {
      return;
    }
    setUpdating(true);
    try {
      await updateRoom(editingRoom.id, {
        number: editForm.number,
        type: editForm.type,
        price: Number(editForm.price),
        status: editForm.status,
        equipments: editForm.equipments
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
      });
      setEditingRoom(null);
      await reload();
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoom(deleteTarget.id);
      setDeleteTarget(null);
      await reload();
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const handleCreate = async () => {
    if (!form.number || !form.type || !form.price) return;
    setCreating(true);
    try {
      await createRoom({
        number: form.number,
        type: form.type,
        price: Number(form.price),
        status: "AVAILABLE",
        equipments: form.equipments
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
      });
      setForm({ number: "", type: "", price: "", equipments: "" });
      setCreateOpen(false);
      await reload();
    } finally {
      setCreating(false);
    }
  };

  const statusPill = (status: RoomStatus) => {
    const label: Record<RoomStatus, string> = {
      AVAILABLE: "Disponible",
      OCCUPIED: "Occupée",
      CLEANING: "Ménage",
      MAINTENANCE: "Maintenance",
    };
    const color: Record<RoomStatus, string> = {
      AVAILABLE:
        "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
      OCCUPIED: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/40",
      CLEANING: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
      MAINTENANCE: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/40",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
          color[status]
        )}
      >
        <BadgeCheck className="h-3 w-3" />
        {label[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Gestion des chambres
          </h2>
          <p className="text-sm text-slate-400">
            Créez, éditez et suivez l&apos;état des chambres de l&apos;Hôtel
            Touristique de Bana.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ number: "", type: "", price: "", equipments: "" });
            setCreateOpen(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-2xl bg-emerald-500 px-3 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle chambre
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-100">
            Liste des chambres
          </h3>
          <span className="text-xs text-slate-500">
            {rooms.length} chambre(s)
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="min-w-full text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Numéro</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Prix</th>
                <th className="px-4 py-3 text-left">Équipements</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Chargement des chambres...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Aucune chambre enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-t border-slate-800/70 hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {room.number}
                    </td>
                    <td className="px-4 py-3">{room.type}</td>
                    <td className="px-4 py-3 text-right">
                      {room.price.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {room.equipments.join(" • ")}
                    </td>
                    <td className="px-4 py-3">{statusPill(room.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800"
                          onClick={() => openEdit(room)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-rose-400 hover:bg-rose-500/10"
                          onClick={() => setDeleteTarget(room)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de création de chambre */}
      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Créer une nouvelle chambre
                </h3>
                <p className="text-xs text-slate-500">
                  Renseignez les informations de base de la chambre.
                </p>
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
                onClick={() => setCreateOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Numéro
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex: 101"
                  value={form.number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, number: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Type
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Standard, Deluxe, Suite..."
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Prix (FCFA / nuit)
                </label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex : 15000"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Équipements (séparés par des virgules)
              </label>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                placeholder="Wi-Fi, TV, Climatisation..."
                value={form.equipments}
                onChange={(e) =>
                  setForm((f) => ({ ...f, equipments: e.target.value }))
                }
              />
            </div>
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
                onClick={handleCreate}
                className="rounded-2xl bg-emerald-500 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
              >
                {creating ? "Création..." : "Créer la chambre"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog d'édition de chambre */}
      {editingRoom && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Modifier la chambre {editingRoom.number}
                </h3>
                <p className="text-xs text-slate-500">
                  Ajustez les informations de la chambre puis enregistrez.
                </p>
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
                onClick={() => setEditingRoom(null)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Numéro
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  value={editForm.number}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, number: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Type
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, type: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Prix (FCFA / nuit)
                </label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Statut
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      status: e.target.value as RoomStatus,
                    }))
                  }
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="OCCUPIED">Occupée</option>
                  <option value="CLEANING">Ménage</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Équipements (séparés par des virgules)
              </label>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                value={editForm.equipments}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, equipments: e.target.value }))
                }
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-2xl border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
                onClick={() => setEditingRoom(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={handleUpdate}
                className="rounded-2xl bg-emerald-500 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
              >
                {updating ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-rose-500/40 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Supprimer cette chambre ?
                </h3>
                <p className="text-xs text-slate-400">
                  Chambre {deleteTarget.number} • {deleteTarget.type}
                </p>
              </div>
            </div>
            <p className="mb-4 text-xs text-slate-400">
              Cette action est irréversible. Assurez-vous que la chambre n&apos;est
              pas associée à des réservations actives avant de continuer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-2xl border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
                onClick={() => setDeleteTarget(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="rounded-2xl bg-rose-500 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-rose-500/40 hover:bg-rose-400 disabled:opacity-60"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

