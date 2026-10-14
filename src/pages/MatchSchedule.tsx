import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconCalendar, IconClock, IconCheck } from "../components/Icons";
import { athleteName, classLabel } from "../lib/data";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function MatchSchedule() {
  const { state, dispatch } = useApp();
  const toast = useToast();

  // Récupérer tous les matchs prêts ou en cours
  const allMatches = Object.values(state.brackets)
    .flat()
    .filter((m) => m.status === "pret" || m.status === "encours")
    .sort((a, b) => {
      // Trier par heure programmée si disponible
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      // Sinon par round puis index
      if (a.round !== b.round) return a.round - b.round;
      return a.index - b.index;
    });

  const assignArena = (matchId: string, catId: string, arenaId: string) => {
    const match = state.brackets[catId]?.find((m) => m.id === matchId);
    if (match) {
      dispatch({
        type: "SET_MATCH",
        catId,
        match: { ...match, arenaId },
      });
      toast("Aire assignée au combat");
    }
  };

  const assignTime = (matchId: string, catId: string, time: string) => {
    const match = state.brackets[catId]?.find((m) => m.id === matchId);
    if (match) {
      dispatch({
        type: "SET_MATCH",
        catId,
        match: { ...match, scheduledTime: time },
      });
      toast("Heure programmée");
    }
  };

  const arenas = Array.from({ length: state.event.arenas }, (_, i) => ({
    id: `arena-${i + 1}`,
    name: `Aire ${i + 1}`,
  }));

  // Grouper les matchs par aire
  const matchesByArena = arenas.map((arena) => ({
    ...arena,
    matches: allMatches.filter((m) => m.arenaId === arena.id),
  }));

  const unassignedMatches = allMatches.filter((m) => !m.arenaId);

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.live} opacity={0.08} blur={3} />
      <PageHead
        title="Planning des Combats"
        subtitle="Programmation et assignation des aires"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Total combats
          </p>
          <p className="font-display text-3xl text-bone mt-2">{allMatches.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Assignés
          </p>
          <p className="font-display text-3xl text-forest mt-2">
            {allMatches.length - unassignedMatches.length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Non assignés
          </p>
          <p className="font-display text-3xl text-gold mt-2">
            {unassignedMatches.length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Aires actives
          </p>
          <p className="font-display text-3xl text-chong mt-2">{arenas.length}</p>
        </div>
      </div>

      {/* Matchs non assignés */}
      {unassignedMatches.length > 0 && (
        <div className="panel p-6 mb-6">
          <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
            Matchs à Assigner ({unassignedMatches.length})
          </h3>
          <div className="space-y-3">
            {unassignedMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between border border-husk p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-bone">
                    {athleteName(state.athletes, match.a)} vs{" "}
                    {athleteName(state.athletes, match.b)}
                  </p>
                  <p className="text-sm text-dune mt-1">{classLabel(match.catId)}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => assignArena(match.id, match.catId, e.target.value)}
                    className="input"
                    value=""
                  >
                    <option value="">Assigner une aire</option>
                    {arenas.map((arena) => (
                      <option key={arena.id} value={arena.id}>
                        {arena.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    onChange={(e) => assignTime(match.id, match.catId, e.target.value)}
                    className="input"
                    placeholder="Heure"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planning par aire */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchesByArena.map((arena) => (
          <div key={arena.id} className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg uppercase tracking-wide text-bone">
                {arena.name}
              </h3>
              <span className="badge text-gold">{arena.matches.length} combats</span>
            </div>

            {arena.matches.length === 0 ? (
              <p className="text-sm text-dune text-center py-8">
                Aucun combat programmé
              </p>
            ) : (
              <div className="space-y-2">
                {arena.matches.map((match, index) => (
                  <div
                    key={match.id}
                    className="border border-husk p-3 hover:bg-bark/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-dune">
                        #{index + 1}
                        {match.scheduledTime && (
                          <span className="ml-2 text-gold">
                            <IconClock className="w-3 h-3 inline" /> {match.scheduledTime}
                          </span>
                        )}
                      </span>
                      <span
                        className={`badge text-xs ${
                          match.status === "encours" ? "text-flame" : "text-gold"
                        }`}
                      >
                        {match.status === "encours" ? "En cours" : "Prêt"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-bone">
                      {athleteName(state.athletes, match.a)} vs{" "}
                      {athleteName(state.athletes, match.b)}
                    </p>
                    <p className="text-xs text-dune mt-1">{classLabel(match.catId)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
