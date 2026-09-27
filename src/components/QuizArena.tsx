import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Department } from '../data/departments';
import { DepartmentIcon } from './DepartmentIcon';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { 
  Timer, 
  Award, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ChevronRight, 
  BarChart3, 
  Eye, 
  EyeOff,
  Trophy,
  ArrowLeft,
} from 'lucide-react';
import { playClickSound, playCorrectSound, playIncorrectSound } from '../utils/sound';

import { StudentUser } from '../types/user';
import { completeQuizCloud } from '../utils/cloud';
import { QuizHoloRoom } from './QuizHoloRoom';

interface QuizArenaProps {
  departments: Department[];
  selectedDeptId: string | null;
  onSelectDeptId: (id: string) => void;
  onCloseQuiz?: () => void;
  currentStudent?: StudentUser | null;
}

interface ShuffledQuestion {
  originalText: string;
  options: string[];
  correctIndex: number;
}

interface AnswerHistory {
  question: string;
  options: string[];
  chosenIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  departments,
  selectedDeptId,
  onSelectDeptId,
  onCloseQuiz,
  currentStudent
}) => {
  const [activeDeptId, setActiveDeptId] = useState<string>(selectedDeptId || 'cse');
  const [viewMode, setViewMode] = useState<'quiz' | 'leaderboard'>('quiz');
  const [questionCountMode, setQuestionCountMode] = useState<10 | 15 | 30>(15);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [totalTimeForQuiz, setTotalTimeForQuiz] = useState(180);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [history, setHistory] = useState<AnswerHistory[]>([]);
  
  // Leaderboard submission form states
  const [xpEarned, setXpEarned] = useState(0);
  const xpAwardedRef = useRef(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when selectedDeptId prop changes externally
  useEffect(() => {
    if (selectedDeptId) {
      setActiveDeptId(selectedDeptId);
      setViewMode('quiz');
    }
  }, [selectedDeptId]);

  const activeDept = departments.find(d => d.id === activeDeptId) || departments[0];

  const initializeQuiz = useCallback((dept: Department, countMode: 10 | 15 | 30 = questionCountMode) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Shuffle questions pool and slice to countMode
    const rawQuestions = shuffleArray(dept.q).slice(0, countMode);
    
    // Shuffle options inside each question
    const preparedQuestions: ShuffledQuestion[] = rawQuestions.map(([text, opts, correctIdx]) => {
      const originalOptions = [...opts];
      const indices = opts.map((_, i) => i);
      const shuffledIndices = shuffleArray(indices);
      const shuffledOptions = shuffledIndices.map(i => originalOptions[i]);
      const newCorrectIndex = shuffledIndices.indexOf(correctIdx);

      return {
        originalText: text,
        options: shuffledOptions,
        correctIndex: newCorrectIndex
      };
    });

    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setHistory([]);
    setIsCompleted(false);
    setShowReview(false);
    setXpEarned(0);
    xpAwardedRef.current = false;

    // Set time according to questions count (12s per question)
    const totalSeconds = Math.max(90, countMode * 12);
    setTotalTimeForQuiz(totalSeconds);
    setTimeLeft(totalSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [questionCountMode]);

  // When active department changes, reinitialize quiz
  useEffect(() => {
    if (activeDept) {
      initializeQuiz(activeDept, questionCountMode);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeDeptId, questionCountMode, initializeQuiz]);

  const handleSelectOption = (idx: number) => {
    if (answered || isCompleted || !questions[currentIndex]) return;

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;
    setSelectedIndex(idx);
    setAnswered(true);

    if (isCorrect) {
      playCorrectSound();
      setScore(prev => prev + 1);
    } else {
      playIncorrectSound();
    }

    setHistory(prev => [
      ...prev,
      {
        question: currentQ.originalText,
        options: currentQ.options,
        chosenIndex: idx,
        correctIndex: currentQ.correctIndex,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex + 1 >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setSelectedIndex(null);
    }
  };

  useEffect(() => {
    if (!isCompleted || !currentStudent || xpAwardedRef.current || questions.length === 0) return;
    xpAwardedRef.current = true;
    void (async () => {
      try {
        const result = await completeQuizCloud(activeDept.id, score, questions.length, `${currentStudent.authUserId || currentStudent.rollNo}-${activeDept.id}-${Date.now()}`);
        setXpEarned(Number(result.xp || 0));
        window.dispatchEvent(new CustomEvent('rit:xp-change'));
      } catch (err) {
        console.error('Cloud quiz completion failed:', err);
        setXpEarned(0);
      }
    })();
  }, [isCompleted, currentStudent, questions.length, score]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <section id="quizzes" className="py-20 px-6 lg:px-16 bg-[#0a0d13] border-b border-[#20242c] relative">
      <div className="max-w-5xl mx-auto">
        {/* Top navigation controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {onCloseQuiz && (
              <button
                onClick={() => {
                  playClickSound();
                  onCloseQuiz();
                }}
                className="px-3.5 py-2 rounded-xl border border-[#292f38] bg-[#121720] text-xs font-semibold text-[#aeb5c0] hover:text-white hover:border-[#55e6a5]/50 transition-all flex items-center gap-2 cursor-pointer shadow"
              >
                <ArrowLeft className="w-4 h-4 text-[#55e6a5]" />
                <span>All Departments</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1.5 p-1 bg-[#121720] border border-[#292f38] rounded-xl">
              <button
                onClick={() => {
                  playClickSound();
                  setViewMode('quiz');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'quiz'
                    ? 'bg-[#55e6a5] text-[#06110d]'
                    : 'text-[#aeb5c0] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quiz Arena</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setViewMode('leaderboard');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'leaderboard'
                    ? 'bg-[#55e6a5] text-[#06110d]'
                    : 'text-[#aeb5c0] hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Global Leaderboard</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          {viewMode === 'quiz' && (
            <div className="flex items-center gap-2 p-1 bg-[#121720] border border-[#292f38] rounded-xl self-start sm:self-auto">
              <span className="text-xs text-[#aeb5c0] pl-2 font-medium">Questions:</span>
              {([10, 15, 30] as const).map(count => (
                <button
                  key={count}
                  onClick={() => {
                    playClickSound();
                    setQuestionCountMode(count);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    questionCountMode === count
                      ? 'bg-[#55e6a5] text-[#06110d]'
                      : 'text-[#aeb5c0] hover:text-white'
                  }`}
                >
                  {count === 30 ? 'All 30' : count}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Leaderboard View */}
        {viewMode === 'leaderboard' ? (
          <GlobalLeaderboard
            departments={departments}
            currentDeptId={activeDeptId}
            currentStudent={currentStudent}
            onTakeQuizForDept={(deptId) => {
              setActiveDeptId(deptId);
              onSelectDeptId(deptId);
              setViewMode('quiz');
            }}
            onClose={() => setViewMode('quiz')}
          />
        ) : (
          /* Active Quiz View */
          <>
            <QuizHoloRoom department={activeDept} question={currentQ?.originalText} score={score} total={questions.length || questionCountMode} />
            {/* Department tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {departments.map((dept) => {
                const isActive = dept.id === activeDeptId;
                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      playClickSound();
                      setActiveDeptId(dept.id);
                      onSelectDeptId(dept.id);
                    }}
                    style={{
                      borderColor: isActive ? dept.accent : undefined,
                      boxShadow: isActive ? `0 0 15px color-mix(in srgb, ${dept.accent} 25%, transparent)` : undefined
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#121720] text-white'
                        : 'bg-[#0d1117] border-[#292f38] text-[#aeb5c0] hover:text-white hover:border-[#384252]'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: dept.accent }}
                    />
                    <span>{dept.code}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Quiz Header / HUD bar */}
            <div 
              className="sticky top-[76px] z-30 p-4 rounded-xl bg-[#080a0f]/95 border border-[#20242c] backdrop-blur-md flex flex-wrap items-center justify-between gap-4 mb-6 shadow-xl"
              style={{ borderColor: activeDept.accent + '44' }}
            >
              <div className="flex items-center gap-3">
                <DepartmentIcon kind={activeDept.kind} accent={activeDept.accent} />
                <div>
                  <div className="text-xs font-bold" style={{ color: activeDept.accent }}>
                    {activeDept.code} • {activeDept.name}
                  </div>
                  <div className="text-xs text-[#aeb5c0]">
                    Question {isCompleted ? questions.length : currentIndex + 1} of {questions.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-mono text-sm font-semibold">
                  <Timer className={`w-4 h-4 ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span className={timeLeft < 30 ? 'text-red-400 font-bold' : 'text-white'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-sm font-semibold pl-4 border-l border-[#20242c]">
                  <span className="text-[#aeb5c0]">SCORE:</span>
                  <span className="text-[#55e6a5] font-bold">{score}</span>
                  <span className="text-[#707987]">/ {questions.length}</span>
                </div>
              </div>
            </div>

            {/* Quiz Body */}
            <div className="max-w-3xl mx-auto perspective-1000">
              {!isCompleted && currentQ ? (
                <div>
                  {/* Question progress ticks */}
                  <div className="flex gap-1.5 mb-5 overflow-hidden">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i < currentIndex
                            ? 'bg-[#55e6a5]'
                            : i === currentIndex
                            ? 'bg-white'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Question card */}
                  <div 
                    key={currentIndex} 
                    className="q border border-[#292f38] rounded-2xl p-6 sm:p-8 bg-[#0d1117] shadow-2xl animate-flip preserve-3d"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8b95a3] mb-4">
                      <span>QUESTION #{currentIndex + 1}</span>
                      <span style={{ color: activeDept.accent }}>{activeDept.code}</span>
                    </div>

                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-white leading-snug mb-8">
                      {currentQ.originalText}
                    </h3>

                    {/* Options grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {currentQ.options.map((option, idx) => {
                        const isOptionCorrect = idx === currentQ.correctIndex;
                        const isChosen = selectedIndex === idx;

                        let btnStyles = 'bg-[#121720] border-[#303641] text-[#dfe5eb] hover:border-[#55e6a5]/50';
                        if (answered) {
                          if (isOptionCorrect) {
                            btnStyles = 'bg-[#1c4635] border-[#55e6a5] text-white font-semibold shadow-[0_0_15px_rgba(85,230,165,0.2)]';
                          } else if (isChosen && !isOptionCorrect) {
                            btnStyles = 'bg-[#3d1919] border-[#e66b6b] text-white font-semibold';
                          } else {
                            btnStyles = 'bg-[#121720]/50 border-[#20242c] text-gray-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={answered}
                            onClick={() => handleSelectOption(idx)}
                            className={`p-4 rounded-xl text-left text-sm font-medium border transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${btnStyles}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#080a0f] border border-[#292f38] flex items-center justify-center text-xs font-mono shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="pt-0.5 leading-snug">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Question footer */}
                    <div className="mt-8 pt-5 border-t border-[#20242c] flex items-center justify-between">
                      <div className="text-xs text-[#aeb5c0]">
                        {answered ? (
                          selectedIndex === currentQ.correctIndex ? (
                            <span className="text-[#55e6a5] font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Correct! +1 point
                            </span>
                          ) : (
                            <span className="text-[#e66b6b] font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect answer
                            </span>
                          )
                        ) : (
                          <span>Select an answer above to proceed</span>
                        )}
                      </div>

                      <button
                        disabled={!answered}
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-[#55e6a5] text-[#06110d] font-bold text-xs sm:text-sm uppercase tracking-wide hover:bg-[#6ef3b7] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <span>{currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Result Screen */
                <div className="border border-[#55e6a5] rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#0e1614] to-[#080a0f] text-center shadow-2xl relative overflow-hidden animate-flip">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner"
                    style={{ backgroundColor: `${activeDept.accent}20`, border: `2px solid ${activeDept.accent}` }}
                  >
                    <Award className="w-10 h-10" style={{ color: activeDept.accent }} />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-[#aeb5c0] uppercase">
                    {activeDept.name} • ASSESSMENT COMPLETE
                  </span>

                  <div className="font-heading font-extrabold text-5xl sm:text-7xl text-[#55e6a5] mt-2 mb-2">
                    {score} <span className="text-2xl sm:text-3xl text-[#aeb5c0] font-normal">/ {questions.length}</span>
                  </div>

                  <div className="text-sm sm:text-base font-semibold text-white mb-2">
                    Performance: {percentage}% • {
                      percentage >= 90 ? '🌟 Gold Scholar - Extraordinary Mastery!' :
                      percentage >= 75 ? '✨ First Class with Distinction' :
                      percentage >= 60 ? '👍 First Class Pass' :
                      '📚 Cadet Level - Great effort, keep learning!'
                    }
                  </div>

                  <div className="quiz-xp-reward">
                    <Sparkles size={18} />
                    <div><span>FIRE XP EARNED</span><strong>+{xpEarned} XP</strong></div>
                    <small>Score XP + completion bonus{percentage === 100 ? ' + perfect-score bonus' : ''}</small>
                  </div>

                  <p className="text-xs sm:text-sm text-[#aeb5c0] max-w-md mx-auto mb-6 leading-relaxed">
                    Come back anytime! The questions and choices reshuffle each attempt to test real conceptual mastery.
                  </p>

                  {/* Cloud leaderboard status */}
                  <div className="my-6 p-5 rounded-2xl bg-[#121720] border border-[#292f38] max-w-lg mx-auto text-left">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider"><Trophy className="w-4 h-4 text-[#f5d90a]" /> CLOUD LEADERBOARD</div>
                    <p className="text-xs text-[#aeb5c0] mt-2">Your quiz attempt and Fire XP were recorded in Supabase PostgreSQL automatically. No separate score submission is required.</p>
                    <button onClick={() => { playClickSound(); setViewMode('leaderboard'); }} className="mt-3 px-4 py-2 rounded-lg bg-[#55e6a5] text-[#06110d] font-bold text-xs">View Live XP Leaderboard</button>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center items-center">
                    <button
                      onClick={() => {
                        playClickSound();
                        initializeQuiz(activeDept, questionCountMode);
                      }}
                      className="px-6 py-3 rounded-xl bg-[#55e6a5] text-[#06110d] font-bold text-sm hover:bg-[#6ef3b7] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        setViewMode('leaderboard');
                      }}
                      className="px-6 py-3 rounded-xl border border-[#292f38] bg-[#121720] text-white font-semibold text-sm hover:border-[#f5d90a]/60 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-[#f5d90a]" />
                      <span>View Leaderboard</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        setShowReview(!showReview);
                      }}
                      className="px-6 py-3 rounded-xl border border-[#303640] bg-[#121720] text-white font-semibold text-sm hover:border-[#55e6a5]/50 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showReview ? 'Hide Answer Review' : 'Review Answers'}</span>
                    </button>
                  </div>

                  {/* Review Accordion / List */}
                  {showReview && (
                    <div className="mt-10 pt-8 border-t border-[#20242c] text-left">
                      <div className="flex items-center gap-2 mb-4 text-white font-heading font-bold text-lg">
                        <BarChart3 className="w-5 h-5 text-[#55e6a5]" />
                        <span>Answer Analysis & Solutions</span>
                      </div>

                      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                        {history.map((h, i) => (
                          <div
                            key={i}
                            className={`p-4 rounded-xl border ${
                              h.isCorrect
                                ? 'bg-[#0d1612] border-emerald-900/60'
                                : 'bg-[#180e0e] border-red-900/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-mono font-bold text-[#aeb5c0]">Q{i + 1}</span>
                              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${h.isCorrect ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                {h.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white mt-1 mb-2">{h.question}</p>
                            <div className="text-xs space-y-1">
                              <div className={h.isCorrect ? 'text-emerald-300 font-semibold' : 'text-red-300'}>
                                Your choice: {h.options[h.chosenIndex]}
                              </div>
                              {!h.isCorrect && (
                                <div className="text-emerald-400 font-semibold">
                                  Correct answer: {h.options[h.correctIndex]}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
