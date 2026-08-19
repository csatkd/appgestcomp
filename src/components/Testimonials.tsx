import { TESTIMONIALS } from "../data";
import Reveal, { Eyebrow } from "./Reveal";

/** La parole au terrain : arbitres, coaches et présidents de clubs. */
export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Ils arbitrent, coachent, président</Eyebrow>
            <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
              La parole <span className="text-gold">au terrain</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className={i === 1 ? "md:translate-y-8" : ""}>
              <figure className="group relative h-full border border-husk bg-coal p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 sm:p-8">
                <span
                  className="kente absolute left-0 top-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
                  aria-hidden="true"
                />
                <span
                  className="font-display text-7xl leading-none text-gold/25"
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote className="-mt-5 text-[15px] leading-relaxed text-bone sm:text-base">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 border-t border-husk pt-5">
                  <p className="font-bold text-bone">{t.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                    {t.role}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dune">
                    {t.org}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
