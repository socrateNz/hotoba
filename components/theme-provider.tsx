"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Forcer le thème clair par défaut si aucun thème n'est défini
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    
    if (!savedTheme) {
      // Pas de thème sauvegardé, forcer le thème clair
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else if (savedTheme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else if (savedTheme === "dark") {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, []);

  if (!mounted) {
    // Pendant le chargement, appliquer le thème clair pour éviter le flash
    return (
      <div className="light">
        {children}
      </div>
    );
  }

  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemeProvider>
  );
}

