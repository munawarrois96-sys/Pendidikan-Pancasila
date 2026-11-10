import React, { useState, useEffect } from 'react';
import { allCpnsQuestions, cpnsPassingGrades, CpnsQuestion } from '../data/cpnsSkdData';
import { sound } from '../utils/audio';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  BookOpen,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  Check,
  X,
  Volume2,
  Download,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface CpnsSimulationViewProps {
  onAddPoints?: (pts: number) => void;
  onNavigateHome?: () => void;
}

export function CpnsSimulationView({ onAddPoints, onNavigateHome }: CpnsSimulationViewProps) {
  // Mode: 'intro' | 'exam' | 'result'
  const [mode, setMode] = useState<'intro' | 'exam' | 'result'>('intro');

  // Exam duration mode: standard (100 min) vs sensory disability (130 min)
  const [durationMode, setDurationMode] = useState<'standard' | 'disability'>('standard');
  const [timeLeft, setTimeLeft] = useState(100 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Active question index (0 to 109)
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers map: questionId -> chosen key ('A' | 'B' | 'C' | 'D' | 'E')
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});

  // Flagged / ragu-ragu map: questionId -> boolean
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Question navigation palette drawer
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Subtest filter for palette and review
  const [activeSubtestFilter, setActiveSubtestFilter] = useState<'Semua' | 'TWK' | 'TIU' | 'TKP'>('Semua');

  // Finish exam modal
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // Current question
  const currentQ: CpnsQuestion = allCpnsQuestions[currentIndex] || allCpnsQuestions[0];

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

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    sound.playClick();
    const totalSecs = durationMode === 'disability' ? 130 * 60 : 100 * 60;
    setTimeLeft(totalSecs);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setIsTimerRunning(true);
    setMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    sound.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  const handleToggleFlag = () => {
    sound.playClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleFinishExam = () => {
    sound.playVictory();
    setIsTimerRunning(false);
    setIsFinishModalOpen(false);
    setMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (onAddPoints) {
      onAddPoints(50); // reward points
    }
  };

  // Calculations for scores
  const scoreResults = React.useMemo(() => {
    let twkScore = 0;
    let tiuScore = 0;
    let tkpScore = 0;
    let answeredCount = 0;

    allCpnsQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans) {
        answeredCount++;
        if (q.subtest === 'TWK') {
          if (ans === q.correctKey) twkScore += 5;
        } else if (q.subtest === 'TIU') {
          if (ans === q.correctKey) tiuScore += 5;
        } else if (q.subtest === 'TKP') {
          const opt = q.options.find((o) => o.key === ans);
          if (opt && opt.points) tkpScore += opt.points;
        }
      }
    });

    const totalScore = twkScore + tiuScore + tkpScore;
    const isTwkPassed = twkScore >= cpnsPassingGrades.TWK.passing;
    const isTiuPassed = tiuScore >= cpnsPassingGrades.TIU.passing;
    const isTkpPassed = tkpScore >= cpnsPassingGrades.TKP.passing;
    const isAllPassed = isTwkPassed && isTiuPassed && isTkpPassed;

    return {
      twkScore,
      tiuScore,
      tkpScore,
      totalScore,
      answeredCount,
      isTwkPassed,
      isTiuPassed,
      isTkpPassed,
      isAllPassed,
    };
  }, [userAnswers]);

  // Questions filtered for palette
  const filteredPaletteQuestions = allCpnsQuestions.filter(
    (q) => activeSubtestFilter === 'Semua' || q.subtest === activeSubtestFilter
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* ================= 1. INTRO / START SCREEN ================= */}
      {mode === 'intro' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-800 via-rose-700 to-red-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-500/50 relative overflow-hidden">
            <div className="max-w-3xl space-y-3 z-10 relative">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-1.5">
                <Award size={15} /> SISTEM RESMI CAT BKN • SIMULASI CPNS SKD
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Simulasi SKD CPNS (Seleksi Kompetensi Dasar)
              </h2>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
                Uji kemampuan Anda dalam 110 butir soal standar BKN CAT terdiri dari <b>TKP</b> (45 soal), <b>TIU</b> (35 soal), dan <b>TWK</b> (30 soal) dengan total skor maksimal 550 poin.
              </p>
            </div>

            <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none">
              🦅
            </div>
          </div>

          {/* Grid Spec & Passing Grade Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-amber-200 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  1. TKP
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">45 Soal</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Tes Karakteristik Pribadi</h4>
              <p className="text-xs text-slate-500">Bobot nilai bertingkat 1 s.d. 5 (tidak menjawab: 0). Nilai maksimal: 225.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                <span className="text-slate-500">Passing Grade:</span>
                <span className="text-amber-700 font-extrabold">166 Poin</span>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  2. TIU
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">35 Soal</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Tes Inteligensia Umum</h4>
              <p className="text-xs text-slate-500">Bobot nilai: Benar 5, Salah/Kosong 0. Nilai maksimal: 175.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                <span className="text-slate-500">Passing Grade:</span>
                <span className="text-blue-700 font-extrabold">80 Poin</span>
              </div>
            </div>

            <div className="bg-white border-2 border-emerald-200 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  3. TWK
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">30 Soal</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Tes Wawasan Kebangsaan</h4>
              <p className="text-xs text-slate-500">Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika. Nilai maks: 150.</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                <span className="text-slate-500">Passing Grade:</span>
                <span className="text-emerald-700 font-extrabold">65 Poin</span>
              </div>
            </div>
          </div>

          {/* Setting Duration & Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h4 className="font-extrabold text-base text-amber-300">Pilihan Waktu Pengerjaan Ujian:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setDurationMode('standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  durationMode === 'standard'
                    ? 'bg-red-950/80 border-red-500 ring-2 ring-red-400'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <input
                  type="radio"
                  name="durationMode"
                  checked={durationMode === 'standard'}
                  onChange={() => setDurationMode('standard')}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-sm text-white block">Standar Umum (100 Menit)</span>
                  <p className="text-slate-400 text-xs mt-0.5">Alokasi waktu resmi BKN untuk peserta umum (rata-rata 54 detik/soal).</p>
                </div>
              </label>

              <label
                onClick={() => setDurationMode('disability')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  durationMode === 'disability'
                    ? 'bg-red-950/80 border-red-500 ring-2 ring-red-400'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <input
                  type="radio"
                  name="durationMode"
                  checked={durationMode === 'disability'}
                  onChange={() => setDurationMode('disability')}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-sm text-white block">Khusus Sensorik Netra (130 Menit)</span>
                  <p className="text-slate-400 text-xs mt-0.5">Sesuai ketentuan waktu resmi bagi penyandang disabilitas sensorik netra.</p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Total Soal: <b className="text-white">110 Butir</b> • Sistem: <b className="text-amber-400">BKN CAT</b>
              </div>
              <button
                onClick={handleStartExam}
                className="px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Mulai Ujian Simulasi SKD CPNS</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. EXAM ACTIVE SCREEN ================= */}
      {mode === 'exam' && (
        <div className="space-y-4">
          {/* Top CAT Header Bar */}
          <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-3 sm:p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                SKD CPNS
              </span>
              <span className="text-xs text-slate-300 font-bold hidden sm:inline">
                Soal Nomor <b className="text-amber-400 text-sm">{currentQ.number}</b> dari 110
              </span>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 font-mono">
              <Clock size={16} className={timeLeft <= 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'} />
              <span className={`text-base font-black ${timeLeft <= 300 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                <Layers size={14} />
                <span>Daftar Soal ({Object.keys(userAnswers).length}/110)</span>
              </button>

              <button
                onClick={() => setIsFinishModalOpen(true)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
              >
                Selesai Ujian
              </button>
            </div>
          </div>

          {/* Main Question Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            {/* Question Subtest Pill & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                    currentQ.subtest === 'TKP'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : currentQ.subtest === 'TIU'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {currentQ.subtest} ({currentQ.category})
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {currentQ.id}</span>
              </div>

              {/* Flag / Ragu-ragu Toggle */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <Flag size={13} className={flaggedQuestions[currentQ.id] ? 'fill-slate-950' : ''} />
                <span>{flaggedQuestions[currentQ.id] ? 'Ditandai Ragu-Ragu' : 'Tandai Ragu-Ragu'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed whitespace-pre-line">
              <span className="font-black mr-2">{currentQ.number}.</span>
              {currentQ.prompt}
            </div>

            {/* Multiple Choice Options (A - E) */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-400 text-sky-950 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 group-hover:border-slate-400'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
              </button>

              <div className="text-xs text-slate-500 font-bold hidden sm:inline">
                {currentQ.number} dari 110 Butir Soal
              </div>

              <button
                disabled={currentIndex === allCpnsQuestions.length - 1}
                onClick={() => {
                  sound.playClick();
                  setCurrentIndex((i) => Math.min(allCpnsQuestions.length - 1, i + 1));
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-40"
              >
                <span>Selanjutnya</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Question Palette Drawer Modal */}
          {isPaletteOpen && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  Palet Lembar Nomor Soal (110 Butir)
                </span>
                <div className="flex items-center gap-1">
                  {(['Semua', 'TWK', 'TIU', 'TKP'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveSubtestFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activeSubtestFilter === filter ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-11 gap-1.5 max-h-72 overflow-y-auto p-1">
                {filteredPaletteQuestions.map((q) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];
                  const isCurrent = q.number === currentQ.number;
                  const idx = allCpnsQuestions.findIndex((item) => item.id === q.id);

                  let btnColor = 'bg-slate-800 text-slate-300 border-slate-700'; // unvisited/unanswered
                  if (isFlagged) {
                    btnColor = 'bg-amber-500 text-slate-950 font-black border-amber-400';
                  } else if (isAnswered) {
                    btnColor = 'bg-emerald-600 text-white font-bold border-emerald-500';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        sound.playClick();
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-mono transition-all text-center border relative ${btnColor} ${
                        isCurrent ? 'ring-2 ring-white scale-105' : ''
                      }`}
                    >
                      <span>{q.number}</span>
                      {isAnswered && (
                        <span className="block text-[9px] font-black uppercase mt-0.5">{userAnswers[q.id]}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Color Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
                  <span>Sudah Dijawab ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500" />
                  <span>Ragu-Ragu ({Object.keys(flaggedQuestions).filter((k) => flaggedQuestions[k]).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
                  <span>Belum Dijawab ({110 - Object.keys(userAnswers).length})</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Finish Modal */}
          {isFinishModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertCircle size={28} />
                  <h4 className="font-extrabold text-lg text-white">Konfirmasi Selesai Ujian SKD</h4>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soal Dijawab:</span>
                    <b className="text-emerald-400 font-mono">{Object.keys(userAnswers).length} dari 110</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Soal Belum Dijawab:</span>
                    <b className="text-red-400 font-mono">{110 - Object.keys(userAnswers).length} Butir</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sisa Waktu:</span>
                    <b className="text-amber-300 font-mono">{formatTime(timeLeft)}</b>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Apakah Anda yakin ingin mengakhiri sesi ujian SKD CPNS sekarang? Jawaban Anda akan dihitung secara otomatis sesuai aturan penilaian resmi BKN CAT.
                </p>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setIsFinishModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Lanjutkan Mengerjakan
                  </button>
                  <button
                    onClick={handleFinishExam}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Ya, Selesai & Lihat Skor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. RESULT / SCORE SCREEN ================= */}
      {mode === 'result' && (
        <div className="space-y-6">
          {/* Main Result Certificate Header */}
          <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
              <Award size={14} /> HASIL SKOR CAT SKD CPNS RESMI
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {scoreResults.isAllPassed ? '🎉 SELAMAT! ANDA LULUS PASSING GRADE SKD' : '⚠️ BELUM MEMENUHI PASSING GRADE SKD'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {scoreResults.isAllPassed
                  ? 'Perolehan nilai Anda pada ketiga subtes (TWK, TIU, TKP) berhasil melampaui seluruh ambang batas resmi KepmenPAN-RB.'
                  : 'Tetap semangat! Tingkatkan latihan pada subtes yang belum mencapai ambang batas batas (passing grade).'}
              </p>
            </div>

            {/* Total Score Gauge */}
            <div className="inline-block bg-slate-950/90 border border-amber-500/40 p-6 rounded-3xl shadow-xl">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block">Total Skor Kumulatif</span>
              <div className="text-6xl sm:text-7xl font-black text-amber-400 my-1 font-mono">
                {scoreResults.totalScore}
              </div>
              <span className="text-xs text-slate-400">Skor Maksimal: 550 Poin</span>
            </div>

            {/* 3 Sub-tests Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              {/* TKP */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-400">1. TKP (45 Soal)</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      scoreResults.isTkpPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {scoreResults.isTkpPassed ? 'MEMENUHI PG' : 'DI BAWAH PG'}
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">{scoreResults.tkpScore} <span className="text-xs font-normal text-slate-500">/ 225</span></div>
                <div className="text-[11px] text-slate-400">
                  Ambang Batas (PG): <b className="text-amber-400">166</b>
                </div>
              </div>

              {/* TIU */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-400">2. TIU (35 Soal)</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      scoreResults.isTiuPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {scoreResults.isTiuPassed ? 'MEMENUHI PG' : 'DI BAWAH PG'}
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">{scoreResults.tiuScore} <span className="text-xs font-normal text-slate-500">/ 175</span></div>
                <div className="text-[11px] text-slate-400">
                  Ambang Batas (PG): <b className="text-blue-400">80</b>
                </div>
              </div>

              {/* TWK */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-400">3. TWK (30 Soal)</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      scoreResults.isTwkPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {scoreResults.isTwkPassed ? 'MEMENUHI PG' : 'DI BAWAH PG'}
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-mono">{scoreResults.twkScore} <span className="text-xs font-normal text-slate-500">/ 150</span></div>
                <div className="text-[11px] text-slate-400">
                  Ambang Batas (PG): <b className="text-emerald-400">65</b>
                </div>
              </div>
            </div>

            {/* Retake & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartExam}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Ulangi Ujian SKD</span>
              </button>

              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700"
                >
                  Kembali ke Beranda
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review Section */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pembahasan Lengkap 110 Butir Soal SKD</h3>
                <p className="text-xs text-slate-500">Pelajari rasionalisasi kunci jawaban dan pembahasan mendalam per subtes</p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['Semua', 'TWK', 'TIU', 'TKP'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubtestFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeSubtestFilter === tab
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {allCpnsQuestions
                .filter((q) => activeSubtestFilter === 'Semua' || q.subtest === activeSubtestFilter)
                .map((q) => {
                  const userAns = userAnswers[q.id];
                  const isTwkOrTiu = q.subtest === 'TWK' || q.subtest === 'TIU';
                  const isCorrect = isTwkOrTiu ? userAns === q.correctKey : undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-700">
                          #{q.number}. [{q.subtest}] {q.category}
                        </span>
                        {isTwkOrTiu && (
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {isCorrect ? 'BENAR (+5)' : 'SALAH (+0)'}
                          </span>
                        )}
                        {q.subtest === 'TKP' && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            Skor Anda: +{q.options.find((o) => o.key === userAns)?.points || 0} Poin
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                        {q.prompt}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              opt.key === q.correctKey
                                ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                                : opt.key === userAns && !isCorrect
                                ? 'bg-red-50 border-red-400 font-medium text-red-950'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>
                              <b>{opt.key}.</b> {opt.text}
                            </span>
                            {opt.points && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                {opt.points} Poin
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-950 space-y-1">
                        <span className="font-extrabold block text-sky-800">💡 Pembahasan Resmi:</span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
