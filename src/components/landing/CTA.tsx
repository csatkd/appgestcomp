import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function CTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 bg-night overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 kente opacity-10" />
      
      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-5 sm:px-8 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide text-bone mb-6">
          Prêt à digitaliser
          <span className="block text-gold mt-2">vos compétitions ?</span>
        </h2>
        <p className="text-lg sm:text-xl text-dune max-w-2xl mx-auto mb-10">
          Rejoignez les fédérations et clubs qui font confiance à DOJANG pour organiser
          leurs compétitions avec professionnalisme et efficacité.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#/competitions"
            className="btn btn-primary text-base px-8 py-4"
          >
            Commencer maintenant
          </a>
          <a
            href="#/organizers"
            className="btn btn-ghost text-base px-8 py-4"
          >
            Gérer les organisateurs
          </a>
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-dune">
          100% gratuit · Open source · Support 24/7
        </p>
      </div>
    </section>
  );
}
