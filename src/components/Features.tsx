import { FEATURES } from "../data";
import Reveal, { Eyebrow } from "./Reveal";

export default function Features() {
  return (
    <section id="fonctionnalites" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Fonctionnalités clés</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
                Tout ce dont votre
                <br />
                <span className="text-gold">fédération</span> a besoin
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-md border-l-2 border-gold pl-5 text-[15px] leading-relaxed text-dune lg:mb-2">
              De la pesée au podium, TKD365 pro couvre chaque étape de
              l'organisation d'une compétition de taekwondo — régionale,
              nationale ou internationale.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-16 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 90 + Math.floor(i / 2) * 40}>
              <div className="group relative border-t border-husk py-8 pl-5 pr-2 transition-colors duration-300 hover:bg-coal/70">
                <span
                  className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gold transition-transform duration-500 group-hover:scale-y-100"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-[52px_1fr] gap-4">
                  <span className="pt-1 font-mono text-sm font-semibold text-gold/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-bone transition-colors duration-300 group-hover:text-gold sm:text-xl">
                      {f.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-dune">{f.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
