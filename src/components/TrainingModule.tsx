import { useState } from 'react';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconBook, IconCheck, IconX } from './Icons';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'rules' | 'scoring' | 'procedures' | 'safety';
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  passingScore: number;
}

const COURSES: Course[] = [
  {
    id: 'basic-rules',
    title: 'Règles de Base du Kyorugi',
    description: 'Apprenez les règles fondamentales du combat WT',
    icon: '📋',
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'Combien de rounds compose un combat de kyorugi standard ?',
        options: ['2 rounds', '3 rounds', '4 rounds', '5 rounds'],
        correctAnswer: 1,
        explanation: 'Un combat standard se compose de 3 rounds de 2 minutes chacun.',
        category: 'rules'
      },
      {
        id: 'q2',
        question: 'Quelle est la durée d\'un round ?',
        options: ['1 minute', '2 minutes', '3 minutes', '5 minutes'],
        correctAnswer: 1,
        explanation: 'Chaque round dure 2 minutes avec 1 minute de repos entre les rounds.',
        category: 'rules'
      },
      {
        id: 'q3',
        question: 'Combien de Gam-jeom entraînent une disqualification (PUN) ?',
        options: ['5 Gam-jeom', '8 Gam-jeom', '10 Gam-jeom', '12 Gam-jeom'],
        correctAnswer: 2,
        explanation: '10 Gam-jeom entraînent une disqualification automatique (PUN).',
        category: 'rules'
      },
      {
        id: 'q4',
        question: 'Quelle est la zone de combat standard ?',
        options: ['6x6 mètres', '8x8 mètres', '10x10 mètres', '12x12 mètres'],
        correctAnswer: 1,
        explanation: 'La zone de combat standard est de 8x8 mètres.',
        category: 'rules'
      },
      {
        id: 'q5',
        question: 'Que se passe-t-il en cas d\'égalité à la fin des 3 rounds ?',
        options: ['Match nul', 'Round supplémentaire (Golden Point)', 'Décision aux critères', 'Redémarrage du combat'],
        correctAnswer: 1,
        explanation: 'En cas d\'égalité, un round supplémentaire (Golden Point) est disputé. Le premier à marquer gagne.',
        category: 'rules'
      }
    ]
  },
  {
    id: 'scoring-system',
    title: 'Système de Scoring',
    description: 'Maîtrisez le système de points WT',
    icon: '🎯',
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'Combien de points pour un coup de poing valide au plastron ?',
        options: ['1 point', '2 points', '3 points', '4 points'],
        correctAnswer: 0,
        explanation: 'Un coup de poing valide au plastron rapporte 1 point.',
        category: 'scoring'
      },
      {
        id: 'q2',
        question: 'Combien de points pour un coup de pied au plastron ?',
        options: ['1 point', '2 points', '3 points', '4 points'],
        correctAnswer: 1,
        explanation: 'Un coup de pied au plastron rapporte 2 points.',
        category: 'scoring'
      },
      {
        id: 'q3',
        question: 'Combien de points pour un coup de pied à la tête ?',
        options: ['2 points', '3 points', '4 points', '5 points'],
        correctAnswer: 1,
        explanation: 'Un coup de pied à la tête rapporte 3 points.',
        category: 'scoring'
      },
      {
        id: 'q4',
        question: 'Combien de points pour une technique rotative au plastron ?',
        options: ['3 points', '4 points', '5 points', '6 points'],
        correctAnswer: 1,
        explanation: 'Une technique rotative au plastron rapporte 4 points.',
        category: 'scoring'
      },
      {
        id: 'q5',
        question: 'Combien de points pour une technique rotative à la tête ?',
        options: ['4 points', '5 points', '6 points', '7 points'],
        correctAnswer: 1,
        explanation: 'Une technique rotative à la tête rapporte 5 points.',
        category: 'scoring'
      }
    ]
  },
  {
    id: 'procedures',
    title: 'Procédures d\'Arbitrage',
    description: 'Les procédures officielles pour les arbitres',
    icon: '⚖️',
    passingScore: 85,
    questions: [
      {
        id: 'q1',
        question: 'Quelle est la position correcte de l\'arbitre central ?',
        options: ['À l\'extérieur du tatami', 'Au centre du tatami', 'Derrière les combattants', 'À côté des juges'],
        correctAnswer: 1,
        explanation: 'L\'arbitre central doit se positionner au centre du tatami pour avoir une vue claire des combattants.',
        category: 'procedures'
      },
      {
        id: 'q2',
        question: 'Comment signaler un Gam-jeom ?',
        options: ['Levant la main', 'Pointant du doigt', 'Annonçant verbalement et gestuellement', 'Utilisant un sifflet'],
        correctAnswer: 2,
        explanation: 'L\'arbitre doit annoncer verbalement "Gam-jeom" et faire le geste approprié.',
        category: 'procedures'
      },
      {
        id: 'q3',
        question: 'Que faire si un combattant sort de la zone de combat ?',
        options: ['Ignorer', 'Donner un Gam-jeom', 'Arrêter le combat', 'Avertir verbalement'],
        correctAnswer: 1,
        explanation: 'Sortir de la zone de combat entraîne un Gam-jeom (avertissement).',
        category: 'procedures'
      },
      {
        id: 'q4',
        question: 'Combien de juges de coin sont nécessaires pour un combat ?',
        options: ['1 juge', '2 juges', '3 juges', '4 juges'],
        correctAnswer: 2,
        explanation: 'Un combat standard nécessite 3 juges de coin en plus de l\'arbitre central.',
        category: 'procedures'
      },
      {
        id: 'q5',
        question: 'Quelle est la procédure en cas de blessure d\'un combattant ?',
        options: ['Continuer le combat', 'Arrêter immédiatement et appeler le médecin', 'Donner 1 minute de repos', 'Disqualifier le combattant'],
        correctAnswer: 1,
        explanation: 'En cas de blessure, l\'arbitre doit arrêter immédiatement le combat et appeler le médecin.',
        category: 'procedures'
      }
    ]
  },
  {
    id: 'safety',
    title: 'Sécurité et Premiers Secours',
    description: 'Protocoles de sécurité pour les arbitres',
    icon: '🛡️',
    passingScore: 90,
    questions: [
      {
        id: 'q1',
        question: 'Quel équipement de protection est obligatoire pour les combattants ?',
        options: ['Plastron uniquement', 'Plastron et protège-dents', 'Plastron, protège-dents et protège-tibias', 'Équipement complet incluant casque'],
        correctAnswer: 3,
        explanation: 'L\'équipement complet inclut : plastron, casque, protège-dents, protège-tibias, gants et protège-avant-bras.',
        category: 'safety'
      },
      {
        id: 'q2',
        question: 'Que faire si un combattant saigne ?',
        options: ['Continuer le combat', 'Arrêter et nettoyer la plaie', 'Appliquer un pansement et continuer', 'Disqualifier le combattant'],
        correctAnswer: 1,
        explanation: 'Si un combattant saigne, le combat doit être arrêté et la plaie nettoyée avant de continuer.',
        category: 'safety'
      },
      {
        id: 'q3',
        question: 'Quels sont les signes de commotion cérébrale ?',
        options: ['Maux de tête et vertiges', 'Nausées et confusion', 'Perte de conscience', 'Tous les symptômes ci-dessus'],
        correctAnswer: 3,
        explanation: 'Les signes de commotion incluent : maux de tête, vertiges, nausées, confusion, perte de conscience, troubles de la vision.',
        category: 'safety'
      },
      {
        id: 'q4',
        question: 'Quelle est la procédure en cas de KO ?',
        options: ['Reprendre le combat après 1 minute', 'Arrêter le combat et appeler le médecin', 'Continuer si le combattant se relève', 'Disqualifier les deux combattants'],
        correctAnswer: 1,
        explanation: 'En cas de KO, le combat est immédiatement arrêté et le médecin doit examiner le combattant.',
        category: 'safety'
      },
      {
        id: 'q5',
        question: 'Quand un combattant peut-il retourner à la compétition après une commotion ?',
        options: ['Immédiatement', 'Après 24 heures', 'Après évaluation médicale complète', 'Après 1 semaine'],
        correctAnswer: 2,
        explanation: 'Un combattant ne peut retourner à la compétition qu\'après une évaluation médicale complète et l\'autorisation d\'un médecin.',
        category: 'safety'
      }
    ]
  }
];

