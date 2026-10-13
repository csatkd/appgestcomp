import { useState } from "react";
import { useApp } from "../lib/store";
import { athleteName, classLabel, WEIGHT_CLASSES } from "../lib/data";
import { PageHead } from "../components/ui";
import { IconTv, IconTrophy, IconUsers, IconHandshake } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";
import SponsorDisplay from "../components/SponsorDisplay";

export default function TvMode() {
  const { state } = useApp();
  const [view, setView] = useState<"podium" | "rankings" | "athletes" | "sponsors">("podium");
  const [selectedCat, setSelectedCat] = useState<string | null>(
    Object.keys(state.results)[0] ?? null
  );

  const finishedCats = WEIGHT_CLASSES.filter((c) => state.catStatus[c.id] === "terminée");

  // Calcul du classement des clubs
  const clubRanking = (() => {
    const map = new Map<string, { club: string; g: number; s: number; b: number; pts: number }>();
    Object.entries(state.results).forEach(([, p]) => {
      const add = (id: string, kind: "g" | "s" | "b") => {
        const a = state.athletes.find((x) => x.id === id);
        if (!a) return;
        const row = map.get(a.club) ?? { club: a.club, g: 0, s: 0, b: 0, pts: 0 };
        row[kind] += 1;
        row.pts += kind === "g" ? 5 : kind === "s" ? 3 : 1;
        map.set(a.club, row);
      };
      add(p.gold, "g");
      add(p.silver, "s");
      p.bronzes.forEach((b) => add(b, "b"));
    });
    return Array.from(map.values()).sort((x, y) => y.pts - x.pts || y.g - x.g || y.s - x.s);
  })();

  const podium = selectedCat ? state.results[selectedCat] : null;

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.tvMode} opacity={0.1} blur={3} />
      <PageHead title="Mode TV" subtitle="Affichage grand écran" />

      {/* Sélecteur de vue */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView("podium")}
          className={`btn ${view === "podium" ? "btn-primary" : "btn-ghost"}`}
        >
          <IconTrophy className="h-4 w-4" />
          Podiums
        </button>
        <button
          type="button"
          onClick={() => setView("rankings")}
          className={`btn ${view === "rankings" ? "btn-primary" : "btn-ghost"}`}
        >
          <IconUsers className="h-4 w-4" />
          Classement clubs
        </button>
        <button
          type="button"
          onClick={() => setView("athletes")}
          className={`btn ${view === "athletes" ? "btn-primary" : "btn-ghost"}`}
        >
          <IconTv className="h-4 w-4" />
          Statistiques
        </button>
        <button
          type="button"
          onClick={() => setView("sponsors")}
          className={`btn ${view === "sponsors" ? "btn-primary" : "btn-ghost"}`}
        >
          <IconHandshake className="h-4 w-4" />
          Sponsors
        </button>
      </div>

      {/* Vue Podiums */}
      {view === "podium" && (
        <div>
          {finishedCats.length === 0 ? (
            <div className="panel flex flex-col items-center px-8 py-16 text-center">
              <IconTrophy className="h-12 w-12 text-dune/40" />
              <p className="mt-4 font-display text-2xl uppercase tracking-wide text-bone">
                Aucun podium disponible
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
                Les podiums apparaîtront dès que des finales seront terminées.
              </p>
            </div>
          ) : (
            <>
              {/* Sélecteur de catégorie */}
              <div className="mb-6 flex flex-wrap gap-2">
                {finishedCats.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCat(c.id)}
                    className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                      selectedCat === c.id
                        ? "border-gold bg-gold font-semibold text-night"
                        : "border-husk text-dune hover:border-gold/60 hover:text-bone"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Podium */}
              {podium && selectedCat && (
                <div className="panel relative overflow-hidden p-8">
                  <div className="kente absolute left-0 top-0 h-2 w-full" aria-hidden="true" />
                  <div className="text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
                      {classLabel(selectedCat)}
                    </p>
                    <h2 className="mt-2 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
                      Podium officiel
                    </h2>
                  </div>

                  <div className="mt-12 flex items-end justify-center gap-6">
                    {/* Argent */}
                    <div className="flex w-1/4 flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center border-4 border-[#c8ccd4] bg-[#c8ccd4]/10 font-display text-3xl text-[#c8ccd4]">
                        2
                      </div>
                      <p className="mt-4 text-center font-display text-xl uppercase tracking-wide text-bone">
                        {athleteName(state.athletes, podium.silver)}
                      </p>
                      <p className="mt-1 text-center text-sm text-dune">
                        {state.athletes.find((a) => a.id === podium.silver)?.club}
                      </p>
                      <div className="mt-4 h-24 w-full bg-[#c8ccd4]/20" />
                    </div>

                    {/* Or */}
                    <div className="flex w-1/4 flex-col items-center">
                      <div className="flex h-20 w-20 items-center justify-center border-4 border-gold bg-gold/10 font-display text-4xl text-gold">
                        1
                      </div>
                      <p className="mt-4 text-center font-display text-2xl uppercase tracking-wide text-gold">
                        {athleteName(state.athletes, podium.gold)}
                      </p>
                      <p className="mt-1 text-center text-sm text-dune">
                        {state.athletes.find((a) => a.id === podium.gold)?.club}
                      </p>
                      <div className="mt-4 h-32 w-full bg-gold/20" />
                    </div>

                    {/* Bronze */}
                    <div className="flex w-1/4 flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center border-4 border-[#c97f4a] bg-[#c97f4a]/10 font-display text-3xl text-[#c97f4a]">
                        3
                      </div>
                      <p className="mt-4 text-center font-display text-xl uppercase tracking-wide text-bone">
                        {podium.bronzes.length > 0
                          ? athleteName(state.athletes, podium.bronzes[0])
                          : "—"}
                      </p>
                      <p className="mt-1 text-center text-sm text-dune">
                        {podium.bronzes.length > 0
                          ? state.athletes.find((a) => a.id === podium.bronzes[0])?.club
                          : ""}
                      </p>
                      <div className="mt-4 h-20 w-full bg-[#c97f4a]/20" />
                    </div>
                  </div>

                  {podium.bronzes.length > 1 && (
                    <div className="mt-8 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dune">
                        Deuxième médaille de bronze
                      </p>
                      <p className="mt-2 font-display text-xl uppercase tracking-wide text-bone">
                        {athleteName(state.athletes, podium.bronzes[1])}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Vue Classement clubs */}
      {view === "rankings" && (
        <div className="panel relative overflow-hidden p-8">
          <div className="kente absolute left-0 top-0 h-2 w-full" aria-hidden="true" />
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
              Classement général
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
              Meilleurs clubs
            </h2>
          </div>

          {clubRanking.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-lg text-dune">Aucun club classé pour le moment</p>
            </div>
          ) : (
            <div className="mt-12 space-y-4">
              {clubRanking.slice(0, 10).map((c, i) => (
                <div key={c.club} className="flex items-center gap-4 border-b border-husk pb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center font-display text-2xl ${
                      i === 0 ? "text-gold" : i === 1 ? "text-[#c8ccd4]" : i === 2 ? "text-[#c97f4a]" : "text-dune"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-bone">{c.club}</p>
                    <div className="mt-1 flex items-center gap-3 font-mono text-xs text-dune">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-gold" /> {c.g}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#c8ccd4]" /> {c.s}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#c97f4a]" /> {c.b}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl text-gold">{c.pts}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                      points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vue Statistiques */}
      {view === "athletes" && (
        <div className="panel relative overflow-hidden p-8">
          <div className="kente absolute left-0 top-0 h-2 w-full" aria-hidden="true" />
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
              Statistiques
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
              {state.event.name}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="font-display text-5xl text-bone">{state.athletes.length}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
                Athlètes inscrits
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-forest">
                {state.athletes.filter((a) => a.status === "pesé").length}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
                Pesées validées
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-gold">
                {finishedCats.length}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
                Catégories terminées
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-flame">
                {state.claims.length}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
                Réclamations
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
              {state.event.date} · {state.event.venue}
            </p>
          </div>
        </div>
      )}

      {/* Vue Sponsors */}
      {view === "sponsors" && (
        <div className="panel relative overflow-hidden p-8">
          <div className="kente absolute left-0 top-0 h-2 w-full" aria-hidden="true" />
          <SponsorDisplay />
        </div>
      )}
    </div>
  );
}
