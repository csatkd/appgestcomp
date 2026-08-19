import type { AppState, Athlete, WeightClass } from "./types";
import { generateBracket, totalRounds, finishMatch } from "./bracket";

export const STORAGE_KEY = "dojang:v1";

export const WEIGHT_CLASSES: WeightClass[] = [
  { id: "M-58", gender: "M", label: "Hommes −58 kg", maxWeight: 58 },
  { id: "M-68", gender: "M", label: "Hommes −68 kg", maxWeight: 68 },
  { id: "M-80", gender: "M", label: "Hommes −80 kg", maxWeight: 80 },
  { id: "M+80", gender: "M", label: "Hommes +80 kg", maxWeight: null },
  { id: "F-49", gender: "F", label: "Femmes −49 kg", maxWeight: 49 },
  { id: "F-57", gender: "F", label: "Femmes −57 kg", maxWeight: 57 },
  { id: "F-67", gender: "F", label: "Femmes −67 kg", maxWeight: 67 },
  { id: "F+67", gender: "F", label: "Femmes +67 kg", maxWeight: null },
];

export const CLUBS = [
  "Nadi El Amel (ALG)",
  "JS Oran (ALG)",
  "Espoir TKD Dakar (SEN)",
  "AC Abidjan (CIV)",
  "Casablanca TKD (MAR)",
  "Lagos Dragons (NGA)",
  "Nairobi Lions (KEN)",
  "Kigali Warriors (RWA)",
];

/** Détermine la catégorie d'un athlète à partir de son poids. */
export function categoryFor(gender: "M" | "F", weight: number): WeightClass {
  const classes = WEIGHT_CLASSES.filter((c) => c.gender === gender);
  for (const c of classes) {
    if (c.maxWeight !== null && weight <= c.maxWeight) return c;
  }
  return classes[classes.length - 1];
}

export function classLabel(catId: string): string {
  return WEIGHT_CLASSES.find((c) => c.id === catId)?.label ?? catId;
}

let seedId = 0;
function ath(
  firstName: string,
  lastName: string,
  gender: "M" | "F",
  birthYear: number,
  club: string,
  weight: number | null
): Athlete {
  seedId += 1;
  const cat = weight !== null ? categoryFor(gender, weight).id : null;
  return {
    id: `ath-${seedId}`,
    firstName,
    lastName,
    gender,
    birthYear,
    club,
    license: `LIC-26-${String(1000 + seedId)}`,
    weight,
    category: cat,
    status: weight !== null ? "pesé" : "inscrit",
  };
}

