import { useCountUp, useScrollAnimation } from '../hooks/useAnimations';
import { AnimatedCard, StaggeredContainer, GradientBorder, GlowEffect } from '../components/animations/AnimatedComponents';
import { IconTrophy, IconUsers, IconCalendar, IconShield, IconStar, IconTrendUp } from '../components/Icons';

export default function DemoShowcase() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  
  const stats = [
    { icon: IconTrophy, label: 'Disciplines', value: 4, color: 'text-gold' },
    { icon: IconUsers, label: 'Modules', value: 123, color: 'text-flame' },
    { icon: IconCalendar, label: 'Fonctionnalités', value: 500, color: 'text-forest' },
    { icon: IconShield, label: 'Sécurité', value: 100, suffix: '%', color: 'text-chong' },
  ];

  const features = [
    {
      title: 'Kyorugi',
      description: 'Gestion complète des combats avec scoring en temps réel',
      icon: '🥋',
      color: 'from-flame to-gold',
    },
    {
      title: 'Poomsae',
      description: 'Compétitions de formes avec notation multi-critères',
      icon: '🎭',
      color: 'from-gold to-forest',
    },
    {
      title: 'Casse',
      description: 'Breaking avec gestion des tentatives et matériaux',
      icon: '💥',
      color: 'from-forest to-chong',
    },
    {
      title: 'Grades',
      description: 'Passages de grade avec certificats officiels',
      icon: '🏆',
      color: 'from-chong to-flame',
    },
  ];

  const innovations = [
    { title: 'Gamification', description: 'Système de niveaux et achievements', icon: IconStar },
    { title: 'Analytics', description: 'Tableaux de bord avancés', icon: IconTrendUp },
    { title: 'Accessibilité', description: 'WCAG AAA compliant', icon: IconShield },
    { title: 'Multi-tenant', description: 'Gestion de multiples compétitions', icon: IconCalendar },
  ];

  return (
    <div className="min-h-screen bg-night">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden particles">
        <div className="absolute inset-0 bg-gradient-to-br from-night via-coal to-night" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-flame/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-forest/5 rounded-full blur-3xl animate-morph" />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <AnimatedCard delay={0}>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-8">
              <div className="w-2 h-2 bg-forest rounded-full animate-pulse" />
              <span className="text-sm font-mono text-dune">Version 5.0 - Production Ready</span>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <h1 className="text-7xl md:text-9xl font-display mb-6 gradient-text">
              DOJANG
            </h1>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <p className="text-2xl md:text-3xl text-bone mb-4 font-light">
              La Plateforme Complète du Taekwondo
            </p>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <p className="text-xl text-dune max-w-3xl mx-auto mb-12">
              Gestion professionnelle des compétitions de Kyorugi, Poomsae, Casse et Passages de Grades.
              <br />
              <span className="text-gold font-semibold">4 disciplines • 123 modules • 500+ fonctionnalités</span>
            </p>
          </AnimatedCard>

          {/* Stats */}
          <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" staggerDelay={150}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const count = useCountUp(stat.value, 2000, heroVisible);
              
              return (
                <GradientBorder key={index} className="hover-lift">
                  <div className="p-6 text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                    <div className={`text-4xl font-display mb-2 ${stat.color}`}>
                      {count}{stat.suffix || ''}
                    </div>
                    <div className="text-sm text-dune font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </GradientBorder>
              );
            })}
          </StaggeredContainer>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display mb-6 text-shadow-gold">
                4 Disciplines Majeures
              </h2>
              <p className="text-xl text-dune max-w-2xl mx-auto">
                Une solution complète pour gérer tous les aspects des compétitions de taekwondo
              </p>
            </div>
          </AnimatedCard>

          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={200}>
            {features.map((feature, index) => (
              <GlowEffect key={index} color="#f0a41c" intensity={15}>
                <div className="panel p-8 hover-lift cursor-pointer group">
                  <div className={`text-6xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-display mb-3 text-bone group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-dune text-lg">
                    {feature.description}
                  </p>
                  <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} transition-all duration-500 mt-4`} />
                </div>
              </GlowEffect>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* Innovations Section */}
      <section className="py-32 px-8 bg-coal relative overflow-hidden">
        <div className="absolute inset-0 particles" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedCard>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display mb-6 gradient-text">
                Innovations Majeures
              </h2>
              <p className="text-xl text-dune max-w-2xl mx-auto">
                Des fonctionnalités révolutionnaires pour une expérience utilisateur exceptionnelle
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((innovation, index) => {
              const Icon = innovation.icon;
              return (
                <AnimatedCard key={index} delay={index * 100}>
                  <div className="glass p-6 h-full hover-lift group">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-flame rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-night" />
                    </div>
                    <h3 className="text-xl font-display mb-2 text-bone group-hover:text-gold transition-colors">
                      {innovation.title}
                    </h3>
                    <p className="text-dune text-sm">
                      {innovation.description}
                    </p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display mb-6 text-shadow-flame">
                Excellence Technique
              </h2>
              <p className="text-xl text-dune max-w-2xl mx-auto">
                Une architecture moderne, performante et sécurisée
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard delay={0}>
              <GradientBorder>
                <div className="p-8">
                  <div className="text-5xl mb-4 animate-heartbeat">⚡</div>
                  <h3 className="text-2xl font-display mb-3 text-bone">Performance</h3>
                  <ul className="space-y-2 text-dune">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-forest rounded-full" />
                      Build en 3.66s
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-forest rounded-full" />
                      0 erreurs TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-forest rounded-full" />
                      163 KB gzippé
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-forest rounded-full" />
                      Code splitting optimisé
                    </li>
                  </ul>
                </div>
              </GradientBorder>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <GradientBorder>
                <div className="p-8">
                  <div className="text-5xl mb-4 animate-wave">🔒</div>
                  <h3 className="text-2xl font-display mb-3 text-bone">Sécurité</h3>
                  <ul className="space-y-2 text-dune">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Score 95/100
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Protection XSS
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Tokens CSRF
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Chiffrement AES-GCM
                    </li>
                  </ul>
                </div>
              </GradientBorder>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <GradientBorder>
                <div className="p-8">
                  <div className="text-5xl mb-4 animate-spin-slow">♿</div>
                  <h3 className="text-2xl font-display mb-3 text-bone">Accessibilité</h3>
                  <ul className="space-y-2 text-dune">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-chong rounded-full" />
                      WCAG AAA
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-chong rounded-full" />
                      5 modes daltoniens
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-chong rounded-full" />
                      Navigation clavier
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-chong rounded-full" />
                      Screen Reader
                    </li>
                  </ul>
                </div>
              </GradientBorder>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-gradient-to-br from-coal via-bark to-coal relative overflow-hidden">
        <div className="absolute inset-0 particles" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedCard>
            <div className="text-6xl mb-6 animate-bounce-in">🚀</div>
            <h2 className="text-5xl md:text-6xl font-display mb-6 gradient-text">
              Prêt à Révolutionner
              <br />
              Votre Gestion ?
            </h2>
            <p className="text-xl text-dune mb-12 max-w-2xl mx-auto">
              DOJANG est la seule plateforme qui gère les 4 disciplines majeures du taekwondo
              avec une excellence technique et une expérience utilisateur exceptionnelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary text-lg px-8 py-4 hover-lift">
                Commencer Maintenant
              </button>
              <button className="btn btn-ghost text-lg px-8 py-4 hover-lift">
                Voir la Démo
              </button>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-husk">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-display gradient-text mb-4">
            DOJANG 5.0
          </div>
          <p className="text-dune mb-4">
            La Plateforme Complète du Taekwondo
          </p>
          <p className="text-sm text-dune/60 font-mono">
            © 2026 DOJANG - FITKD Côte d'Ivoire
          </p>
        </div>
      </footer>
    </div>
  );
}
