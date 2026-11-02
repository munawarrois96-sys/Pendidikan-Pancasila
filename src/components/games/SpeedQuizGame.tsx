import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Timer, Zap, Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface BlitzQuestion {
  question: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  options: string[];
  correctIndex: number;
  explanation: string;
}

const BLITZ_QUESTIONS: BlitzQuestion[] = [
  {
    question: 'Lambang Sila Pertama Pancasila adalah...',
    difficulty: 'Mudah',
    options: ['Bintang Emas', 'Rantai Baja', 'Pohon Beringin', 'Kepala Banteng'],
    correctIndex: 0,
    explanation: 'Bintang bersudut lima berlatar hitam melambangkan cahaya rohani bagi setiap insan manusia.',
  },
  {
    question: 'Pasal dalam UUD 1945 yang menjamin kemerdekaan tiap warga negara memeluk agama adalah...',
    difficulty: 'Sedang',
    options: ['Pasal 27 ayat 1', 'Pasal 29 ayat 2', 'Pasal 33 ayat 1', 'Pasal 34 ayat 1'],
    correctIndex: 1,
    explanation: 'Pasal 29 ayat (2) menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing dan beribadat menurut agamanya.',
  },
  {
    question: 'BPUPKI dibentuk oleh pemerintah balatentara Jepang pada tanggal...',
    difficulty: 'Sedang',
    options: ['1 Maret 1945', '29 Mei 1945', '1 Juni 1945', '17 Agustus 1945'],
    correctIndex: 0,
    explanation: 'BPUPKI (Dokuritsu Zyunbi Tyoosakai) diumumkan pembentukannya pada 1 Maret 1945 oleh Letjen Kumakichi Harada.',
  },
  {
    question: 'Prinsip hukum "Lex superior derogat legi inferiori" memiliki arti...',
    difficulty: 'Sulit',
    options: [
      'Hukum yang baru mengesampingkan hukum lama',
      'Hukum yang lebih tinggi mengesampingkan hukum yang lebih rendah',
      'Hukum khusus mengesampingkan hukum umum',
      'Semua warga negara sama di depan hukum',
    ],
    correctIndex: 1,
    explanation: 'Lex superior derogat legi inferiori adalah asas hukum di mana norma yang berderajat lebih rendah tidak boleh bertentangan dengan norma di atasnya.',
  },
  {
    question: 'Jumlah bulu pada masing-masing sayap burung Garuda Pancasila melambangkan...',
    difficulty: 'Mudah',
    options: ['Tanggal 17', 'Bulan 8', 'Tahun 19', 'Tahun 45'],
    correctIndex: 0,
    explanation: '17 helai bulu pada tiap sayap, 8 helai pada ekor, 19 helai di bawah perisai/pangkal ekor, dan 45 helai di leher melambangkan 17-08-1945.',
  },
  {
    question: 'Salah satu nilai instrumental dari sila kelima dalam UUD 1945 adalah...',
    difficulty: 'Sulit',
    options: [
      'Pasal 33 (Perekonomian Nasional & Kesejahteraan Sosial)',
      'Pasal 36A (Lambang Negara)',
      'Pasal 1 ayat 2 (Kedaulatan Rakyat)',
      'Pasal 30 ayat 1 (Pertahanan Negara)',
    ],
    correctIndex: 0,
    explanation: 'Pasal 33 dan Pasal 34 mengatur kemakmuran bersama dan jaminan sosial bagi fakir miskin sebagai penjabaran Sila ke-5.',
  },
];

export const SpeedQuizGame: React.FC<{ onScoreEarned?: (pts: number) => void }> = ({ onScoreEarned }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Semua' | 'Mudah' | 'Sedang' | 'Sulit'>('Semua');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const filteredQuestions = BLITZ_QUESTIONS.filter(
    (q) => selectedDifficulty === 'Semua' || q.difficulty === selectedDifficulty
  );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  useEffect(() => {
    if (isGameOver || isAnswered) return;

    if (timeLeft <= 0) {
      sound.playWrong();
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedAnswer(-1); // Timed out
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      // Time bonus: more points if answered faster!
      const bonus = timeLeft * 5;
      const pts = 50 + bonus;
      setScore((s) => s + pts);
      if (onScoreEarned) onScoreEarned(pts);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
      setIsAnswered(false);
      sound.playClick();
    } else {
      setIsGameOver(true);
      sound.playVictory();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    sound.playClick();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Zap size={14} /> Game Kuis Kilat
          </span>
          <h3 className="text-lg md:text-xl font-bold">Uji Refleks Pengetahuan Pancasila</h3>
        </div>

        {/* Filter Difficulty */}
        <div className="flex items-center gap-2">
          {(['Semua', 'Mudah', 'Sedang', 'Sulit'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setCurrentIndex(0);
                setTimeLeft(15);
                setIsAnswered(false);
                setSelectedAnswer(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {!isGameOver ? (
        <div className="max-w-xl mx-auto">
          {/* Progress and Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium">
              Soal {currentIndex + 1} dari {filteredQuestions.length}
            </span>

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                timeLeft <= 5
                  ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
              }`}
            >
              <Timer size={14} />
              <span>{timeLeft} detik</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Trophy size={14} />
              <span>{score} Poin</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5 shadow-inner">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 mb-3">
              Tingkat: {currentQ.difficulty}
            </div>
            <h4 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOption = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';
              if (isAnswered) {
                if (isCorrectOption) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && isCorrectOption && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation when answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4 animate-fade-in">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                💡 Pembahasan Soal:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              <button
                onClick={handleNext}
                className="mt-3 w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm transition-all"
              >
                {currentIndex < filteredQuestions.length - 1 ? 'Soal Berikutnya ⏩' : 'Lihat Hasil Akhir 🏆'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results screen */
        <div className="text-center py-8 max-w-md mx-auto">
          <div className="text-5xl mb-3">⚡</div>
          <h3 className="text-2xl font-bold text-amber-300 mb-2">Kuis Kilat Selesai!</h3>
          <p className="text-slate-300 text-sm mb-6">
            Refleks dan pemahaman konsep kebangsaanmu luar biasa!
          </p>
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total Skor Diperoleh</span>
            <div className="text-4xl font-extrabold text-amber-400 my-1">{score}</div>
            <span className="text-xs text-emerald-400 font-semibold">Tersimpan ke Profil Belajar</span>
          </div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            <RotateCcw size={16} /> Mainkan Lagi
          </button>
        </div>
      )}
    </div>
  );
};
