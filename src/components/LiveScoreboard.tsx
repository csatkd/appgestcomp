import { useEffect, useState } from "react";

const ROUND_SECONDS = 120;

interface MatchState {
  time: number;
  round: number;
}

/**
 * Tableau de bord Kyorugi en direct — démo interactive.
 * Le chrono tourne, les points tombent, les Gam-jeom s'accumulent.
 * Cliquez sur un coin pour simuler un point.
 */
export default function LiveScoreboard() {
  const [match, setMatch] = useState<MatchState>({ time: 102, round: 2 });
  const [scores, setScores] = useState({ red: 12, blue: 8 });
  const [gamjeom, setGamjeom] = useState({ red: 1, blue: 0 });
  const [flash, setFlash] = useState<null | "red" | "blue">(null);

  /* Chrono + rotation des rounds */
  useEffect(() => {
    const id = setInterval(() => {
      setMatch((s) => {
        if (s.time > 0) return { ...s, time: s.time - 1 };
        return { time: ROUND_SECONDS, round: s.round >= 3 ? 1 : s.round + 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const score = (side: "red" | "blue", pts: number, withGamjeom = false) => {
    setScores((s) => ({ ...s, [side]: s[side] + pts }));
    setFlash(side);
    window.setTimeout(() => setFlash(null), 600);
    if (withGamjeom) {
      const other = side === "red" ? "blue" : "red";
      setGamjeom((g) => ({ ...g, [other]: g[other] + 1 }));
    }
  };

  /* Scoring automatique aléatoire (ambiance live) */
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.62) return;
      const side: "red" | "blue" = Math.random() < 0.5 ? "red" : "blue";
      const r = Math.random();
      const pts = r < 0.22 ? 1 : r < 0.62 ? 2 : r < 0.87 ? 3 : 4;
      score(side, pts, Math.random() < 0.16);
    }, 4200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = String(Math.floor(match.time / 60)).padStart(2, "0");
  const ss = String(match.time % 60).padStart(2, "0");

  return (
    <div className="relative border border-husk bg-coal shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="kente h-1.5 w-full" aria-hidden="true" />

      {/* Bandeau live */}
      <div className="flex items-center justify-between gap-3 border-b border-husk px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="dot-live inline-block h-2.5 w-2.5 rounded-full bg-flame" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-bone">
            Live — Tatami 1
          </span>
        </div>
        <span className="border border-gold/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
          Quart de finale
        </span>
      </div>

      <div className="flex items-center justify-between px-5 pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
          Kyorugi — −68 kg Hommes
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
          Round {match.round} / 3
        </p>
      </div>

      {/* Chrono + rounds */}
      <div className="px-5 pt-2">
        <div className="flex items-end justify-between">
          <p
            className="font-mono text-6xl font-semibold tabular-nums leading-none text-bone sm:text-7xl"
            aria-live="off"
          >
            {mm}:{ss}
          </p>
          <div className="mb-2 flex gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((r) => (
              <span
                key={r}
                className={`h-1.5 w-8 ${
                  r < match.round
                    ? "bg-gold"
                    : r === match.round
                      ? "bg-gold dot-soft"
                      : "bg-husk"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Coins rouge / bleu */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <button
          type="button"
          onClick={() => score("red", 2)}
          className="group cursor-pointer border border-husk border-l-4 border-l-flame bg-bark/60 px-4 py-3 text-left transition hover:border-flame/70 hover:bg-bark"
          aria-label="Ajouter 2 points au coin rouge (CHUNG)"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-flame">
            Chung · CIV
          </p>
          <p className="mt-1 truncate font-semibold text-bone">S. DELI</p>
          <div className="mt-2 flex items-end justify-between">
            <span
              className={`inline-block font-display text-5xl leading-none text-bone ${
                flash === "red" ? "flash" : ""
              }`}
            >
              {scores.red}
            </span>
            {gamjeom.red > 0 && (
              <span className="mb-1 font-mono text-[10px] text-flame">
                Gam-jeom ×{gamjeom.red}
              </span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => score("blue", 2)}
          className="group cursor-pointer border border-husk border-r-4 border-r-chong bg-bark/60 px-4 py-3 text-right transition hover:border-chong/70 hover:bg-bark"
          aria-label="Ajouter 2 points au coin bleu (CHONG)"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chong">
            Chong · SEN
          </p>
          <p className="mt-1 truncate font-semibold text-bone">D. HERVE</p>
          <div className="mt-2 flex items-end justify-between">
            {gamjeom.blue > 0 ? (
              <span className="mb-1 font-mono text-[10px] text-chong">
                Gam-jeom ×{gamjeom.blue}
              </span>
            ) : (
              <span />
            )}
            <span
              className={`inline-block font-display text-5xl leading-none text-bone ${
                flash === "blue" ? "flash" : ""
              }`}
            >
              {scores.blue}
            </span>
          </div>
        </button>
      </div>

      {/* Pied : connexion PSS */}
      <div className="mt-5 flex items-center justify-between border-t border-husk px-5 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] text-forest">
          <span className="dot-soft inline-block h-2 w-2 rounded-full bg-forest" />
          <span className="uppercase tracking-[0.14em]">PSS Daedo connecté</span>
        </p>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-dune sm:block">
          Démo · cliquez un coin pour scorer
        </p>
      </div>
    </div>
  );
}
