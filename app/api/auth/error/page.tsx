"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

// Create a separate client component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "CredentialsSignin":
        return {
          title: "Erreur de connexion",
          message: "Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.",
          details: "Si vous n'avez pas encore de compte, créez-en un depuis la page d'inscription.",
        };
      case "Configuration":
        return {
          title: "Erreur de configuration",
          message: "Une erreur de configuration serveur est survenue.",
          details: "Veuillez contacter l'administrateur du système.",
        };
      case "AccessDenied":
        return {
          title: "Accès refusé",
          message: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
          details: "Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.",
        };
      default:
        return {
          title: "Erreur d'authentification",
          message: "Une erreur est survenue lors de la tentative de connexion.",
          details: error ? `Code d'erreur: ${error}` : "Erreur inconnue",
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 p-8 shadow-lg dark:shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
              {errorInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Hotel Touristique de Bana
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/50 dark:bg-rose-500/10">
            <p className="text-sm text-rose-800 dark:text-rose-200">
              {errorInfo.message}
            </p>
            {errorInfo.details && (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">
                {errorInfo.details}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition-colors"
            >
              Réessayer
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Créer un compte
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 p-8 shadow-lg">
          <div className="text-center">
            <div className="animate-pulse">Chargement...</div>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}