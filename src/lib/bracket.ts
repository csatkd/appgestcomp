import type { Match, Podium } from "./types";

let counter = 0;
export function uid(prefix = "m"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`;
}

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/** Ordre de seeding standard (1, 8, 4, 5, 2, 7, 3, 6…) pour un tableau équilibré. */
function seedOrder(size: number): number[] {
  let arr = [1];
  while (arr.length < size) {
    const m = arr.length * 2;
    const next: number[] = [];
    for (const s of arr) next.push(s, m + 1 - s);
    arr = next;
  }
  return arr;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const findMatch = (matches: Match[], id: string): Match | undefined =>
  matches.find((m) => m.id === id);

/** Propage un vainqueur dans le tableau et ouvre les matchs complets. */
function propagate(matches: Match[], match: Match, winnerId: string): void {
  if (!match.nextId || !match.nextSlot) return;
  const target = findMatch(matches, match.nextId);
  if (!target) return;
  target[match.nextSlot] = winnerId;
  if (target.a && target.b && target.status === "attente") {
    target.status = "pret";
  }
}

/** Résout les byes (exempts) en cascade jusqu'à stabilisation. */
function resolveByes(matches: Match[]): void {
  let changed = true;
  while (changed) {
    changed = false;
    for (const m of matches) {
      if (m.status !== "attente" || m.winner) continue;
      if (m.a && !m.b) {
        m.winner = "a";
        m.bye = true;
        m.status = "termine";
        propagate(matches, m, m.a);
        changed = true;
      } else if (m.b && !m.a) {
        m.winner = "b";
        m.bye = true;
        m.status = "termine";
        propagate(matches, m, m.b);
        changed = true;
      }
    }
  }
}

/** Génère un tableau complet à élimination directe pour une catégorie. */
export function generateBracket(catId: string, athleteIds: string[]): Match[] {
  const n = athleteIds.length;
  if (n < 2) return [];
  const size = nextPow2(n);
  const rounds = Math.log2(size);
  const order = seedOrder(size);

  const slots: (string | null)[] = new Array(size).fill(null);
  athleteIds.forEach((id, i) => {
    slots[order.indexOf(i + 1)] = id;
  });

  const matches: Match[] = [];
  for (let r = 0; r < rounds; r++) {
    const count = size / Math.pow(2, r + 1);
    for (let i = 0; i < count; i++) {
      matches.push({
        id: uid(catId),
        catId,
        round: r,
        index: i,
        a: null,
        b: null,
        baseA: 0,
        baseB: 0,
        gamA: 0,
        gamB: 0,
        winner: null,
        bye: false,
        status: "attente",
        nextId: null,
        nextSlot: null,
      });
    }
  }

  const at = (r: number, i: number): Match =>
    matches.find((m) => m.round === r && m.index === i) as Match;

  for (let i = 0; i < size / 2; i++) {
    const m = at(0, i);
    m.a = slots[i * 2];
    m.b = slots[i * 2 + 1];
    if (m.a && m.b) m.status = "pret";
  }

  for (let r = 0; r < rounds - 1; r++) {
    const count = size / Math.pow(2, r + 1);
    for (let i = 0; i < count; i++) {
      const m = at(r, i);
      m.nextId = at(r + 1, Math.floor(i / 2)).id;
      m.nextSlot = i % 2 === 0 ? "a" : "b";
    }
  }

  resolveByes(matches);
  return matches;
}

export function totalRounds(matches: Match[]): number {
  return matches.reduce((max, m) => Math.max(max, m.round + 1), 0);
}

export function roundName(round: number, rounds: number): string {
  const fromEnd = rounds - 1 - round;
  if (fromEnd === 0) return "Finale";
  if (fromEnd === 1) return "Demi-finales";
  if (fromEnd === 2) return "Quarts de finale";
  if (fromEnd === 3) return "Huitièmes de finale";
  return `Tour ${round + 1}`;
}

export function totalScore(m: Match, side: "a" | "b"): number {
  return side === "a" ? m.baseA + m.gamB : m.baseB + m.gamA;
}

/** Termine un match : propage le vainqueur et calcule le podium si c'est la finale. */
export function finishMatch(
  matches: Match[],
  matchId: string,
  winner: "a" | "b"
): { matches: Match[]; podium: Podium | null } {
  const next = matches.map((m) => ({ ...m }));
  const m = findMatch(next, matchId);
  if (!m || !m.a || !m.b) return { matches: next, podium: null };

  const winnerId = winner === "a" ? m.a : m.b;
  const loserId = winner === "a" ? m.b : m.a;
  m.winner = winner;
  m.status = "termine";
  propagate(next, m, winnerId);

  const rounds = totalRounds(next);
  let podium: Podium | null = null;

  if (m.round === rounds - 1) {
    const bronzes: string[] = [];
    if (rounds >= 2) {
      next
        .filter((x) => x.round === rounds - 2 && x.winner && x.a && x.b)
        .forEach((x) => {
          const loser = x.winner === "a" ? x.b : x.a;
          if (loser) bronzes.push(loser);
        });
    }
    podium = { gold: winnerId, silver: loserId, bronzes };
  }

  return { matches: next, podium };
}
