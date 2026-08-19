import { CLUB_RANKING, PODIUM } from "../data";
import { useInView } from "../hooks";
import Reveal, { Eyebrow } from "./Reveal";

const RANK_COLORS = ["#f0a41c", "#c8ccd4", "#c97f4a"];

/** Tableau des médailles en direct + podium animé. */
export default function Rankings() {
  const [tableRef, tableOn] = useInView<HTMLDivElement>(0.2);
  const [podRef, podOn] = useInView<HTMLDivElement>(0.25);
  const maxPts = Math.max(...CLUB_RANKING.map((c) => c.pts));

  return (
    <section
      id="classements"
      className="relative scroll-mt-24 border-y border-husk bg-night py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Classements en direct</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
                Le podium se dessine
                <br />
                <span className="text-gold">en temps réel</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-dune lg:mb-2">
              <span className="dot-live inline-block h-2.5 w-2.5 rounded-full bg-flame" />
              Mise à jour live — Championnat National Kyorugi 2026
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-end gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Tableau des médailles */}
          <Reveal>
            <div ref={tableRef} className="border border-husk bg-coal/70">
              <div className="grid grid-cols-[40px_1fr_38px_38px_38px_76px] items-center gap-2 border-b border-husk px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-dune sm:gap-3 sm:px-6">
                <span>#</span>
                <span>Club</span>
                <span className="text-center">Or</span>
                <span className="text-center">Ar</span>
                <span className="text-center">Br</span>
                <span className="text-right">Points</span>
              </div>
              {CLUB_RANKING.map((c, i) => (
                <div
                  key={c.code}
                  className="group grid grid-cols-[40px_1fr_38px_38px_38px_76px] items-center gap-2 border-b border-husk/60 px-5 py-4 transition-colors duration-300 last:border-b-0 hover:bg-bark/70 sm:gap-3 sm:px-6"
                >
                  <span
                    className="font-display text-2xl leading-none"
                    style={{ color: RANK_COLORS[i] ?? "#b3a186" }}
                  >
                    {c.rank}
                  </span>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-husk bg-bark font-mono text-[10px] font-semibold text-gold">
                      {c.code}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-bone">{c.club}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        {c.city}
                      </p>
                    </div>
                  </div>
                  <span className="text-center font-mono text-sm font-semibold text-gold">{c.g}</span>
                  <span className="text-center font-mono text-sm text-[#c8ccd4]">{c.s}</span>
                  <span className="text-center font-mono text-sm text-[#c97f4a]">{c.b}</span>
                  <div className="text-right">
                    <p className="font-display text-xl leading-none text-bone">{c.pts}</p>
                    <div className="mt-1.5 h-1 w-full overflow-hidden bg-husk">
                      <div
                        className="h-full bg-gold transition-[width] duration-1000 ease-out"
                        style={{
                          width: tableOn ? `${(c.pts / maxPts) * 100}%` : "0%",
                          transitionDelay: `${i * 120}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Podium */}
          <Reveal delay={150}>
            <div ref={podRef}>
              <div className="flex items-end justify-center gap-3 sm:gap-4">
                {PODIUM.map((p, i) => (
                  <div key={p.place} className="flex w-1/3 max-w-[160px] flex-col items-center">
                    <span
                      className="flex h-11 w-11 items-center justify-center border-2 font-display text-xl"
                      style={{ borderColor: p.medal, color: p.medal }}
                    >
                      {p.place}
                    </span>
                    <p className="mt-2.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-bone">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-dune">
                      {p.club} · {p.code}
                    </p>
                    <div
                      className={`grow-y relative mt-4 w-full border border-husk bg-bark ${podOn ? "on" : ""}`}
                      style={{
                        height: p.place === 1 ? 185 : p.place === 2 ? 132 : 96,
                        transitionDelay: `${i * 160}ms`,
                      }}
                    >
                      <div className="kente absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-gold/20">
                        {p.place}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
                Kyorugi −68 kg Hommes · Finale
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-12 border-t border-husk pt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
            Meilleure équipe · Meilleur club · Meilleur athlète — <span className="text-gold">générés automatiquement</span> à la fin de chaque journée
          </p>
        </Reveal>
      </div>
    </section>
  );
}
