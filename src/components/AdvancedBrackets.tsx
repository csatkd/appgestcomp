import { useState } from 'react';
import { useApp } from '../lib/store';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconTrophy, IconUsers, IconCalendar } from './Icons';

type BracketType = 'single' | 'double' | 'round-robin' | 'multistage';

interface BracketConfig {
  type: BracketType;
  name: string;
  athletes: string[];
  rounds: number;
}

export default function AdvancedBrackets() {
  const { state } = useApp();
  const [selectedType, setSelectedType] = useState<BracketType>('single');
  const [showPreview, setShowPreview] = useState(false);

  const bracketTypes = [
    {
      id: 'single' as BracketType,
      name: 'Élimination Simple',
      description: 'Un seul match perdu = élimination',
      icon: '🏆',
      color: 'from-gold to-flame'
    },
    {
      id: 'double' as BracketType,
      name: 'Double Élimination',
      description: 'Deux défaites avant élimination',
      icon: '🔄',
      color: 'from-forest to-chong'
    },
    {
      id: 'round-robin' as BracketType,
      name: 'Round Robin',
      description: 'Tous contre tous',
      icon: '🔁',
      color: 'from-chong to-gold'
    },
    {
      id: 'multistage' as BracketType,
      name: 'Multi-Étapes',
      description: 'Phases de groupes + élimination',
      icon: '📊',
      color: 'from-flame to-forest'
    }
  ];

  const generateBracket = (type: BracketType, athleteCount: number) => {
    switch (type) {
      case 'single':
        return generateSingleElimination(athleteCount);
      case 'double':
        return generateDoubleElimination(athleteCount);
      case 'round-robin':
        return generateRoundRobin(athleteCount);
      case 'multistage':
        return generateMultistage(athleteCount);
      default:
        return [];
    }
  };

  const generateSingleElimination = (count: number) => {
    const rounds = Math.ceil(Math.log2(count));
    const matches = [];
    let currentRound = count;
    
    for (let r = 0; r < rounds; r++) {
      const matchesInRound = Math.floor(currentRound / 2);
      for (let m = 0; m < matchesInRound; m++) {
        matches.push({
          round: r,
          match: m,
          athlete1: null,
          athlete2: null,
          winner: null
        });
      }
      currentRound = matchesInRound;
    }
    
    return matches;
  };

  const generateDoubleElimination = (count: number) => {
    const winnersBracket = generateSingleElimination(count);
    const losersBracket = generateSingleElimination(count);
    
    return {
      winners: winnersBracket,
      losers: losersBracket,
      grandFinal: [{ round: 0, match: 0, athlete1: null, athlete2: null, winner: null }]
    };
  };

  const generateRoundRobin = (count: number) => {
    const matches = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        matches.push({
          round: 0,
          match: matches.length,
          athlete1: i,
          athlete2: j,
          winner: null
        });
      }
    }
    return matches;
  };

  const generateMultistage = (count: number) => {
    const groupSize = 4;
    const groups = Math.ceil(count / groupSize);
    const groupMatches = [];
    
    for (let g = 0; g < groups; g++) {
      const groupAthletes = Array.from({ length: groupSize }, (_, i) => g * groupSize + i);
      const matches = generateRoundRobin(groupAthletes.length);
      groupMatches.push({ group: g, matches });
    }
    
    return {
      groups: groupMatches,
      knockout: generateSingleElimination(groups)
    };
  };

  const currentBracket: any = generateBracket(selectedType, 8);

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Bracket Builder Avancé"
        subtitle="Système de tournoi professionnel"
      />

      {/* Sélection du type de bracket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {bracketTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`panel p-6 text-left transition-all ${
              selectedType === type.id
                ? 'border-gold border-2 scale-105'
                : 'hover:border-gold/50'
            }`}
          >
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4`}>
              {type.icon}
            </div>
            <h3 className="font-display text-xl text-bone mb-2">{type.name}</h3>
            <p className="text-sm text-dune">{type.description}</p>
          </button>
        ))}
      </div>

      {/* Preview du bracket */}
      <div className="panel p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-bone">
            Aperçu : {bracketTypes.find(t => t.id === selectedType)?.name}
          </h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-primary"
          >
            {showPreview ? 'Masquer' : 'Afficher'} le bracket
          </button>
        </div>

        {showPreview && (
          <div className="overflow-x-auto">
            {selectedType === 'single' && (
              <SingleEliminationView matches={currentBracket} />
            )}
            {selectedType === 'double' && (
              <DoubleEliminationView bracket={currentBracket} />
            )}
            {selectedType === 'round-robin' && (
              <RoundRobinView matches={currentBracket} />
            )}
            {selectedType === 'multistage' && (
              <MultistageView bracket={currentBracket} />
            )}
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel p-6">
          <IconTrophy className="w-8 h-8 text-gold mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {Array.isArray(currentBracket) ? currentBracket.length : 0}
          </p>
          <p className="text-sm text-dune">Matchs totaux</p>
        </div>
        <div className="panel p-6">
          <IconUsers className="w-8 h-8 text-forest mb-3" />
          <p className="font-display text-3xl text-bone mb-1">8</p>
          <p className="text-sm text-dune">Athlètes participants</p>
        </div>
        <div className="panel p-6">
          <IconCalendar className="w-8 h-8 text-chong mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {Math.ceil(Math.log2(8))}
          </p>
          <p className="text-sm text-dune">Rounds nécessaires</p>
        </div>
      </div>
    </div>
  );
}

