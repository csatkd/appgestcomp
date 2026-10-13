import { useScrollReveal } from "../../hooks/useScrollReveal";
import { LogoMark } from "../Icons";

export default function Hero() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-night pt-20">
      {/* Background patterns */}
      <div className="absolute inset-0 mud-bg opacity-30" />
      <div className="absolute inset-0 noise-layer" />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gold/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-night to-transparent" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <LogoMark className="w-20 h-20 text-gold" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 mb-8">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              FITKD Côte d'Ivoire
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-wide text-bone mb-6 leading-tight">
            DOJANG
            <span className="block text-gold mt-2">La Régie des Tatamis</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg sm:text-xl md:text-2xl text-dune max-w-3xl mx-auto mb-12 leading-relaxed">
            La plateforme professionnelle de gestion des compétitions de taekwondo.
            <br className="hidden sm:block" />
            Du local à l'international, gérez tout en un seul endroit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#/competitions"
              className="btn btn-primary text-base px-8 py-4"
            >
              Accéder à l'application
            </a>
            <a
              href="#fonctionnalites"
              className="btn btn-ghost text-base px-8 py-4"
            >
              Découvrir les fonctionnalités
            </a>
          </div>

          {/* Stats rapides */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "10+", label: "Modules" },
              { value: "100%", label: "Gratuit" },
              { value: "WT", label: "Règles officielles" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`transition-all duration-700 delay-${i * 100} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="font-display text-3xl sm:text-4xl text-gold mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-dune">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
