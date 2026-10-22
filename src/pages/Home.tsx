import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const modules = [
    {
      id: 'kyorugi',
      title: 'Kyorugi',
      subtitle: 'Combat',
      icon: '🥊',
      description: 'Gestion complète des combats avec scoring en temps réel',
      path: '/live',
      color: 'from-red-500 to-orange-500',
      stats: { athletes: 127, matches: 85, active: 12 }
    },
    {
      id: 'poomsae',
      title: 'Poomsae',
      subtitle: 'Formes',
      icon: '🎭',
      description: 'Compétitions de formes avec notation multi-critères',
      path: '/poomsae',
      color: 'from-blue-500 to-cyan-500',
      stats: { athletes: 89, performances: 45, categories: 8 }
    },
    {
      id: 'casse',
      title: 'Casse',
      subtitle: 'Breaking',
      icon: '💥',
      description: 'Breaking avec gestion des tentatives et matériaux',
      path: '/casse',
      color: 'from-green-500 to-emerald-500',
      stats: { athletes: 56, attempts: 124, success: 89 }
    },
    {
      id: 'grades',
      title: 'Grades',
      subtitle: 'Passages',
      icon: '🏆',
      description: 'Passages de grade avec certificats officiels',
      path: '/grades',
      color: 'from-purple-500 to-pink-500',
      stats: { exams: 12, candidates: 78, certified: 65 }
    }
  ];

  const quickActions = [
    { label: 'Dashboard', icon: '📊', path: '/app' },
    { label: 'Athlètes', icon: '👥', path: '/athletes' },
    { label: 'Calendrier', icon: '📅', path: '/calendar' },
    { label: 'Rapports', icon: '📈', path: '/reports' },
    { label: 'Sponsors', icon: '💼', path: '/sponsors' },
    { label: 'Admin', icon: '⚙️', path: '/admin' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-coal to-night">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-flame/5" />
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <div className="text-8xl mb-6 animate-float">🥋</div>
            <h1 className="text-7xl font-display mb-6 gradient-text">
              DOJANG
            </h1>
            <p className="text-3xl text-bone mb-4 font-light">
              La Plateforme Complète du Taekwondo
            </p>
            <p className="text-xl text-dune max-w-2xl mx-auto">
              Gestion professionnelle des compétitions • 4 disciplines • 123 modules • Production Ready
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="glass px-6 py-3 rounded-lg hover:scale-105 transition-all hover-lift flex items-center gap-2"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-bone font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disciplines Cards */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-4xl font-display text-center mb-12 text-bone">
          Les 4 Disciplines Majeures
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onMouseEnter={() => setHoveredCard(module.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(module.path)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                hoveredCard === module.id ? 'scale-105 shadow-2xl' : 'scale-100'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-20`} />
              
              {/* Content */}
              <div className="relative glass p-8 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-6xl mb-4">{module.icon}</div>
                    <h3 className="text-3xl font-display text-bone mb-2">
                      {module.title}
                    </h3>
                    <p className="text-lg text-gold font-semibold">
                      {module.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-display text-bone">
                      {Object.values(module.stats)[0]}
                    </div>
                    <div className="text-sm text-dune">
                      {Object.keys(module.stats)[0]}
                    </div>
                  </div>
                </div>

                <p className="text-dune mb-6">{module.description}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-display text-bone">
                        {value}
                      </div>
                      <div className="text-xs text-dune uppercase tracking-wider">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-opacity duration-500 ${
                  hoveredCard === module.id ? 'opacity-10' : ''
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-coal/50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-display text-center mb-12 text-bone">
            Fonctionnalités Innovantes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎮',
                title: 'Gamification',
                description: 'Système de niveaux, XP et achievements pour motiver les utilisateurs'
              },
              {
                icon: '📊',
                title: 'Analytics Avancés',
                description: 'Tableaux de bord interactifs avec graphiques en temps réel'
              },
              {
                icon: '♿',
                title: 'Accessibilité',
                description: 'Conforme WCAG AAA avec 5 modes daltoniens et navigation clavier'
              },
              {
                icon: '🔒',
                title: 'Sécurité',
                description: 'Protection XSS, CSRF, rate limiting et chiffrement AES-GCM'
              },
              {
                icon: '🚀',
                title: 'Performance',
                description: 'Build optimisé, code splitting et lazy loading'
              },
              {
                icon: '🌐',
                title: 'Multi-tenant',
                description: 'Gestion de multiples compétitions simultanées'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-xl hover-lift cursor-pointer group"
                onClick={() => navigate('/demo')}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display text-bone mb-2 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dune text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-display mb-6 gradient-text">
          Prêt à Commencer ?
        </h2>
        <p className="text-xl text-dune mb-12 max-w-2xl mx-auto">
          Découvrez la puissance de DOJANG pour gérer vos compétitions de taekwondo
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/demo')}
            className="btn btn-primary text-lg px-8 py-4 hover-lift"
          >
            <span className="mr-2">🎬</span>
            Voir la Démo
          </button>
          <button
            onClick={() => navigate('/app')}
            className="btn btn-ghost text-lg px-8 py-4 hover-lift"
          >
            <span className="mr-2">🚀</span>
            Accéder à l'Application
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-husk py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="text-3xl font-display gradient-text mb-4">
            DOJANG 5.1
          </div>
          <p className="text-dune mb-4">
            La Plateforme Complète du Taekwondo
          </p>
          <p className="text-sm text-dune/60">
            © 2026 DOJANG - FITKD Côte d'Ivoire • Production Ready
          </p>
        </div>
      </footer>
    </div>
  );
}
