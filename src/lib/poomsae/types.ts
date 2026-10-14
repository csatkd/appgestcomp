/**
 * Types spécifiques au Poomsae (formes)
 * Le Poomsae est une discipline artistique où les athlètes exécutent
 * des enchaînements de mouvements prédéfinis (formes/patterns)
 */

// ============================================
// FORMES POOMSAE
// ============================================

/**
 * Liste officielle des formes WT (World Taekwondo)
 */
export type PoomsaeForm = 
  // Formes Taegeuk (ceintures de couleur)
  | "Taegeuk 1 Jang"
  | "Taegeuk 2 Jang"
  | "Taegeuk 3 Jang"
  | "Taegeuk 4 Jang"
  | "Taegeuk 5 Jang"
  | "Taegeuk 6 Jang"
  | "Taegeuk 7 Jang"
  | "Taegeuk 8 Jang"
  // Formes noires (Dan)
  | "Koryo"
  | "Keumgang"
  | "Taebaek"
  | "Pyongwon"
  | "Shipjin"
  | "Jitae"
  | "Chonkwon"
  | "Hansoo"
  | "Ilyeo"
  // Freestyle
  | "Freestyle";

/**
 * Correspondance entre grade et forme imposée
 */
export const GRADE_TO_FORM: Record<string, PoomsaeForm> = {
  "9ᵉ Gup (Blanche)": "Taegeuk 1 Jang",
  "8ᵉ Gup (Jaune)": "Taegeuk 2 Jang",
  "7ᵉ Gup (Jaune-Vert)": "Taegeuk 3 Jang",
  "6ᵉ Gup (Vert)": "Taegeuk 4 Jang",
  "5ᵉ Gup (Vert-Bleu)": "Taegeuk 5 Jang",
  "4ᵉ Gup (Bleu)": "Taegeuk 6 Jang",
  "3ᵉ Gup (Bleu-Rouge)": "Taegeuk 7 Jang",
  "2ᵉ Gup (Rouge)": "Taegeuk 8 Jang",
  "1ᵉʳ Gup (Rouge-Noire)": "Koryo",
  "1ᵉʳ Dan": "Koryo",
  "2ᵉ Dan": "Keumgang",
  "3ᵉ Dan": "Taebaek",
  "4ᵉ Dan": "Pyongwon",
  "5ᵉ Dan": "Shipjin",
  "6ᵉ Dan": "Jitae",
  "7ᵉ Dan": "Chonkwon",
  "8ᵉ Dan": "Hansoo",
  "9ᵉ Dan": "Ilyeo",
};

// ============================================
// CATÉGORIES POOMSAE
// ============================================

export type PoomsaeCategory = 
  | "individuel-reconnu"    // Individuel - formes imposées
  | "individuel-freestyle"  // Individuel - formes libres
  | "equipe-reconnu"        // Équipe - formes synchronisées
  | "equipe-freestyle";     // Équipe - formes libres synchronisées

export type PoomsaeDivision = 
  | "cadet"       // 12-14 ans
  | "junior"      // 15-17 ans
  | "senior"      // 18-29 ans
  | "veteran";    // 30+ ans

export type BeltLevel = 
  | "color"       // Ceintures de couleur (9ᵉ-1ᵉʳ Gup)
  | "black";      // Ceintures noires (1ᵉʳ-9ᵉ Dan)

// ============================================
// CRITÈRES DE NOTATION
// ============================================

/**
 * Critères de notation WT pour le Poomsae
 * Chaque critère est noté de 0 à 10 points
 */
export interface PoomsaeScores {
  /** Précision des mouvements (exactitude des techniques) */
  accuracy: number;
  
  /** Puissance et vitesse d'exécution */
  power: number;
  
  /** Équilibre et stabilité */
  balance: number;
  
  /** Rythme et tempo */
  rhythm: number;
  
  /** Expression et confiance */
  expression: number;
  
  /** Présentation générale (tenue, attitude) */
  presentation: number;
}

/**
 * Pondération des critères selon le type de Poomsae
 */
export const CRITERIA_WEIGHTS = {
  "individuel-reconnu": {
    accuracy: 0.30,      // 30%
    power: 0.20,         // 20%
    balance: 0.20,       // 20%
    rhythm: 0.15,        // 15%
    expression: 0.10,    // 10%
    presentation: 0.05,  // 5%
  },
  "individuel-freestyle": {
    accuracy: 0.20,
    power: 0.25,
    balance: 0.15,
    rhythm: 0.15,
    expression: 0.20,
    presentation: 0.05,
  },
  "equipe-reconnu": {
    accuracy: 0.25,
    power: 0.15,
    balance: 0.15,
    rhythm: 0.20,        // Synchronisation plus importante
    expression: 0.15,
    presentation: 0.10,
  },
  "equipe-freestyle": {
    accuracy: 0.15,
    power: 0.20,
    balance: 0.10,
    rhythm: 0.25,        // Synchronisation cruciale
    expression: 0.20,
    presentation: 0.10,
  },
};

