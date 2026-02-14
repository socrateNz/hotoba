import Link from "next/link";
import { BedDouble, Wifi, Car, UtensilsCrossed, MapPin, Star, ArrowRight, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 dark:border-slate-800/50 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                Hotel Touristique de Bana
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">Votre séjour de rêve</p>
            </div>
          </div>
          <nav className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Link href="#services" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Services
            </Link>
            <Link href="#galerie" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Galerie
            </Link>
            <Link href="/reservation" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Réserver
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-emerald-500/50 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 transition-colors"
            >
              Créer un compte
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl lg:text-6xl">
            Bienvenue à l&apos;Hotel Touristique de Bana
          </h1>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            Découvrez un havre de paix au cœur de Bana. Confort, élégance et service d&apos;exception pour un séjour inoubliable.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Réserver maintenant
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Découvrir nos services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">Nos Services</h2>
          <p className="text-slate-600 dark:text-slate-400">Tout ce dont vous avez besoin pour un séjour parfait</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BedDouble, title: "Chambres Confortables", desc: "Chambres spacieuses et élégantes avec vue panoramique" },
            { icon: Wifi, title: "Wi-Fi Gratuit", desc: "Connexion haut débit dans tout l'hôtel" },
            { icon: Car, title: "Parking Sécurisé", desc: "Stationnement gratuit pour tous nos clients" },
            { icon: UtensilsCrossed, title: "Restauration", desc: "Cuisine locale et internationale" },
          ].map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500/50 dark:hover:bg-slate-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{service.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Galerie Section */}
      <section id="galerie" className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">Galerie</h2>
          <p className="text-slate-600 dark:text-slate-400">Découvrez nos espaces et chambres</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/80 to-slate-50/90 dark:from-emerald-500/20 dark:via-slate-900/80 dark:to-slate-950/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-emerald-500/60 dark:text-emerald-400/60" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">Image {i}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-12 text-center dark:border-emerald-500/30 dark:from-emerald-500/10 dark:via-slate-900/80 dark:to-slate-950/90">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Star className="h-3.5 w-3.5" />
              Réservez dès maintenant
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-50 md:text-4xl">
              Prêt pour un séjour inoubliable ?
            </h2>
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              Réservez votre chambre en quelques clics. Paiement à l&apos;arrivée, confirmation immédiate.
            </p>
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Réserver maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 dark:border-slate-800/50 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Hotel Touristique de Bana</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Votre destination pour un séjour exceptionnel à Bana.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Liens rapides</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="#services" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#galerie" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Galerie
                  </Link>
                </li>
                <li>
                  <Link href="/reservation" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Réserver
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Contact</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>Bana, Cameroun</li>
                <li>+237 600 000 000</li>
                <li>contact@htb.cm</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 dark:border-slate-800/50 pt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Hotel Touristique de Bana. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
