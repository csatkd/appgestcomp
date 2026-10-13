import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Action, ActivityEntry, ActivityKind, AppState, Match } from "./types";
import { buildSeed, categoryFor, classLabel, STORAGE_KEY, WEIGHT_CLASSES } from "./data";
import { finishMatch, generateBracket, shuffle, uid } from "./bracket";

const ACTIVITY_LIMIT = 80;

function loadInitial(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && parsed.version === 5 && Array.isArray(parsed.athletes)) {
        return {
          ...parsed,
          disabledCats: parsed.disabledCats ?? [],
          activity: parsed.activity ?? [],
          claims: parsed.claims ?? [],
          qrScans: parsed.qrScans ?? [],
        };
      }
    }
  } catch {
    /* stockage corrompu → reseed */
  }
  return buildSeed();
}

/** Ajoute une entrée au journal d'activité (plafonné). */
function withLog(
  state: AppState,
  kind: ActivityKind,
  label: string
): AppState {
  const entry: ActivityEntry = {
    id: uid("act"),
    time: new Date().toISOString(),
    kind,
    label,
  };
  return { ...state, activity: [entry, ...state.activity].slice(0, ACTIVITY_LIMIT) };
}

function athleteLabel(state: AppState, id: string): string {
  const a = state.athletes.find((x) => x.id === id);
  return a ? `${a.firstName} ${a.lastName}` : id;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_ATHLETE": {
      const next = { ...state, athletes: [action.athlete, ...state.athletes] };
      return withLog(
        next,
        "athlete",
        `Inscription : ${action.athlete.firstName} ${action.athlete.lastName} (${action.athlete.club})`
      );
    }

    case "DELETE_ATHLETE": {
      const name = athleteLabel(state, action.id);
      const next = {
        ...state,
        athletes: state.athletes.filter((a) => a.id !== action.id),
      };
      return withLog(next, "athlete", `Suppression du dossier : ${name}`);
    }

    case "WEIGH_IN": {
      const name = athleteLabel(state, action.id);
      const cat = categoryFor(
        state.athletes.find((a) => a.id === action.id)?.gender ?? "M",
        action.weight
      );
      const athletes = state.athletes.map((a) => {
        if (a.id !== action.id) return a;
        return {
          ...a,
          weight: action.weight,
          category: cat.id,
          status: "pesé" as const,
        };
      });
      return withLog(
        { ...state, athletes },
        "pesee",
        `Pesée validée : ${name} — ${action.weight.toFixed(1)} kg → ${classLabel(cat.id)}`
      );
    }

    case "FORFAIT": {
      const name = athleteLabel(state, action.id);
      const next = {
        ...state,
        athletes: state.athletes.map((a) =>
          a.id === action.id ? { ...a, status: "forfait" as const } : a
        ),
      };
      return withLog(next, "pesee", `Forfait déclaré : ${name}`);
    }

    case "REINSTATE": {
      const name = athleteLabel(state, action.id);
      const next = {
        ...state,
        athletes: state.athletes.map((a) =>
          a.id === action.id
            ? { ...a, status: a.weight !== null ? ("pesé" as const) : ("inscrit" as const) }
            : a
        ),
      };
      return withLog(next, "pesee", `Réintégration : ${name}`);
    }

    case "GENERATE_BRACKET": {
      const ids = shuffle(action.athleteIds);
      const matches = generateBracket(action.catId, ids);
      const next = {
        ...state,
        brackets: { ...state.brackets, [action.catId]: matches },
        catStatus: { ...state.catStatus, [action.catId]: "tirée" as const },
      };
      return withLog(
        next,
        "tirage",
        `Tirage au sort généré — ${classLabel(action.catId)} (${ids.length} engagés)`
      );
    }

    case "RESET_BRACKET": {
      const brackets = { ...state.brackets };
      delete brackets[action.catId];
      const next = {
        ...state,
        brackets,
        catStatus: { ...state.catStatus, [action.catId]: "ouverte" as const },
        results: Object.fromEntries(
          Object.entries(state.results).filter(([k]) => k !== action.catId)
        ),
      };
      return withLog(next, "tirage", `Tableau annulé — ${classLabel(action.catId)}`);
    }

    case "SET_MATCH": {
      const arr = state.brackets[action.catId];
      if (!arr) return state;
      return {
        ...state,
        brackets: {
          ...state.brackets,
          [action.catId]: arr.map((m) => (m.id === action.match.id ? action.match : m)),
        },
      };
    }

    case "FINISH_MATCH": {
      const arr = state.brackets[action.catId];
      if (!arr) return state;
      const { matches, podium } = finishMatch(arr, action.matchId, action.winner);
      const results = podium
        ? { ...state.results, [action.catId]: podium }
        : state.results;
      const catStatus = podium
        ? { ...state.catStatus, [action.catId]: "terminée" as const }
        : state.catStatus;
      const next = {
        ...state,
        brackets: { ...state.brackets, [action.catId]: matches },
        results,
        catStatus,
      };
      if (podium) {
        return withLog(
          next,
          "combat",
          `Catégorie officialisée — ${classLabel(action.catId)} : or pour ${athleteLabel(state, podium.gold)}`
        );
      }
      return next;
    }

    case "UPDATE_EVENT": {
      const next = { ...state, event: action.event };
      return withLog(next, "config", `Événement mis à jour : ${action.event.name}`);
    }

    case "TOGGLE_CLASS": {
      const disabled = state.disabledCats.includes(action.catId);
      const disabledCats = disabled
        ? state.disabledCats.filter((c) => c !== action.catId)
        : [...state.disabledCats, action.catId];
      const next = { ...state, disabledCats };
      return withLog(
        next,
        "config",
        `${classLabel(action.catId)} ${disabled ? "réouverte aux engagements" : "fermée aux engagements"}`
      );
    }

    case "ADD_CLAIM": {
      const next = { ...state, claims: [action.claim, ...state.claims] };
      const athlete = state.athletes.find((a) => a.id === action.claim.athleteId);
      const name = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Inconnu";
      return withLog(next, "config", `Réclamation soumise par ${name}`);
    }

    case "UPDATE_CLAIM": {
      const claims = state.claims.map((c) => {
        if (c.id !== action.id) return c;
        return {
          ...c,
          status: action.status,
          resolvedAt: action.status === "acceptee" || action.status === "rejetee" ? new Date().toISOString() : null,
          resolution: action.resolution ?? c.resolution,
        };
      });
      const next = { ...state, claims };
      const claim = claims.find((c) => c.id === action.id);
      const athlete = state.athletes.find((a) => a.id === claim?.athleteId);
      const name = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Inconnu";
      const statusLabel = action.status === "acceptee" ? "acceptée" : action.status === "rejetee" ? "rejetée" : "en examen";
      return withLog(next, "config", `Réclamation de ${name} ${statusLabel}`);
    }

    case "DELETE_CLAIM": {
      const claims = state.claims.filter((c) => c.id !== action.id);
      return { ...state, claims };
    }

    case "ADD_QR_SCAN": {
      const next = { ...state, qrScans: [action.scan, ...state.qrScans] };
      const athlete = state.athletes.find((a) => a.id === action.scan.athleteId);
      const name = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Inconnu";
      const typeLabel = action.scan.type === "presence" ? "présence" : "pesée";
      return withLog(next, "config", `Scan QR ${typeLabel} : ${name}`);
    }

    case "ADD_COMPETITION": {
      const next = { ...state, competitions: [action.competition, ...state.competitions] };
      return withLog(next, "config", `Nouvelle compétition créée : ${action.competition.name}`);
    }

    case "UPDATE_COMPETITION": {
      const competitions = state.competitions.map((c) => {
        if (c.id !== action.id) return c;
        return { ...c, ...action.updates, updatedAt: new Date().toISOString() };
      });
      const next = { ...state, competitions };
      const comp = competitions.find((c) => c.id === action.id);
      return withLog(next, "config", `Compétition mise à jour : ${comp?.name}`);
    }

    case "DELETE_COMPETITION": {
      const competitions = state.competitions.filter((c) => c.id !== action.id);
      const next = {
        ...state,
        competitions,
        currentCompetitionId: state.currentCompetitionId === action.id ? null : state.currentCompetitionId,
      };
      return withLog(next, "config", `Compétition supprimée`);
    }

    case "SET_CURRENT_COMPETITION": {
      return { ...state, currentCompetitionId: action.id };
    }

    case "ADD_ORGANIZER": {
      const next = { ...state, organizers: [action.organizer, ...state.organizers] };
      return withLog(next, "config", `Nouvel organisateur ajouté : ${action.organizer.name}`);
    }

    case "UPDATE_ORGANIZER": {
      const organizers = state.organizers.map((o) => {
        if (o.id !== action.id) return o;
        return { ...o, ...action.updates };
      });
      return { ...state, organizers };
    }

    case "DELETE_ORGANIZER": {
      const organizers = state.organizers.filter((o) => o.id !== action.id);
      return { ...state, organizers };
    }

    case "ADD_CLUB": {
      const next = { ...state, clubs: [action.club, ...state.clubs] };
      return withLog(next, "config", `Nouveau club ajouté : ${action.club.name}`);
    }

    case "UPDATE_CLUB": {
      const clubs = state.clubs.map((c) => {
        if (c.id !== action.id) return c;
        return { ...c, ...action.updates };
      });
      const next = { ...state, clubs };
      const club = clubs.find((c) => c.id === action.id);
      return withLog(next, "config", `Club mis à jour : ${club?.name}`);
    }

    case "DELETE_CLUB": {
      const clubs = state.clubs.filter((c) => c.id !== action.id);
      const next = { ...state, clubs };
      return withLog(next, "config", `Club supprimé`);
    }

    case "ADD_REFEREE": {
      const next = { ...state, referees: [action.referee, ...state.referees] };
      return withLog(next, "config", `Nouvel arbitre ajouté : ${action.referee.firstName} ${action.referee.lastName}`);
    }

    case "UPDATE_REFEREE": {
      const referees = state.referees.map((r) => {
        if (r.id !== action.id) return r;
        return { ...r, ...action.updates };
      });
      const next = { ...state, referees };
      const ref = referees.find((r) => r.id === action.id);
      return withLog(next, "config", `Arbitre mis à jour : ${ref?.firstName} ${ref?.lastName}`);
    }

    case "DELETE_REFEREE": {
      const referees = state.referees.filter((r) => r.id !== action.id);
      const next = { ...state, referees };
      return withLog(next, "config", `Arbitre supprimé`);
    }

    case "IMPORT_STATE": {
      const next = withLog(
        action.state,
        "donnees",
        action.label ?? "Données importées depuis une sauvegarde JSON"
      );
      return next;
    }

    case "RESET_ALL": {
      const next = buildSeed();
      return withLog(next, "donnees", "Données réinitialisées (jeu de démonstration FITKD)");
    }

    default:
      return state;
  }
}

interface StoreCtx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota dépassé : silencieux */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp doit être utilisé dans <StoreProvider>");
  return ctx;
}

export function useAthleteMap() {
  const { state } = useApp();
  return useMemo(() => {
    const map = new Map<string, (typeof state.athletes)[number]>();
    state.athletes.forEach((a) => map.set(a.id, a));
    return map;
  }, [state.athletes]);
}

export function weighedIn(state: AppState, catId: string) {
  return state.athletes.filter(
    (a) => a.category === catId && a.status === "pesé"
  );
}

export function canResetBracket(matches: Match[] | undefined): boolean {
  if (!matches) return false;
  return matches.every((m) => m.status !== "termine" || m.bye);
}

export { WEIGHT_CLASSES };
