import { useEffect, useState } from "react";
import { LogoMark } from "./Icons";

const LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#evenements", label: "Événements" },
  { href: "#modules", label: "Modules" },
  { href: "#plateforme", label: "La Plateforme" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
        scrolled || open
          ? "border-b border-husk bg-night/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Liseré kente signature */}
      <div className="kente h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="TKD365 — retour en haut">
          <LogoMark className="h-9 w-9 text-gold" />
          <span className="font-display text-2xl uppercase tracking-wide text-bone">
            TKD365 <span className="text-base text-gold">PRO</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="navlink text-sm font-medium text-dune transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://tkd365.pro/sign-up-login-screen"
            target="_blank"
            rel="noreferrer"
            className="hidden bg-gold px-5 py-2.5 text-sm font-bold text-night transition-all duration-300 hover:bg-bone sm:inline-block [clip-path:polygon(0_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]"
          >
            Accéder à la plateforme
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-husk lg:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-bone transition-transform duration-300 ${
                open ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-gold transition-transform duration-300 ${
                open ? "-translate-y-1 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`overflow-hidden border-husk bg-night/95 backdrop-blur-md transition-all duration-500 lg:hidden ${
          open ? "max-h-96 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-5" aria-label="Navigation mobile">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-husk/60 py-3 font-medium text-bone transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://tkd365.pro/sign-up-login-screen"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 bg-gold px-5 py-3 text-center font-bold text-night"
          >
            Accéder à la plateforme
          </a>
        </nav>
      </div>
    </header>
  );
}
