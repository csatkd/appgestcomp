import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Action, AppState, Match } from "./types";
import { buildSeed, categoryFor, STORAGE_KEY, WEIGHT_CLASSES } from "./data";
import { finishMatch, generateBracket, shuffle } from "./bracket";

function loadInitial(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && parsed.version === 2 && Array.isArray(parsed.athletes)) {
        return parsed;
      }
    }
  } catch {
    /* stockage corrompu → reseed */
  }
  return buildSeed();
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_ATHLETE":
      return { ...state, athletes: [action.athlete, ...state.athletes] };

    case "DELETE_ATHLETE":
      return {
        ...state,
        athletes: state.athletes.filter((a) => a.id !== action.id),
      };

    case "WEIGH_IN": {
      const athletes = state.athletes.map((a) => {
        if (a.id !== action.id) return a;
        const cat = categoryFor(a.gender, action.weight);
        return {
          ...a,
          weight: action.weight,
          category: cat.id,
          status: "pesé" as const,
        };
      });
      return { ...state, athletes };
    }

    case "FORFAIT":
      return {
        ...state,
        athletes: state.athletes.map((a) =>
          a.id === action.id ? { ...a, status: "forfait" } : a
        ),
      };

    case "REINSTATE":
      return {
        ...state,
        athletes: state.athletes.map((a) =>
          a.id === action.id
            ? { ...a, status: a.weight !== null ? "pesé" : "inscrit" }
            : a
        ),
      };

    case "GENERATE_BRACKET": {
      const ids = shuffle(action.athleteIds);
      const matches = generateBracket(action.catId, ids);
      return {
        ...state,
        brackets: { ...state.brackets, [action.catId]: matches },
        catStatus: { ...state.catStatus, [action.catId]: "tirée" },
      };
    }

    case "RESET_BRACKET": {
      const brackets = { ...state.brackets };
      delete brackets[action.catId];
      return {
        ...state,
        brackets,
        catStatus: { ...state.catStatus, [action.catId]: "ouverte" },
        results: Object.fromEntries(
          Object.entries(state.results).filter(([k]) => k !== action.catId)
        ),
      };
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
      return {
        ...state,
        brackets: { ...state.brackets, [action.catId]: matches },
        results,
        catStatus,
      };
    }

    case "RESET_ALL":
      return buildSeed();

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
