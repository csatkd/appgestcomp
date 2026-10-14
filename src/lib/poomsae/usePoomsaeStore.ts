import { useState, useCallback } from 'react';
import {
  PoomsaePerformance,
  PoomsaeCategoryConfig,
  JudgeScore,
  PerformanceStatus,
  calculateAverageScore,
} from './types';

/**
 * Hook pour gérer l'état complet des compétitions Poomsae
 */
export function usePoomsaeStore() {
  // Catégories de compétition
  const [categories, setCategories] = useState<PoomsaeCategoryConfig[]>([]);
  
  // Performances des athlètes
  const [performances, setPerformances] = useState<PoomsaePerformance[]>([]);
  
  // Ordre de passage par catégorie
  const [passingOrder, setPassingOrder] = useState<Record<string, string[]>>({});

  // ============================================
  // GESTION DES CATÉGORIES
  // ============================================

  const addCategory = useCallback((category: PoomsaeCategoryConfig) => {
    setCategories(prev => [...prev, category]);
    setPassingOrder(prev => ({ ...prev, [category.id]: [] }));
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<PoomsaeCategoryConfig>) => {
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

  const registerPerformance = useCallback((performance: PoomsaePerformance) => {
    setPerformances(prev => [...prev, performance]);
    
    // Ajouter à l'ordre de passage
    setPassingOrder(prev => ({
      ...prev,
      [performance.categoryId]: [...(prev[performance.categoryId] || []), performance.id]
    }));
  }, []);

  const updatePerformance = useCallback((id: string, updates: Partial<PoomsaePerformance>) => {
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
        const duration = perf.startTime
          ? (new Date(endTime).getTime() - new Date(perf.startTime).getTime()) / 1000
          : 0;
        
        // Calculer le score final
        const category = categories.find(c => c.id === perf.categoryId);
        const finalScore = category
          ? calculateAverageScore(perf.judgeScores, category.type)
          : 0;
        
        return {
          ...perf,
          status: 'terminee' as PerformanceStatus,
          endTime,
          duration,
          finalScore
        };
      })
    );
  }, [categories]);

  const disqualifyPerformance = useCallback((id: string, reason: string) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === id
          ? {
              ...perf,
              status: 'disqualifie' as PerformanceStatus,
              notes: reason,
              endTime: new Date().toISOString()
            }
          : perf
      )
    );
  }, []);

  // ============================================
  // GESTION DES NOTATIONS
  // ============================================

  const addJudgeScore = useCallback((performanceId: string, judgeScore: JudgeScore) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === performanceId
          ? {
              ...perf,
              judgeScores: [...perf.judgeScores, judgeScore]
            }
          : perf
      )
    );
  }, []);

  const updateJudgeScore = useCallback(
    (performanceId: string, judgeId: string, scores: Partial<JudgeScore>) => {
      setPerformances(prev =>
        prev.map(perf => {
          if (perf.id !== performanceId) return perf;
          
          return {
            ...perf,
            judgeScores: perf.judgeScores.map(js =>
              js.judgeId === judgeId ? { ...js, ...scores } : js
            )
          };
        })
      );
    }
  );

  const addDeduction = useCallback((performanceId: string, points: number, reason: string) => {
    setPerformances(prev =>
      prev.map(perf =>
        perf.id === performanceId
          ? {
              ...perf,
              deductions: perf.deductions + points,
              deductionReasons: [...perf.deductionReasons, reason]
            }
          : perf
      )
    );
  }, []);

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
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    const categoryPerformances = performances
      .filter(perf => perf.categoryId === categoryId && perf.status === 'terminee')
      .map(perf => {
        const finalScore = calculateAverageScore(perf.judgeScores, category.type);
        return {
          ...perf,
          finalScore
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
    
    return categoryPerformances.map((perf, index) => ({
      rank: index + 1,
      performance: perf
    }));
  }, [categories, performances]);

  const getAthletePerformances = useCallback((athleteId: string) => {
    return performances.filter(perf => perf.athleteId === athleteId);
  }, [performances]);

  const getCategoryStats = useCallback((categoryId: string) => {
    const categoryPerformances = performances.filter(perf => perf.categoryId === categoryId);
    const completed = categoryPerformances.filter(perf => perf.status === 'terminee');
    const inProgress = categoryPerformances.filter(perf => perf.status === 'en_cours');
    const disqualified = categoryPerformances.filter(perf => perf.status === 'disqualifie');
    
    const avgScore = completed.length > 0
      ? completed.reduce((sum, perf) => sum + (perf.finalScore || 0), 0) / completed.length
      : 0;
    
    const avgDuration = completed.length > 0
      ? completed.reduce((sum, perf) => sum + (perf.duration || 0), 0) / completed.length
      : 0;
    
    return {
      total: categoryPerformances.length,
      completed: completed.length,
      inProgress: inProgress.length,
      disqualified: disqualified.length,
      pending: categoryPerformances.length - completed.length - inProgress.length - disqualified.length,
      avgScore: Math.round(avgScore * 100) / 100,
      avgDuration: Math.round(avgDuration)
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
    disqualifyPerformance,
    
    // Notations
    addJudgeScore,
    updateJudgeScore,
    addDeduction,
    
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
