import { useState, useCallback } from 'react';
import {
  BreakingPerformance,
  BreakingCategoryConfig,
  BreakingAttempt,
  PerformanceStatus,
  calculateBreakingScore,
  countSuccessfulBreaks,
  calculateRanking,
} from './types';

/**
 * Hook pour gérer l'état complet des compétitions de Casse
 */
export function useCasseStore() {
  // Catégories de compétition
  const [categories, setCategories] = useState<BreakingCategoryConfig[]>([]);
  
  // Performances des athlètes
  const [performances, setPerformances] = useState<BreakingPerformance[]>([]);
  
  // Ordre de passage par catégorie
  const [passingOrder, setPassingOrder] = useState<Record<string, string[]>>({});

  // ============================================
  // GESTION DES CATÉGORIES
  // ============================================

  const addCategory = useCallback((category: BreakingCategoryConfig) => {
    setCategories(prev => [...prev, category]);
    setPassingOrder(prev => ({ ...prev, [category.id]: [] }));
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<BreakingCategoryConfig>) => {
    setCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setPerformances(prev => prev.filter(perf => perf.categoryId !== id));
    setPassingOrder(prev => {
      const newOrder = { ...prev };
      delete newOrder[id];
      return newOrder;
    });
  }, []);

  // ============================================
  // GESTION DES PERFORMANCES
  // ============================================

  const registerPerformance = useCallback((performance: BreakingPerformance) => {
    setPerformances(prev => [...prev, performance]);
    
    // Ajouter à l'ordre de passage
    setPassingOrder(prev => ({
      ...prev,
      [performance.categoryId]: [...(prev[performance.categoryId] || []), performance.id]
    }));
  }, []);

  const updatePerformance = useCallback((id: string, updates: Partial<BreakingPerformance>) => {
    setPerformances(prev =>
      prev.map(perf => perf.id === id ? { ...perf, ...updates } : perf)
    );
  }, []);

  const startPerformance = useCallback((id: string) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === id
          ? {
              ...perf,
              status: 'en_cours' as PerformanceStatus,
              startTime: new Date().toISOString()
            }
          : perf
      )
    );
  }, []);

  const endPerformance = useCallback((id: string) => {
    setPerformances(prev =>
      prev.map(perf => {
        if (perf.id !== id) return perf;
        
        const endTime = new Date().toISOString();
        
        // Calculer les scores
        const totalScore = calculateBreakingScore(perf);
        const successfulBreaks = countSuccessfulBreaks(perf.attempts);
        const failedBreaks = perf.attempts.length - successfulBreaks;
        
        return {
          ...perf,
          status: 'terminee' as PerformanceStatus,
          endTime,
          totalScore,
          successfulBreaks,
          failedBreaks
        };
      })
    );
  }, []);

  const abandonPerformance = useCallback((id: string, reason: string) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === id
          ? {
              ...perf,
              status: 'abandonnee' as PerformanceStatus,
              endTime: new Date().toISOString(),
              notes: reason
            }
          : perf
      )
    );
  }, []);

  const disqualifyPerformance = useCallback((id: string, reason: string) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === id
          ? {
              ...perf,
              status: 'disqualifiee' as PerformanceStatus,
              endTime: new Date().toISOString(),
              notes: reason
            }
          : perf
      )
    );
  }, []);

  // ============================================
  // GESTION DES TENTATIVES
  // ============================================

  const addAttempt = useCallback((performanceId: string, attempt: BreakingAttempt) => {
    setPerformances(prev =>
      prev.map(perf => {
        if (perf.id !== performanceId) return perf;
        
        const newAttempts = [...perf.attempts, attempt];
        const totalScore = calculateBreakingScore({ ...perf, attempts: newAttempts });
        const successfulBreaks = countSuccessfulBreaks(newAttempts);
        
        return {
          ...perf,
          attempts: newAttempts,
          totalScore,
          successfulBreaks,
          failedBreaks: newAttempts.length - successfulBreaks
        };
      })
    );
  }, []);

  const updateAttempt = useCallback(
    (performanceId: string, attemptId: string, updates: Partial<BreakingAttempt>) => {
      setPerformances(prev =>
        prev.map(perf => {
          if (perf.id !== performanceId) return perf;
          
          const newAttempts = perf.attempts.map(att =>
            att.id === attemptId ? { ...att, ...updates } : att
          );
          
          const updatedPerf = { ...perf, attempts: newAttempts };
          const totalScore = calculateBreakingScore(updatedPerf);
          const successfulBreaks = countSuccessfulBreaks(newAttempts);
          
          return {
            ...perf,
            attempts: newAttempts,
            totalScore,
            successfulBreaks,
            failedBreaks: newAttempts.length - successfulBreaks
          };
        })
      );
    },
    []
  );

  // ============================================
  // ORDRE DE PASSAGE
  // ============================================

  const shufflePassingOrder = useCallback((categoryId: string) => {
    setPassingOrder(prev => {
      const order = [...(prev[categoryId] || [])];
      // Algorithme de Fisher-Yates pour mélanger
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      
      // Mettre à jour l'ordre des performances
      setPerformances(perfs =>
        perfs.map(perf => {
          const newIndex = order.indexOf(perf.id);
          return newIndex !== -1 ? { ...perf, order: newIndex + 1 } : perf;
        })
      );
      
      return { ...prev, [categoryId]: order };
    });
  }, []);

  const setPassingOrderManual = useCallback((categoryId: string, order: string[]) => {
    setPassingOrder(prev => ({ ...prev, [categoryId]: order }));
    
    // Mettre à jour l'ordre des performances
    setPerformances(perfs =>
      perfs.map(perf => {
        const newIndex = order.indexOf(perf.id);
        return newIndex !== -1 ? { ...perf, order: newIndex + 1 } : perf;
      })
    );
  }, []);

  // ============================================
  // CALCULS ET STATISTIQUES
  // ============================================

  const getCategoryPerformances = useCallback((categoryId: string) => {
    return performances
      .filter(perf => perf.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }, [performances]);

  const getCategoryRankings = useCallback((categoryId: string) => {
    const categoryPerformances = performances.filter(perf => perf.categoryId === categoryId);
    return calculateRanking(categoryPerformances);
  }, [performances]);

  const getAthletePerformances = useCallback((athleteId: string) => {
    return performances.filter(perf => perf.athleteId === athleteId);
  }, [performances]);

  const getCategoryStats = useCallback((categoryId: string) => {
    const categoryPerformances = performances.filter(perf => perf.categoryId === categoryId);
    const completed = categoryPerformances.filter(perf => perf.status === 'terminee');
    const inProgress = categoryPerformances.filter(perf => perf.status === 'en_cours');
    const abandoned = categoryPerformances.filter(perf => perf.status === 'abandonnee');
    const disqualified = categoryPerformances.filter(perf => perf.status === 'disqualifiee');
    
    const avgScore = completed.length > 0
      ? completed.reduce((sum, perf) => sum + perf.totalScore, 0) / completed.length
      : 0;
    
    const totalBreaks = completed.reduce((sum, perf) => sum + perf.successfulBreaks, 0);
    const totalAttempts = completed.reduce((sum, perf) => sum + perf.attempts.length, 0);
    const successRate = totalAttempts > 0 ? (totalBreaks / totalAttempts) * 100 : 0;
    
    return {
      total: categoryPerformances.length,
      completed: completed.length,
      inProgress: inProgress.length,
      abandoned: abandoned.length,
      disqualified: disqualified.length,
      pending: categoryPerformances.length - completed.length - inProgress.length - abandoned.length - disqualified.length,
      avgScore: Math.round(avgScore * 100) / 100,
      successRate: Math.round(successRate * 10) / 10,
      totalBreaks
    };
  }, [performances]);

  // ============================================
  // RÉINITIALISATION
  // ============================================

  const resetCategory = useCallback((categoryId: string) => {
    setPerformances(prev => prev.filter(perf => perf.categoryId !== categoryId));
    setPassingOrder(prev => ({ ...prev, [categoryId]: [] }));
  }, []);

  const resetAll = useCallback(() => {
    setCategories([]);
    setPerformances([]);
    setPassingOrder({});
  }, []);

  return {
    // Catégories
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Performances
    performances,
    registerPerformance,
    updatePerformance,
    startPerformance,
    endPerformance,
    abandonPerformance,
    disqualifyPerformance,
    
    // Tentatives
    addAttempt,
    updateAttempt,
    
    // Ordre de passage
    passingOrder,
    shufflePassingOrder,
    setPassingOrderManual,
    
    // Calculs
    getCategoryPerformances,
    getCategoryRankings,
    getAthletePerformances,
    getCategoryStats,
    
    // Réinitialisation
    resetCategory,
    resetAll
  };
}
