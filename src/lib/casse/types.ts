/**
 * Types spécifiques à la Casse (Breaking)
 * La casse est une discipline où les athlètes cassent des matériaux
 * (planches, briques, tuiles) avec des techniques de frappe
 */

// ============================================
// TYPES DE MATÉRIAUX
// ============================================

export type MaterialType = 
  | "planche_bois"        // Planche de bois (pin, chêne)
  | "brique_argile"       // Brique en argile
  | "tuile_ceramique"     // Tuile en céramique
  | "parpaing_beton"      // Parpaing en béton
  | "pave"                // Pavé
  | "glace"               // Bloc de glace
  | "autre";              // Autre matériau

export interface Material {
  id: string;
  type: MaterialType;
  name: string;
  thickness: number; // en cm
  width: number; // en cm
  height: number; // en cm
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = facile, 5 = très difficile
}

// ============================================
// TECHNIQUES DE CASSE
// ============================================

export type BreakingTechnique = 
  // Techniques de poing
  | "poing_direct"
  | "poing_crochet"
  | "poing_uppercut"
  | "poing_marteau"
  // Techniques de pied
  | "pied_frontal"
  | "pied_circulaire"
  | "pied_lateral"
  | "pied_arriere"
  | "pied_sauté"
  // Techniques de coude
  | "coude_direct"
  | "coude_circulaire"
  | "coude_descendant"
  // Techniques de genou
  | "genou_direct"
  | "genou_sauté"
  // Techniques de tête
  | "tete_direct"
  // Techniques spéciales
  | "volante"
  | "rotation";

export interface Technique {
  id: string;
  name: string;
  type: BreakingTechnique;
  bodyPart: "poing" | "pied" | "coude" | "genou" | "tete";
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
}

// ============================================
// CATÉGORIES DE CASSE
// ============================================

export type BreakingCategory = 
  | "technique"        // Précision et forme
  | "puissance"        // Force brute
  | "special"          // Techniques spéciales
  | "freestyle";       // Enchaînement créatif

export type BreakingDivision = 
  | "debutant"         // Ceintures blanches à vertes
  | "intermediaire"    // Ceintures bleues à rouges
  | "avance"           // Ceintures noires 1-3 Dan
  | "expert"           // Ceintures noires 4+ Dan

// ============================================
// TENTATIVE DE CASSE
// ============================================

export type AttemptResult = 
  | "reussi"           // Casse réussie
  | "echoue"           // Casse échouée
  | "partiel"          // Casse partielle
  | "disqualifie";     // Disqualification

export interface BreakingAttempt {
  id: string;
  performanceId: string;
  attemptNumber: number;
  materialId: string;
  techniqueId: string;
  result: AttemptResult;
  
  // Notation
  score: number; // 0-10
  powerScore: number; // 0-10
  techniqueScore: number; // 0-10
  formScore: number; // 0-10
  
  // Observations
  comments: string;
  injuries: string[]; // Blessures éventuelles
  
  // Timing
  timestamp: string;
  duration: number; // en secondes
  
  // Juges
  judges: string[]; // IDs des juges
}

// ============================================
// PERFORMANCE DE CASSE
// ============================================

export type PerformanceStatus = 
  | "attente"          // En attente
  | "en_cours"         // En cours d'exécution
  | "terminee"         // Terminée
  | "abandonnee"       // Abandonnée
  | "disqualifiee";    // Disqualifiée

export interface BreakingPerformance {
  id: string;
  categoryId: string;
  athleteId: string;
  category: BreakingCategory;
  
  // Matériaux à casser
  materials: Material[];
  techniques: Technique[];
  
  // Tentatives
  attempts: BreakingAttempt[];
  maxAttempts: number;
  
  // Score
  totalScore: number;
  averageScore: number;
  successfulBreaks: number;
  failedBreaks: number;
  
  // Statut
  status: PerformanceStatus;
  startTime?: string;
  endTime?: string;
  
  // Métadonnées
  order: number;
  arenaId?: string;
  notes?: string;
}

// ============================================
// CONFIGURATION DE CATÉGORIE
// ============================================

export interface BreakingCategoryConfig {
  id: string;
  name: string;
  category: BreakingCategory;
  division: BreakingDivision;
  gender: "M" | "F" | "Mixed";
  ageMin: number;
  ageMax: number;
  beltLevel: "color" | "black";
  
  // Règles spécifiques
  maxAttempts: number;
  timeLimit: number; // en secondes
  requiredMaterials: Material[];
  allowedTechniques: BreakingTechnique[];
  
  // Sécurité
  protectiveEquipment: string[];
  safetyRules: string[];
  
  maxParticipants: number;
}

// ============================================
// RÉSULTATS ET CLASSEMENT
// ============================================

