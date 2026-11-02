import React, { useState } from 'react';
import { Question, QuizAttempt } from '../types';
import { sound } from '../utils/audio';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  quizTitle: string;
  studentName?: string;
  studentClass?: string;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onBackToMaterials?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  quizTitle,
  studentName = 'Siswa SMANDE',
  studentClass = 'XI-1',
  onFinishQuiz,
  onBackToMaterials,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [matchingState, setMatchingState] = useState<Record<string, string>>({}); // left -> right
  const [selectedMatchingLeft, setSelectedMatchingLeft] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const activeQ = questions[currentIdx];

  // Multiple Choice Handler
  const handleSingleSelect = (optionIdx: number) => {
    sound.playClick();
    setAnswers({ ...answers, [activeQ.id]: optionIdx });
  };

  // Complex Multiple Handler (Multi-select)
  const handleComplexSelect = (optionIdx: number) => {
    sound.playClick();
    const currentList: number[] = answers[activeQ.id] || [];
    const updated = currentList.includes(optionIdx)
      ? currentList.filter((i) => i !== optionIdx)
      : [...currentList, optionIdx];
    setAnswers({ ...answers, [activeQ.id]: updated });
  };

  // True / False Handler
  const handleBoolSelect = (val: boolean) => {
    sound.playClick();
    setAnswers({ ...answers, [activeQ.id]: val });
  };

  // Short Answer Handler
  const handleShortText = (text: string) => {
    setAnswers({ ...answers, [activeQ.id]: text });
  };

  // Matching pair click
  const handleMatchingClickLeft = (leftItem: string) => {
    sound.playClick();
    setSelectedMatchingLeft(leftItem);
  };

  const handleMatchingClickRight = (rightItem: string) => {
    if (!selectedMatchingLeft) return;
    sound.playClick();
    const updated = { ...matchingState, [selectedMatchingLeft]: rightItem };
    setMatchingState(updated);
    setAnswers({ ...answers, [activeQ.id]: updated });
    setSelectedMatchingLeft(null);
  };

  // Submit and calculate score
  const handleFinish = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];

      if (q.type === 'multiple_choice' || q.type === 'case_study') {
        if (userAns === q.correctOptionIndex) correctCount++;
      } else if (q.type === 'complex_multiple') {
        const correct = q.correctOptionsIndices || [];
        const user = (userAns as number[]) || [];
        if (
          user.length === correct.length &&
          user.every((val) => correct.includes(val))
        ) {
          correctCount++;
        }
      } else if (q.type === 'true_false') {
        if (userAns === q.correctBoolean) correctCount++;
      } else if (q.type === 'short_answer') {
        const textAns = (userAns || '').toString().trim().toLowerCase();
        const matches = (q.correctShortAnswer || []).some(
          (ans) => textAns === ans.toLowerCase()
        );
        if (matches) correctCount++;
      } else if (q.type === 'matching') {
        const userMatches = userAns || {};
        const pairs = q.matchingPairs || [];
        const allCorrect = pairs.every(
          (p) => userMatches[p.left] === p.right
        );
        if (allCorrect && pairs.length > 0) correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setFinalScore(calculatedScore);
    setIsCompleted(true);

    if (calculatedScore >= 75) {
      sound.playVictory();
    } else {
      sound.playWrong();
    }

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: 'general-quiz',
      quizTitle,
      studentId: 'std-current',
      studentName,
      studentClass,
      score: calculatedScore,
      totalQuestions: questions.length,
      correctCount,
      timestamp: new Date().toLocaleString('id-ID'),
      answers,
    };

    onFinishQuiz(attempt);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      sound.playClick();
    } else {
      handleFinish();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setMatchingState({});
    setIsCompleted(false);
    setFinalScore(0);
    sound.playClick();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-8 text-white shadow-2xl max-w-3xl mx-auto">
      {/* Quiz Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles size={14} /> Asesmen Otomatis & Pembahasan
          </span>
          <h2 className="text-xl md:text-2xl font-bold">{quizTitle}</h2>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs font-semibold">
            <Clock size={14} className="text-amber-400" />
            <span>Soal {currentIdx + 1} dari {questions.length}</span>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 mb-6 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 mb-6 shadow-inner">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Tipe: {activeQ.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Tingkat: {activeQ.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Scenario if Case Study */}
            {activeQ.scenario && (
              <div className="bg-slate-900/90 border-l-4 border-amber-500 p-3.5 rounded-r-xl mb-4 text-xs md:text-sm text-slate-300 leading-relaxed italic">
                <b>Narasi Kasus:</b> {activeQ.scenario}
              </div>
            )}

            <h3 className="text-base md:text-lg font-bold text-white leading-relaxed">
              {activeQ.prompt}
            </h3>
          </div>

          {/* Answer Inputs by Type */}
          <div className="mb-6">
            {/* 1. Multiple Choice / Case Study Single Select */}
            {(activeQ.type === 'multiple_choice' || activeQ.type === 'case_study') && activeQ.options && (
              <div className="space-y-3">
                {activeQ.options.map((opt, i) => {
                  const isSelected = answers[activeQ.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSingleSelect(i)}
                      className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-red-950/70 border-red-500 ring-2 ring-red-500 text-white font-semibold'
                          : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle size={18} className="text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Complex Multiple Choice (Multi-Select) */}
            {activeQ.type === 'complex_multiple' && activeQ.options && (
              <div className="space-y-3">
                <span className="text-xs text-amber-400 font-semibold block mb-1">
                  *Pilih seluruh pilihan yang sesuai (bisa lebih dari satu):
                </span>
                {activeQ.options.map((opt, i) => {
                  const list: number[] = answers[activeQ.id] || [];
                  const isChecked = list.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleComplexSelect(i)}
                      className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500 text-white font-semibold'
                          : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-red-600 accent-red-600"
                        />
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. True or False */}
            {activeQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'BENAR', value: true, color: 'emerald' },
                  { label: 'SALAH', value: false, color: 'rose' },
                ].map((item) => {
                  const isSelected = answers[activeQ.id] === item.value;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleBoolSelect(item.value)}
                      className={`py-6 rounded-2xl border font-bold text-base md:text-lg transition-all text-center ${
                        isSelected
                          ? 'bg-red-600 border-red-500 text-white ring-2 ring-red-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4. Short Answer */}
            {activeQ.type === 'short_answer' && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-medium">
                  Ketikkan jawaban singkatmu di bawah ini:
                </label>
                <input
                  type="text"
                  value={answers[activeQ.id] || ''}
                  onChange={(e) => handleShortText(e.target.value)}
                  placeholder="Contoh: Sutasoma..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-red-500 outline-none transition-colors"
                />
              </div>
            )}

            {/* 5. Matching (Menjodohkan) */}
            {activeQ.type === 'matching' && activeQ.matchingPairs && (
              <div className="space-y-4">
                <span className="text-xs text-slate-400 block">
                  1) Klik konsep di sisi kiri, 2) Lalu klik pasangannya di sisi kanan:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {activeQ.matchingPairs.map((pair, pIdx) => {
                      const isSelected = selectedMatchingLeft === pair.left;
                      const hasPair = !!matchingState[pair.left];
                      return (
                        <button
                          key={pIdx}
                          onClick={() => handleMatchingClickLeft(pair.left)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-950 border-amber-500 ring-2 ring-amber-500 text-white font-bold'
                              : hasPair
                              ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="font-semibold">{pair.left}</div>
                          {hasPair && (
                            <span className="text-[10px] text-emerald-400 block mt-1 truncate">
                              → {matchingState[pair.left]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {activeQ.matchingPairs.map((pair, pIdx) => (
                      <button
                        key={pIdx}
                        disabled={!selectedMatchingLeft}
                        onClick={() => handleMatchingClickRight(pair.right)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                          selectedMatchingLeft
                            ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200 cursor-pointer'
                            : 'bg-slate-950/60 border-slate-800/60 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {pair.right}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx((p) => p - 1);
                sound.playClick();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition-colors"
            >
              Sebelumnya
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-bold text-xs md:text-sm text-white shadow-lg transition-all"
            >
              <span>{currentIdx < questions.length - 1 ? 'Soal Selanjutnya' : 'Kumpulkan & Selesai'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation and Comprehensive Explanations Screen */
        <div className="space-y-6">
          <div className="text-center py-6 bg-slate-950 border border-slate-800 rounded-3xl p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white mb-3 shadow-xl">
              <Award size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Hasil Evaluasi Pembelajaran</h3>
            <p className="text-xs text-slate-400 mb-4">
              Nama: <span className="text-slate-200 font-semibold">{studentName}</span> ({studentClass})
            </p>

            <div className="text-5xl font-black text-amber-400 my-2">{finalScore}</div>
            <span className="text-xs uppercase tracking-wider text-slate-400">Skala 0 - 100</span>

            <div className="mt-4">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                  finalScore >= 75
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950 text-red-300 border border-red-500/40'
                }`}
              >
                {finalScore >= 75
                  ? 'TUNTAS (Memenuhi Kriteria Ketercapaian TP)'
                  : 'PERLU PENGAYAAN / REMEDIAL'}
              </span>
            </div>
          </div>

          {/* Detailed Question Review & Explanations */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wider">
              Pembahasan & Analisis Jawaban:
            </h4>

            {questions.map((q, idx) => {
              return (
                <div key={q.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Soal #{idx + 1} ({q.type})</span>
                  </div>
                  <p className="text-xs md:text-sm text-white font-medium">{q.prompt}</p>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="text-amber-400 font-bold block mb-1">💡 Kunci & Penjelasan:</span>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw size={15} /> Ulangi Kuis
            </button>
            {onBackToMaterials && (
              <button
                onClick={onBackToMaterials}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
              >
                Kembali ke Daftar Materi 📚
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
