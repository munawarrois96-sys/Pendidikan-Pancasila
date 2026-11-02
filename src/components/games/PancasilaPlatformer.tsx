import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../utils/audio';
import { Heart, Trophy, Zap, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface LevelConfig {
  id: number;
  name: string;
  theme: string;
  bgGradient: [string, string];
  checkpointQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  obstacleName: string;
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Level 1: Sejarah Perumusan Pancasila',
    theme: 'Lembah Perjuangan BPUPKI',
    bgGradient: ['#1e293b', '#0f172a'],
    obstacleName: 'Rintangan Putus Asa',
    checkpointQuestion: {
      question: 'Kapan Ir. Soekarno pertama kali menyampaikan gagasan dasar negara dengan nama Pancasila?',
      options: ['29 Mei 1945', '1 Juni 1945', '22 Juni 1945', '17 Agustus 1945'],
      correctIndex: 1,
      explanation: 'Tepat sekali! Tanggal 1 Juni 1945 merupakan momentum bersejarah Hari Lahir Pancasila.',
    },
  },
  {
    id: 2,
    name: 'Level 2: Kedudukan dan Fungsi Pancasila',
    theme: 'Kota Konsensus Nasional',
    bgGradient: ['#1e1b4b', '#311042'],
    obstacleName: 'Jebakan Radikalisme',
    checkpointQuestion: {
      question: 'Pancasila berfungsi sebagai "Philosophische Grondslag", yang artinya adalah...',
      options: [
        'Pedoman upacara bendera mingguan',
        'Dasar filsafat dan pandangan hidup bangsa',
        'Kumpulan peraturan lalu lintas',
        'Sistem anggaran belanja negara',
      ],
      correctIndex: 1,
      explanation: 'Benar! Philosophische Grondslag berarti fundamen filosofis dasar berdirinya negara Indonesia.',
    },
  },
  {
    id: 3,
    name: 'Level 3: Penerapan Nilai Pancasila',
    theme: 'Hutan Keberagaman Nusantara',
    bgGradient: ['#064e3b', '#022c22'],
    obstacleName: 'Monster Intoleransi',
    checkpointQuestion: {
      question: 'Membantu teman tanpa membedakan asal suku, agama, dan latar belakang merupakan cerminan sila...',
      options: ['Sila Pertama', 'Sila Kedua & Ketiga', 'Sila Keempat saja', 'Hanya aturan sekolah'],
      correctIndex: 1,
      explanation: 'Hebat! Sila ke-2 mengajarkan kemanusiaan yang beradab dan Sila ke-3 menjunjung persatuan Indonesia.',
    },
  },
  {
    id: 4,
    name: 'Level 4: UUD NRI Tahun 1945',
    theme: 'Kuil Hukum & Konstitusi',
    bgGradient: ['#3b0764', '#1e1b4b'],
    obstacleName: 'Rintangan Pelanggaran Aturan',
    checkpointQuestion: {
      question: 'Tata urutan peraturan perundang-undangan tertinggi di Republik Indonesia adalah...',
      options: ['Peraturan Presiden', 'Peraturan Daerah', 'UUD NRI Tahun 1945', 'Ketetapan Camat'],
      correctIndex: 2,
      explanation: 'Sempurna! UUD NRI 1945 adalah hukum dasar tertulis tertinggi di Indonesia (UU No. 12/2011).',
    },
  },
  {
    id: 5,
    name: 'Level 5: Demokrasi & Hak Asasi Manusia',
    theme: 'Puncak Garuda Kejayaan Indonesia',
    bgGradient: ['#7c2d12', '#451a03'],
    obstacleName: 'Kabut Hoaks & Korupsi',
    checkpointQuestion: {
      question: 'Asas utama pengambilan keputusan dalam Demokrasi Pancasila adalah...',
      options: [
        'Musyawarah untuk mufakat',
        'Voting sepihak oleh penguasa',
        'Menuruti siapa yang paling kaya',
        'Mengabaikan pendapat orang lain',
      ],
      correctIndex: 0,
      explanation: 'Puncak keberhasilan! Sila ke-4 menegaskan kepemimpinan hikmat kebijaksanaan dalam permusyawaratan.',
    },
  },
];

