import Reveal, { Eyebrow } from "./Reveal";
import { ArrowRight } from "./Icons";

export default function Cta() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden border-t border-husk bg-bark py-24 sm:py-32"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(240,164,28,0.05) 0 2px, transparent 2px 20px)",
      }}
    >
      <div className="kente absolute inset-x-0 top-0 h-2" aria-hidden="true" />
      <div className="kente absolute inset-x-0 bottom-0 h-2" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal>
          <div>
            <Eyebrow>Rejoignez TKD365 pro</Eyebrow>
            <h2 className="mt-7 font-display text-5xl uppercase leading-[0.98] text-bone sm:text-6xl lg:text-7xl">
              Prêt à digitaliser
              <br />
              votre <span className="text-gold">fédération</span> ?
            </h2>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div>
            <p className="text-[15px] leading-relaxed text-dune sm:text-base">
              Rejoignez les fédérations et clubs qui font confiance à TKD365 pro
              pour organiser leurs compétitions, gérer leurs athlètes et
              diffuser leurs résultats en temps réel.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://tkd365.pro/sign-up-login-screen"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 font-bold text-night transition-colors duration-300 hover:bg-bone [clip-path:polygon(0_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]"
              >
                Créer un compte
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a
                href="https://tkd365.pro/federation-landing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-husk px-7 py-4 font-semibold text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                Page Fédération
              </a>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-dune">
              <span className="text-gold">48 ligues</span>·
              <span>12 847 athlètes</span>·
              <span>320+ événements / an</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
