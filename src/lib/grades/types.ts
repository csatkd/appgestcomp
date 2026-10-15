/**
 * Types pour la gestion des passages de grades (promotions)
 * Système évolutif et adaptable pour tous les niveaux de ceintures
 */

// ============================================
// CEINTURES ET GRADES
// ============================================

export type BeltColor = 
  | "blanche"
  | "jaune"
  | "jaune-vert"
  | "vert"
  | "vert-bleu"
  | "bleu"
  | "bleu-rouge"
  | "rouge"
  | "rouge-noire"
  | "noire";

export type BeltLevel = "gup" | "dan";

export interface Belt {
  id: string;
  color: BeltColor;
  level: BeltLevel;
  grade: number; // 9-1 pour Gup, 1-9 pour Dan
  name: string; // Ex: "9ᵉ Gup", "1ᵉʳ Dan"
  minAge?: number; // Âge minimum requis
  minTimeInPrevious?: number; // Mois minimum dans le grade précédent
  requirements: GradeRequirements;
}

export interface GradeRequirements {
  // Techniques obligatoires
  techniques: TechniqueRequirement[];
  
  // Formes (Poomsae)
  poomsae: PoomsaeRequirement[];
  
  // Combat (si applicable)
  sparring?: SparringRequirement;
  
  // Théorie
  theory?: TheoryRequirement;
  
  // Casse (si applicable)
  breaking?: BreakingRequirement;
  
  // Temps minimum de pratique
  minPracticeTime?: number; // en mois
  
  // Âge minimum
  minAge?: number;
  
  // Présence aux entraînements
  minAttendance?: number; // pourcentage
}

export interface TechniqueRequirement {
  id: string;
  name: string;
  type: "basic" | "advanced" | "self-defense";
  minimumScore: number; // 0-10
  weight: number; // pourcentage dans la note finale
}

export interface PoomsaeRequirement {
  form: string; // Nom de la forme
  minimumScore: number;
  weight: number;
}

export interface SparringRequirement {
  rounds: number;
  minimumScore: number;
  weight: number;
  required: boolean;
}

export interface TheoryRequirement {
  topics: string[];
  minimumScore: number;
  weight: number;
  format: "oral" | "written" | "both";
}

export interface BreakingRequirement {
  materials: string[];
  techniques: string[];
  minimumSuccess: number; // nombre minimum de casses réussies
  weight: number;
}

// ============================================
// EXAMEN DE GRADE
// ============================================

export type ExamStatus = 
  | "planifie"
  | "inscrit"
  | "en_cours"
  | "evalue"
  | "reussi"
  | "echoue"
  | "reporte"
  | "annule";

export interface GradeExam {
  id: string;
  name: string;
  date: string;
  location: string;
  targetBelt: Belt;
  previousBelt: Belt;
  status: ExamStatus;
  
  // Organisation
  organizerId: string;
  examiners: Examiner[];
  maxParticipants: number;
  
  // Inscription
  registrationDeadline: string;
  registrationFee: number;
  registeredAthletes: ExamRegistration[];
  
  // Évaluation
  evaluationCriteria: EvaluationCriteria;
  
  // Résultats
  results?: ExamResult[];
  
  // Métadonnées
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Examiner {
  id: string;
  name: string;
  dan: number; // Ceinture noire Dan
  specialization: string[];
  certification: string;
}

export interface ExamRegistration {
  id: string;
  athleteId: string;
  athleteName: string;
  currentBelt: Belt;
  targetBelt: Belt;
  registeredAt: string;
  paid: boolean;
  eligible: boolean;
  eligibilityNotes?: string;
}

export interface EvaluationCriteria {
  techniques: {
    weight: number; // pourcentage
    minScore: number;
  };
  poomsae: {
    weight: number;
    minScore: number;
  };
  sparring?: {
    weight: number;
    minScore: number;
  };
  theory?: {
    weight: number;
    minScore: number;
  };
  breaking?: {
    weight: number;
    minScore: number;
  };
  attitude: {
    weight: number;
    minScore: number;
  };
}

// ============================================
// ÉVALUATION ET RÉSULTATS
// ============================================

export interface ExamEvaluation {
  id: string;
  registrationId: string;
  athleteId: string;
  examId: string;
  
  // Scores par catégorie
  techniquesScore: number;
  poomsaeScore: number;
  sparringScore?: number;
  theoryScore?: number;
  breakingScore?: number;
  attitudeScore: number;
  
  // Score final pondéré
  finalScore: number;
  
  // Résultat
  passed: boolean;
  result: "reussi" | "echoue" | "conditionnel";
  
  // Commentaires
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  examinerComments: string;
  
  // Évaluateurs
  evaluatedBy: string[]; // IDs des examinateurs
  evaluationDate: string;
}

export interface ExamResult {
  registrationId: string;
  athleteId: string;
  athleteName: string;
  previousBelt: Belt;
  targetBelt: Belt;
  finalScore: number;
  passed: boolean;
  result: "reussi" | "echoue" | "conditionnel";
  certificateId?: string;
  evaluationDate: string;
}

// ============================================
// CERTIFICAT DE GRADE
// ============================================

export interface GradeCertificate {
  id: string;
  athleteId: string;
  athleteName: string;
  belt: Belt;
  examId: string;
  examDate: string;
  finalScore: number;
  
