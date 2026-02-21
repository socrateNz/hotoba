import Link from "next/link";
import Image from "next/image";
import {
  BedDouble, Wifi, Car, UtensilsCrossed, MapPin, Star,
  ArrowRight, Calendar, Phone, Mail, Clock, Users,
  Coffee, Sparkles, Shield, Award
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-linear-to-br from-amber-600 to-amber-400">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">H</div>
            </div>
            <div>
              <span className="text-lg font-serif font-semibold tracking-wide text-slate-900 dark:text-white">
                Hôtel Touristique de Bana
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Palace & Spa
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#accueil" className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors">
              Accueil
            </Link>
            <Link href="#services" className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors">
              Services
            </Link>
            <Link href="#galerie" className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors">
              Galerie
            </Link>
            <Link href="#avis" className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors">
              Avis
            </Link>
            <Link href="#contact" className="text-sm font-medium text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/reservation"
              className="hidden rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors sm:inline-block"
            >
              Réserver
            </Link>
            <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800 md:hidden">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 to-slate-900/70 dark:from-slate-950/80 dark:to-slate-950/75" />
          {/* <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3')] bg-cover bg-center" /> */}
          <div className="h-full w-full bg-[url('/hotoba.webp')] bg-cover bg-center" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Luxe & Confort à Bana</span>
            </div>
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-white lg:text-7xl">
              Un Art de Vivre
              <span className="block text-amber-400">Exceptionnel</span>
            </h1>
            <p className="mb-10 text-lg text-slate-200 lg:text-xl">
              Découvrez un havre de paix où l'élégance traditionnelle rencontre le confort moderne.
              Une expérience unique au cœur de Bana.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/reservation"
                className="rounded-lg bg-amber-600 px-8 py-4 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
              >
                Réserver votre séjour
              </Link>
              <Link
                href="#services"
                className="rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Découvrir l'hôtel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Nos Prestations
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
              Un Service d'Excellence
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Des prestations haut de gamme pour rendre votre séjour inoubliable
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BedDouble, title: "Chambres Prestiges", desc: "Suites spacieuses avec vue panoramique et literie haut de gamme" },
              { icon: Coffee, title: "Petit-déjeuner", desc: "Buffet gastronomique avec produits locaux et internationaux" },
              { icon: Wifi, title: "Connexion Premium", desc: "Wi-Fi fibre optique dans tout l'établissement" },
              { icon: Car, title: "Service Voiturier", desc: "Parking privé et service de voiturier 24h/24" },
              { icon: UtensilsCrossed, title: "Restaurant Étoilé", desc: "Cuisine raffinée du Chef Marc Veyrat" },
              { icon: Users, title: "Salle de Réception", desc: "Espaces modulables pour vos événements" },
              { icon: Shield, title: "Sécurité 24h/24", desc: "Surveillance et personnel dédié" },
              { icon: Award, title: "Spa & Bien-être", desc: "Soins traditionnels et massages" },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-slate-900"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors dark:bg-amber-900/30 dark:text-amber-400">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galerie Section */}
      <section id="galerie" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Notre Galerie
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
              Un Cadre d'Exception
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Découvrez en images l'ambiance unique de notre établissement
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Suite Présidentielle", desc: "Vue panoramique sur les montagnes" },
              { title: "Restaurant Gastronomique", desc: "Cuisine étoilée" },
              { title: "Piscine à débordement", desc: "Eau chauffée toute l'année" },
              { title: "Spa & Hammam", desc: "Soins traditionnels" },
              { title: "Terrasse Panoramique", desc: "Coucher de soleil magique" },
              { title: "Jardin Tropical", desc: "Espace de détente" },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 aspect-4/3 cursor-pointer"
              >
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-slate-400" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="font-serif text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis Section */}
      <section id="avis" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Témoignages
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Claude Tchamgoue",
                date: "Séjour en Février 2024",
                comment: "Un séjour exceptionnel dans un cadre magnifique. Le personnel est aux petits soins et la cuisine est remarquable.",
                rating: 5
              },
              {
                name: "Annaelle Kadji",
                date: "Séjour en Janvier 2024",
                comment: "Le luxe discret et l'authenticité des lieux en font une adresse incontournable à Bana. Je recommande vivement.",
                rating: 5
              },
              {
                name: "Bernard Kameni",
                date: "Séjour en Décembre 2023",
                comment: "Un véritable havre de paix. Les chambres sont spacieuses et le spa est divin. Nous reviendrons sans hésiter.",
                rating: 5
              }
            ].map((avis, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
                <div className="mb-4 flex gap-1">
                  {[...Array(avis.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-slate-600 dark:text-slate-400 italic">"{avis.comment}"</p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{avis.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">{avis.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-600 to-amber-400 px-8 py-16 text-center lg:px-16">
            {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" /> */}
            <div className="absolute inset-0 bg-[url('/hotoba2.webp')] bg-cover bg-center opacity-10" />
            <div className="relative">
              <h2 className="mb-6 font-serif text-4xl font-bold text-white lg:text-5xl">
                Prêt pour une expérience unique ?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-amber-50">
                Réservez votre séjour dès maintenant et bénéficiez de nos offres exclusives
              </p>
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Réserver en ligne
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-linear-to-br from-amber-600 to-amber-400">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">H</div>
                </div>
                <div>
                  <span className="text-lg font-serif font-semibold tracking-wide text-slate-900 dark:text-white">
                    Hôtel Touristique de Bana
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Palace & Spa
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                L'excellence de l'hôtellerie traditionnelle camerounaise, sublimée par le confort moderne.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold text-slate-900 dark:text-white">Liens utiles</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#accueil" className="text-sm text-slate-600 hover:text-amber-600 dark:text-slate-400 transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="text-sm text-slate-600 hover:text-amber-600 dark:text-slate-400 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#galerie" className="text-sm text-slate-600 hover:text-amber-600 dark:text-slate-400 transition-colors">
                    Galerie
                  </Link>
                </li>
                <li>
                  <Link href="/reservation" className="text-sm text-slate-600 hover:text-amber-600 dark:text-slate-400 transition-colors">
                    Réservation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold text-slate-900 dark:text-white">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Quartier Royal, Bana<br />Cameroun
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">+237 699 999 999</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-600 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">contact@hotelbana.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold text-slate-900 dark:text-white">Horaires</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p>Réception 24h/24</p>
                    <p>Restaurant: 7h - 23h</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center lg:flex-row">
              <p className="text-sm text-slate-500 dark:text-slate-500">
                © {new Date().getFullYear()} Hôtel Touristique de Bana. Tous droits réservés.
              </p>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                {"design and build by "}
                <Link href={"https://portfolio-socrate.vercel.app"} className="text-amber-600 underline">{"Etarcos Dev"}</Link>
              </span>
              {/* <div className="flex gap-6">
                <Link href="/mentions-legales" className="text-sm text-slate-500 hover:text-amber-600 dark:text-slate-500 transition-colors">
                  Mentions légales
                </Link>
                <Link href="/confidentialite" className="text-sm text-slate-500 hover:text-amber-600 dark:text-slate-500 transition-colors">
                  Confidentialité
                </Link>
                <Link href="/cgv" className="text-sm text-slate-500 hover:text-amber-600 dark:text-slate-500 transition-colors">
                  CGV
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}