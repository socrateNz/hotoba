"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });
      
      if (res?.error) {
        let errorMessage = "Identifiants invalides";
        
        if (res.error === "CredentialsSignin") {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (res.error.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (res.error) {
          errorMessage = res.error;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      if (res?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion");
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/dev/seed-admin", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setSeedMessage(
          `Erreur création admin: ${json.error ?? "inconnue"}`
        );
      } else {
        setSeedMessage(
          `Admin créé avec succès ! Email: admin@htb.test, Mot de passe: AdminHtb@2024`
        );
      }
    } catch (e) {
      setSeedMessage("Erreur réseau lors de la création de l'admin");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 p-8 shadow-lg dark:shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40" />
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
              Connexion
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Hotel Touristique de Bana
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="ex: votre@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-500/50 dark:bg-rose-500/10">
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {error}
              </p>
            </div>
          )}
          {seedMessage && (
            <div className={`rounded-2xl border p-3 ${
              seedMessage.includes("Erreur")
                ? "border-rose-200 bg-rose-50 dark:border-rose-500/50 dark:bg-rose-500/10"
                : "border-emerald-200 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-500/10"
            }`}>
              <p className={`text-xs ${
                seedMessage.includes("Erreur")
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}>
                {seedMessage}
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>
            <button
              type="button"
              onClick={createAdmin}
              disabled={seeding}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {seeding ? "Création..." : "Créer le compte admin par défaut"}
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-500">
              (Bouton temporaire pour le développement)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}