  // Informations du certificat
  certificateNumber: string;
  issueDate: string;
  issuedBy: string; // Organisation
  signedBy: string[]; // Signataires
  
  // Validation
  verified: boolean;
  verificationCode: string;
  
  // Métadonnées
  pdfUrl?: string;
  createdAt: string;
}

// ============================================
// CONFIGURATION FLEXIBLE
// ============================================

export interface GradeSystemConfig {
  id: string;
  name: string; // Ex: "Système WT", "Système ITF"
  version: string;
  
  // Ceintures
  belts: Belt[];
  
  // Critères d'évaluation par défaut
  defaultEvaluationCriteria: EvaluationCriteria;
  
  // Règles de progression
  progressionRules: {
    minTimeBetweenGrades: number; // mois
    minAgeForBlackBelt: number;
    maxAttemptsPerExam: number;
    conditionalPassThreshold: number; // score minimum pour réussite conditionnelle
  };
  
  // Options
  options: {
    requireSparring: boolean;
    requireTheory: boolean;
    requireBreaking: boolean;
    allowConditionalPass: boolean;
    certificateValidityYears: number;
  };
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Calcule le score final pondéré
 */
export function calculateFinalScore(
  scores: {
    techniquesScore: number;
    poomsaeScore: number;
    sparringScore?: number;
    theoryScore?: number;
    breakingScore?: number;
    attitudeScore: number;
  },
  criteria: EvaluationCriteria
): number {
  let total = 0;
  
  total += scores.techniquesScore * (criteria.techniques.weight / 100);
  total += scores.poomsaeScore * (criteria.poomsae.weight / 100);
  
  if (scores.sparringScore !== undefined && criteria.sparring) {
    total += scores.sparringScore * (criteria.sparring.weight / 100);
  }
  
  if (scores.theoryScore !== undefined && criteria.theory) {
    total += scores.theoryScore * (criteria.theory.weight / 100);
  }
  
  if (scores.breakingScore !== undefined && criteria.breaking) {
    total += scores.breakingScore * (criteria.breaking.weight / 100);
  }
  
  total += scores.attitudeScore * (criteria.attitude.weight / 100);
  
  return Math.round(total * 100) / 100;
}

/**
 * Détermine si l'examen est réussi
 */
export function determineResult(
  finalScore: number,
  criteria: EvaluationCriteria,
  conditionalThreshold: number = 70
): "reussi" | "echoue" | "conditionnel" {
  // Vérifier les scores minimums par catégorie
  if (
    finalScore >= 80 &&
    (criteria.sparring ? true : true) // Si sparring requis, vérifier le score
  ) {
    return "reussi";
  }
  
  if (finalScore >= conditionalThreshold) {
    return "conditionnel";
  }
  
  return "echoue";
}

/**
 * Vérifie l'éligibilité d'un athlète
 */
export function checkEligibility(
  athlete: {
    currentBelt: Belt;
    beltObtainedDate: string;
    birthDate: string;
    attendanceRate: number;
  },
  targetBelt: Belt,
  config: GradeSystemConfig
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Vérifier l'âge
  if (targetBelt.minAge) {
    const age = calculateAge(athlete.birthDate);
    if (age < targetBelt.minAge) {
      reasons.push(`Âge minimum requis : ${targetBelt.minAge} ans`);
    }
  }
  
  // Vérifier le temps dans le grade précédent
  if (targetBelt.minTimeInPrevious) {
    const monthsInGrade = calculateMonthsSince(athlete.beltObtainedDate);
    if (monthsInGrade < targetBelt.minTimeInPrevious) {
      reasons.push(`Temps minimum dans le grade précédent : ${targetBelt.minTimeInPrevious} mois`);
    }
  }
  
  // Vérifier la présence
  if (targetBelt.requirements.minAttendance) {
    if (athlete.attendanceRate < targetBelt.requirements.minAttendance) {
      reasons.push(`Présence minimum requise : ${targetBelt.requirements.minAttendance}%`);
    }
  }
  
  return {
    eligible: reasons.length === 0,
    reasons
  };
}

/**
 * Calcule l'âge à partir de la date de naissance
 */
function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcule le nombre de mois depuis une date
 */
function calculateMonthsSince(date: string): number {
  const start = new Date(date);
  const end = new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12;
  return months + (end.getMonth() - start.getMonth());
}

// ============================================
// CEINTURES PAR DÉFAUT (SYSTÈME WT)
// ============================================

export const DEFAULT_BELTS: Belt[] = [
  {
    id: "belt-10",
    color: "blanche",
    level: "gup",
    grade: 10,
    name: "10ᵉ Gup",
    requirements: {
      techniques: [],
      poomsae: [],
      minPracticeTime: 0,
      minAge: 6
    }
  },
  {
    id: "belt-9",
    color: "blanche",
    level: "gup",
    grade: 9,
    name: "9ᵉ Gup",
    minTimeInPrevious: 3,
    requirements: {
      techniques: [
        { id: "tech-1", name: "Position de base", type: "basic", minimumScore: 6, weight: 30 },
        { id: "tech-2", name: "Blocage basique", type: "basic", minimumScore: 6, weight: 30 },
        { id: "tech-3", name: "Coup de poing", type: "basic", minimumScore: 6, weight: 40 }
      ],
      poomsae: [
        { form: "Taegeuk 1 Jang", minimumScore: 6, weight: 100 }
      ],
      minPracticeTime: 3,
      minAge: 7,
      minAttendance: 70
    }
  },
  {
    id: "belt-8",
    color: "jaune",
    level: "gup",
    grade: 8,
    name: "8ᵉ Gup",
    minTimeInPrevious: 4,
    requirements: {
      techniques: [
        { id: "tech-4", name: "Coup de pied frontal", type: "basic", minimumScore: 6.5, weight: 40 },
        { id: "tech-5", name: "Blocage moyen", type: "basic", minimumScore: 6.5, weight: 30 },
        { id: "tech-6", name: "Position de combat", type: "basic", minimumScore: 6.5, weight: 30 }
      ],
      poomsae: [
        { form: "Taegeuk 2 Jang", minimumScore: 6.5, weight: 100 }
      ],
      minPracticeTime: 4,
      minAge: 8,
      minAttendance: 75
    }
  },
  {
    id: "belt-1",
    color: "rouge-noire",
    level: "gup",
    grade: 1,
    name: "1ᵉʳ Gup",
    minTimeInPrevious: 6,
    requirements: {
      techniques: [
        { id: "tech-20", name: "Techniques avancées", type: "advanced", minimumScore: 7.5, weight: 40 },
        { id: "tech-21", name: "Self-défense", type: "self-defense", minimumScore: 7.5, weight: 30 },
        { id: "tech-22", name: "Combinaisons", type: "advanced", minimumScore: 7.5, weight: 30 }
      ],
      poomsae: [
        { form: "Taegeuk 8 Jang", minimumScore: 7.5, weight: 100 }
      ],
      sparring: {
        rounds: 2,
        minimumScore: 7,
        weight: 100,
        required: true
      },
      theory: {
        topics: ["Histoire du taekwondo", "Philosophie", "Termes coréens"],
        minimumScore: 7,
        weight: 100,
        format: "oral"
      },
      breaking: {
        materials: ["Planche 2cm"],
        techniques: ["Coup de pied frontal"],
        minimumSuccess: 1,
        weight: 100
      },
      minPracticeTime: 12,
      minAge: 15,
      minAttendance: 85
    }
  },
  {
    id: "belt-black-1",
    color: "noire",
    level: "dan",
    grade: 1,
    name: "1ᵉʳ Dan",
    minTimeInPrevious: 12,
    requirements: {
      techniques: [
        { id: "tech-30", name: "Techniques maître", type: "advanced", minimumScore: 8, weight: 30 },
        { id: "tech-31", name: "Self-défense avancée", type: "self-defense", minimumScore: 8, weight: 30 },
        { id: "tech-32", name: "Démonstration", type: "advanced", minimumScore: 8, weight: 40 }
      ],
      poomsae: [
        { form: "Koryo", minimumScore: 8, weight: 100 }
      ],
      sparring: {
        rounds: 3,
        minimumScore: 7.5,
        weight: 100,
        required: true
      },
      theory: {
        topics: ["Philosophie du taekwondo", "Histoire complète", "Anatomie", "Pédagogie"],
        minimumScore: 8,
        weight: 100,
        format: "both"
      },
      breaking: {
        materials: ["Planche 3cm", "Brique"],
        techniques: ["Coup de pied circulaire", "Coup de poing"],
        minimumSuccess: 2,
        weight: 100
      },
      minPracticeTime: 24,
      minAge: 16,
      minAttendance: 90
    }
  }
];

// ============================================
// CONFIGURATION PAR DÉFAUT
// ============================================

export const DEFAULT_CONFIG: GradeSystemConfig = {
  id: "config-wt",
  name: "Système WT (World Taekwondo)",
  version: "1.0",
  belts: DEFAULT_BELTS,
  defaultEvaluationCriteria: {
    techniques: { weight: 40, minScore: 6 },
    poomsae: { weight: 30, minScore: 6 },
    sparring: { weight: 15, minScore: 6 },
    theory: { weight: 10, minScore: 6 },
    breaking: { weight: 5, minScore: 6 },
    attitude: { weight: 0, minScore: 6 }
  },
  progressionRules: {
    minTimeBetweenGrades: 3,
    minAgeForBlackBelt: 16,
    maxAttemptsPerExam: 3,
    conditionalPassThreshold: 70
  },
  options: {
    requireSparring: true,
    requireTheory: true,
    requireBreaking: true,
    allowConditionalPass: true,
    certificateValidityYears: 0 // 0 = validité permanente
  }
};
