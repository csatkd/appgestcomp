import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../lib/store";
import { athleteName, classLabel, readyMatches } from "../lib/data";
import { roundName, totalRounds, totalScore } from "../lib/bracket";
import type { Match, MatchClock } from "../lib/types";
import { PageHead, EmptyState, useToast } from "../components/ui";
import {
  IconLive,
  IconPlay,
  IconPause,
  IconUndo,
  IconFlag,
  IconChevron,
  IconCheck,
  IconTrophy,
} from "../components/Icons";

const ROUND_SECONDS = 120;
const REST_SECONDS = 60;
const GOLDEN_SECONDS = 120;
const MAX_GAMJEOM = 10;

/* ════════════════ Sélecteur de combats ════════════════ */

export function LiveIndex() {
  const { state } = useApp();
  const ready = readyMatches(state);

  return (
    <div className="fade-up mx-auto max-w-4xl">
      <PageHead title="Régie Live" subtitle="Poste de contrôle des aires de combat" />

      {ready.length === 0 ? (
        <EmptyState
          icon={<IconLive className="h-7 w-7" />}
          title="Aucun combat à diriger"
          text="Tous les combats prêts apparaîtront ici. Générez d'abord les tirages au sort des catégories pesées."
          action={
            <Link to="/tirages" className="btn btn-primary btn-sm">
              Ouvrir les tirages
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {ready.map((m) => {
            const encours = m.status === "encours";
            return (
              <li key={m.id}>
                <Link
                  to={`/live/${m.id}`}
                  className={`group flex items-center gap-5 border px-6 py-5 transition-all duration-200 ${
                    encours
                      ? "border-flame/60 bg-coal hover:border-flame"
                      : "border-husk bg-coal hover:border-gold/60 hover:bg-bark"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center border ${
                      encours ? "border-flame text-flame" : "border-gold text-gold"
                    }`}
                  >
                    {encours ? (
                      <span className="dot-live inline-block h-2.5 w-2.5 rounded-full bg-flame" aria-hidden="true" />
                    ) : (
                      <IconLive className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-bone">
                      {athleteName(state.athletes, m.a)}{" "}
                      <span className="mx-1 font-mono text-[10px] uppercase text-dune">vs</span>{" "}
                      {athleteName(state.athletes, m.b)}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dune">
                      {classLabel(m.catId)} ·{" "}
                      {roundName(m.round, totalRounds(state.brackets[m.catId] ?? []))}
                    </p>
                  </div>
                  <span className={`badge shrink-0 ${encours ? "text-flame" : "text-gold"}`}>
                    {encours ? "Reprendre" : "Diriger"}
                  </span>
                  <IconChevron className="h-4 w-4 shrink-0 text-dune transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ════════════════ Écran de combat ════════════════ */

type Phase = "idle" | "combat" | "repos" | "golden" | "fin";

interface Snapshot {
  baseA: number;
  baseB: number;
  gamA: number;
  gamB: number;
  clock: MatchClock;
}

const SCORE_ACTIONS = [
  { label: "Poing", pts: 1 },
  { label: "Corps", pts: 2 },
  { label: "Tête", pts: 3 },
  { label: "Rotatif corps", pts: 4 },
  { label: "Rotatif tête", pts: 5 },
];

export function LiveMatch() {
  const { matchId } = useParams();
  const { state, dispatch } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  const match = useMemo(
    () =>
      Object.values(state.brackets)
        .flat()
        .find((m) => m.id === matchId) ?? null,
    [state.brackets, matchId]
  );

  const [baseA, setBaseA] = useState(match?.baseA ?? 0);
  const [baseB, setBaseB] = useState(match?.baseB ?? 0);
  const [gamA, setGamA] = useState(match?.gamA ?? 0);
  const [gamB, setGamB] = useState(match?.gamB ?? 0);
  const [clock, setClock] = useState<MatchClock>(
    match?.clock ?? { time: ROUND_SECONDS, round: 1, phase: "combat" }
  );
  const [phase, setPhase] = useState<Phase>(match?.clock?.phase ?? "idle");
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<"a" | "b" | null>(match?.winner ?? null);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [flash, setFlash] = useState<"" | "a" | "b">("");

  const flashTimer = useRef<number>(0);

  const totals = { a: baseA + gamB, b: baseB + gamA };
  const done = match?.status === "termine";

  /* Persistance du combat à chaque évolution */
  useEffect(() => {
    if (!match || done) return;
    const updated: Match = {
      ...match,
      baseA,
      baseB,
      gamA,
      gamB,
      status: history.length > 0 || running || phase !== "idle" ? "encours" : match.status,
      clock: { ...clock },
    };
    dispatch({ type: "SET_MATCH", catId: match.catId, match: updated });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseA, baseB, gamA, gamB, clock]);

  /* Chronomètre */
  useEffect(() => {
    if (!running || phase === "fin" || phase === "idle") return;
    const id = window.setInterval(() => {
      setClock((c) => {
        if (c.time > 1) return { ...c, time: c.time - 1 };
        // fin de période
        window.clearInterval(id);
        setRunning(false);
        if (c.phase === "combat") {
          if (c.round < 3) {
            setPhase("repos");
            return { time: REST_SECONDS, round: c.round, phase: "repos" };
          }
          // fin du temps réglementaire
          setPhase("fin");
          if (totals.a !== totals.b) setWinner(totals.a > totals.b ? "a" : "b");
          return { ...c, time: 0 };
        }
        if (c.phase === "repos") {
          setPhase("combat");
          return { time: ROUND_SECONDS, round: c.round + 1, phase: "combat" };
        }
        // golden point écoulé sans point → décision arbitrale
        setPhase("fin");
        return { ...c, time: 0 };
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, totals.a, totals.b]);

  if (!match) {
    return (
      <div className="fade-up mx-auto max-w-3xl">
        <EmptyState
          icon={<IconLive className="h-7 w-7" />}
          title="Combat introuvable"
          text="Ce combat n'existe pas ou le tirage a été réinitialisé."
          action={
            <Link to="/live" className="btn btn-primary btn-sm">
              Retour à la régie
            </Link>
          }
        />
      </div>
    );
  }

  if (done) {
    const winName = athleteName(state.athletes, match.winner === "a" ? match.a : match.b);
    return (
      <div className="fade-up mx-auto max-w-3xl">
        <EmptyState
          icon={<IconTrophy className="h-7 w-7" />}
          title={`Victoire : ${winName}`}
          text={`Score final ${totalScore(match, "a")} – ${totalScore(match, "b")}. Le vainqueur a été placé dans la suite du tableau.`}
          action={
            <div className="flex gap-3">
              <Link to="/tirages" className="btn btn-primary btn-sm">Voir le tableau</Link>
              <Link to="/live" className="btn btn-ghost btn-sm">Régie live</Link>
            </div>
          }
        />
      </div>
    );
  }

  const snapshot = (): Snapshot => ({ baseA, baseB, gamA, gamB, clock: { ...clock } });

  const doFlash = (side: "a" | "b") => {
    setFlash(side);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(""), 550);
  };

  const addScore = (side: "a" | "b", pts: number) => {
    if (phase === "fin") return;
    if (phase === "idle") setPhase("combat");
    setHistory((h) => [...h, snapshot()]);
    if (phase === "golden") {
      if (side === "a") setBaseA((v) => v + pts);
      else setBaseB((v) => v + pts);
      setWinner(side);
      setPhase("fin");
      setRunning(false);
      toast("Point en or — vainqueur désigné", "info");
      return;
    }
    if (side === "a") setBaseA((v) => v + pts);
    else setBaseB((v) => v + pts);
    doFlash(side);
  };

  const addGamjeom = (side: "a" | "b") => {
    if (phase === "fin") return;
    if (phase === "idle") setPhase("combat");
    setHistory((h) => [...h, snapshot()]);
    const next = (side === "a" ? gamA : gamB) + 1;
    if (side === "a") setGamA(next);
    else setGamB(next);

    if (next >= MAX_GAMJEOM) {
      setWinner(side === "a" ? "b" : "a");
      setPhase("fin");
      setRunning(false);
      toast(`PUN — 10 Gam-jeom pour ${side === "a" ? "Chong" : "Hong"}`, "error");
      return;
    }
    if (phase === "golden") {
      setWinner(side === "a" ? "b" : "a");
      setPhase("fin");
      setRunning(false);
      toast("Point en or — Gam-jeom décisif", "info");
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBaseA(last.baseA);
    setBaseB(last.baseB);
    setGamA(last.gamA);
    setGamB(last.gamB);
    setClock(last.clock);
    setPhase(last.clock.phase);
    setWinner(null);
  };

  const abandon = (side: "a" | "b") => {
    setHistory((h) => [...h, snapshot()]);
    setWinner(side === "a" ? "b" : "a");
    setPhase("fin");
    setRunning(false);
  };

  const confirm = () => {
    if (!winner) return;
    dispatch({ type: "FINISH_MATCH", catId: match.catId, matchId: match.id, winner });
    const name = athleteName(state.athletes, winner === "a" ? match.a : match.b);
    toast(`Résultat officiel : victoire de ${name}`);
    navigate("/tirages");
  };

  const startPause = () => {
    if (phase === "idle") setPhase("combat");
    if (phase === "repos" && clock.time === REST_SECONDS) {
      // reprise directe sur le round suivant
      setClock((c) => ({ time: ROUND_SECONDS, round: c.round + 1, phase: "combat" }));
      setPhase("combat");
      setRunning(true);
      return;
    }
    if (phase === "golden" && clock.time === GOLDEN_SECONDS) setRunning(true);
    else setRunning((r) => !r);
  };

  const mm = String(Math.floor(clock.time / 60)).padStart(2, "0");
  const ss = String(clock.time % 60).padStart(2, "0");
  const rounds = totalRounds(state.brackets[match.catId] ?? []);

  const corner = (side: "a" | "b") => {
    const isChong = side === "a";
    const id = isChong ? match.a : match.b;
    const athlete = state.athletes.find((a) => a.id === id);
    const total = totals[side];
    const gam = isChong ? gamA : gamB;
    const accent = isChong ? "chong" : "flame";

    return (
      <section
        className={`relative overflow-hidden border bg-coal ${
          isChong ? "border-chong/50" : "border-flame/50"
        }`}
      >
        <div
          className={`absolute left-0 top-0 h-full w-1.5 ${isChong ? "bg-chong" : "bg-flame"}`}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between px-5 pt-4">
          <p
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.24em] ${
              isChong ? "text-chong" : "text-flame"
            }`}
          >
            {isChong ? "Chong · Bleu" : "Hong · Rouge"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
            {athlete?.license ?? ""}
          </p>
        </div>

        <div className="px-5 pb-1 pt-1">
          <p className="truncate font-display text-2xl uppercase tracking-wide text-bone sm:text-3xl">
            {athleteName(state.athletes, id)}
          </p>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
            {athlete?.club ?? "—"}
          </p>
        </div>

        <div className="flex items-center justify-between px-5 py-2">
          <div
            key={total}
            className={`flash font-display text-7xl tabular-nums leading-none sm:text-8xl ${
              flash === side ? (isChong ? "text-chong" : "text-flame") : "text-bone"
            }`}
          >
            {total}
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-dune">Gam-jeom</p>
            <div className="mt-1.5 flex justify-end gap-1">
              {Array.from({ length: Math.max(gam, 1) }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 ${
                    i < gam ? (gam >= MAX_GAMJEOM - 1 ? "bg-flame" : "bg-gold") : "bg-husk"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            {gam > 0 && (
              <p className="mt-1 font-mono text-[10px] text-flame">×{gam}</p>
            )}
          </div>
        </div>

        {/* Boutons de score */}
        <div className="grid grid-cols-5 gap-1.5 border-t border-husk p-3">
          {SCORE_ACTIONS.map((s) => (
            <button
              key={s.pts}
              type="button"
              disabled={phase === "fin"}
              onClick={() => addScore(side, s.pts)}
              className={`group cursor-pointer border px-1 py-2.5 text-center transition-all duration-150 active:scale-95 ${
                isChong
                  ? "border-chong/40 hover:border-chong hover:bg-chong/15"
                  : "border-flame/40 hover:border-flame hover:bg-flame/15"
              } disabled:cursor-not-allowed disabled:opacity-30`}
              aria-label={`${s.label} — ${s.pts} point(s) pour ${isChong ? "Chong" : "Hong"}`}
            >
              <span
                className={`block font-display text-2xl leading-none ${
                  isChong ? "text-chong" : "text-flame"
                }`}
              >
                +{s.pts}
              </span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.08em] text-dune">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 border-t border-husk p-3 pt-0">
          <button
            type="button"
            disabled={phase === "fin"}
            onClick={() => addGamjeom(side)}
            className="btn btn-ghost btn-sm flex-1 hover:border-gold hover:text-gold"
          >
            <IconFlag className="h-3.5 w-3.5" />
            Gam-jeom adverse
          </button>
          <button
            type="button"
            disabled={phase === "fin"}
            onClick={() => abandon(side)}
            className="btn btn-danger btn-sm"
            title={`Abandon / disqualification de ${isChong ? "Chong" : "Hong"}`}
          >
            {isChong ? "WDR Chong" : "WDR Hong"}
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead
        title="Aire de combat"
        subtitle={`${classLabel(match.catId)} · ${roundName(match.round, rounds)}`}
        actions={
          <Link to="/live" className="btn btn-ghost btn-sm">
            <IconChevron className="h-3.5 w-3.5 rotate-180" />
            Régie
          </Link>
        }
      />

      {/* Chrono central */}
      <div className="panel relative mb-6 overflow-hidden">
        <div className="kente absolute left-0 top-0 h-1.5 w-full" aria-hidden="true" />
        <div className="flex flex-col items-center gap-4 px-6 py-7">
          <div className="flex items-center gap-3">
            <span
              className={`badge ${
                phase === "fin"
                  ? "text-forest"
                  : phase === "repos"
                    ? "text-gold"
                    : phase === "golden"
                      ? "text-flame"
                      : running
                        ? "text-flame"
                        : "text-dune"
              }`}
            >
              {phase === "fin" ? (
                "Fin du combat"
              ) : phase === "repos" ? (
                "Repos — round suivant"
              ) : phase === "golden" ? (
                <>
                  <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
                  Point en or
                </>
              ) : running ? (
                <>
                  <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
                  En cours
                </>
              ) : (
                "Prêt"
              )}
            </span>
            <div className="flex gap-1.5" aria-label={`Round ${clock.round} sur 3`}>
              {[1, 2, 3].map((r) => (
                <span
                  key={r}
                  className={`h-1.5 w-8 ${
                    r < clock.round || phase === "fin"
                      ? "bg-gold"
                      : r === clock.round
                        ? "bg-gold dot-soft"
                        : "bg-husk"
                  }`}
                />
              ))}
            </div>
          </div>

          <p
            className={`font-mono text-7xl font-semibold tabular-nums leading-none sm:text-8xl ${
              clock.time <= 10 && (phase === "combat" || phase === "golden")
                ? "text-flame"
                : "text-bone"
            }`}
          >
            {mm}:{ss}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {phase !== "fin" && (
              <button type="button" onClick={startPause} className="btn btn-primary btn-sm">
                {running ? <IconPause className="h-3.5 w-3.5" /> : <IconPlay className="h-3.5 w-3.5" />}
                {running ? "Pause" : phase === "idle" ? "Lancer le round 1" : "Reprendre"}
              </button>
            )}
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0 || phase === "fin"}
              className="btn btn-ghost btn-sm"
            >
              <IconUndo className="h-3.5 w-3.5" />
              Annuler ({history.length})
            </button>
            {phase === "repos" && (
              <button
                type="button"
                onClick={() => {
                  setClock({ time: ROUND_SECONDS, round: clock.round + 1, phase: "combat" });
                  setPhase("combat");
                  setRunning(true);
                }}
                className="btn btn-ghost btn-sm hover:border-forest hover:text-forest"
              >
                Passer le repos
              </button>
            )}
            {phase === "fin" && (
              <>
                {winner ? (
                  <button type="button" onClick={confirm} className="btn btn-primary btn-sm">
                    <IconCheck className="h-3.5 w-3.5" />
                    Confirmer la victoire de{" "}
                    {athleteName(state.athletes, winner === "a" ? match.a : match.b)}
                  </button>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="badge self-center text-gold">Décision arbitrale requise :</span>
                    <button type="button" onClick={() => setWinner("a")} className="btn btn-ghost btn-sm hover:border-chong hover:text-chong">
                      Victoire Chong
                    </button>
                    <button type="button" onClick={() => setWinner("b")} className="btn btn-ghost btn-sm hover:border-flame hover:text-flame">
                      Victoire Hong
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {phase === "golden" && (
            <p className="max-w-md text-center font-mono text-[11px] uppercase tracking-[0.16em] text-flame">
              Égalité {totals.a} – {totals.b} : le premier point ou Gam-jeom décide du vainqueur.
            </p>
          )}
        </div>
      </div>

      {/* Coins */}
      <div className="grid gap-6 lg:grid-cols-2">
        {corner("a")}
        {corner("b")}
      </div>

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-dune">
        Règles WT : poing +1 · corps +2 · tête +3 · techniques rotatives +2 · Gam-jeom = +1 adverse ·
        10 Gam-jeom = PUN
      </p>
    </div>
  );
}

