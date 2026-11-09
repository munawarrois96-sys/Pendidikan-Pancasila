import React, { useState, useEffect, useMemo } from 'react';
import {
  tkaPancasilaQuestions,
  TkaQuestion,
  TkaPilihanGandaQuestion,
  TkaBenarSalahQuestion,
  TkaMultiJawabanQuestion,
  TkaElement,
  TkaCognitiveLevel,
} from '../data/tkaPancasilaData';
import { sound } from '../utils/audio';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  BookOpen,
  Scale,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  Check,
  X,
  Volume2,
  Download,
  Info,
  Compass,
} from 'lucide-react';

interface TkaSimulationViewProps {
  onAddPoints?: (pts: number) => void;
  onNavigateHome?: () => void;
}

export function TkaSimulationView({ onAddPoints, onNavigateHome }: TkaSimulationViewProps) {
  // Mode: 'intro' | 'exam' | 'result'
  const [mode, setMode] = useState<'intro' | 'exam' | 'result'>('intro');

  // Current Question Index (0 to 29)
  const [currentIndex, setCurrentIndex] = useState(0);

  // User Answers State:
  // - For pilihan_ganda: string ('A' | 'B' | 'C' | 'D' | 'E')
  // - For benar_salah: Record<string, boolean> (statementId -> true/false)
  // - For multi_jawaban: string[] (array of option keys, up to 3)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  // Flagged/Ragu-ragu questions set
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Timer State (60 minutes = 3600 seconds)
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Palette drawer open/close
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Review Filter in Result mode
  const [reviewFilter, setReviewFilter] = useState<'semua' | 'benar' | 'salah' | 'Pancasila' | 'UUD' | 'Bhinneka' | 'NKRI'>('semua');

  // Confirmation modal
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // Active question
  const currentQ = tkaPancasilaQuestions[currentIndex];

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start exam
  const handleStartExam = () => {
    sound.playClick();
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(60 * 60);
    setCurrentIndex(0);
    setMode('exam');
    setIsTimerRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Answering handlers
  const handleSelectPilihanGanda = (optionKey: 'A' | 'B' | 'C' | 'D' | 'E') => {
    sound.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const handleToggleBenarSalah = (stmtId: string, value: boolean) => {
    sound.playClick();
    setUserAnswers((prev) => {
      const currentMap = prev[currentQ.id] || {};
      return {
        ...prev,
        [currentQ.id]: {
          ...currentMap,
          [stmtId]: value,
        },
      };
    });
  };

  const handleToggleMultiJawaban = (optKey: string) => {
    sound.playClick();
    setUserAnswers((prev) => {
      const currentList: string[] = prev[currentQ.id] || [];
      if (currentList.includes(optKey)) {
        return {
          ...prev,
          [currentQ.id]: currentList.filter((k) => k !== optKey),
        };
      } else {
        if (currentList.length >= 3) {
          // Can select max 3
          return prev;
        }
        return {
          ...prev,
          [currentQ.id]: [...currentList, optKey],
        };
      }
    });
  };

  const toggleFlagCurrent = () => {
    sound.playClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  // Determine if a question is answered
  const isQuestionAnswered = (q: TkaQuestion) => {
    const ans = userAnswers[q.id];
    if (ans === undefined || ans === null) return false;
    if (q.type === 'pilihan_ganda') {
      return typeof ans === 'string' && ans.length > 0;
    }
    if (q.type === 'benar_salah') {
      // Must answer all 3 statements
      return (
        typeof ans === 'object' &&
        q.statements.every((stmt) => ans[stmt.id] !== undefined)
      );
    }
    if (q.type === 'multi_jawaban') {
      // Must select 3 options
      return Array.isArray(ans) && ans.length === 3;
    }
    return false;
  };

  // Count answered questions
  const answeredCount = useMemo(() => {
    return tkaPancasilaQuestions.filter((q) => isQuestionAnswered(q)).length;
  }, [userAnswers]);

  // Finish exam & calculate scores
  const handleFinishExam = () => {
    setIsTimerRunning(false);
    setIsFinishModalOpen(false);
    sound.playVictory();
    setMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate earned points
    const finalScore = scoreSummary.totalScore;
    if (onAddPoints) {
      onAddPoints(Math.round(finalScore * 2));
    }
  };

  // Evaluation & Score Calculation
  const scoreSummary = useMemo(() => {
    let totalCorrectCount = 0;
    const elementScores: Record<TkaElement, { total: number; correct: number }> = {
      Pancasila: { total: 0, correct: 0 },
      'UUD NRI 1945': { total: 0, correct: 0 },
      'Bhinneka Tunggal Ika': { total: 0, correct: 0 },
      NKRI: { total: 0, correct: 0 },
    };

    const cognitiveScores: Record<TkaCognitiveLevel, { total: number; correct: number }> = {
      Pemahaman: { total: 0, correct: 0 },
      Penerapan: { total: 0, correct: 0 },
      Penalaran: { total: 0, correct: 0 },
    };

    const questionResults: Record<string, { isCorrect: boolean; partialScore: number }> = {};

    tkaPancasilaQuestions.forEach((q) => {
      // Track counts
      elementScores[q.element].total += 1;
      cognitiveScores[q.cognitiveLevel].total += 1;

      const userAns = userAnswers[q.id];
      let isCorrect = false;
      let partialScore = 0;

      if (q.type === 'pilihan_ganda') {
        if (userAns === q.correctAnswer) {
          isCorrect = true;
          partialScore = 1;
        }
      } else if (q.type === 'benar_salah') {
        if (userAns && typeof userAns === 'object') {
          const correctStmts = q.statements.filter(
            (stmt) => userAns[stmt.id] === stmt.isCorrectTrue
          ).length;
          partialScore = correctStmts / q.statements.length;
          if (correctStmts === q.statements.length) {
            isCorrect = true;
          }
        }
      } else if (q.type === 'multi_jawaban') {
        if (Array.isArray(userAns)) {
          const correctMatch = userAns.filter((k) => q.correctAnswers.includes(k)).length;
          partialScore = correctMatch / q.correctAnswers.length;
          if (userAns.length === 3 && correctMatch === 3) {
            isCorrect = true;
          }
        }
      }

      if (isCorrect) {
        totalCorrectCount += 1;
        elementScores[q.element].correct += 1;
        cognitiveScores[q.cognitiveLevel].correct += 1;
      }

      questionResults[q.id] = { isCorrect, partialScore };
    });

    const totalQuestions = tkaPancasilaQuestions.length;
    const totalScore = Math.round((totalCorrectCount / totalQuestions) * 100);

    return {
      totalQuestions,
      totalCorrectCount,
      totalScore,
      elementScores,
      cognitiveScores,
      questionResults,
    };
  }, [userAnswers]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* ========================================================= */}
      {/* 1. INTRO / BERANDA SIMULASI TKA */}
      {/* ========================================================= */}
      {mode === 'intro' && (
        <div className="bg-white rounded-3xl border border-sky-200 shadow-xl overflow-hidden animate-fadeIn">
          {/* Banner Header */}
          <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-900 text-white p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pointer-events-none">
              <GraduationCap size={320} className="text-white transform translate-x-12" />
            </div>

            <div className="max-w-2xl relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full shadow-sm">
                <Sparkles size={14} />
                <span>Simulasi Standar TKA / UTBK 2026</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Simulasi TKA Pendidikan Pancasila SMA
              </h1>
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
                Mata pelajaran yang sebelumnya dikenal sebagai <strong>PPKn / PKN (Pendidikan Pancasila dan Kewarganegaraan)</strong>. Dirancang khusus untuk siswa Kelas 12 SMA Negeri 1 Mande dalam persiapan Tes Kemampuan Akademik (TKA) dan seleksi masuk perguruan tinggi.
              </p>
            </div>
          </div>

          {/* Grid Informasi Kisi-kisi */}
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Format 30 Soal */}
              <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-sm">
                  30
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">Komposisi 30 Soal</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>20 Pilihan Ganda</strong> (A, B, C, D, E)</li>
                  <li><strong>5 Benar / Salah</strong> (3 pernyataan per nomor)</li>
                  <li><strong>5 Multi Jawaban</strong> (pilih 3 benar dari 5 opsi)</li>
                </ul>
              </div>

              {/* Card 2: 4 Elemen Pembelajaran */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                  <Shield size={20} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">4 Elemen Kisi-Kisi</h3>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[11px] bg-white border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md">Pancasila</span>
                  <span className="text-[11px] bg-white border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md">UUD NRI 1945</span>
                  <span className="text-[11px] bg-white border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md">Bhinneka Tunggal Ika</span>
                  <span className="text-[11px] bg-white border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md">NKRI</span>
                </div>
              </div>

              {/* Card 3: 3 Level Kognitif */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                  <Clock size={20} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">3 Level Kognitif & Waktu</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>Pemahaman (L1)</strong>: Konsep & dasar yuridis</li>
                  <li><strong>Penerapan (L2)</strong>: Studi kasus & pemecahan masalah</li>
                  <li><strong>Penalaran (L3 / HOTS)</strong>: Evaluasi kritis</li>
                  <li className="text-emerald-700 font-bold">Durasi Ujian: 60 Menit</li>
                </ul>
              </div>
            </div>

            {/* Petunjuk Pengerjaan */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Info size={16} className="text-sky-600" />
                <span>Petunjuk Pengerjaan Simulasi:</span>
              </h4>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Simulasi berjalan otomatis dengan waktu mundur <strong>60 menit</strong>. Kerjakan soal yang dianggap mudah terlebih dahulu.</li>
                <li>Pada soal <strong>Pilihan Ganda</strong>, pilih satu jawaban yang paling tepat (A, B, C, D, atau E).</li>
                <li>Pada soal <strong>Kategori Benar / Salah</strong>, tentukan status kebenaran dari ketiga pernyataan yang disediakan.</li>
                <li>Pada soal <strong>Multi Jawaban</strong>, centang tepat <strong>tiga (3) jawaban</strong> yang benar dari lima pilihan.</li>
                <li>Gunakan tombol <strong>"Ragu-Ragu"</strong> jika belum yakin untuk menandai soal di palet navigasi.</li>
                <li>Setelah selesai, sistem akan menampilkan <strong>skor instan, analisis kompetensi per elemen, dan pembahasan mendalam</strong>.</li>
              </ol>
            </div>

            {/* Start CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Pengampu: <strong>Munawar Rois, S.Pd.</strong> • SMA Negeri 1 Mande, Cianjur
              </div>

              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <GraduationCap size={20} />
                <span>Mulai Simulasi TKA Sekarang (60 Menit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EXAM SIMULATION INTERFACE (CAT SYSTEM) */}
      {/* ========================================================= */}
      {mode === 'exam' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Exam Navigation Bar: Timer, Progress & Palette Toggle */}
          <div className="bg-white rounded-2xl border border-sky-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-18 z-30">
            {/* Left: Progress info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                {currentIndex + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-800">
                    Soal No. {currentIndex + 1} dari 30
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                    {answeredCount}/30 Terjawab
                  </span>
                </div>
                <div className="w-36 sm:w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(answeredCount / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Center: Live Timer with alert */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-black border transition-colors ${
                timeLeft < 300
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              <Clock size={16} className={timeLeft < 300 ? 'text-rose-600' : 'text-sky-600'} />
              <span>Sisa Waktu: {formatTime(timeLeft)}</span>
            </div>

            {/* Right: Palette Button & Selesai Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition-colors"
                title="Buka Palet Nomor Soal"
              >
                <Layers size={14} className="text-sky-600" />
                <span className="hidden sm:inline">Daftar Soal</span>
                <span className="sm:hidden">Palet</span>
              </button>

              <button
                onClick={() => setIsFinishModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                Selesai Ujian
              </button>
            </div>
          </div>

          {/* Question Palette Drawer (Collapsible) */}
          {isPaletteOpen && (
            <div className="bg-white rounded-2xl border border-sky-200 p-4 shadow-md space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                <span>Pilih Nomor Soal (1 s.d. 30):</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Terjawab</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Ragu-ragu</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" /> Belum</span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {tkaPancasilaQuestions.map((q, idx) => {
                  const isAns = isQuestionAnswered(q);
                  const isFlag = flaggedQuestions[q.id];
                  const isCurrent = idx === currentIndex;

                  let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isFlag) {
                    bgClass = 'bg-amber-400 text-sky-950 font-black';
                  } else if (isAns) {
                    bgClass = 'bg-emerald-600 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                        sound.playClick();
                      }}
                      className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all ${bgClass} ${
                        isCurrent ? 'ring-2 ring-sky-600 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Question Card */}
          <div className="bg-white rounded-3xl border border-sky-200 p-6 sm:p-8 shadow-md space-y-6">
            {/* Meta tags: Element, Cognitive Level & Type */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-sky-100 text-sky-800 text-xs font-black px-2.5 py-0.5 rounded-lg border border-sky-200 flex items-center gap-1">
                  <Shield size={12} />
                  {currentQ.element}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-amber-200">
                  Level: {currentQ.cognitiveLevel}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-lg">
                  {currentQ.type === 'pilihan_ganda'
                    ? 'Pilihan Ganda (1 Jawaban)'
                    : currentQ.type === 'benar_salah'
                    ? 'Kategori Benar / Salah (3 Pernyataan)'
                    : 'Multi Jawaban (Pilih 3 dari 5 Opsi)'}
                </span>
              </div>

              {/* Ragu-ragu Checkbox */}
              <button
                onClick={toggleFlagCurrent}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-400 text-sky-950 border-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Flag size={13} className={flaggedQuestions[currentQ.id] ? 'fill-sky-950' : ''} />
                <span>Ragu-Ragu</span>
              </button>
            </div>

            {/* Stimulus Context (if any) */}
            {currentQ.stimulus && (
              <div className="p-4 sm:p-5 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block mb-1">
                  Wacana / Stimulus Kontekstual:
                </span>
                <p>{currentQ.stimulus}</p>
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </div>

            {/* ===================================================== */}
            {/* TIPE 1: PILIHAN GANDA (A, B, C, D, E) */}
            {/* ===================================================== */}
            {currentQ.type === 'pilihan_ganda' && (
              <div className="space-y-3 pt-2">
                {(currentQ as TkaPilihanGandaQuestion).options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectPilihanGanda(opt.key)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 group ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-600 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-sky-100'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className={`text-xs sm:text-sm pt-0.5 leading-relaxed ${
                        isSelected ? 'font-bold text-sky-950' : 'text-slate-800'
                      }`}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===================================================== */}
            {/* TIPE 2: KATEGORI BENAR / SALAH (3 PERNYATAAN) */}
            {/* ===================================================== */}
            {currentQ.type === 'benar_salah' && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-slate-500 italic">
                  *Tentukan pilihan status Benar (B) atau Salah (S) untuk setiap butir pernyataan di bawah ini:
                </p>
                <div className="space-y-3">
                  {(currentQ as TkaBenarSalahQuestion).statements.map((stmt, sIdx) => {
                    const currentVal = userAnswers[currentQ.id]?.[stmt.id];
                    return (
                      <div
                        key={stmt.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                            {stmt.text}
                          </span>
                        </div>

                        {/* Toggle Benar / Salah buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleBenarSalah(stmt.id, true)}
                            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all border ${
                              currentVal === true
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-emerald-800 border-slate-300 hover:bg-emerald-50'
                            }`}
                          >
                            ✓ Benar
                          </button>
                          <button
                            onClick={() => handleToggleBenarSalah(stmt.id, false)}
                            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all border ${
                              currentVal === false
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-white text-rose-800 border-slate-300 hover:bg-rose-50'
                            }`}
                          >
                            ✕ Salah
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* TIPE 3: MULTI JAWABAN (PILIH 3 DARI 5) */}
            {/* ===================================================== */}
            {currentQ.type === 'multi_jawaban' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 italic">
                    *Pilih tepat 3 opsi yang Anda yakini benar.
                  </p>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    (userAnswers[currentQ.id]?.length || 0) === 3
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    Terpilih: {userAnswers[currentQ.id]?.length || 0} / 3 Opsi
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(currentQ as TkaMultiJawabanQuestion).options.map((opt) => {
                    const selectedList: string[] = userAnswers[currentQ.id] || [];
                    const isChecked = selectedList.includes(opt.key);
                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleToggleMultiJawaban(opt.key)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                          isChecked
                            ? 'bg-sky-50/80 border-sky-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-sky-600 border-sky-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isChecked && <Check size={14} className="stroke-[3]" />}
                        </div>
                        <span className={`text-xs sm:text-sm leading-relaxed ${
                          isChecked ? 'font-bold text-sky-950' : 'text-slate-800'
                        }`}>
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Question Actions: Previous & Next */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  sound.playClick();
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
              </button>

              <div className="text-xs font-bold text-slate-500">
                {currentIndex + 1} / 30
              </div>

              {currentIndex < 29 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => Math.min(29, prev + 1));
                    sound.playClick();
                  }}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Berikutnya</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setIsFinishModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Selesai & Kumpulkan</span>
                  <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. HASIL SIMULASI & PEMBAHASAN MENDALAM */}
      {/* ========================================================= */}
      {mode === 'result' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Banner Card */}
          <div className="bg-white rounded-3xl border border-sky-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-900 text-white p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400 text-sky-950 text-xs font-black px-3 py-1 rounded-full">
                    <Award size={14} />
                    <span>Laporan Hasil Simulasi TKA SMANDE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">
                    {scoreSummary.totalScore >= 80
                      ? 'Luar Biasa! Kemampuan Akademik Unggul'
                      : scoreSummary.totalScore >= 65
                      ? 'Bagus! Kompetensi TKA Terpenuhi'
                      : 'Perlu Penguatan Materi Esensial'}
                  </h2>
                  <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
                    Hasil simulasi Anda telah dianalisis berdasarkan 4 elemen Kurikulum Merdeka dan 3 level kognitif TKA Pendidikan Pancasila SMA.
                  </p>
                </div>

                {/* Score Circle Badge */}
                <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shrink-0 min-w-[160px]">
                  <span className="text-xs text-sky-200 font-bold uppercase tracking-wider">
                    Skor TKA
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-amber-300 my-1">
                    {scoreSummary.totalScore}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {scoreSummary.totalCorrectCount} dari 30 Soal Benar
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Analysis Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Row 1: Elemen Breakdown */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-sky-600" />
                  <span>Penguasaan per Elemen Materi:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.keys(scoreSummary.elementScores) as TkaElement[]).map((el) => {
                    const data = scoreSummary.elementScores[el];
                    const pct = Math.round((data.correct / data.total) * 100);
                    return (
                      <div key={el} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-800">{el}</span>
                          <span className="font-mono font-bold text-sky-700">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {data.correct} dari {data.total} soal benar
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Cognitive Level Breakdown */}
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers size={16} className="text-sky-600" />
                  <span>Penguasaan per Level Kognitif:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(Object.keys(scoreSummary.cognitiveScores) as TkaCognitiveLevel[]).map((lvl) => {
                    const data = scoreSummary.cognitiveScores[lvl];
                    const pct = Math.round((data.correct / data.total) * 100);
                    return (
                      <div key={lvl} className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-800">{lvl}</span>
                          <span className="font-mono font-bold text-sky-700">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {data.correct} dari {data.total} soal benar
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Ulangi / Kembali */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleStartExam}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <RotateCcw size={15} />
                  <span>Ulangi Simulasi TKA</span>
                </button>

                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Kembali ke Beranda</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PEMBAHASAN MENDALAM 30 SOAL */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-sky-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <BookOpen size={18} className="text-sky-600" />
                  <span>Kunci Jawaban & Pembahasan Lengkap (30 Soal)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pelajari dasar hukum, konstitusi, dan argumentasi pedagogis dari setiap butir soal.
                </p>
              </div>

              {/* Review Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'Semua (30)', value: 'semua' },
                  { label: 'Benar', value: 'benar' },
                  { label: 'Salah', value: 'salah' },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setReviewFilter(f.value as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      reviewFilter === f.value
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Questions with In-depth Explanations */}
            <div className="space-y-6">
              {tkaPancasilaQuestions
                .filter((q) => {
                  const res = scoreSummary.questionResults[q.id];
                  if (reviewFilter === 'benar') return res.isCorrect;
                  if (reviewFilter === 'salah') return !res.isCorrect;
                  return true;
                })
                .map((q) => {
                  const res = scoreSummary.questionResults[q.id];
                  const userAns = userAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border-2 space-y-4 transition-all ${
                        res.isCorrect
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-rose-200 bg-rose-50/20'
                      }`}
                    >
                      {/* Header Soal Review */}
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg text-white font-black flex items-center justify-center text-xs ${
                              res.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          >
                            {q.number}
                          </span>
                          <span className="font-extrabold text-slate-800">
                            {q.element} • {q.cognitiveLevel}
                          </span>
                        </div>

                        <span
                          className={`font-black px-2.5 py-0.5 rounded-md text-[11px] flex items-center gap-1 ${
                            res.isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.isCorrect ? '✓ Jawaban Tepat' : '✕ Belum Tepat'}
                        </span>
                      </div>

                      {/* Stimulus */}
                      {q.stimulus && (
                        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                          "{q.stimulus}"
                        </div>
                      )}

                      {/* Prompt */}
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>

                      {/* User Answer vs Key Answer */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                        {q.type === 'pilihan_ganda' && (
                          <div className="space-y-1">
                            <div>
                              <strong className="text-slate-500">Pilihan Anda: </strong>
                              <span className={res.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                {userAns || 'Tidak Dijawab'}
                              </span>
                            </div>
                            <div>
                              <strong className="text-slate-500">Kunci Jawaban: </strong>
                              <span className="text-emerald-700 font-bold">{q.correctAnswer}</span>
                            </div>
                          </div>
                        )}

                        {q.type === 'benar_salah' && (
                          <div className="space-y-1">
                            <strong className="text-slate-500 block">Status Kunci Pernyataan:</strong>
                            {q.statements.map((s, idx) => {
                              const ansVal = userAns?.[s.id];
                              const isMatch = ansVal === s.isCorrectTrue;
                              return (
                                <div key={s.id} className="text-[11px] flex items-center justify-between gap-2 border-b border-slate-100 py-1">
                                  <span>{idx + 1}. {s.text}</span>
                                  <span className="shrink-0 font-bold">
                                    Kunci: {s.isCorrectTrue ? 'Benar' : 'Salah'} | Anda: {ansVal !== undefined ? (ansVal ? 'Benar' : 'Salah') : '-'} ({isMatch ? '✓' : '✕'})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'multi_jawaban' && (
                          <div className="space-y-1">
                            <div>
                              <strong className="text-slate-500">Pilihan Anda: </strong>
                              <span className="font-bold text-slate-800">
                                {Array.isArray(userAns) ? userAns.join(', ') : 'Tidak Dijawab'}
                              </span>
                            </div>
                            <div>
                              <strong className="text-slate-500">Kunci 3 Jawaban Benar: </strong>
                              <span className="text-emerald-700 font-bold">{q.correctAnswers.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* In-depth Explanation Box */}
                      <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-xs text-slate-700 leading-relaxed space-y-1">
                        <strong className="text-sky-900 block font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-sky-700" />
                          Pembahasan & Dasar Konstitusional:
                        </strong>
                        <p>{q.explanation}</p>
                        <span className="text-[10px] text-sky-800 font-medium block pt-1">
                          Referensi: {q.curriculumReference}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL KONFIRMASI SELESAI UJIAN */}
      {/* ========================================================= */}
      {isFinishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Konfirmasi Selesaikan Ujian?
                </h3>
                <p className="text-xs text-slate-500">
                  Pastikan semua jawaban telah diperiksa dengan teliti.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Soal Sudah Terjawab:</span>
                <strong className="text-emerald-700 font-bold">{answeredCount} dari 30</strong>
              </div>
              <div className="flex justify-between">
                <span>Soal Belum Terjawab:</span>
                <strong className={30 - answeredCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {30 - answeredCount} Soal
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Soal Ditandai Ragu-Ragu:</span>
                <strong className="text-amber-700 font-bold">
                  {Object.values(flaggedQuestions).filter(Boolean).length} Soal
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Sisa Waktu:</span>
                <strong className="font-mono text-slate-800">{formatTime(timeLeft)}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsFinishModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                onClick={handleFinishExam}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Ya, Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
