import { useState, useEffect } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconBell, IconCheck, IconUsers } from "../components/Icons";
import { athleteName, classLabel } from "../lib/data";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function CallSystem() {
  const { state, dispatch } = useApp();
  const toast = useToast();

  // Récupérer les matchs prêts à être appelés
  const readyMatches = Object.values(state.brackets)
    .flat()
    .filter((m) => m.status === "pret" && m.arenaId);

  const [selectedArena, setSelectedArena] = useState<string>("all");
  const [callingMatch, setCallingMatch] = useState<string | null>(null);
  const [callCountdown, setCallCountdown] = useState<number>(0);

  // Countdown pour l'appel
  useEffect(() => {
    if (callCountdown > 0) {
      const timer = setTimeout(() => setCallCountdown(callCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [callCountdown]);

  const callAthlete = (matchId: string, catId: string) => {
    const match = state.brackets[catId]?.find((m) => m.id === matchId);
    if (match) {
      dispatch({
        type: "SET_MATCH",
        catId,
        match: { ...match, called: true },
      });
      setCallingMatch(matchId);
      setCallCountdown(120); // 2 minutes pour se présenter
      toast("Athlètes appelés - 2 minutes pour se présenter");
    }
  };

  const confirmPresence = (matchId: string, catId: string) => {
    const match = state.brackets[catId]?.find((m) => m.id === matchId);
    if (match) {
      dispatch({
        type: "SET_MATCH",
        catId,
        match: { ...match, status: "encours" },
      });
      setCallingMatch(null);
      setCallCountdown(0);
      toast("Combat démarré", "success");
    }
  };

  const markNoShow = (matchId: string, catId: string, side: "a" | "b") => {
    const match = state.brackets[catId]?.find((m) => m.id === matchId);
    if (match) {
      const winner = side === "a" ? "b" : "a";
      dispatch({
        type: "FINISH_MATCH",
        catId,
        matchId,
        winner,
      });
      setCallingMatch(null);
      setCallCountdown(0);
      toast("Forfait enregistré - Victoire par défaut", "info");
    }
  };

  // Filtrer par aire
  const filteredMatches =
    selectedArena === "all"
      ? readyMatches
      : readyMatches.filter((m) => m.arenaId === selectedArena);

  const arenas = Array.from({ length: state.event.arenas }, (_, i) => ({
    id: `arena-${i + 1}`,
    name: `Aire ${i + 1}`,
  }));

  // Match en cours d'appel
  const currentCallingMatch = callingMatch
    ? Object.values(state.brackets)
        .flat()
        .find((m) => m.id === callingMatch)
    : null;

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.live} opacity={0.08} blur={3} />
      <PageHead
        title="Système d'Appel"
        subtitle="Appel des athlètes avant les combats"
      />

      {/* Match en cours d'appel */}
      {currentCallingMatch && (
        <div className="panel p-6 mb-6 border-2 border-gold">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <IconBell className="w-6 h-6 text-gold animate-pulse" />
              <h3 className="font-display text-2xl uppercase tracking-wide text-bone">
                Appel en Cours
              </h3>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl text-gold">
                {Math.floor(callCountdown / 60)}:{String(callCountdown % 60).padStart(2, "0")}
              </p>
              <p className="text-xs text-dune">Temps restant</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-chong/50 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-chong mb-2">
                CHONG (Bleu)
              </p>
              <p className="font-display text-xl text-bone">
                {athleteName(state.athletes, currentCallingMatch.a)}
              </p>
              <p className="text-sm text-dune mt-1">
                {state.athletes.find((a) => a.id === currentCallingMatch.a)?.club}
              </p>
            </div>
            <div className="border border-flame/50 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-flame mb-2">
                HONG (Rouge)
              </p>
              <p className="font-display text-xl text-bone">
                {athleteName(state.athletes, currentCallingMatch.b)}
              </p>
              <p className="text-sm text-dune mt-1">
                {state.athletes.find((a) => a.id === currentCallingMatch.b)?.club}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => confirmPresence(currentCallingMatch.id, currentCallingMatch.catId)}
              className="btn btn-primary flex-1"
            >
              <IconCheck className="w-4 h-4" />
              Présents - Démarrer le combat
            </button>
            <button
              onClick={() => markNoShow(currentCallingMatch.id, currentCallingMatch.catId, "a")}
              className="btn btn-danger"
            >
              Forfait Chong
            </button>
            <button
              onClick={() => markNoShow(currentCallingMatch.id, currentCallingMatch.catId, "b")}
              className="btn btn-danger"
            >
              Forfait Hong
            </button>
          </div>
        </div>
      )}

      {/* Filtre par aire */}
      <div className="panel p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-mono text-xs uppercase tracking-wider text-dune">
            Filtrer par aire :
          </label>
          <select
            value={selectedArena}
            onChange={(e) => setSelectedArena(e.target.value)}
            className="input"
          >
            <option value="all">Toutes les aires</option>
            {arenas.map((arena) => (
              <option key={arena.id} value={arena.id}>
                {arena.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des matchs à appeler */}
      <div className="panel p-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Matchs Prêts à Appeler ({filteredMatches.length})
        </h3>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <IconUsers className="w-16 h-16 text-dune/30 mx-auto mb-4" />
            <p className="text-dune">Aucun match à appeler</p>
            <p className="text-sm text-dune mt-2">
              Assignez des aires aux matchs dans le Planning
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className={`border p-4 transition-all ${
                  match.called
                    ? "border-gold bg-gold/5"
                    : "border-husk hover:border-gold/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-bone">
                      {athleteName(state.athletes, match.a)} vs{" "}
                      {athleteName(state.athletes, match.b)}
                    </p>
                    <p className="text-sm text-dune mt-1">
                      {classLabel(match.catId)}
                      {match.arenaId && (
                        <span className="ml-2 text-gold">
                          • {arenas.find((a) => a.id === match.arenaId)?.name}
                        </span>
                      )}
                      {match.scheduledTime && (
                        <span className="ml-2 text-chong">• {match.scheduledTime}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => callAthlete(match.id, match.catId)}
                    disabled={!!callingMatch}
                    className="btn btn-primary btn-sm"
                  >
                    <IconBell className="w-4 h-4" />
                    Appeler
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chong rounded-full" />
                    <span className="text-dune">
                      {athleteName(state.athletes, match.a)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-flame rounded-full" />
                    <span className="text-dune">
                      {athleteName(state.athletes, match.b)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