export default function TrainingModule() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completedCourses, setCompletedCourses] = useState<string[]>(() => {
    const stored = localStorage.getItem('completed_courses');
    return stored ? JSON.parse(stored) : [];
  });

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleValidateAnswer = () => {
    if (selectedAnswer === null || !selectedCourse) return;
    
    setShowExplanation(true);
    if (selectedAnswer === selectedCourse.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedCourse) return;

    if (currentQuestionIndex < selectedCourse.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Course terminé
      const finalScore = ((score + (selectedAnswer === selectedCourse.questions[currentQuestionIndex].correctAnswer ? 1 : 0)) / 
                         selectedCourse.questions.length) * 100;
      
      if (finalScore >= selectedCourse.passingScore) {
        const newCompleted = [...completedCourses, selectedCourse.id];
        setCompletedCourses(newCompleted);
        localStorage.setItem('completed_courses', JSON.stringify(newCompleted));
      }
      
      setCompleted(true);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  // Vue de sélection des cours
  if (!selectedCourse) {
    return (
      <div className="fade-up mx-auto max-w-7xl">
        <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
        <PageHead title="Module de Formation" subtitle="Cours et certifications pour arbitres et coaches" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COURSES.map(course => {
            const isCompleted = completedCourses.includes(course.id);
            
            return (
              <div key={course.id} className="panel p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{course.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-bone mb-2">{course.title}</h3>
                    <p className="text-sm text-dune mb-3">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-dune">{course.questions.length} questions</span>
                      <span className="text-dune">Score minimum: {course.passingScore}%</span>
                      {isCompleted && (
                        <span className="badge text-forest">✓ Complété</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartCourse(course)}
                  className="btn btn-primary w-full"
                >
                  {isCompleted ? 'Recommencer' : 'Commencer'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Progression globale */}
        <div className="panel p-6 mt-8">
          <h3 className="font-display text-xl text-bone mb-4">Votre Progression</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dune">Cours complétés</span>
                <span className="text-bone font-semibold">
                  {completedCourses.length} / {COURSES.length}
                </span>
              </div>
              <div className="h-3 bg-husk rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-flame transition-all duration-500"
                  style={{ width: `${(completedCourses.length / COURSES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue de quiz
  if (completed) {
    const finalScore = (score / selectedCourse.questions.length) * 100;
    const passed = finalScore >= selectedCourse.passingScore;

    return (
      <div className="fade-up mx-auto max-w-3xl">
        <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
        
        <div className="panel p-8 text-center">
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h2 className="font-display text-3xl text-bone mb-4">
            {passed ? 'Félicitations !' : 'Continuez vos efforts !'}
          </h2>
          <p className="text-xl text-dune mb-6">
            Score : <span className={`font-bold ${passed ? 'text-forest' : 'text-flame'}`}>
              {finalScore.toFixed(1)}%
            </span>
          </p>
          <p className="text-dune mb-8">
            {passed
              ? `Vous avez réussi le cours "${selectedCourse.title}" avec succès !`
              : `Score minimum requis : ${selectedCourse.passingScore}%. Réessayez pour améliorer votre score.`}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={handleBackToCourses} className="btn btn-ghost">
              Retour aux cours
            </button>
            {!passed && (
              <button onClick={() => handleStartCourse(selectedCourse)} className="btn btn-primary">
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedCourse.questions[currentQuestionIndex];

  return (
    <div className="fade-up mx-auto max-w-3xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      
      <div className="panel p-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dune">Question {currentQuestionIndex + 1} / {selectedCourse.questions.length}</span>
            <span className="text-bone font-semibold">Score: {score}</span>
          </div>
          <div className="h-2 bg-husk rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-flame transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / selectedCourse.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="font-display text-2xl text-bone mb-4">
            {currentQuestion.question}
          </h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = showExplanation;

              let borderColor = 'border-husk';
              let bgColor = 'bg-bark/30';
              
              if (showResult) {
                if (isCorrect) {
                  borderColor = 'border-forest';
                  bgColor = 'bg-forest/10';
                } else if (isSelected && !isCorrect) {
                  borderColor = 'border-flame';
                  bgColor = 'bg-flame/10';
                }
              } else if (isSelected) {
                borderColor = 'border-gold';
                bgColor = 'bg-gold/10';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${borderColor} ${bgColor} ${
                    !showExplanation ? 'hover:border-gold/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-gold bg-gold/20' : 'border-husk'
                    }`}>
                      {showResult && isCorrect && <IconCheck className="w-4 h-4 text-forest" />}
                      {showResult && isSelected && !isCorrect && <IconX className="w-4 h-4 text-flame" />}
                    </div>
                    <span className="text-bone">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explication */}
        {showExplanation && (
          <div className="mb-6 p-4 bg-bark/50 border border-husk rounded-lg">
            <h4 className="font-semibold text-bone mb-2 flex items-center gap-2">
              <IconBook className="w-5 h-5 text-gold" />
              Explication
            </h4>
            <p className="text-dune">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4">
          <button onClick={handleBackToCourses} className="btn btn-ghost">
            Annuler
          </button>
          {!showExplanation ? (
            <button
              onClick={handleValidateAnswer}
              disabled={selectedAnswer === null}
              className="btn btn-primary flex-1"
            >
              Valider
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="btn btn-primary flex-1">
              {currentQuestionIndex < selectedCourse.questions.length - 1 ? 'Question suivante' : 'Terminer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