export interface BreakingResult {
  categoryId: string;
  rankings: Array<{
    rank: number;
    athleteId: string;
    totalScore: number;
    successfulBreaks: number;
    failedBreaks: number;
    bestTechnique?: string;
  }>;
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Calcule le score total d'une performance
 */
export function calculateBreakingScore(performance: BreakingPerformance): number {
  if (performance.attempts.length === 0) return 0;
  
  const totalScore = performance.attempts.reduce((sum, attempt) => {
    // Pondération des critères
    const weightedScore = 
      (attempt.score * 0.4) +           // 40% score global
      (attempt.powerScore * 0.3) +      // 30% puissance
      (attempt.techniqueScore * 0.2) +  // 20% technique
      (attempt.formScore * 0.1);        // 10% forme
    
    // Bonus pour réussite
    const bonus = attempt.result === "reussi" ? 1.0 : 
                  attempt.result === "partiel" ? 0.5 : 0;
    
    return sum + (weightedScore * bonus);
  }, 0);
  
  return Math.round((totalScore / performance.attempts.length) * 100) / 100;
}

/**
 * Détermine le nombre de tentatives réussies
 */
export function countSuccessfulBreaks(attempts: BreakingAttempt[]): number {
  return attempts.filter(a => a.result === "reussi").length;
}

/**
 * Vérifie si l'athlète peut continuer
 */
export function canContinue(performance: BreakingPerformance): boolean {
  if (performance.status !== "en_cours") return false;
  if (performance.attempts.length >= performance.maxAttempts) return false;
  
  // Vérifier les abandons pour blessure
  const hasInjury = performance.attempts.some(
    a => a.injuries.length > 0 && a.result === "disqualifie"
  );
  
  return !hasInjury;
}

/**
 * Calcule le temps restant
 */
export function getRemainingTime(performance: BreakingPerformance, timeLimit: number): number {
  if (!performance.startTime) return timeLimit;
  
  const elapsed = (Date.now() - new Date(performance.startTime).getTime()) / 1000;
  return Math.max(0, timeLimit - elapsed);
}

/**
 * Détermine le rang basé sur le score
 */
export function calculateRanking(performances: BreakingPerformance[]): BreakingResult["rankings"] {
  return performances
    .filter(p => p.status === "terminee")
    .map(p => ({
      rank: 0, // Sera calculé après tri
      athleteId: p.athleteId,
      totalScore: p.totalScore,
      successfulBreaks: p.successfulBreaks,
      failedBreaks: p.failedBreaks,
      bestTechnique: p.attempts.length > 0 
        ? p.attempts.reduce((best, curr) => 
            curr.score > best.score ? curr : best
          ).techniqueId
        : undefined
    }))
    .sort((a, b) => {
      // Tri par score total
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // En cas d'égalité, tri par nombre de réussites
      return b.successfulBreaks - a.successfulBreaks;
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

// ============================================
// MATÉRIAUX PAR DÉFAUT
// ============================================

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: "mat-1",
    type: "planche_bois",
    name: "Planche de pin 1cm",
    thickness: 1,
    width: 30,
    height: 30,
    difficulty: 1
  },
  {
    id: "mat-2",
    type: "planche_bois",
    name: "Planche de pin 2cm",
    thickness: 2,
    width: 30,
    height: 30,
    difficulty: 2
  },
  {
    id: "mat-3",
    type: "brique_argile",
    name: "Brique standard",
    thickness: 7,
    width: 20,
    height: 10,
    difficulty: 3
  },
  {
    id: "mat-4",
    type: "tuile_ceramique",
    name: "Tuile céramique",
    thickness: 1,
    width: 30,
    height: 30,
    difficulty: 2
  },
  {
    id: "mat-5",
    type: "parpaing_beton",
    name: "Parpaing béton",
    thickness: 20,
    width: 50,
    height: 20,
    difficulty: 5
  }
];

// ============================================
// TECHNIQUES PAR DÉFAUT
// ============================================

export const DEFAULT_TECHNIQUES: Technique[] = [
  {
    id: "tech-1",
    name: "Poing direct",
    type: "poing_direct",
    bodyPart: "poing",
    difficulty: 1,
    description: "Coup de poing droit avec rotation du poignet"
  },
  {
    id: "tech-2",
    name: "Pied frontal",
    type: "pied_frontal",
    bodyPart: "pied",
    difficulty: 2,
    description: "Coup de pied frontal avec talon"
  },
  {
    id: "tech-3",
    name: "Pied circulaire",
    type: "pied_circulaire",
    bodyPart: "pied",
    difficulty: 3,
    description: "Coup de pied circulaire (dollyo chagi)"
  },
  {
    id: "tech-4",
    name: "Coude descendant",
    type: "coude_descendant",
    bodyPart: "coude",
    difficulty: 4,
    description: "Coup de coude descendant"
  },
  {
    id: "tech-5",
    name: "Pied sauté",
    type: "pied_sauté",
    bodyPart: "pied",
    difficulty: 5,
    description: "Coup de pied avec élan et saut"
  }
];
