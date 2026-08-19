import { useEffect, useState } from "react";
import { STATS, QUICK_CHIPS } from "../data";
import { useCountUp, useInView } from "../hooks";
import LiveScoreboard from "./LiveScoreboard";
import { ArrowRight } from "./Icons";
import Reveal from "./Reveal";

function StatCell({
  value,
  suffix,
  label,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const n = useCountUp(value, start);
  return (
    <div className="px-6 py-7 sm:px-8">
      <span className="kente inline-block h-1.5 w-8" aria-hidden="true" />
      <p className="mt-3 font-display text-4xl leading-none text-bone tabular-nums sm:text-5xl">
        {n.toLocaleString("fr-FR")}
        <span className="text-gold">{suffix}</span>
      </p>
      <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  const [masksOn, setMasksOn] = useState(false);
  const [statsRef, statsInView] = useInView<HTMLDivElement>();

  useEffect(() => {
    const id = window.setTimeout(() => setMasksOn(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="mud-bg relative overflow-hidden pb-16 pt-32 sm:pt-36">
      {/* Lueurs ambiantes */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-gold/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-1/3 h-[460px] w-[460px] rounded-full bg-flame/[0.07] blur-[130px]"
        aria-hidden="true"
      />
      {/* Filigrane vertical */}
      <span
        className="outline-gold pointer-events-none absolute -left-7 top-1/3 hidden select-none font-display text-7xl opacity-70 [writing-mode:vertical-rl] xl:block"
        aria-hidden="true"
      >
        TKD · 365
      </span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          {/* Colonne éditoriale */}
          <div className={masksOn ? "masks-on" : ""}>
            <p className="mask-line">
              <span
                style={{ display: "flex" }}
                className="items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs"
              >
                <span className="kente inline-block h-2 w-12" aria-hidden="true" />
                Plateforme officielle de gestion
              </span>
            </p>

            <h1 className="mt-7 font-display text-[clamp(3rem,8.5vw,6.2rem)] uppercase leading-[0.94] text-bone">
              <span className="mask-line">
                <span style={{ transitionDelay: "100ms" }}>La plateforme</span>
              </span>
              <span className="mask-line">
                <span style={{ transitionDelay: "230ms" }}>
                  tout-en-un du
                </span>
              </span>
              <span className="mask-line">
                <span className="text-gold" style={{ transitionDelay: "360ms" }}>
                  Taekwondo
                </span>
              </span>
            </h1>

            <Reveal delay={420}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-dune sm:text-lg">
                TKD365 pro centralise la gestion complète de vos compétitions{" "}
                <strong className="font-semibold text-bone">Kyorugi, Poomsae, Casse et Démonstration</strong>{" "}
                — des inscriptions au scoring en direct, des brackets aux classements finaux.
              </p>
            </Reveal>

            <Reveal delay={520}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="https://tkd365.pro/sign-up-login-screen"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 bg-gold px-7 py-4 font-bold text-night transition-colors duration-300 hover:bg-bone [clip-path:polygon(0_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]"
                >
                  Accéder à la plateforme
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
                <a
                  href="#evenements"
                  className="group inline-flex items-center gap-3 border border-husk px-7 py-4 font-semibold text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  Voir les événements
                  <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={620}>
              <ul className="mt-10 flex flex-wrap gap-2.5">
                {QUICK_CHIPS.map((c) => (
                  <li
                    key={c.label}
                    className="flex cursor-default items-center gap-2.5 border border-husk px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dune transition-colors duration-300 hover:border-gold/60 hover:text-bone"
                  >
                    <span
                      className="dot-soft inline-block h-2 w-2"
                      style={{ background: c.color }}
                      aria-hidden="true"
                    />
                    {c.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Tableau de bord live */}
          <Reveal delay={300} className="lg:sticky lg:top-28">
            <LiveScoreboard />
          </Reveal>
        </div>

        {/* Compteurs */}
        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-2 border border-husk bg-coal/70 lg:grid-cols-4 [&>*:nth-child(2n)]:border-l [&>*:nth-child(n+3)]:border-t [&>*]:border-husk lg:[&>*:nth-child(n+2)]:border-l lg:[&>*:nth-child(n+3)]:border-t-0"
        >
          {STATS.map((s) => (
            <StatCell key={s.label} {...s} start={statsInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