// ============================================
// JUGES ET NOTATIONS
// ============================================

export type JudgeRole = 
  | "principal"    // Juge principal (note globale)
  | "accuracy"     // Juge spécialisé précision
  | "power"        // Juge spécialisé puissance
  | "balance"      // Juge spécialisé équilibre
  | "rhythm";      // Juge spécialisé rythme

export interface Judge {
  id: string;
  name: string;
  role: JudgeRole;
  certification: string; // Niveau de certification
}

/**
 * Notation d'un juge pour une performance
 */
export interface JudgeScore {
  judgeId: string;
  scores: PoomsaeScores;
  deductions: number; // Déductions pour erreurs
  comments?: string;
  timestamp: string;
}

// ============================================
// PERFORMANCE POOMSAE
// ============================================

export type PerformanceStatus = 
  | "attente"      // En attente de passage
  | "en_cours"     // En cours d'exécution
  | "terminee"     // Exécution terminée
  | "disqualifie"; // Disqualifié

export interface PoomsaePerformance {
  id: string;
  categoryId: string;
  athleteId: string;
  form: PoomsaeForm;
  order: number; // Ordre de passage
  
  // Timing
  startTime?: string;
  endTime?: string;
  duration?: number; // en secondes
  
  // Notations
  judgeScores: JudgeScore[];
  finalScore?: number; // Moyenne pondérée
  
  // Déductions
  deductions: number;
  deductionReasons: string[];
  
  // Statut
  status: PerformanceStatus;
  
  // Métadonnées
  arenaId?: string;
  notes?: string;
}

// ============================================
// CATÉGORIE POOMSAE
// ============================================

export interface PoomsaeCategoryConfig {
  id: string;
  name: string;
  type: PoomsaeCategory;
  division: PoomsaeDivision;
  beltLevel: BeltLevel;
  gender: "M" | "F" | "Mixed";
  ageMin: number;
  ageMax: number;
  requiredForm?: PoomsaeForm; // Forme imposée (si applicable)
  teamSize?: number; // Taille de l'équipe (si équipe)
  maxParticipants: number;
}

// ============================================
// RÉSULTATS ET CLASSEMENT
// ============================================

export interface PoomsaeResult {
  categoryId: string;
  rankings: Array<{
    rank: number;
    athleteId: string;
    finalScore: number;
    form: PoomsaeForm;
  }>;
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Calcule le score final pondéré d'une performance
 */
export function calculateFinalScore(
  scores: PoomsaeScores,
  categoryType: PoomsaeCategory,
  deductions: number = 0
): number {
  const weights = CRITERIA_WEIGHTS[categoryType];
  
  let total = 0;
  total += scores.accuracy * weights.accuracy;
  total += scores.power * weights.power;
  total += scores.balance * weights.balance;
  total += scores.rhythm * weights.rhythm;
  total += scores.expression * weights.expression;
  total += scores.presentation * weights.presentation;
  
  // Appliquer les déductions
  total = Math.max(0, total - deductions);
  
  // Arrondir à 2 décimales
  return Math.round(total * 100) / 100;
}

/**
 * Calcule la moyenne des scores des juges
 */
export function calculateAverageScore(
  judgeScores: JudgeScore[],
  categoryType: PoomsaeCategory
): number {
  if (judgeScores.length === 0) return 0;
  
  const totalScore = judgeScores.reduce((sum, js) => {
    const score = calculateFinalScore(js.scores, categoryType, js.deductions);
    return sum + score;
  }, 0);
  
  return Math.round((totalScore / judgeScores.length) * 100) / 100;
}

/**
 * Détermine la forme requise selon le grade
 */
export function getRequiredForm(grade: string): PoomsaeForm | null {
  return GRADE_TO_FORM[grade] || null;
}

/**
 * Vérifie si une forme est valide pour un niveau de ceinture
 */
export function isFormValidForBelt(
  form: PoomsaeForm,
  beltLevel: BeltLevel
): boolean {
  const colorForms: PoomsaeForm[] = [
    "Taegeuk 1 Jang", "Taegeuk 2 Jang", "Taegeuk 3 Jang", "Taegeuk 4 Jang",
    "Taegeuk 5 Jang", "Taegeuk 6 Jang", "Taegeuk 7 Jang", "Taegeuk 8 Jang"
  ];
  
  const blackForms: PoomsaeForm[] = [
    "Koryo", "Keumgang", "Taebaek", "Pyongwon", "Shipjin",
    "Jitae", "Chonkwon", "Hansoo", "Ilyeo"
  ];
  
  if (beltLevel === "color") {
    return colorForms.includes(form);
  } else {
    return blackForms.includes(form) || form === "Freestyle";
  }
}
