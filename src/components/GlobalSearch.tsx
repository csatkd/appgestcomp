import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/store';
import { IconSearch, IconX, IconUsers, IconAward, IconHandshake, IconShield } from './Icons';

interface SearchResult {
  id: string;
  type: 'athlete' | 'club' | 'sponsor' | 'referee';
  title: string;
  subtitle: string;
  path: string;
  icon: React.ComponentType<any>;
}

export default function GlobalSearch() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ouvrir avec Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus sur l'input quand ouvert
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Recherche
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Rechercher dans les athlètes
    state.athletes.forEach((athlete) => {
      const fullName = `${athlete.firstName} ${athlete.lastName}`.toLowerCase();
      if (fullName.includes(q) || athlete.license.toLowerCase().includes(q)) {
        searchResults.push({
          id: athlete.id,
          type: 'athlete',
          title: `${athlete.firstName} ${athlete.lastName}`,
          subtitle: `${athlete.club} • ${athlete.license}`,
          path: '/athletes',
          icon: IconUsers,
        });
      }
    });

    // Rechercher dans les clubs
    state.clubs.forEach((club) => {
      if (club.name.toLowerCase().includes(q) || club.city.toLowerCase().includes(q)) {
        searchResults.push({
          id: club.id,
          type: 'club',
          title: club.name,
          subtitle: `${club.city} • ${club.region}`,
          path: '/clubs',
          icon: IconAward,
        });
      }
    });

    // Rechercher dans les sponsors
    state.sponsors.forEach((sponsor) => {
      if (sponsor.name.toLowerCase().includes(q) || sponsor.contact.toLowerCase().includes(q)) {
        searchResults.push({
          id: sponsor.id,
          type: 'sponsor',
          title: sponsor.name,
          subtitle: `${sponsor.type} • ${sponsor.level}`,
          path: '/sponsors',
          icon: IconHandshake,
        });
      }
    });

    // Rechercher dans les arbitres
    state.referees.forEach((referee) => {
      const fullName = `${referee.firstName} ${referee.lastName}`.toLowerCase();
      if (fullName.includes(q) || referee.license.toLowerCase().includes(q)) {
        searchResults.push({
          id: referee.id,
          type: 'referee',
          title: `${referee.firstName} ${referee.lastName}`,
          subtitle: `${referee.grade} • ${referee.city}`,
          path: '/referees',
          icon: IconShield,
        });
      }
    });

    setResults(searchResults.slice(0, 10)); // Limiter à 10 résultats
    setSelectedIndex(0);
  }, [query, state]);

  // Navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].path);
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-night/80 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setQuery('');
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="panel overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-husk px-4 py-3">
            <IconSearch className="h-5 w-5 text-dune" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher des athlètes, clubs, sponsors, arbitres..."
              className="flex-1 bg-transparent text-bone placeholder:text-dune/50 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="text-dune hover:text-bone transition-colors"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Résultats */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 && query.trim() ? (
              <div className="px-4 py-8 text-center text-dune">
                Aucun résultat pour "{query}"
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-8 text-center text-dune">
                Commencez à taper pour rechercher...
              </div>
            ) : (
              <ul>
                {results.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <li
                      key={result.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-bark text-gold'
                          : 'hover:bg-bark/50'
                      }`}
                      onClick={() => {
                        navigate(result.path);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center border border-husk bg-coal">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-bone truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-dune truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <span className="text-xs text-dune uppercase">
                        {result.type === 'athlete' && 'Athlète'}
                        {result.type === 'club' && 'Club'}
                        {result.type === 'sponsor' && 'Sponsor'}
                        {result.type === 'referee' && 'Arbitre'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-husk px-4 py-2 flex items-center justify-between text-xs text-dune">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-bark border border-husk rounded">↑↓</kbd>{' '}
                Naviguer
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-bark border border-husk rounded">↵</kbd>{' '}
                Sélectionner
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-bark border border-husk rounded">Esc</kbd>{' '}
                Fermer
              </span>
            </div>
            <span>Ctrl+K pour ouvrir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