export const PancasilaPlatformer: React.FC<{ onCompleteScore?: (score: number) => void }> = ({ onCompleteScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'checkpoint' | 'gameover' | 'levelwin' | 'gamewin'>('start');
  const [activeQuestion, setActiveQuestion] = useState<LevelConfig['checkpointQuestion'] | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Keyboard controls state
  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean }>({
    left: false,
    right: false,
    up: false,
  });

  const level = LEVELS[currentLevelIdx];

  // Game internal state ref to keep animation loop fast
  const gameRef = useRef({
    player: {
      x: 50,
      y: 220,
      width: 28,
      height: 38,
      vx: 0,
      vy: 0,
      isGrounded: false,
      color: '#EF4444',
    },
    cameraX: 0,
    coins: [] as { x: number; y: number; collected: boolean }[],
    obstacles: [] as { x: number; y: number; width: number; height: number; vx: number }[],
    platforms: [] as { x: number; y: number; width: number; height: number }[],
    checkpointX: 1300,
    flagX: 1450,
    checkpointPassed: false,
    animationId: 0,
  });

  // Setup level elements
  const initLevel = (levelIndex: number) => {
    const g = gameRef.current;
    g.player.x = 50;
    g.player.y = 220;
    g.player.vx = 0;
    g.player.vy = 0;
    g.cameraX = 0;
    g.checkpointPassed = false;
    setQuestionFeedback(null);

    // Platforms
    g.platforms = [
      { x: 0, y: 280, width: 450, height: 60 },
      { x: 490, y: 250, width: 140, height: 20 },
      { x: 670, y: 210, width: 130, height: 20 },
      { x: 840, y: 260, width: 160, height: 20 },
      { x: 1040, y: 220, width: 140, height: 20 },
      { x: 1220, y: 280, width: 350, height: 60 },
    ];

    // Star coins
    g.coins = [
      { x: 140, y: 230, collected: false },
      { x: 260, y: 230, collected: false },
      { x: 530, y: 200, collected: false },
      { x: 710, y: 160, collected: false },
      { x: 890, y: 210, collected: false },
      { x: 1090, y: 170, collected: false },
      { x: 1320, y: 230, collected: false },
      { x: 1400, y: 230, collected: false },
    ];

    // Obstacles
    g.obstacles = [
      { x: 300, y: 250, width: 24, height: 28, vx: -1 },
      { x: 870, y: 230, width: 24, height: 28, vx: 1 },
      { x: 1260, y: 250, width: 24, height: 28, vx: -1.2 },
    ];
  };

  const handleStartGame = () => {
    setLives(3);
    setScore(0);
    setCurrentLevelIdx(0);
    initLevel(0);
    setGameState('playing');
    sound.playClick();
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      initLevel(nextIdx);
      setGameState('playing');
      sound.playClick();
    } else {
      setGameState('gamewin');
      sound.playVictory();
      if (onCompleteScore) {
        onCompleteScore(score + 100);
      }
    }
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        if (!keysRef.current.up && gameRef.current.player.isGrounded && gameState === 'playing') {
          keysRef.current.up = true;
          sound.playJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        keysRef.current.up = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const updateAndDraw = () => {
      if (!isRunning) return;

      const g = gameRef.current;
      const player = g.player;

      // Horizontal movement
      const speed = 4;
      if (keysRef.current.left) {
        player.vx = -speed;
      } else if (keysRef.current.right) {
        player.vx = speed;
      } else {
        player.vx = 0;
      }

      // Jump
      if (keysRef.current.up && player.isGrounded) {
        player.vy = -10.5;
        player.isGrounded = false;
        keysRef.current.up = false;
      }

      // Gravity
      player.vy += 0.55;
      if (player.vy > 12) player.vy = 12;

      // Apply positions
      player.x += player.vx;
      player.y += player.vy;

      // Collision with platforms
      player.isGrounded = false;
      for (const plat of g.platforms) {
        // Vertical landing check
        if (
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.width &&
          player.y + player.height >= plat.y &&
          player.y + player.height - player.vy <= plat.y + 10
        ) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          break;
        }
      }

      // Check fall into pit
      if (player.y > 380) {
        sound.playWrong();
        setLives((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setGameState('gameover');
          } else {
            // Respawn
            player.x = 50;
            player.y = 200;
            player.vx = 0;
            player.vy = 0;
          }
          return next;
        });
      }

      // Move camera
      const targetCamX = player.x - 250;
      if (targetCamX > g.cameraX) {
        g.cameraX += (targetCamX - g.cameraX) * 0.1;
      }

      // Check coin collection
      g.coins.forEach((coin) => {
        if (!coin.collected) {
          const dist = Math.hypot(player.x + player.width / 2 - coin.x, player.y + player.height / 2 - coin.y);
          if (dist < 26) {
            coin.collected = true;
            sound.playCoin();
            setScore((s) => s + 20);
          }
        }
      });

      // Update & check obstacle collision
      for (const obs of g.obstacles) {
        obs.x += obs.vx;
        if (obs.x < 100 || obs.x > 1400) obs.vx *= -1;

        // Player vs Obstacle bounding box
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          sound.playWrong();
          player.x = Math.max(50, player.x - 60);
          player.y -= 10;
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
            }
            return nextL;
          });
          break;
        }
      }

      // Checkpoint trigger
      if (!g.checkpointPassed && player.x >= g.checkpointX) {
        g.checkpointPassed = true;
        setActiveQuestion(level.checkpointQuestion);
        setGameState('checkpoint');
        return;
      }

      // Goal flag trigger
      if (g.checkpointPassed && player.x >= g.flagX) {
        sound.playVictory();
        setScore((s) => s + 50);
        setGameState('levelwin');
        return;
      }

      // ================= DRAWING =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, level.bgGradient[0]);
      bg.addColorStop(1, level.bgGradient[1]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-g.cameraX, 0);

      // Distant clouds/hills
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(300, 100, 60, 0, Math.PI * 2);
      ctx.arc(350, 90, 80, 0, Math.PI * 2);
      ctx.arc(700, 120, 90, 0, Math.PI * 2);
      ctx.arc(1100, 80, 100, 0, Math.PI * 2);
      ctx.fill();

      // Platforms
      g.platforms.forEach((p) => {
        // Platform top grass / gold border
        ctx.fillStyle = '#D97706';
        ctx.fillRect(p.x, p.y, p.width, 6);
        // Platform body
        ctx.fillStyle = '#334155';
        ctx.fillRect(p.x, p.y + 6, p.width, p.height - 6);
        // Pattern detail
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(p.x, p.y, p.width, p.height);
      });

      // Coins (Gold Stars)
      g.coins.forEach((c) => {
        if (!c.collected) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFBEB';
          ctx.beginPath();
          ctx.arc(c.x - 2, c.y - 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Obstacles (Social Issues - Hoaks / Intoleransi)
      g.obstacles.forEach((o) => {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.roundRect(o.x, o.y, o.width, o.height, 4);
        ctx.fill();
        // Spikes or exclamation
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('!', o.x + 8, o.y + 18);
      });

      // Checkpoint gate
      ctx.fillStyle = g.checkpointPassed ? '#10B981' : '#F59E0B';
      ctx.fillRect(g.checkpointX, 180, 12, 100);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('POS SOAL', g.checkpointX - 14, 170);

      // Finish Flag (Merah Putih)
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(g.flagX, 160, 6, 120);
      // Red top
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(g.flagX + 6, 160, 36, 15);
      // White bottom
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(g.flagX + 6, 175, 36, 15);

      // Player (Siswa Berbaju Seragam Putih Abu-Abu / Merah Putih)
      // Body
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(player.x, player.y + 12, player.width, 14);
      // Pants (Abu-abu SMA)
      ctx.fillStyle = '#64748B';
      ctx.fillRect(player.x, player.y + 26, player.width, 12);
      // Head
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y + 7, 7, 0, Math.PI * 2);
      ctx.fill();
      // Scarf/Dasi Merah
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(player.x + player.width / 2 - 2, player.y + 12, 4, 8);

      ctx.restore();

      g.animationId = requestAnimationFrame(updateAndDraw);
    };

    gameRef.current.animationId = requestAnimationFrame(updateAndDraw);

    return () => {
      isRunning = false;
      cancelAnimationFrame(gameRef.current.animationId);
    };
  }, [gameState, level]);

  const handleAnswerCheckpoint = (selectedIndex: number) => {
    if (!activeQuestion) return;
    const isCorrect = selectedIndex === activeQuestion.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 50);
      setQuestionFeedback({
        isCorrect: true,
        text: `Jawaban Tepat! (+50 Poin) ${activeQuestion.explanation}`,
      });
    } else {
      sound.playWrong();
      setLives((l) => Math.max(1, l - 1));
      setQuestionFeedback({
        isCorrect: false,
        text: `Kurang Tepat! Penjelasan: ${activeQuestion.explanation}`,
      });
    }
  };

  const handleContinueAfterCheckpoint = () => {
    setGameState('playing');
    setActiveQuestion(null);
    setQuestionFeedback(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl text-white">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">2D Platformer Edukatif</span>
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            🇮🇩 Petualangan Siswa Pancasila
            <span className="text-xs bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-normal">
              {level.theme}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-5">
          {/* Nyawa */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium mr-1">Nyawa:</span>
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                size={18}
                className={heart <= lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-600'}
              />
            ))}
          </div>

          {/* Skor */}
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 font-bold">
            <Trophy size={16} />
            <span>{score} Poin</span>
          </div>

          <button
            onClick={() => {
              initLevel(currentLevelIdx);
              setGameState('playing');
            }}
            title="Reset Posisi Level"
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          className="w-full h-[260px] md:h-[340px] block select-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 mb-3">
              <Zap className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Petualangan Siswa Pancasila</h2>
            <p className="text-sm text-slate-300 max-w-md mb-5 leading-relaxed">
              Bantu karakter siswa melompat melewati platform, mengumpulkan bintang nilai moral, menghindari rintangan permasalahan sosial, dan menjawab pos pertanyaan Pancasila di setiap level!
            </p>
            <div className="flex gap-4 mb-4 text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span>🎮 <b>A / D / Panah</b>: Bergerak</span>
              <span>⬆️ <b>W / Spasi</b>: Melompat</span>
              <span>📱 <b>Tombol Layar</b>: Siap untuk HP</span>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95"
            >
              Mulai Petualangan 🚀
            </button>
          </div>
        )}

        {/* Checkpoint Question Modal Overlay */}
        {gameState === 'checkpoint' && activeQuestion && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-5 z-30 overflow-y-auto">
            <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap size={14} /> Pos Ujian Pemahaman Pancasila
              </div>
              <h4 className="text-base md:text-lg font-semibold text-white mb-4">
                {activeQuestion.question}
              </h4>

              {!questionFeedback ? (
                <div className="space-y-2 mb-4">
                  {activeQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerCheckpoint(idx)}
                      className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-red-600/20 hover:border-red-500/50 border border-slate-700 text-sm text-slate-200 transition-all font-medium flex items-center justify-between group"
                    >
                      <span>{opt}</span>
                      <span className="text-xs text-slate-400 group-hover:text-amber-400 font-bold">Pilih</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <div
                    className={`p-4 rounded-xl mb-3 flex items-start gap-3 border ${
                      questionFeedback.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/40 border-red-500/50 text-red-200'
                    }`}
                  >
                    {questionFeedback.isCorrect ? (
                      <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={24} className="text-red-400 shrink-0" />
                    )}
                    <p className="text-xs md:text-sm leading-relaxed">{questionFeedback.text}</p>
                  </div>
                  <button
                    onClick={handleContinueAfterCheckpoint}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
                  >
                    Lanjutkan Berlari Menuju Tiang Bendera 🏃‍♂️
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Level Win Modal */}
        {gameState === 'levelwin' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-amber-300 mb-1">Level Berhasil Dituntaskan!</h3>
            <p className="text-slate-300 text-sm max-w-sm mb-4">
              Hebat! Kamu berhasil mengibarkan bendera Merah Putih di {level.name}.
            </p>
            <div className="text-xl font-bold text-white mb-6 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl">
              Skor Terkumpul: <span className="text-amber-400">{score}</span>
            </div>
            <button
              onClick={handleNextLevel}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all"
            >
              Lanjut ke Level Berikutnya ⏩
            </button>
          </div>
        )}

        {/* Game Win Modal (Completed All 5 Levels) */}
        {gameState === 'gamewin' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-5xl mb-3">🦅</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 mb-2">
              Selamat! Kamu Adalah Pelajar Pancasila Sejati!
            </h2>
            <p className="text-slate-300 text-sm max-w-md mb-4">
              Seluruh 5 tingkatan peradaban dan konstitusi telah kamu selesaikan dengan penuh integritas dan keberanian.
            </p>
            <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl mb-6 text-center max-w-xs w-full">
              <span className="text-xs uppercase text-slate-400 tracking-wider">Total Skor Akhir</span>
              <div className="text-3xl font-black text-amber-300">{score + 100}</div>
              <span className="text-xs text-emerald-400 font-semibold">Lencana Penjelajah Terbuka!</span>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Mainkan Ulang 🔄
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-4xl mb-2">💔</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Kesempatan Bermain Habis</h3>
            <p className="text-slate-300 text-sm max-w-sm mb-5">
              Jangan menyerah! Setiap kegagalan adalah pelajaran untuk kembali berjuang dengan lebih teliti.
            </p>
            <button
              onClick={() => {
                setLives(3);
                initLevel(currentLevelIdx);
                setGameState('playing');
              }}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 transition-all"
            >
              Coba Ulang Level Ini 🔄
            </button>
          </div>
        )}
      </div>

      {/* Mobile-Friendly On-Screen Virtual Controls */}
      <div className="mt-4 flex items-center justify-between md:hidden bg-slate-950/60 p-3 rounded-xl border border-slate-800 select-none">
        <div className="flex gap-2">
          <button
            onTouchStart={() => (keysRef.current.left = true)}
            onTouchEnd={() => (keysRef.current.left = false)}
            onMouseDown={() => (keysRef.current.left = true)}
            onMouseUp={() => (keysRef.current.left = false)}
            className="w-14 h-12 rounded-xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onTouchStart={() => (keysRef.current.right = true)}
            onTouchEnd={() => (keysRef.current.right = false)}
            onMouseDown={() => (keysRef.current.right = true)}
            onMouseUp={() => (keysRef.current.right = false)}
            className="w-14 h-12 rounded-xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white"
          >
            <ArrowRight size={22} />
          </button>
        </div>

        <button
          onTouchStart={() => {
            if (gameRef.current.player.isGrounded && gameState === 'playing') {
              keysRef.current.up = true;
              sound.playJump();
            }
          }}
          onMouseDown={() => {
            if (gameRef.current.player.isGrounded && gameState === 'playing') {
              keysRef.current.up = true;
              sound.playJump();
            }
          }}
          className="w-20 h-12 rounded-xl bg-red-600 active:bg-red-700 font-bold text-white flex items-center justify-center gap-1 shadow-lg shadow-red-600/30"
        >
          <ArrowUp size={20} /> Lompat
        </button>
      </div>
    </div>
  );
};
