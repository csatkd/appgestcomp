import { useScrollReveal } from "../../hooks/useScrollReveal";

const testimonials = [
  {
    quote:
      "DOJANG a révolutionné la gestion de nos championnats nationaux. Tout est centralisé, rapide et professionnel.",
    author: "Fédération Ivoirienne de Taekwondo",
    role: "Organisateur National",
  },
  {
    quote:
      "Le live scoring WT est impeccable. Nos arbitres et le public apprécient la fluidité et la précision.",
    author: "Club Taekwondo Abidjan",
    role: "Entraîneur Principal",
  },
  {
    quote:
      "La gestion multi-compétitions nous permet d'organiser simultanément nos opens régionaux sans confusion.",
    author: "Ligue Régionale Nord",
    role: "Directeur Technique",
  },
];

export default function Testimonials() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

  return (
    <section className="relative py-24 bg-coal">
      <div className="absolute inset-0 mud-bg opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              Témoignages
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide text-bone mb-6">
            Ils nous font
            <span className="block text-gold mt-2">confiance</span>
          </h2>
          <p className="text-lg text-dune max-w-2xl mx-auto">
            Découvrez comment DOJANG transforme la gestion des compétitions de taekwondo en Côte d'Ivoire.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`group relative border border-husk bg-night p-8 transition-all duration-700 hover:border-gold/50 hover:bg-bark ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Quote icon */}
      <div className="text-gold/20 font-display text-6xl leading-none mb-4">"</div>

      {/* Quote text */}
      <p className="text-bone text-lg leading-relaxed mb-6 italic">
        {testimonial.quote}
      </p>

      {/* Author */}
      <div className="border-t border-husk pt-4">
        <div className="font-bold text-bone">{testimonial.author}</div>
        <div className="font-mono text-xs uppercase tracking-wider text-dune mt-1">
          {testimonial.role}
        </div>
      </div>

      {/* Hover accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-flame to-forest scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
    </div>
  );
}
