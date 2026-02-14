"use client";

import { useEffect, useState } from "react";
import {
  createProfile,
  getStaffProfiles,
  Profile,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Users, Mail, Phone, Shield, Plus, X } from "lucide-react";

type StaffRole = "ADMIN" | "MANAGER" | "STAFF";

export default function StaffPage() {
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    full_name: string;
    email: string;
    phone: string;
    role: StaffRole;
  }>({
    full_name: "",
    email: "",
    phone: "",
    role: "STAFF",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getStaffProfiles();
        // On garde uniquement ADMIN / MANAGER / STAFF
        setStaff(data.profiles.filter((p) => p.role !== "USER"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!form.full_name || !form.email) {
      setError("Nom complet et email sont obligatoires.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const { profile } = await createProfile({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
      });
      setStaff((prev) => [profile, ...prev]);
      setForm({ full_name: "", email: "", phone: "", role: "STAFF" });
      setCreateOpen(false);
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de la création du collaborateur.");
    } finally {
      setCreating(false);
    }
  };

  const roleBadge = (role: StaffRole) => {
    const label: Record<StaffRole, string> = {
      ADMIN: "ADMIN",
      MANAGER: "MANAGER",
      STAFF: "STAFF",
    };
    const color: Record<StaffRole, string> = {
      ADMIN: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40",
      MANAGER: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40",
      STAFF: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
          color[role]
        )}
      >
        <Shield className="h-3 w-3" />
        {label[role]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Gestion RH – Équipe HTB
          </h2>
          <p className="text-sm text-slate-400">
            Liste des collaborateurs (ADMIN, MANAGER, STAFF) avec leurs
            coordonnées.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ full_name: "", email: "", phone: "", role: "STAFF" });
            setError(null);
            setCreateOpen(true);
          }}
          className="inline-flex h-9 items-center gap-2 rounded-2xl bg-emerald-500 px-3 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouveau collaborateur
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-900 text-slate-300">
              <Users className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              Collaborateurs
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {staff.length} collaborateur(s)
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="min-w-full text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Chargement des collaborateurs...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    Aucun collaborateur enregistré.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-slate-800/70 hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col">
                        <span className="text-slate-100">{s.full_name}</span>
                        <span className="text-[11px] text-slate-500">
                          ID {s.id.slice(0, 8)}…
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Mail className="h-3 w-3 text-slate-500" />
                          {s.email}
                        </span>
                        {s.phone && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Phone className="h-3 w-3 text-slate-500" />
                            {s.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {roleBadge(s.role as StaffRole)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog création collaborateur */}
      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Nouveau collaborateur
                </h3>
                <p className="text-xs text-slate-500">
                  Créez un membre de l&apos;équipe avec le rôle approprié.
                </p>
              </div>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800"
                onClick={() => setCreateOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Nom complet
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex : Marie Manager"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Email professionnel
                </label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="collaborateur@htb.cm"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Téléphone (optionnel)
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="+2376..."
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Rôle
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as StaffRole,
                    }))
                  }
                >
                  <option value="STAFF">STAFF</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {error && (
                <p className="text-[11px] text-rose-400">
                  {error}
                </p>
              )}
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
                {creating ? "Création..." : "Créer le collaborateur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