// Composants de visualisation
function SingleEliminationView({ matches }: { matches: any[] }) {
  const rounds = Math.max(...matches.map(m => m.round)) + 1;
  
  return (
    <div className="flex gap-8 min-w-max">
      {Array.from({ length: rounds }, (_, r) => (
        <div key={r} className="flex flex-col gap-4">
          <h4 className="font-semibold text-bone text-center mb-2">
            {r === rounds - 1 ? 'Finale' : `Tour ${r + 1}`}
          </h4>
          {matches
            .filter(m => m.round === r)
            .map((match, idx) => (
              <div key={idx} className="panel p-4 min-w-[200px]">
                <div className="border-b border-husk pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-bark rounded flex items-center justify-center text-xs">
                      A{idx * 2 + 1}
                    </div>
                    <span className="text-sm text-dune">Athlète {idx * 2 + 1}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-bark rounded flex items-center justify-center text-xs">
                      A{idx * 2 + 2}
                    </div>
                    <span className="text-sm text-dune">Athlète {idx * 2 + 2}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function DoubleEliminationView({ bracket }: { bracket: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-display text-xl text-gold mb-4">Winners Bracket</h4>
        <SingleEliminationView matches={bracket.winners || []} />
      </div>
      <div>
        <h4 className="font-display text-xl text-flame mb-4">Losers Bracket</h4>
        <SingleEliminationView matches={bracket.losers || []} />
      </div>
      <div>
        <h4 className="font-display text-xl text-forest mb-4">Grand Finale</h4>
        <SingleEliminationView matches={bracket.grandFinal || []} />
      </div>
    </div>
  );
}

function RoundRobinView({ matches }: { matches: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match, idx) => (
        <div key={idx} className="panel p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dune">Match {idx + 1}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bark rounded flex items-center justify-center text-xs">
                A{match.athlete1 + 1}
              </div>
              <span className="text-sm text-bone">vs</span>
              <div className="w-8 h-8 bg-bark rounded flex items-center justify-center text-xs">
                A{match.athlete2 + 1}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MultistageView({ bracket }: { bracket: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-display text-xl text-gold mb-4">Phase de Groupes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bracket.groups?.map((group: any, idx: number) => (
            <div key={idx} className="panel p-4">
              <h5 className="font-semibold text-bone mb-3">Groupe {idx + 1}</h5>
              <RoundRobinView matches={group.matches} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-display text-xl text-flame mb-4">Phase Éliminatoire</h4>
        <SingleEliminationView matches={bracket.knockout || []} />
      </div>
    </div>
  );
}
