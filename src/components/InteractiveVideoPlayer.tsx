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
  Award,
  Layers,
  Film,
  Subtitles,
  Volume,
  ExternalLink,
  ChevronRight,
  Flame,
  Radio,
  Share2
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
  // Player state
  const [activeMode, setActiveMode] = useState<'animation' | 'youtube'>('animation');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(material.video.durationSec || 180);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Default fallback scenes if not specified
  const scenes = material.video.scenes && material.video.scenes.length > 0
    ? material.video.scenes
    : [
        {
          time: 0,
          timestamp: '00:00',
          title: `Pengenalan Materi: ${material.title}`,
          speaker: 'Munawar Rois, S.Pd. (Guru Pengampu)',
          narration: `Selamat datang di video pembelajaran Pendidikan Pancasila SMA Negeri 1 Mande. Bab ini membahas ${material.title}. Perhatikan konsep penting dan amalkan dalam kehidupan sehari-hari.`,
          badge: 'Fase Pembuka',
          highlightWords: ['Pendidikan Pancasila', 'SMANDE', 'Nilai Karakter'],
        },
        {
          time: 35,
          timestamp: '00:35',
          title: 'Konsep Kunci & Dasar Filosofis',
          speaker: 'Bung Karno & Pendiri Bangsa',
          narration: material.summary,
          badge: 'Konsep Utama',
          highlightWords: ['Filsafat Bangsa', 'Konsensus Nasional', 'Persatuan'],
        },
        {
          time: 90,
          timestamp: '01:30',
          title: 'Analisis Kasus & Penerapan Keseharian',
          speaker: 'Munawar Rois, S.Pd.',
          narration: `${material.caseStudy.title}. ${material.caseStudy.context} Pelajar SMANDE harus memegang teguh: ${material.caseStudy.moralGuidance}`,
          badge: 'Studi Kasus',
          highlightWords: ['Gotong Royong', 'Integritas', 'Aksi Nyata'],
        },
        {
          time: 145,
          timestamp: '02:25',
          title: 'Refleksi Akhir & Evaluasi HOTS',
          speaker: 'Garuda Pancasila',
          narration: 'Mari merefleksikan pemahaman Anda. Selesaikan LKPD digital dan uji kecakapan Anda di kuis penilaian otomatis berhadiah lencana dan poin keaktifan!',
          badge: 'Refleksi',
          highlightWords: ['Kuis Interaktif', 'Lencana Profil', 'Evaluasi'],
        },
      ];

  // Update duration based on scenes
  useEffect(() => {
    const totalSec = material.video.durationSec || 180;
    setDuration(totalSec);
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
      // Speech synthesis fallback graceful ignore
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
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  // Determine YouTube ID or fallback embed URL
  const ytId = material.video.youtubeId || 'vF3E83Z6F0o';
  const ytEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-sky-400/30 flex flex-col transition-all ${
        compact ? 'max-w-3xl mx-auto' : 'w-full'
      }`}
    >
      {/* Top Bar Header with Badges & Mode Switcher */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 px-4 py-3 border-b border-sky-600/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Film size={18} className="animate-spin" style={{ animationDuration: isPlaying ? '4s' : '0s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500 text-sky-950 px-2 py-0.5 rounded-full">
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

        {/* Tab Switcher: Animasi SMANDE vs YouTube */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-sky-500/30 text-xs">
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
            <span>Animasi Interaktif</span>
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
            <span>YouTube Resmi</span>
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
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {activeMode === 'animation' ? (
          <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-6 overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950/70 to-slate-950">
            {/* Animated Background Motion Elements ("Berputar" & Visual Depth) */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {/* Rotating Film Reels */}
              <div
                className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-4 border-dashed border-sky-400/40 animate-spin"
                style={{ animationDuration: isPlaying ? `${8 / playbackSpeed}s` : '0s' }}
              />
              <div
                className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-4 border-dashed border-sky-300/30 animate-spin"
                style={{
                  animationDuration: isPlaying ? `${12 / playbackSpeed}s` : '0s',
                  animationDirection: 'reverse',
                }}
              />
              {/* Center Spinning Mandala Wheel */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-sky-500/20 animate-spin"
                style={{ animationDuration: isPlaying ? `${20 / playbackSpeed}s` : '0s' }}
              />
            </div>

            {/* Top Scene Pill & Speaker Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-sky-500/20 border border-sky-400/40 text-sky-300 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {currentScene.badge}
                </span>
                <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
                  Adegan {activeSceneIndex + 1} dari {scenes.length}
                </span>
              </div>

              {/* Loop & Film Status Badge */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    isLooping
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                  title={isLooping ? 'Putar Terus Aktif (Auto Loop)' : 'Putar Sekali'}
                >
                  <RotateCcw size={12} className={isPlaying && isLooping ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
                  <span>{isLooping ? 'Putar Berulang 🔄' : 'Sekali'}</span>
                </button>

                <button
                  onClick={toggleVoiceNarration}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    voiceNarrationEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                  title="Bacakan narasi dengan suara Guru / AI Tutor"
                >
                  <Volume size={12} />
                  <span>{voiceNarrationEnabled ? 'Suara Aktif' : 'Suara Guru'}</span>
                </button>
              </div>
            </div>

            {/* Center Dynamic Animated Graphics Showcase */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-2">
              {/* Left: Animated Character / Emblem Stage */}
              <div className="relative flex flex-col items-center">
                {/* Glowing Aura Ring */}
                <div
                  className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center p-2 relative transition-all duration-700 ${
                    isPlaying
                      ? 'bg-gradient-to-tr from-sky-600/40 via-blue-500/20 to-sky-300/40 shadow-2xl shadow-sky-500/30 border border-sky-400/60'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {/* Rotating decorative ticks */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-dotted border-sky-400/30 animate-spin"
                    style={{ animationDuration: isPlaying ? '10s' : '0s' }}
                  />

                  {/* Character / Teacher Avatar / Garuda Emblem */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-sky-900 to-slate-950 flex flex-col items-center justify-center p-2 text-center relative">
                    <img
                      src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
                      alt="Logo Pendidikan Pancasila"
                      className={`w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md transition-transform duration-500 ${
                        isPlaying ? 'scale-105 animate-pulse' : 'scale-95 opacity-80'
                      }`}
                    />
                  </div>

                  {/* Audio Wave Bars when playing */}
                  {isPlaying && (
                    <div className="absolute -bottom-3 flex items-end gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-sky-400/50">
                      <span className="w-1 bg-sky-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 bg-sky-300 rounded-full animate-bounce h-5" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                      <span className="w-1 bg-sky-400 rounded-full animate-bounce h-2" style={{ animationDelay: '75ms' }} />
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[11px] font-bold text-sky-300 block">
                    {currentScene.speaker}
                  </span>
                  <span className="text-[10px] text-slate-400">Pendidikan Pancasila SMANDE</span>
                </div>
              </div>

              {/* Right: Interactive Scene Board */}
              <div className="flex-1 max-w-xl bg-slate-900/90 backdrop-blur-md border border-sky-500/30 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-sky-400 font-bold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={13} />
                      {currentScene.title}
                    </span>
                    <span className="font-mono text-slate-400">{currentScene.timestamp}</span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed mb-3 min-h-[60px]">
                    "{currentScene.narration}"
                  </p>
                </div>

                {/* Keyword Highlights Pills */}
                {currentScene.highlightWords && currentScene.highlightWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Fokus:</span>
                    {currentScene.highlightWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="text-[10px] font-bold px-2 py-0.5 bg-sky-500/20 text-sky-200 border border-sky-400/30 rounded-md"
                      >
                        #{word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Subtitles Box (if enabled) */}
            {showSubtitles && (
              <div className="relative z-10 mx-auto max-w-2xl bg-black/85 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-lg backdrop-blur-md">
                <span className="text-xs md:text-sm font-bold text-amber-300 drop-shadow">
                  {currentScene.narration}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Mode 2: YouTube Streaming Embed */
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
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-300 border border-slate-950 z-20 cursor-pointer hover:scale-150 transition-transform"
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
          Pintasan Bab:
        </span>
        {scenes.map((scene, idx) => (
          <button
            key={idx}
            onClick={() => jumpToScene(idx)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSceneIndex === idx
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span className="text-[10px] opacity-75 font-mono">{scene.timestamp}</span>
            <span>{scene.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
