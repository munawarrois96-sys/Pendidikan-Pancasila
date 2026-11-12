import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Film,
  Subtitles,
  Volume,
  ExternalLink,
  ChevronRight,
  Radio,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { MaterialSection } from '../types';

interface InteractiveVideoPlayerProps {
  material: MaterialSection;
  onTakeQuiz?: (quizId: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  material,
  onTakeQuiz,
  onClose,
  compact = false,
}) => {
  // Player state: animation, youtube, or dual (side-by-side companion)
  const [activeMode, setActiveMode] = useState<'animation' | 'youtube' | 'dual'>('animation');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(material.video.durationSec || 180);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isYouTubeStarted, setIsYouTubeStarted] = useState<boolean>(false);
  const [selectedOfficialSource, setSelectedOfficialSource] = useState<'kemdikbud' | 'bpip' | 'tvedukasi'>('kemdikbud');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Scenes list from material or default
  const scenes = material.video.scenes && material.video.scenes.length > 0
    ? material.video.scenes
    : [
        {
          time: 0,
          timestamp: '00:00',
          title: `Pengenalan Materi: ${material.title}`,
          speaker: 'Munawar Rois, S.Pd. (Guru Pengampu)',
          narration: `Selamat datang di video pembelajaran Pendidikan Pancasila SMA Negeri 1 Mande. Bab ini membahas ${material.title}.`,
          badge: 'Fase Pembuka',
          image: material.video.thumbnail,
          highlightWords: ['Pendidikan Pancasila', 'SMANDE', 'Nilai Karakter'],
        },
        {
          time: 45,
          timestamp: '00:45',
          title: 'Konsep Kunci & Dasar Filosofis',
          speaker: 'Pendiri Bangsa',
          narration: material.summary,
          badge: 'Konsep Utama',
          image: material.video.thumbnail,
          highlightWords: ['Filsafat Bangsa', 'Konsensus Nasional', 'Persatuan'],
        },
        {
          time: 100,
          timestamp: '01:40',
          title: 'Analisis Kasus & Penerapan Keseharian',
          speaker: 'Munawar Rois, S.Pd.',
          narration: `${material.caseStudy.title}. ${material.caseStudy.moralGuidance}`,
          badge: 'Studi Kasus',
          image: material.video.thumbnail,
          highlightWords: ['Gotong Royong', 'Integritas', 'Aksi Nyata'],
        },
      ];

  // Update duration based on material
  useEffect(() => {
    const totalSec = material.video.durationSec || 180;
    setDuration(totalSec);
    setCurrentTime(0);
    setActiveSceneIndex(0);
    setIsYouTubeStarted(false);
  }, [material]);

  // Handle Play/Pause timer loop
  useEffect(() => {
    if (activeMode !== 'animation') return;

    if (isPlaying) {
      const intervalMs = 100 / playbackSpeed;
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= duration) {
            if (isLooping) {
              return 0; // loop back to start
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return next;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, duration, isLooping, activeMode]);

  // Determine current scene
  useEffect(() => {
    let currentIdx = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (currentTime >= scenes[i].time) {
        currentIdx = i;
      }
    }
    if (currentIdx !== activeSceneIndex) {
      setActiveSceneIndex(currentIdx);
      if (voiceNarrationEnabled && 'speechSynthesis' in window) {
        speakNarration(scenes[currentIdx].narration);
      }
    }
  }, [currentTime, scenes, activeSceneIndex, voiceNarrationEnabled]);

  // Web Speech API for teacher narration
  const speakNarration = (text: string) => {
    if (!('speechSynthesis' in window) || isMuted) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = playbackSpeed * 0.95;
      utterance.volume = volume;
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback
    }
  };

  const toggleVoiceNarration = () => {
    const nextState = !voiceNarrationEnabled;
    setVoiceNarrationEnabled(nextState);
    if (nextState) {
      speakNarration(scenes[activeSceneIndex].narration);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const jumpToScene = (index: number) => {
    const targetScene = scenes[index];
    if (targetScene) {
      setCurrentTime(targetScene.time);
      setActiveSceneIndex(index);
      if (voiceNarrationEnabled) {
        speakNarration(targetScene.narration);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const activeImage = currentScene.image || material.video.thumbnail;

  // Reliable YouTube ID (BPIP RI / Kemendikbud)
  const ytId = material.video.youtubeId || 'zi6ewCmcTfg';
  const ytEmbedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
  const ytWatchUrl = `https://www.youtube.com/watch?v=${ytId}`;

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-400/40 flex flex-col transition-all ${
        compact ? 'max-w-3xl mx-auto' : 'w-full'
      }`}
    >
      {/* Top Bar Header with Badges & Mode Switcher */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 px-4 py-3 border-b border-sky-600/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Film size={18} className="animate-spin" style={{ animationDuration: isPlaying ? '3s' : '0s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400 text-sky-950 px-2 py-0.5 rounded-full">
                Kelas {material.grade} • Bab {material.chapterNumber}
              </span>
              <span className="text-[10px] font-semibold text-sky-200">
                SMA Negeri 1 Mande (SMANDE)
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-extrabold text-white truncate max-w-md">
              {material.video.title}
            </h3>
          </div>
        </div>

        {/* Tab Switcher: Animasi SMANDE vs YouTube vs Berdampingan */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-sky-500/30 text-xs">
          <button
            onClick={() => {
              setActiveMode('animation');
              setIsPlaying(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMode === 'animation'
                ? 'bg-sky-500 text-sky-950 shadow-md'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Animasi SMANDE</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('youtube');
              setIsPlaying(false);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMode === 'youtube'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            <Play size={13} />
            <span>YouTube Resmi HD</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('dual');
              setIsPlaying(true);
              setIsYouTubeStarted(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMode === 'dual'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-amber-200 hover:text-white'
            }`}
            title="Tonton Animasi SMANDE dan Video Resmi YouTube secara bersamaan berdampingan"
          >
            <Film size={13} />
            <span>⚖️ Berdampingan</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white px-2 py-1 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className={`relative w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none ${
        activeMode === 'dual' ? 'min-h-[460px]' : 'aspect-video'
      }`}>
        {activeMode === 'dual' ? (
          /* ================= MODE 3: MODE BERDAMPINGAN (DUAL COMPANION) ================= */
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full min-h-[460px] divide-y lg:divide-y-0 lg:divide-x divide-sky-700/50">
            {/* Sisi Kiri: Animasi Interaktif SMANDE */}
            <div className="relative aspect-video lg:aspect-auto w-full flex flex-col justify-between overflow-hidden bg-slate-900 p-4">
              <img
                src={activeImage}
                alt={currentScene.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-sky-500 text-sky-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Sparkles size={11} /> Animasi SMANDE
                </span>
                <span className="text-xs text-amber-300 font-extrabold bg-black/60 px-2 py-0.5 rounded-lg border border-amber-400/40">
                  {currentScene.badge}
                </span>
              </div>

              <div className="relative z-10 my-auto p-4 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-sky-400/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-amber-300">
                  <span>{currentScene.speaker}</span>
                  <span className="font-mono text-sky-300">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                  "{currentScene.narration}"
                </p>
                {currentScene.highlightWords && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentScene.highlightWords.map((w, idx) => (
                      <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-500/20 text-sky-200 rounded border border-sky-400/30">
                        #{w}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Adegan {activeSceneIndex + 1} dari {scenes.length}</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? 'Jeda' : 'Lanjut'}</span>
                </button>
              </div>
            </div>

            {/* Sisi Kanan: Video Resmi YouTube Kemendikbud & BPIP */}
            <div className="relative aspect-video lg:aspect-auto w-full bg-black flex flex-col">
              <div className="bg-red-950/90 border-b border-red-800/40 px-3 py-1.5 flex items-center justify-between text-xs font-bold text-white z-10">
                <span className="flex items-center gap-1.5 text-red-200">
                  <Play size={12} className="fill-red-400 text-red-400" />
                  <span>Siaran Resmi YouTube (Kemendikbudristek & BPIP)</span>
                </span>
                <a
                  href={ytWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-sky-300 hover:text-white flex items-center gap-1"
                >
                  <span>Buka YouTube</span>
                  <ExternalLink size={10} />
                </a>
              </div>
              <div className="flex-1 w-full relative min-h-[240px]">
                <iframe
                  src={ytEmbedUrl}
                  title={material.video.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : activeMode === 'animation' ? (
          /* ================= MODE 1: ANIMASI INTERAKTIF DENGAN GAMBAR JELAS & BERPUTAR ================= */
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Background Educational Picture with Dynamic Zoom / Ken Burns Animation */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeImage}
                alt={currentScene.title}
                key={activeSceneIndex}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Gradient Scrims for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
              <div className="absolute inset-0 bg-sky-950/30 mix-blend-multiply" />
            </div>

            {/* Rotating Film Reels ("Berputar" di pojok atas & bawah) */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
              <div
                className="absolute top-3 left-3 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-dashed border-amber-300 animate-spin"
                style={{ animationDuration: isPlaying ? `${6 / playbackSpeed}s` : '0s' }}
              />
              <div
                className="absolute top-3 right-3 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-dashed border-sky-300 animate-spin"
                style={{
                  animationDuration: isPlaying ? `${6 / playbackSpeed}s` : '0s',
                  animationDirection: 'reverse',
                }}
              />
            </div>

            {/* Top Scene Pill & Speaker Badge */}
            <div className="relative z-20 p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-sky-950/80 border border-sky-400/50 text-sky-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentScene.badge}
                </span>
                <span className="text-xs text-white font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20 hidden sm:inline-block">
                  Adegan {activeSceneIndex + 1} dari {scenes.length}
                </span>
              </div>

              {/* Loop & Film Status Badge */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md backdrop-blur-md ${
                    isLooping
                      ? 'bg-sky-600/90 text-white border-sky-400'
                      : 'bg-black/60 text-slate-300 border-slate-700'
                  }`}
                  title={isLooping ? 'Putar Berulang Aktif' : 'Putar Sekali'}
                >
                  <RotateCcw size={13} className={isPlaying && isLooping ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
                  <span>{isLooping ? 'Putar Terus 🔄' : 'Sekali'}</span>
                </button>

                <button
                  onClick={toggleVoiceNarration}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md backdrop-blur-md ${
                    voiceNarrationEnabled
                      ? 'bg-emerald-600/90 text-white border-emerald-400'
                      : 'bg-black/60 text-slate-300 border-slate-700'
                  }`}
                  title="Bacakan narasi dengan suara Guru / AI Tutor"
                >
                  <Volume size={13} />
                  <span>{voiceNarrationEnabled ? 'Suara Guru Aktif' : 'Bunyikan Suara'}</span>
                </button>
              </div>
            </div>

            {/* Center Dynamic Picture & Narration Showcase */}
            <div className="relative z-20 px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-5 my-auto">
              {/* Left: Speaker / Emblem Card */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl p-1 relative transition-all duration-700 shadow-2xl ${
                    isPlaying
                      ? 'bg-gradient-to-tr from-sky-400 via-amber-300 to-sky-500 ring-4 ring-sky-400/40'
                      : 'bg-slate-800 ring-2 ring-slate-700'
                  }`}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white p-1.5 flex flex-col items-center justify-center">
                    <img
                      src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
                      alt="Logo Pendidikan Pancasila SMANDE"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Audio visualizer bounce when playing */}
                  {isPlaying && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-end gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-sky-400">
                      <span className="w-1 bg-sky-400 rounded-full animate-bounce h-3" />
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 bg-sky-300 rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>

                <span className="mt-3 text-xs font-black text-amber-300 drop-shadow-md">
                  {currentScene.speaker}
                </span>
                <span className="text-[10px] text-sky-200">SMA Negeri 1 Mande</span>
              </div>

              {/* Right: Glassmorphism Narration & Concept Card */}
              <div className="max-w-xl w-full bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-sky-300 font-extrabold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-amber-400" />
                    {currentScene.title}
                  </span>
                  <span className="font-mono bg-sky-900/60 px-2 py-0.5 rounded text-sky-200 border border-sky-600/40">
                    {currentScene.timestamp}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-white font-medium leading-relaxed mb-3 drop-shadow-sm min-h-[50px]">
                  "{currentScene.narration}"
                </p>

                {/* Keyword Highlights */}
                {currentScene.highlightWords && currentScene.highlightWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-slate-300 font-semibold mr-1">Kata Kunci:</span>
                    {currentScene.highlightWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="text-[10px] font-bold px-2 py-0.5 bg-sky-500/30 text-sky-200 border border-sky-400/40 rounded-md"
                      >
                        #{word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Subtitles Box */}
            {showSubtitles && (
              <div className="relative z-20 mx-4 md:mx-auto max-w-2xl mb-4 bg-slate-950/90 border border-amber-400/50 px-4 py-2 rounded-xl text-center shadow-2xl backdrop-blur-md">
                <span className="text-xs md:text-sm font-extrabold text-amber-300 drop-shadow">
                  {currentScene.narration}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ================= MODE 2: YOUTUBE RESMI DENGAN GAMBAR & SUARA ================= */
          <div className="w-full h-full relative bg-slate-950 flex flex-col justify-center items-center">
            {!isYouTubeStarted ? (
              /* Interactive Pre-Play Cover (Guarantees crisp image & unmuted sound on click) */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <img
                  src={material.video.thumbnail}
                  alt={material.video.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />

                <div className="relative z-10 max-w-lg space-y-4">
                  <div className="inline-flex items-center gap-2 bg-red-600/90 text-white px-3.5 py-1 rounded-full text-xs font-black shadow-lg">
                    <Play size={14} className="fill-white" />
                    <span>Video Resmi YouTube Kemendikbud & BPIP RI</span>
                  </div>

                  <h3 className="text-base md:text-xl font-black text-white leading-tight">
                    {material.video.title}
                  </h3>

                  <p className="text-xs text-slate-200 max-w-md mx-auto">
                    Klik tombol di bawah untuk memutar video dengan gambar jernih HD dan suara penuh tanpa terblokir.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsYouTubeStarted(true)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/50 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play size={20} className="fill-white" />
                      <span>Putar Video Sekarang (Suara & Gambar HD)</span>
                    </button>

                    <a
                      href={ytWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-sky-200 font-bold text-xs rounded-2xl border border-sky-400/40 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={14} />
                      <span>Buka di YouTube</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Active YouTube Iframe */
              <div className="w-full h-full relative">
                <iframe
                  src={ytEmbedUrl}
                  title={material.video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode YouTube Info Strip (Sound helper) */}
      {activeMode === 'youtube' && (
        <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <Volume2 size={15} className="text-amber-400 shrink-0" />
            <span>
              <b>Tips Audio:</b> Jika suara tertahan oleh peramban, klik ikon speaker pada pemutar video YouTube untuk membunyikannya.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={ytWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky-300 hover:text-white flex items-center gap-1"
            >
              <span>Tonton Langsung di YouTube</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Video Control Bar (when in animation mode) */}
      {activeMode === 'animation' && (
        <div className="bg-slate-900 border-t border-sky-800/40 p-3 md:p-4 space-y-2">
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-sky-300 min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative group flex items-center">
              {/* Visual Scene Markers */}
              {scenes.map((s, idx) => {
                const markLeft = (s.time / duration) * 100;
                return (
                  <div
                    key={idx}
                    onClick={() => jumpToScene(idx)}
                    style={{ left: `${markLeft}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 z-20 cursor-pointer hover:scale-150 transition-transform"
                    title={`${s.timestamp} - ${s.title}`}
                  />
                );
              })}
              <input
                type="range"
                min={0}
                max={duration}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 group-hover:h-2.5 transition-all"
              />
            </div>
            <span className="text-xs font-mono text-slate-400 min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Buttons & Secondary Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTime((t) => Math.max(0, t - 5))}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Mundur 5 Detik"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => {
                  const nextPlay = !isPlaying;
                  setIsPlaying(nextPlay);
                  if (!nextPlay && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  } else if (nextPlay && voiceNarrationEnabled) {
                    speakNarration(scenes[activeSceneIndex].narration);
                  }
                }}
                className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-sky-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime((t) => Math.min(duration, t + 5))}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Maju 5 Detik"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                  if (voiceNarrationEnabled) speakNarration(scenes[0].narration);
                }}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Putar dari Awal"
              >
                <RotateCcw size={16} />
              </button>

              {/* Volume / Mute */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-300 hover:text-white"
                >
                  {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 hidden sm:inline-block"
                />
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-slate-800 text-sky-200 border border-sky-700/50 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x (Normal)</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>

              {/* Subtitles Toggle */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                  showSubtitles
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Teks Terjemahan / Subtitle"
              >
                <Subtitles size={16} />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Layar Penuh"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Quiz Shortcut Button */}
              {onTakeQuiz && (
                <button
                  onClick={() => onTakeQuiz(material.relatedQuizId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
                >
                  <Sparkles size={13} />
                  <span>Kuis Bab Ini</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapters / Scenes Selector Strip */}
      <div className="bg-slate-950 border-t border-slate-900 px-4 py-2.5 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
          Pintasan Adegan:
        </span>
        {scenes.map((scene, idx) => (
          <button
            key={idx}
            onClick={() => jumpToScene(idx)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSceneIndex === idx
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-400/50'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">{scene.timestamp}</span>
            <span>{scene.title}</span>
          </button>
        ))}
      </div>

      {/* ================= OFFICIAL YOUTUBE VIDEO COMPANION PANEL (PENYERTA RESMI) ================= */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border-t border-sky-500/30 p-4 md:p-6 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Play size={18} className="fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-600/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Saluran Resmi Kemendikbudristek & BPIP RI
                </span>
                <span className="text-[11px] font-semibold text-emerald-300 hidden sm:inline-block">
                  ● Sumber Pembelajaran Terverifikasi
                </span>
              </div>
              <h4 className="text-sm md:text-base font-black text-white mt-0.5">
                Penyerta Video Pembelajaran Resmi YouTube (Kemendikbudristek & BPIP RI)
              </h4>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveMode('youtube');
                setIsYouTubeStarted(true);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Play size={14} className="fill-white" />
              <span>Tonton YouTube HD</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('dual');
                setIsYouTubeStarted(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Film size={14} />
              <span>Berdampingan</span>
            </button>
            <a
              href={ytWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-200 font-bold text-xs rounded-xl border border-sky-400/30 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={14} />
              <span>Buka YouTube</span>
            </a>
          </div>
        </div>

        {/* Companion Video Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 border border-sky-500/20 rounded-2xl p-4">
          {/* Thumbnail & Quick Play */}
          <div
            onClick={() => {
              setActiveMode('youtube');
              setIsYouTubeStarted(true);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-sky-400/30 shadow-md"
          >
            <img
              src={material.video.thumbnail}
              alt={material.video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={18} className="fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] font-mono text-white px-1.5 py-0.5 rounded">
              {material.video.duration || '08:24'}
            </span>
          </div>

          {/* Video Summary & Alignment */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md">
                  Materi: Kelas {material.grade} • Bab {material.chapterNumber}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Sumber: Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI
                </span>
              </div>
              <h5 className="text-sm font-extrabold text-white leading-snug mb-1">
                {material.video.title}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {material.video.summary}
              </p>
            </div>

            <div className="pt-2 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-sky-200 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400">Penyerta Saluran Resmi:</span>
                <span className="px-2 py-0.5 bg-sky-900/60 rounded text-[10px] font-bold border border-sky-600/40 text-sky-200">
                  TV Edukasi
                </span>
                <span className="px-2 py-0.5 bg-red-950/60 text-red-200 rounded text-[10px] font-bold border border-red-600/40">
                  BPIP RI
                </span>
                <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-200 rounded text-[10px] font-bold border border-emerald-600/40">
                  Rumah Belajar
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Disinkronisasi oleh Guru Pengampu: Munawar Rois, S.Pd.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