function seedAthletes(): Athlete[] {
  seedId = 0;
  return [
    // Hommes −68 kg (catégorie complète, tirage généré)
    ath("Sofiane", "DELI", "M", 2001, "Nadi El Amel (ALG)", 64.2),
    ath("Daouda", "HERVE", "M", 1999, "AC Abidjan (CIV)", 66.8),
    ath("Karim", "MANSOURI", "M", 2003, "JS Oran (ALG)", 62.5),
    ath("Ibrahima", "NDIAYE", "M", 2002, "Espoir TKD Dakar (SEN)", 67.4),
    ath("Youssef", "BENALI", "M", 2000, "Casablanca TKD (MAR)", 61.0),
    ath("Chinedu", "OKAFOR", "M", 2004, "Lagos Dragons (NGA)", 65.7),
    // Hommes −58 kg
    ath("Amine", "KOUASSI", "M", 2005, "AC Abidjan (CIV)", 55.3),
    ath("Moussa", "TRAORÉ", "M", 2003, "Espoir TKD Dakar (SEN)", 57.1),
    ath("Reda", "HADJ", "M", 2006, "Nadi El Amel (ALG)", 54.8),
    ath("Kevin", "MWAPE", "M", 2004, "Nairobi Lions (KEN)", 56.2),
    ath("Omar", "SY", "M", 2005, "Espoir TKD Dakar (SEN)", null),
    // Hommes −80 kg
    ath("Abdoulaye", "DIALLO", "M", 1998, "Espoir TKD Dakar (SEN)", 76.4),
    ath("Mehdi", "CHERIF", "M", 2000, "JS Oran (ALG)", 78.9),
    ath("Samuel", "ETOUNDI", "M", 1997, "Kigali Warriors (RWA)", 74.1),
    // Hommes +80 kg
    ath("Babacar", "FALL", "M", 1996, "Espoir TKD Dakar (SEN)", 92.5),
    ath("Jean-Marc", "KOUIDIO", "M", 1999, "AC Abidjan (CIV)", 88.2),
    // Femmes −49 kg
    ath("Awa", "CISSÉ", "F", 2004, "Espoir TKD Dakar (SEN)", 46.2),
    ath("Lina", "BOUZID", "F", 2002, "Nadi El Amel (ALG)", 48.0),
    ath("Fatoumata", "KANTÉ", "F", 2005, "AC Abidjan (CIV)", 47.3),
    ath("Grace", "ADEYEMI", "F", 2003, "Lagos Dragons (NGA)", null),
    // Femmes −57 kg
    ath("Nour", "EL AMRI", "F", 2001, "Casablanca TKD (MAR)", 53.6),
    ath("Salimata", "OUÉDRAOGO", "F", 2000, "Espoir TKD Dakar (SEN)", 55.9),
    ath("Mariam", "TOURE", "F", 2003, "AC Abidjan (CIV)", 52.4),
    // Femmes −67 kg
    ath("Kenza", "BERRAH", "F", 1999, "JS Oran (ALG)", 63.7),
    ath("Aminata", "SOW", "F", 1998, "Espoir TKD Dakar (SEN)", 65.1),
    // Femmes +67 kg
    ath("Ruth", "WAMBUI", "F", 1997, "Nairobi Lions (KEN)", 71.8),
    ath("Oumou", "DIAGNE", "F", 2000, "Espoir TKD Dakar (SEN)", 69.4),
  ];
}

/** État initial : événement + athlètes + un tirage déjà prêt en −68 kg. */
export function buildSeed(): AppState {
  const athletes = seedAthletes();

  const m68 = athletes.filter((a) => a.category === "M-68").map((a) => a.id);
  let bracket = generateBracket("M-68", m68);

  // Un combat de quart déjà disputé, pour alimenter le tableau de bord.
  const qf = bracket.find((m) => m.round === 0 && m.status === "pret");
  if (qf) {
    const r = finishMatch(bracket, qf.id, Math.random() < 0.5 ? "a" : "b");
    bracket = r.matches.map((m) => {
      if (m.id !== qf.id) return m;
      const winner = m.winner === "a" ? "a" : "b";
      const loser = winner === "a" ? "b" : "a";
      return {
        ...m,
        baseA: winner === "a" ? 14 : 9,
        baseB: winner === "b" ? 14 : 9,
        gamA: loser === "a" ? 2 : 1,
        gamB: loser === "b" ? 2 : 1,
      };
    });
  }

  const catStatus: AppState["catStatus"] = {};
  WEIGHT_CLASSES.forEach((c) => {
    catStatus[c.id] = "ouverte";
  });
  catStatus["M-68"] = "tirée";

  return {
    version: 1,
    event: {
      name: "DOJANG Cup 2026",
      date: "14–16 Mars 2026",
      venue: "Palais des Sports — Alger",
      arenas: 2,
    },
    athletes,
    brackets: { "M-68": bracket },
    catStatus,
    results: {},
  };
}

export function athleteName(athletes: Athlete[], id: string | null): string {
  if (!id) return "—";
  const a = athletes.find((x) => x.id === id);
  if (!a) return "—";
  return `${a.firstName.charAt(0)}. ${a.lastName}`;
}

export function totalMatches(state: AppState): number {
  return Object.values(state.brackets).reduce((s, arr) => s + arr.length, 0);
}

export function finishedMatches(state: AppState): number {
  return Object.values(state.brackets).reduce(
    (s, arr) => s + arr.filter((m) => m.status === "termine").length,
    0
  );
}

export function readyMatches(state: AppState) {
  const all = Object.values(state.brackets)
    .flat()
    .filter((m) => m.status === "pret" || m.status === "encours");
  return all.sort((x, y) => (x.status === y.status ? 0 : x.status === "encours" ? -1 : 1));
}

export { totalRounds };
