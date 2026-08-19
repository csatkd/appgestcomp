export type Gender = "M" | "F";

export type AthleteStatus = "inscrit" | "pesé" | "forfait";

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: number;
  club: string;
  license: string;
  weight: number | null;
  category: string | null;
  status: AthleteStatus;
}

export type MatchStatus = "attente" | "pret" | "encours" | "termine";

export interface MatchClock {
  time: number;
  round: number;
  phase: "combat" | "repos" | "golden";
}

export interface Match {
  id: string;
  catId: string;
  round: number;
  index: number;
  a: string | null;
  b: string | null;
  baseA: number;
  baseB: number;
  gamA: number;
  gamB: number;
  winner: "a" | "b" | null;
  bye: boolean;
  status: MatchStatus;
  nextId: string | null;
  nextSlot: "a" | "b" | null;
  clock?: MatchClock;
}

export type CategoryStatus = "ouverte" | "tirée" | "terminée";

export interface WeightClass {
  id: string;
  gender: Gender;
  label: string;
  maxWeight: number | null;
}

export interface Podium {
  gold: string;
  silver: string;
  bronzes: string[];
}

export interface EventConfig {
  name: string;
  date: string;
  venue: string;
  arenas: number;
}

export interface AppState {
  version: number;
  event: EventConfig;
  athletes: Athlete[];
  brackets: Record<string, Match[]>;
  catStatus: Record<string, CategoryStatus>;
  results: Record<string, Podium>;
}

export type Action =
  | { type: "ADD_ATHLETE"; athlete: Athlete }
  | { type: "DELETE_ATHLETE"; id: string }
  | { type: "WEIGH_IN"; id: string; weight: number }
  | { type: "FORFAIT"; id: string }
  | { type: "REINSTATE"; id: string }
  | { type: "GENERATE_BRACKET"; catId: string; athleteIds: string[] }
  | { type: "RESET_BRACKET"; catId: string }
  | { type: "SET_MATCH"; catId: string; match: Match }
  | { type: "FINISH_MATCH"; catId: string; matchId: string; winner: "a" | "b" }
  | { type: "RESET_ALL" };
