import { JOURNEY } from "../data";
import { useInView } from "../hooks";
import Reveal, { Eyebrow } from "./Reveal";
import { MODULE_ICONS } from "./Icons";

/** Parcours d'un événement : de la pesée au podium, en 6 étapes. */
export default function Journey() {
  const [lineRef, lineOn] = useInView<HTMLDivElement>(0.25);

  return (
    <section
      id="parcours"
      className="relative scroll-mt-24 border-t border-husk py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Le parcours d'un événement</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
                De la pesée
                <br />
                au <span className="text-gold">podium</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-md border-l-2 border-gold pl-5 text-[15px] leading-relaxed text-dune lg:mb-2">
              Six étapes, un seul fil conducteur. Chaque phase de votre
              compétition est orchestrée par TKD365 pro — sans ressaisie, sans
              rupture, sans attente.
            </p>
          </Reveal>
        </div>

        <div ref={lineRef} className="relative mt-16">
          {/* Ligne horizontale (desktop) */}
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-husk lg:block"
            aria-hidden="true"
          />
          <div
            className={`grow-x absolute left-0 right-0 top-6 hidden h-[2px] bg-gold/80 lg:block ${
              lineOn ? "on" : ""
            }`}
            aria-hidden="true"
          />
          {/* Ligne verticale (mobile) */}
          <div
            className="absolute bottom-4 left-6 top-2 w-px bg-husk lg:hidden"
            aria-hidden="true"
          />

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {JOURNEY.map((step, i) => {
              const Icon = MODULE_ICONS[step.icon];
              return (
                <Reveal key={step.title} delay={i * 100}>
                  <div className="group relative pl-20 lg:pl-0">
                    <div className="absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center border border-husk bg-night text-gold transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-gold group-hover:text-night lg:static lg:mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="flex items-center gap-2 font-mono text-xs font-semibold text-gold/60">
                      {String(i + 1).padStart(2, "0")}
                      {step.live && (
                        <span className="inline-flex items-center gap-1.5 text-flame">
                          <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" />
                          LIVE
                        </span>
                      )}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl uppercase tracking-wide text-bone transition-colors duration-300 group-hover:text-gold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-dune">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
