import { MODULES, ROLES } from "../data";
import Reveal, { Eyebrow } from "./Reveal";
import { MODULE_ICONS } from "./Icons";

export default function Modules() {
  return (
    <section id="modules" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Modules intégrés</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
                Une suite complète
                <br />
                pour <span className="text-gold">chaque rôle</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="lg:mb-2">
              <p className="max-w-md text-[15px] leading-relaxed text-dune">
                Athlètes, coaches, arbitres, officiels et administrateurs —
                chaque acteur de la compétition dispose de son espace dédié.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <li
                    key={r}
                    className="cursor-default border border-husk px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dune transition-colors duration-300 hover:border-gold hover:text-gold"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULES.map((m, i) => {
            const Icon = MODULE_ICONS[m.icon];
            return (
              <Reveal key={m.title} delay={(i % 4) * 70}>
                <article className="group relative h-full overflow-hidden border border-husk bg-coal p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:bg-bark">
                  <span
                    className="kente absolute right-0 top-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="flex h-12 w-12 items-center justify-center border border-husk text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-night">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dune">
                    {m.tag}
                  </p>
                  <h3 className="mt-1.5 font-bold leading-snug text-bone">{m.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-dune">{m.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
