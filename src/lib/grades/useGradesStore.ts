import { useState, useCallback } from 'react';
import {
  GradeExam,
  ExamRegistration,
  ExamEvaluation,
  ExamResult,
  GradeCertificate,
  GradeSystemConfig,
  Belt,
  ExamStatus,
  DEFAULT_CONFIG,
  calculateFinalScore,
  determineResult,
  checkEligibility,
} from './types';

/**
 * Hook pour gérer l'état complet des passages de grades
 * Système évolutif et flexible
 */
export function useGradesStore() {
  // Configuration du système de grades
  const [config, setConfig] = useState<GradeSystemConfig>(DEFAULT_CONFIG);
  
  // Examens de grade
  const [exams, setExams] = useState<GradeExam[]>([]);
  
  // Certificats de grade
  const [certificates, setCertificates] = useState<GradeCertificate[]>([]);

  // ============================================
  // GESTION DE LA CONFIGURATION
  // ============================================

  const updateConfig = useCallback((updates: Partial<GradeSystemConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const addBelt = useCallback((belt: Belt) => {
    setConfig(prev => ({
      ...prev,
      belts: [...prev.belts, belt]
    }));
  }, []);

  const updateBelt = useCallback((beltId: string, updates: Partial<Belt>) => {
    setConfig(prev => ({
      ...prev,
      belts: prev.belts.map(b => b.id === beltId ? { ...b, ...updates } : b)
    }));
  }, []);

  const deleteBelt = useCallback((beltId: string) => {
    setConfig(prev => ({
      ...prev,
      belts: prev.belts.filter(b => b.id !== beltId)
    }));
  }, []);

  // ============================================
  // GESTION DES EXAMENS
  // ============================================

  const createExam = useCallback((exam: GradeExam) => {
    setExams(prev => [...prev, exam]);
  }, []);

  const updateExam = useCallback((examId: string, updates: Partial<GradeExam>) => {
    setExams(prev =>
      prev.map(e => e.id === examId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e)
    );
  }, []);

  const updateExamStatus = useCallback((examId: string, status: ExamStatus) => {
    setExams(prev =>
      prev.map(e => e.id === examId ? { ...e, status, updatedAt: new Date().toISOString() } : e)
    );
  }, []);

  const deleteExam = useCallback((examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  }, []);

  // ============================================
  // GESTION DES INSCRIPTIONS
  // ============================================

  const registerForExam = useCallback((examId: string, registration: ExamRegistration) => {
    setExams(prev =>
      prev.map(e => {
        if (e.id !== examId) return e;
        return {
          ...e,
          registeredAthletes: [...e.registeredAthletes, registration],
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const updateRegistration = useCallback(
    (examId: string, registrationId: string, updates: Partial<ExamRegistration>) => {
      setExams(prev =>
        prev.map(e => {
          if (e.id !== examId) return e;
          return {
            ...e,
            registeredAthletes: e.registeredAthletes.map(r =>
              r.id === registrationId ? { ...r, ...updates } : r
            ),
            updatedAt: new Date().toISOString()
          };
        })
      );
    }
  );

  const removeRegistration = useCallback((examId: string, registrationId: string) => {
    setExams(prev =>
      prev.map(e => {
        if (e.id !== examId) return e;
        return {
          ...e,
          registeredAthletes: e.registeredAthletes.filter(r => r.id !== registrationId),
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const checkAthleteEligibility = useCallback(
    (
      athlete: {
        currentBelt: Belt;
        beltObtainedDate: string;
        birthDate: string;
        attendanceRate: number;
      },
      targetBeltId: string
    ) => {
      const targetBelt = config.belts.find(b => b.id === targetBeltId);
      if (!targetBelt) {
        return { eligible: false, reasons: ['Ceinture cible non trouvée'] };
      }
      return checkEligibility(athlete, targetBelt, config);
    },
    [config]
  );

  // ============================================
  // GESTION DES ÉVALUATIONS
  // ============================================

  const addEvaluation = useCallback((examId: string, evaluation: Omit<ExamEvaluation, 'finalScore' | 'passed' | 'result'>) => {
    // Calculer le score final
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const evaluationData = {
      techniquesScore: evaluation.techniquesScore,
      poomsaeScore: evaluation.poomsaeScore,
      sparringScore: evaluation.sparringScore,
      theoryScore: evaluation.theoryScore,
      breakingScore: evaluation.breakingScore,
      attitudeScore: evaluation.attitudeScore
    };

    const finalScore = calculateFinalScore(evaluationData, exam.evaluationCriteria);
    const result = determineResult(
      finalScore,
      exam.evaluationCriteria,
      config.progressionRules.conditionalPassThreshold
    );

    const completeEvaluation: ExamEvaluation = {
      ...evaluation,
      finalScore,
      passed: result === 'reussi' || result === 'conditionnel',
      result
    };

    setExams(prev =>
      prev.map(e => {
        if (e.id !== examId) return e;
        
        // Ajouter ou mettre à jour le résultat
        const existingResultIndex = e.results?.findIndex(r => r.registrationId === evaluation.registrationId);
        
        const examResult: ExamResult = {
          registrationId: evaluation.registrationId,
          athleteId: evaluation.athleteId,
          athleteName: e.registeredAthletes.find(r => r.id === evaluation.registrationId)?.athleteName || '',
          previousBelt: e.previousBelt,
          targetBelt: e.targetBelt,
          finalScore,
          passed: completeEvaluation.passed,
          result: completeEvaluation.result,
          evaluationDate: completeEvaluation.evaluationDate
        };

        let newResults = e.results || [];
        if (existingResultIndex !== undefined && existingResultIndex >= 0) {
          newResults = newResults.map((r, i) => i === existingResultIndex ? examResult : r);
        } else {
          newResults = [...newResults, examResult];
        }

        return {
          ...e,
          results: newResults,
          status: 'evalue' as ExamStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );

    return completeEvaluation;
  }, [exams, config]);

  const updateEvaluation = useCallback(
    (examId: string, evaluationId: string, updates: Partial<ExamEvaluation>) => {
      // Recalculer le score final si nécessaire
      setExams(prev =>
        prev.map(e => {
          if (e.id !== examId) return e;
          
          const results = e.results?.map(r => {
            if (r.registrationId !== evaluationId) return r;
            // Recalculer si les scores ont changé
            return r;
          });

          return {
            ...e,
            results,
            updatedAt: new Date().toISOString()
          };
        })
      );
    }
  );

  // ============================================
  // GESTION DES CERTIFICATS
  // ============================================

  const generateCertificate = useCallback(
    (examId: string, registrationId: string): GradeCertificate | null => {
      const exam = exams.find(e => e.id === examId);
      if (!exam) return null;

      const result = exam.results?.find(r => r.registrationId === registrationId);
      if (!result || !result.passed) return null;

      const certificate: GradeCertificate = {
        id: `cert-${Date.now()}`,
        athleteId: result.athleteId,
        athleteName: result.athleteName,
        belt: result.targetBelt,
        examId: exam.id,
        examDate: exam.date,
        finalScore: result.finalScore,
        certificateNumber: `WT-${result.targetBelt.grade}-${Date.now()}`,
        issueDate: new Date().toISOString(),
        issuedBy: exam.organizerId,
        signedBy: exam.examiners.map(e => e.name),
        verified: true,
        verificationCode: generateVerificationCode(),
        createdAt: new Date().toISOString()
      };

      setCertificates(prev => [...prev, certificate]);

      // Mettre à jour le résultat avec l'ID du certificat
      setExams(prev =>
        prev.map(e => {
          if (e.id !== examId) return e;
          return {
            ...e,
            results: e.results?.map(r =>
              r.registrationId === registrationId
                ? { ...r, certificateId: certificate.id }
                : r
            ),
            updatedAt: new Date().toISOString()
          };
        })
      );

      return certificate;
    },
    [exams]
  );

  const verifyCertificate = useCallback((certificateNumber: string): GradeCertificate | null => {
    return certificates.find(c => c.certificateNumber === certificateNumber) || null;
  }, [certificates]);

  const getAthleteCertificates = useCallback((athleteId: string) => {
    return certificates.filter(c => c.athleteId === athleteId);
  }, [certificates]);

  // ============================================
  // STATISTIQUES ET CALCULS
  // ============================================

  const getExamStats = useCallback((examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return null;

    const totalRegistered = exam.registeredAthletes.length;
    const totalPaid = exam.registeredAthletes.filter(r => r.paid).length;
    const totalEligible = exam.registeredAthletes.filter(r => r.eligible).length;
    
    const results = exam.results || [];
    const totalEvaluated = results.length;
    const totalPassed = results.filter(r => r.passed).length;
    const totalFailed = results.filter(r => !r.passed).length;
    const totalConditional = results.filter(r => r.result === 'conditionnel').length;
    
    const averageScore = totalEvaluated > 0
      ? results.reduce((sum, r) => sum + r.finalScore, 0) / totalEvaluated
      : 0;

    const passRate = totalEvaluated > 0
      ? (totalPassed / totalEvaluated) * 100
      : 0;

    return {
      totalRegistered,
      totalPaid,
      totalEligible,
      totalEvaluated,
      totalPassed,
      totalFailed,
      totalConditional,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 10) / 10
    };
  }, [exams]);

  const getUpcomingExams = useCallback(() => {
    const now = new Date();
    return exams
      .filter(e => new Date(e.date) > now && e.status !== 'annule')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exams]);

  const getPastExams = useCallback(() => {
    const now = new Date();
    return exams
      .filter(e => new Date(e.date) <= now || e.status === 'annule')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [exams]);

  const getAthleteGradeHistory = useCallback((athleteId: string) => {
    const history: Array<{
      examId: string;
      examDate: string;
      previousBelt: Belt;
      targetBelt: Belt;
      finalScore: number;
      passed: boolean;
      certificateId?: string;
    }> = [];

    exams.forEach(exam => {
      const result = exam.results?.find(r => r.athleteId === athleteId);
      if (result) {
        history.push({
          examId: exam.id,
          examDate: exam.date,
          previousBelt: result.previousBelt,
          targetBelt: result.targetBelt,
          finalScore: result.finalScore,
          passed: result.passed,
          certificateId: result.certificateId
        });
      }
    });

    return history.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
  }, [exams]);

  // ============================================
  // RÉINITIALISATION
  // ============================================

  const resetAll = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setExams([]);
    setCertificates([]);
  }, []);

  return {
    // Configuration
    config,
    updateConfig,
    addBelt,
    updateBelt,
    deleteBelt,
    
    // Examens
    exams,
    createExam,
    updateExam,
    updateExamStatus,
    deleteExam,
    
    // Inscriptions
    registerForExam,
    updateRegistration,
    removeRegistration,
    checkAthleteEligibility,
    
    // Évaluations
    addEvaluation,
    updateEvaluation,
    
    // Certificats
    certificates,
    generateCertificate,
    verifyCertificate,
    getAthleteCertificates,
    
    // Statistiques
    getExamStats,
    getUpcomingExams,
    getPastExams,
    getAthleteGradeHistory,
    
    // Réinitialisation
    resetAll
  };
}

/**
 * Génère un code de vérification unique
 */
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
