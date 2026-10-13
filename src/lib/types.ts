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

export type CompetitionType = "locale" | "nationale" | "internationale";
export type CompetitionStatus = "brouillon" | "active" | "terminee" | "archivee";

export interface Organizer {
  id: string;
  name: string;
  email: string;
  organization: string;
  phone?: string;
}

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  status: CompetitionStatus;
  organizerId: string;
  startDate: string;
  endDate: string;
  venue: string;
  arenas: number;
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  city: string;
  region: string;
  president: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  athleteCount: number;
}

export type ActivityKind =
  | "athlete"
  | "pesee"
  | "tirage"
  | "combat"
  | "config"
  | "donnees";

export interface ActivityEntry {
  id: string;
  time: string; // ISO
  kind: ActivityKind;
  label: string;
}

export type ClaimStatus = "soumise" | "en_examen" | "acceptee" | "rejetee";

export interface Claim {
  id: string;
  matchId: string;
  catId: string;
  athleteId: string;
  reason: string;
  status: ClaimStatus;
  submittedAt: string;
  resolvedAt: string | null;
  resolution: string | null;
}

export interface QrScan {
  id: string;
  athleteId: string;
  scannedAt: string;
  type: "presence" | "pesee";
}

export interface Club {
  id: string;
  name: string;
  city: string;
  region: string;
  president: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  athleteCount: number;
}

export interface Referee {
  id: string;
  firstName: string;
  lastName: string;
  license: string;
  grade: string;
  phone: string;
  email: string;
  city: string;
  status: "actif" | "inactif" | "suspendu";
  matchesCount: number;
}

export type SponsorType = "principal" | "officiel" | "partenaire" | "media" | "technique";
export type SponsorLevel = "or" | "argent" | "bronze";
export type SponsorStatus = "actif" | "en_attente" | "expire";

export interface Sponsor {
  id: string;
  name: string;
  type: SponsorType;
  level: SponsorLevel;
  logo: string;
  logoHighRes?: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: SponsorStatus;
  amount?: number;
  description?: string;
  visibility?: SponsorVisibility[];
  benefits?: string[];
  contractFile?: string;
  notes?: string;
  payments?: SponsorPayment[];
  communications?: SponsorCommunication[];
}

export type SponsorVisibility = "site_web" | "tv" | "affiches" | "maillots" | "stand" | "reseaux_sociaux" | "presse";

export interface SponsorPayment {
  id: string;
  amount: number;
  date: string;
  status: "paye" | "en_attente" | "en_retard";
  method?: string;
  reference?: string;
  notes?: string;
}

export interface SponsorCommunication {
  id: string;
  date: string;
  type: "email" | "telephone" | "reunion" | "autre";
  subject: string;
  content: string;
  participants?: string[];
}

export interface AppState {
  version: number;
  event: EventConfig;
  athletes: Athlete[];
  brackets: Record<string, Match[]>;
  catStatus: Record<string, CategoryStatus>;
  results: Record<string, Podium>;
  disabledCats: string[];
  activity: ActivityEntry[];
  claims: Claim[];
  qrScans: QrScan[];
  competitions: Competition[];
  organizers: Organizer[];
  currentCompetitionId: string | null;
  clubs: Club[];
  referees: Referee[];
  sponsors: Sponsor[];
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
  | { type: "UPDATE_EVENT"; event: EventConfig }
  | { type: "TOGGLE_CLASS"; catId: string }
  | { type: "ADD_CLAIM"; claim: Claim }
  | { type: "UPDATE_CLAIM"; id: string; status: ClaimStatus; resolution?: string }
  | { type: "DELETE_CLAIM"; id: string }
  | { type: "ADD_QR_SCAN"; scan: QrScan }
  | { type: "ADD_COMPETITION"; competition: Competition }
  | { type: "UPDATE_COMPETITION"; id: string; updates: Partial<Competition> }
  | { type: "DELETE_COMPETITION"; id: string }
  | { type: "SET_CURRENT_COMPETITION"; id: string | null }
  | { type: "ADD_ORGANIZER"; organizer: Organizer }
  | { type: "UPDATE_ORGANIZER"; id: string; updates: Partial<Organizer> }
  | { type: "DELETE_ORGANIZER"; id: string }
  | { type: "ADD_CLUB"; club: Club }
  | { type: "UPDATE_CLUB"; id: string; updates: Partial<Club> }
  | { type: "DELETE_CLUB"; id: string }
  | { type: "ADD_REFEREE"; referee: Referee }
  | { type: "UPDATE_REFEREE"; id: string; updates: Partial<Referee> }
  | { type: "DELETE_REFEREE"; id: string }
  | { type: "ADD_SPONSOR"; sponsor: Sponsor }
  | { type: "UPDATE_SPONSOR"; id: string; updates: Partial<Sponsor> }
  | { type: "DELETE_SPONSOR"; id: string }
  | { type: "IMPORT_STATE"; state: AppState; label?: string }
  | { type: "RESET_ALL" };
