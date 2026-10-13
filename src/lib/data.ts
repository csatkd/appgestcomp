import type { AppState, Athlete, WeightClass, Club, Referee } from "./types";
import { generateBracket, totalRounds, finishMatch } from "./bracket";

export const STORAGE_KEY = "dojang:v5";

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
  "Taekwondo Club d'Abidjan",
  "INJS Abidjan",
  "Bouaké TKD Académie",
  "Yamoussoukro Taekwondo",
  "Denguélé d'Odienné",
  "Korhogo TKD",
  "San Pedro Olympique TKD",
  "SOA Taekwondo",
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
    license: `FITKD-26-${String(1000 + seedId)}`,
    weight,
    category: cat,
    status: weight !== null ? "pesé" : "inscrit",
  };
}

function seedAthletes(): Athlete[] {
  seedId = 0;
  return [
    // Hommes −68 kg (catégorie complète, tirage généré)
    ath("Adama", "KONÉ", "M", 2001, "Taekwondo Club d'Abidjan", 64.2),
    ath("Seydou", "TRAORÉ", "M", 1999, "INJS Abidjan", 66.8),
    ath("Wilfried", "AKA", "M", 2003, "Bouaké TKD Académie", 62.5),
    ath("Moussa", "DIABATÉ", "M", 2002, "Yamoussoukro Taekwondo", 67.4),
    ath("Jean-Marc", "N'GUESSAN", "M", 2000, "Taekwondo Club d'Abidjan", 61.0),
    ath("Ibrahim", "OUATTARA", "M", 2004, "Korhogo TKD", 65.7),
    // Hommes −58 kg
    ath("Ange", "KOUADIO", "M", 2005, "INJS Abidjan", 55.3),
    ath("Tiémoko", "SILUÉ", "M", 2003, "Korhogo TKD", 57.1),
    ath("Koffi", "YAO", "M", 2006, "Bouaké TKD Académie", 54.8),
    ath("Franck", "KASSI", "M", 2004, "San Pedro Olympique TKD", 56.2),
    ath("Issa", "BAMBA", "M", 2005, "Denguélé d'Odienné", null),
    // Hommes −80 kg
    ath("Abdoulaye", "CISSÉ", "M", 1998, "Denguélé d'Odienné", 76.4),
    ath("Hermann", "KONAN", "M", 2000, "Taekwondo Club d'Abidjan", 78.9),
    ath("Serge", "TANOH", "M", 1997, "SOA Taekwondo", 74.1),
    // Hommes +80 kg
    ath("Lacina", "DOUMBIA", "M", 1996, "Yamoussoukro Taekwondo", 92.5),
    ath("Éric", "GNAGNE", "M", 1999, "SOA Taekwondo", 88.2),
    // Femmes −49 kg
    ath("Aya", "KOUAMÉ", "F", 2004, "INJS Abidjan", 46.2),
    ath("Salimata", "FOFANA", "F", 2002, "Korhogo TKD", 48.0),
    ath("Adjoua", "N'ZI", "F", 2005, "Bouaké TKD Académie", 47.3),
    ath("Grâce", "ASSAMOI", "F", 2003, "Taekwondo Club d'Abidjan", null),
    // Femmes −57 kg
    ath("Aminata", "SANGARÉ", "F", 2001, "Denguélé d'Odienné", 53.6),
    ath("Mariam", "TOURE", "F", 2000, "Yamoussoukro Taekwondo", 55.9),
    ath("Prisca", "GUEI", "F", 2003, "San Pedro Olympique TKD", 52.4),
    // Femmes −67 kg
    ath("Bintou", "KONATÉ", "F", 1999, "SOA Taekwondo", 63.7),
    ath("Nafissatou", "COULIBALY", "F", 1998, "Korhogo TKD", 65.1),
    // Femmes +67 kg
    ath("Ruth", "ADOU", "F", 1997, "Taekwondo Club d'Abidjan", 71.8),
    ath("Fatoumata", "ZADI", "F", 2000, "INJS Abidjan", 69.4),
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

  // Données de démonstration pour les clubs
  const clubs: Club[] = [
    {
      id: "club-1",
      name: "Taekwondo Club d'Abidjan",
      city: "Abidjan",
      region: "Lagunes",
      president: "M. Koné Ibrahim",
      email: "tca@example.com",
      phone: "+225 07 12 34 56 78",
      address: "Cocody, Abidjan",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
      athleteCount: 45,
    },
    {
      id: "club-2",
      name: "INJS Abidjan",
      city: "Abidjan",
      region: "Lagunes",
      president: "Mme Traoré Awa",
      email: "injs@example.com",
      phone: "+225 07 23 45 67 89",
      address: "Yopougon, Abidjan",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
      athleteCount: 38,
    },
    {
      id: "club-3",
      name: "Bouaké TKD Académie",
      city: "Bouaké",
      region: "Gbêkê",
      president: "M. Diallo Mamadou",
      email: "bouake.tkd@example.com",
      phone: "+225 05 34 56 78 90",
      address: "Centre-ville, Bouaké",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 250).toISOString(),
      athleteCount: 32,
    },
    {
      id: "club-4",
      name: "Yamoussoukro Taekwondo",
      city: "Yamoussoukro",
      region: "Bélier",
      president: "M. Kouassi Jean",
      email: "yam.tkd@example.com",
      phone: "+225 01 45 67 89 01",
      address: "Yamoussoukro",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
      athleteCount: 28,
    },
    {
      id: "club-5",
      name: "Denguélé d'Odienné",
      city: "Odienné",
      region: "Denguélé",
      president: "M. Cissé Ahmed",
      email: "denguele@example.com",
      phone: "+225 07 56 78 90 12",
      address: "Odienné",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
      athleteCount: 22,
    },
    {
      id: "club-6",
      name: "Korhogo TKD",
      city: "Korhogo",
      region: "Poro",
      president: "M. Ouattara Souleymane",
      email: "korhogo.tkd@example.com",
      phone: "+225 05 67 89 01 23",
      address: "Korhogo",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(),
      athleteCount: 25,
    },
    {
      id: "club-7",
      name: "San Pedro Olympique TKD",
      city: "San Pedro",
      region: "San-Pédro",
      president: "Mme Bamba Fatou",
      email: "sanpedro@example.com",
      phone: "+225 01 78 90 12 34",
      address: "San Pedro",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      athleteCount: 18,
    },
    {
      id: "club-8",
      name: "SOA Taekwondo",
      city: "Abidjan",
      region: "Lagunes",
      president: "M. Adjobi Serge",
      email: "soa.tkd@example.com",
      phone: "+225 07 89 01 23 45",
      address: "Adjamé, Abidjan",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100).toISOString(),
      athleteCount: 35,
    },
  ];

  // Données de démonstration pour les arbitres
  const referees: Referee[] = [
    {
      id: "ref-1",
      firstName: "Moussa",
      lastName: "Koné",
      license: "ARB-2024-001",
      grade: "Arbitre International",
      phone: "+225 07 11 22 33 44",
      email: "m.kone.arbitre@example.com",
      city: "Abidjan",
      status: "actif",
      matchesCount: 156,
    },
    {
      id: "ref-2",
      firstName: "Fatou",
      lastName: "Diallo",
      license: "ARB-2024-002",
      grade: "Arbitre Continental",
      phone: "+225 05 22 33 44 55",
      email: "f.diallo.arbitre@example.com",
      city: "Bouaké",
      status: "actif",
      matchesCount: 98,
    },
    {
      id: "ref-3",
      firstName: "Ibrahim",
      lastName: "Ouattara",
      license: "ARB-2024-003",
      grade: "Arbitre National",
      phone: "+225 01 33 44 55 66",
      email: "i.ouattara.arbitre@example.com",
      city: "Korhogo",
      status: "actif",
      matchesCount: 67,
    },
    {
      id: "ref-4",
      firstName: "Aminata",
      lastName: "Touré",
      license: "ARB-2024-004",
      grade: "Arbitre National",
      phone: "+225 07 44 55 66 77",
      email: "a.toure.arbitre@example.com",
      city: "Yamoussoukro",
      status: "actif",
      matchesCount: 54,
    },
    {
      id: "ref-5",
      firstName: "Seydou",
      lastName: "Cissé",
      license: "ARB-2024-005",
      grade: "Arbitre Régional",
      phone: "+225 05 55 66 77 88",
      email: "s.cisse.arbitre@example.com",
      city: "San Pedro",
      status: "actif",
      matchesCount: 32,
    },
    {
      id: "ref-6",
      firstName: "Mariam",
      lastName: "Bamba",
      license: "ARB-2024-006",
      grade: "Arbitre Régional",
      phone: "+225 01 66 77 88 99",
      email: "m.bamba.arbitre@example.com",
      city: "Abidjan",
      status: "inactif",
      matchesCount: 28,
    },
  ];

  return {
    version: 5,
    event: {
      name: "Championnat National FITKD 2026",
      date: "14–16 Mars 2026",
      venue: "Palais des Sports — Treichville, Abidjan",
      arenas: 3,
    },
    athletes,
    brackets: { "M-68": bracket },
    catStatus,
    results: {},
    disabledCats: [],
    claims: [],
    qrScans: [],
    competitions: [
      {
        id: "comp-1",
        name: "Championnat National FITKD 2026",
        type: "nationale",
        status: "active",
        organizerId: "org-1",
        startDate: "2026-03-14",
        endDate: "2026-03-16",
        venue: "Palais des Sports — Treichville, Abidjan",
        arenas: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    organizers: [
      {
        id: "org-1",
        name: "Fédération Ivoirienne de Taekwondo",
        email: "contact@fitkd.ci",
        organization: "FITKD",
        phone: "+225 27 22 44 55 66",
      },
    ],
    currentCompetitionId: "comp-1",
    clubs,
    referees,
    activity: [
      {
        id: "seed-1",
        time: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        kind: "config",
        label: "Événement configuré — Championnat National FITKD 2026",
      },
      {
        id: "seed-2",
        time: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
        kind: "athlete",
        label: "27 athlètes inscrits depuis 8 clubs ivoiriens",
      },
      {
        id: "seed-3",
        time: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        kind: "pesee",
        label: "Pesée officielle terminée — 26 athlètes validés",
      },
      {
        id: "seed-4",
        time: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        kind: "tirage",
        label: "Tirage au sort généré — Hommes −68 kg (8 engagés)",
      },
    ],
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
