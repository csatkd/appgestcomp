import { PILLARS } from "../data";
import Reveal, { Eyebrow } from "./Reveal";
import { MODULE_ICONS, ArrowRight } from "./Icons";

export default function About() {
  return (
    <section
      id="plateforme"
      className="relative scroll-mt-24 overflow-hidden border-t border-husk py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-forest/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Colonne collante */}
          <div className="self-start lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>À propos de TKD365 pro</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-[3.4rem]">
                La gestion du
                <br />
                taekwondo,
                <br />
                <span className="text-gold">réinventée</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-dune sm:text-base">
                TKD365 pro est la plateforme numérique de référence pour les
                fédérations, ligues et clubs de taekwondo. Conçue pour répondre
                aux exigences des compétitions officielles — du niveau régional
                à l'international — elle intègre l'ensemble du cycle de vie
                d'un événement sportif.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <figure className="relative mt-12 max-w-lg">
                <span
                  className="absolute -bottom-3 -right-3 h-full w-full border-2 border-gold"
                  aria-hidden="true"
                />
                <span className="kente absolute -left-2 -top-2 z-10 h-2 w-24" aria-hidden="true" />
                <div className="relative overflow-hidden border border-husk">
                  <img
                    src="https://image.qwenlm.ai/generated-images/011ae01e-b731-4d44-bdbb-dc43c1851ec6/_result.png"
                    alt="Athlète africain de taekwondo en pleine action"
                    className="img-breathe aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-dune">
                  Alger · Harcha Arena — Finale −68 kg
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={280}>
              <a
                href="https://tkd365.pro/sign-up-login-screen"
                target="_blank"
                rel="noreferrer"
                className="group mt-9 inline-flex items-center gap-3 bg-gold px-7 py-4 font-bold text-night transition-colors duration-300 hover:bg-bone [clip-path:polygon(0_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]"
              >
                Rejoindre la plateforme
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </Reveal>
          </div>

          {/* Piliers défilants */}
          <div className="flex flex-col gap-6 lg:pt-10">
            {PILLARS.map((p, i) => {
              const Icon = MODULE_ICONS[p.icon];
              return (
                <Reveal key={p.title} delay={i * 90}>
                  <article className="group relative overflow-hidden border border-husk bg-coal p-7 pl-9 transition-all duration-300 hover:border-gold/60 hover:bg-bark">
                    <span className="kente-vert absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />
                    <span
                      className="absolute right-5 top-4 font-display text-5xl leading-none text-husk transition-colors duration-300 group-hover:text-gold/40"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center border border-husk text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-night">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-bone sm:text-xl">{p.title}</h3>
                    <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-dune">{p.desc}</p>
                  </article>
                </Reveal>
              );
            })}

            {/* Encart live rappel */}
            <Reveal delay={360}>
              <aside className="relative mt-2 border border-gold/40 bg-bark p-7">
                <div className="kente absolute left-0 top-0 h-1.5 w-full" aria-hidden="true" />
                <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                  <span className="dot-live inline-block h-2.5 w-2.5 rounded-full bg-flame" />
                  Temps réel — du tatami au podium
                </p>
                <p className="mt-4 font-display text-2xl uppercase leading-snug text-bone sm:text-3xl">
                  Chaque point compté.
                  <br />
                  Chaque athlète classé. <span className="text-gold">En direct.</span>
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
