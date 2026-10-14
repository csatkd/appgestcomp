import { useMemo } from 'react';
import { useApp } from '../lib/store';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';

export default function AdvancedAnalytics() {
  const { state } = useApp();

  // Calculer les statistiques avancées
  const analytics = useMemo(() => {
    // Statistiques des athlètes
    const totalAthletes = state.athletes.length;
    const athletesByGender = {
      male: state.athletes.filter(a => a.gender === 'M').length,
      female: state.athletes.filter(a => a.gender === 'F').length,
    };

    // Statistiques des clubs
    const athletesByClub = state.athletes.reduce((acc, athlete) => {
      acc[athlete.club] = (acc[athlete.club] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topClubs = Object.entries(athletesByClub)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Statistiques des catégories
    const athletesByCategory = state.athletes.reduce((acc, athlete) => {
      if (athlete.category) {
        acc[athlete.category] = (acc[athlete.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Statistiques des matchs
    const totalMatches = Object.values(state.brackets).flat().length;
    const completedMatches = Object.values(state.brackets)
      .flat()
      .filter(m => m.status === 'termine').length;
    const pendingMatches = Object.values(state.brackets)
      .flat()
      .filter(m => m.status === 'pret').length;

    // Taux de completion
    const completionRate = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

    // Statistiques des sponsors
    const totalSponsors = state.sponsors.length;
    const activeSponsors = state.sponsors.filter(s => s.status === 'actif').length;
    const totalSponsorAmount = state.sponsors
      .filter(s => s.status === 'actif' && s.amount)
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    // Répartition par niveau de sponsor
    const sponsorsByLevel = {
      or: state.sponsors.filter(s => s.level === 'or').length,
      argent: state.sponsors.filter(s => s.level === 'argent').length,
      bronze: state.sponsors.filter(s => s.level === 'bronze').length,
    };

    // Statistiques des réclamations
    const totalClaims = state.claims.length;
    const resolvedClaims = state.claims.filter(c => c.status === 'acceptee' || c.status === 'rejetee').length;
    const pendingClaims = state.claims.filter(c => c.status === 'soumise' || c.status === 'en_examen').length;

    // Taux de résolution
    const resolutionRate = totalClaims > 0 ? (resolvedClaims / totalClaims) * 100 : 0;

    return {
      totalAthletes,
      athletesByGender,
      topClubs,
      athletesByCategory,
      totalMatches,
      completedMatches,
      pendingMatches,
      completionRate,
      totalSponsors,
      activeSponsors,
      totalSponsorAmount,
      sponsorsByLevel,
      totalClaims,
      resolvedClaims,
      pendingClaims,
      resolutionRate,
    };
  }, [state]);

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead title="Analytics Avancés" subtitle="Visualisations et statistiques détaillées" />

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel p-6">
          <div className="text-3xl font-display text-gold mb-2">{analytics.totalAthletes}</div>
          <div className="text-sm text-dune">Athlètes inscrits</div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="text-chong">♂ {analytics.athletesByGender.male}</span>
            <span className="text-flame">♀ {analytics.athletesByGender.female}</span>
          </div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-forest mb-2">
            {analytics.completionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-dune">Taux de completion</div>
          <div className="mt-2 text-xs text-dune">
            {analytics.completedMatches} / {analytics.totalMatches} matchs
          </div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-gold mb-2">{analytics.activeSponsors}</div>
          <div className="text-sm text-dune">Sponsors actifs</div>
          <div className="mt-2 text-xs text-dune">
            {analytics.totalSponsorAmount.toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-flame mb-2">
            {analytics.resolutionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-dune">Taux de résolution</div>
          <div className="mt-2 text-xs text-dune">
            {analytics.resolvedClaims} / {analytics.totalClaims} réclamations
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique en barres - Top Clubs */}
        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Top 5 Clubs</h3>
          <div className="space-y-3">
            {analytics.topClubs.map(([club, count], index) => {
              const maxCount = analytics.topClubs[0][1];
              const percentage = (count / maxCount) * 100;
              const colors = ['bg-gold', 'bg-flame', 'bg-forest', 'bg-chong', 'bg-dune'];
              
              return (
                <div key={club}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-bone font-semibold">{club}</span>
                    <span className="text-dune">{count} athlètes</span>
                  </div>
                  <div className="h-6 bg-husk rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index]} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-bold text-night">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphique circulaire - Répartition par genre */}
        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Répartition par Genre</h3>
          <div className="flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {(() => {
                const total = analytics.athletesByGender.male + analytics.athletesByGender.female;
                const malePercentage = (analytics.athletesByGender.male / total) * 100;
                const femalePercentage = (analytics.athletesByGender.female / total) * 100;
                
                const maleAngle = (malePercentage / 100) * 360;
                const femaleAngle = (femalePercentage / 100) * 360;
                
                const malePath = describeArc(100, 100, 80, 0, maleAngle);
                const femalePath = describeArc(100, 100, 80, maleAngle, maleAngle + femaleAngle);
                
                return (
                  <>
                    <path d={malePath} fill="#3a72e0" stroke="#14100a" strokeWidth="2" />
                    <path d={femalePath} fill="#e2472e" stroke="#14100a" strokeWidth="2" />
                    <text x="100" y="100" textAnchor="middle" fill="#f4ead9" fontSize="24" fontWeight="bold">
                      {total}
                    </text>
                    <text x="100" y="120" textAnchor="middle" fill="#b09e82" fontSize="12">
                      athlètes
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-chong rounded"></div>
              <span className="text-sm text-dune">
                Hommes ({analytics.athletesByGender.male})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-flame rounded"></div>
              <span className="text-sm text-dune">
                Femmes ({analytics.athletesByGender.female})
              </span>
            </div>
          </div>
        </div>

        {/* Graphique en barres horizontales - Catégories */}
        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Athlètes par Catégorie</h3>
          <div className="space-y-2">
            {Object.entries(analytics.athletesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => {
                const maxCount = Math.max(...Object.values(analytics.athletesByCategory));
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-dune font-mono">{category}</div>
                    <div className="flex-1 h-5 bg-husk rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-flame transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-bone font-semibold">{count}</div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Graphique circulaire - Sponsors par niveau */}
        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Sponsors par Niveau</h3>
          <div className="flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {(() => {
                const total = analytics.sponsorsByLevel.or + 
                             analytics.sponsorsByLevel.argent + 
                             analytics.sponsorsByLevel.bronze;
                
                if (total === 0) {
                  return (
                    <text x="100" y="100" textAnchor="middle" fill="#b09e82" fontSize="14">
                      Aucun sponsor
                    </text>
                  );
                }
                
                const orPercentage = (analytics.sponsorsByLevel.or / total) * 100;
                const argentPercentage = (analytics.sponsorsByLevel.argent / total) * 100;
                const bronzePercentage = (analytics.sponsorsByLevel.bronze / total) * 100;
                
                const orAngle = (orPercentage / 100) * 360;
                const argentAngle = (argentPercentage / 100) * 360;
                const bronzeAngle = (bronzePercentage / 100) * 360;
                
                const orPath = describeArc(100, 100, 80, 0, orAngle);
                const argentPath = describeArc(100, 100, 80, orAngle, orAngle + argentAngle);
                const bronzePath = describeArc(100, 100, 80, orAngle + argentAngle, orAngle + argentAngle + bronzeAngle);
                
                return (
                  <>
                    {analytics.sponsorsByLevel.or > 0 && (
                      <path d={orPath} fill="#f0a41c" stroke="#14100a" strokeWidth="2" />
                    )}
                    {analytics.sponsorsByLevel.argent > 0 && (
                      <path d={argentPath} fill="#c8ccd4" stroke="#14100a" strokeWidth="2" />
                    )}
                    {analytics.sponsorsByLevel.bronze > 0 && (
                      <path d={bronzePath} fill="#c97f4a" stroke="#14100a" strokeWidth="2" />
                    )}
                    <text x="100" y="100" textAnchor="middle" fill="#f4ead9" fontSize="24" fontWeight="bold">
                      {total}
                    </text>
                    <text x="100" y="120" textAnchor="middle" fill="#b09e82" fontSize="12">
                      sponsors
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gold rounded"></div>
              <span className="text-sm text-dune">Or ({analytics.sponsorsByLevel.or})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-dune">Argent ({analytics.sponsorsByLevel.argent})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-sm text-dune">Bronze ({analytics.sponsorsByLevel.bronze})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Matchs</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dune">Total</span>
              <span className="text-bone font-semibold">{analytics.totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">Terminés</span>
              <span className="text-forest font-semibold">{analytics.completedMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">En attente</span>
              <span className="text-gold font-semibold">{analytics.pendingMatches}</span>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Sponsors</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dune">Total</span>
              <span className="text-bone font-semibold">{analytics.totalSponsors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">Actifs</span>
              <span className="text-forest font-semibold">{analytics.activeSponsors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">Montant total</span>
              <span className="text-gold font-semibold">
                {analytics.totalSponsorAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="font-display text-xl text-bone mb-4">Réclamations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dune">Total</span>
              <span className="text-bone font-semibold">{analytics.totalClaims}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">Résolues</span>
              <span className="text-forest font-semibold">{analytics.resolvedClaims}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dune">En attente</span>
              <span className="text-flame font-semibold">{analytics.pendingClaims}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour créer des arcs SVG
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
