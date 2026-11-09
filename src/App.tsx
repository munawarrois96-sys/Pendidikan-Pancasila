import React, { useState } from 'react';
import { materialsData } from './data/materialsData';
import { questionsBank } from './data/quizData';
import { initialAnnouncements } from './data/forumAndAnnouncements';
import { defaultStudents, defaultTeacher, defaultAdmin } from './utils/userStore';
import { MaterialSection, Question, QuizAttempt, UserProfile, GradeLevel } from './types';
import { sound } from './utils/audio';

// Components
import { PancasilaPlatformer } from './components/games/PancasilaPlatformer';
import { SpeedQuizGame } from './components/games/SpeedQuizGame';
import { DetectiveGame } from './components/games/DetectiveGame';
import { ElectionSimGame } from './components/games/ElectionSimGame';
import { PancasilaPuzzleGame } from './components/games/PancasilaPuzzleGame';
import { MaterialDetailView } from './components/MaterialDetailView';
import { QuizEngine } from './components/QuizEngine';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SimulationsView } from './components/SimulationsView';
import { ELibraryView } from './components/ELibraryView';
import { ForumDiscussionView } from './components/ForumDiscussionView';
import { ProfileAndCompetitionsView } from './components/ProfileAndCompetitionsView';
import { NusantaraInteractiveMap } from './components/NusantaraInteractiveMap';
import { AITutorModal } from './components/AITutorModal';
import { InteractiveVideoPlayer } from './components/InteractiveVideoPlayer';
import { NavigationWindowFrame } from './components/NavigationWindowFrame';
import { ClockWidget } from './components/ClockWidget';
import { GlossaryView } from './components/GlossaryView';
import { ThreeDimensionalViewer } from './components/ThreeDimensionalViewer';
import { NationalGalleryView } from './components/NationalGalleryView';

// Icons
import {
  Home,
  BookOpen,
  BookMarked,
  Box,
  Play,
  Gamepad2,
  CheckSquare,
  Brain,
  Award,
  Vote,
  Library,
  MessageSquare,
  Calendar,
  UserCheck,
  User,
  Info,
  Bot,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Clock,
  ChevronRight,
  Compass,
  Megaphone,
  Heart,
  Search,
  Landmark,
  Users,
} from 'lucide-react';

export default function App() {
  // Navigation State with History for Window Frame Back tracking
  const [activeMenu, setActiveMenu] = useState<string>('beranda');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['beranda']);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('XI');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSection | null>(null);
  const [activeVideoMaterial, setActiveVideoMaterial] = useState<MaterialSection>(materialsData[0]);
  const [videoFilterGrade, setVideoFilterGrade] = useState<'ALL' | GradeLevel>('ALL');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[] | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');

  const handleNavigate = (menuId: string) => {
    sound.playClick();
    if (menuId !== activeMenu) {
      setNavigationHistory((prev) => [...prev, menuId]);
      setActiveMenu(menuId);
      setSelectedMaterial(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    sound.playClick();
    if (selectedMaterial) {
      setSelectedMaterial(null);
      return;
    }
    if (navigationHistory.length > 1) {
      const newHist = [...navigationHistory];
      newHist.pop(); // remove current
      const prev = newHist[newHist.length - 1];
      setNavigationHistory(newHist);
      setActiveMenu(prev);
    } else {
      setActiveMenu('beranda');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Game sub-tab state
  const [activeGameTab, setActiveGameTab] = useState<'platformer' | 'speed' | 'detective' | 'pemilu' | 'puzzle'>('platformer');

  // User State & Role Switching
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultStudents[0]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'standar' | 'besar' | 'ekstra'>('standar');

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.setMuted(next);
  };

  const handleRoleChange = (role: 'siswa' | 'guru' | 'admin') => {
    sound.playClick();
    if (role === 'siswa') setCurrentUser(defaultStudents[0]);
    else if (role === 'guru') setCurrentUser(defaultTeacher);
    else setCurrentUser(defaultAdmin);
  };

  // Start specific quiz from a material
  const handleStartMaterialQuiz = (quizId: string) => {
    sound.playClick();
    const qs = questionsBank.filter(
      (q) => q.grade === (selectedMaterial?.grade || selectedGrade)
    );
    setActiveQuizQuestions(qs.length > 0 ? qs : questionsBank.slice(0, 5));
    setActiveQuizTitle(`Asesmen Formatif: ${selectedMaterial?.title || 'Pendidikan Pancasila'}`);
    setActiveMenu('kuis');
  };

  const handleQuizFinish = (attempt: QuizAttempt) => {
    const earnedPts = Math.round(attempt.score / 2);
    setCurrentUser((prev) => ({
      ...prev,
      points: prev.points + earnedPts,
      quizScores: { ...prev.quizScores, [attempt.quizId]: attempt.score },
    }));
  };

  // Navigation Drawer (Garis Tiga) State
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [selectedDrawerCat, setSelectedDrawerCat] = useState('Semua');

  // 19 Main Navigation Items with categories for clear visitor navigation
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home, category: 'Utama', desc: 'Sambutan guru, profil sekolah, dan gambaran umum' },
    { id: 'materi', label: 'Materi Belajar', icon: BookOpen, category: 'Pembelajaran', desc: 'Modul Kurikulum Merdeka Kelas X, XI, XII' },
    { id: 'video', label: 'Video Animasi', icon: Play, category: 'Pembelajaran', desc: 'Video pembelajaran interaktif & studi kasus' },
    { id: 'galeriPresiden', label: 'Galeri Presiden (1-8)', icon: Landmark, category: 'Wawasan', desc: 'Biografi, peninggalan & warisan Presiden RI ke-1 s.d. ke-8' },
    { id: 'galeriTokoh', label: 'Galeri Tokoh Nasional', icon: Users, category: 'Wawasan', desc: 'Perumus Pancasila, pendiri bangsa & pahlawan kemerdekaan' },
    { id: 'game', label: 'Game Edukasi (5)', icon: Gamepad2, category: 'Interaktif', desc: 'Platformer 2D, Kuis Kilat, Detektif, Pemilu, Puzzle' },
    { id: 'kuis', label: 'Kuis Interaktif', icon: CheckSquare, category: 'Asesmen', desc: '7 jenis soal dengan penilaian otomatis' },
    { id: 'bankSoal', label: 'Bank Soal', icon: Brain, category: 'Asesmen', desc: 'Latihan soal HOTS per bab dan tingkat kesulitan' },
    { id: 'kompetisi', label: 'Kompetisi & Lencana', icon: Award, category: 'Prestasi', desc: 'Leaderboard, poin, badges & sertifikat digital' },
    { id: 'simulasi', label: 'Simulasi Demokrasi', icon: Vote, category: 'Interaktif', desc: 'Sidang PPKI, Musyawarah Kelas, OSIS & MK' },
    { id: 'objek3d', label: 'Objek 3D 4 Pilar', icon: Box, category: 'Interaktif', desc: 'Eksplorasi 3D Pancasila, UUD 1945, Bhinneka & NKRI' },
    { id: 'nusantara', label: 'Peta Nusantara', icon: Compass, category: 'Kebinekaan', desc: 'Eksplorasi budaya dan gotong royong 38 provinsi' },
    { id: 'elibrary', label: 'E-Library', icon: Library, category: 'Referensi', desc: 'Buku Kemdikbud, UUD 1945, 45 Butir Sila' },
    { id: 'glosarium', label: 'Glosarium Pancasila', icon: BookMarked, category: 'Referensi', desc: 'Kamus istilah lengkap Pancasila, konstitusi, hukum & demokrasi' },
    { id: 'forum', label: 'Forum Diskusi', icon: MessageSquare, category: 'Komunitas', desc: 'Mimbar musyawarah & refleksi etika berbangsa' },
    { id: 'agenda', label: 'Agenda & Tugas', icon: Calendar, category: 'Sekolah', desc: 'Kalender asesmen & hari besar nasional' },
    { id: 'dashboardGuru', label: 'Dashboard Guru', icon: UserCheck, category: 'Manajemen', desc: 'Panel guru, bank soal & rekap ekspor nilai' },
    { id: 'profil', label: 'Profil Siswa', icon: User, category: 'Pengguna', desc: 'Portofolio Profil Pelajar Pancasila & sertifikat' },
    { id: 'tentang', label: 'Tentang Web', icon: Info, category: 'Informasi', desc: 'Profil SMA Negeri 1 Mande & tim pengampu' },
  ];

  const filteredNavItems = navItems.filter((item) => {
    const matchSearch = item.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                        item.desc.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                        item.category.toLowerCase().includes(drawerSearch.toLowerCase());
    const matchCategory = selectedDrawerCat === 'Semua' || item.category === selectedDrawerCat;
    return matchSearch && matchCategory;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b from-sky-100/70 via-sky-50 to-white text-slate-800 flex flex-col font-sans transition-all duration-200 ${
      fontSize === 'ekstra' ? 'text-lg' : fontSize === 'besar' ? 'text-base' : ''
    }`}>
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-40 bg-sky-600 text-white shadow-md border-b border-sky-500">
        {/* Top Flag Strip */}
        <div className="h-1.5 w-full flex">
          <div className="bg-red-600 w-1/2 h-full" />
          <div className="bg-white w-1/2 h-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo Brand with Uploaded Official Logo */}
          <div
            onClick={() => {
              setActiveMenu('beranda');
              setSelectedMaterial(null);
              sound.playClick();
            }}
            className="flex items-center gap-2.5 md:gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white p-1 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden border border-sky-300 shrink-0">
              <img
                src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
                alt="Logo Ruang Pendidikan Pancasila SMA Negeri 1 Mande"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm md:text-base text-white tracking-tight drop-shadow-sm">
                  Pendidikan Pancasila
                </span>
                <span className="text-[10px] bg-amber-400 text-sky-950 font-black px-1.5 py-0.2 rounded shadow-sm">
                  SMANDE
                </span>
              </div>
              <p className="text-[11px] text-sky-100 font-medium truncate max-w-[200px] sm:max-w-none">
                SMA Negeri 1 Mande • Kurikulum Merdeka
              </p>
            </div>
          </div>

          {/* User Quick Info & Action Controls */}
          <div className="flex items-center gap-2">
            {/* Real-time Clock, Day & Date Widget in Header */}
            <ClockWidget variant="header" />

            {/* Tombol Garis Tiga (Menu Navigasi) - Membuka Semua Menu ke Bawah */}
            <button
              onClick={() => {
                setIsNavDrawerOpen(true);
                sound.playClick();
              }}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1.5 bg-white text-sky-800 hover:bg-sky-50 font-extrabold text-xs md:text-sm rounded-xl shadow-md transition-all border border-sky-200 active:scale-95 group shrink-0"
              title={`Buka ${navItems.length} Menu Pembelajaran (Navigasi Vertikal)`}
            >
              <Menu size={18} className="text-sky-700 stroke-[2.5] group-hover:rotate-6 transition-transform" />
              <span className="font-extrabold">Menu Navigasi</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-black px-1.5 py-0.5 rounded-md hidden sm:inline">
                {navItems.length} Menu ▾
              </span>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden lg:flex items-center gap-1 bg-sky-700/80 border border-sky-400/40 p-1 rounded-xl text-xs">
              {(['siswa', 'guru', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                    currentUser.role === r
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-sky-100 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Nyalakan Audio SFX' : 'Bisukan Audio SFX'}
              className="p-2 rounded-xl bg-sky-700 hover:bg-sky-500 text-white transition-colors border border-sky-400/50"
            >
              {isSoundMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            {/* Font Size Accessibility Controller */}
            <button
              onClick={() => {
                sound.playClick();
                setFontSize((curr) => (curr === 'standar' ? 'besar' : curr === 'besar' ? 'ekstra' : 'standar'));
              }}
              title="Ubah Ukuran Huruf Website (Standar, Besar, Ekstra)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-500 text-xs font-bold text-amber-300 border border-sky-400/50 transition-all active:scale-95 shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">A+</span>
              <span className="text-[10px] uppercase font-black text-sky-950 bg-amber-400 px-1.5 py-0.5 rounded shadow-xs hidden sm:inline">
                {fontSize === 'ekstra' ? 'Ekstra' : fontSize === 'besar' ? 'Besar' : 'Standar'}
              </span>
            </button>

            {/* AI Tutor Floating Trigger */}
            <button
              onClick={() => {
                setIsAiTutorOpen(true);
                sound.playClick();
              }}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-sky-950 font-black text-xs rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
            >
              <Bot size={16} />
              <span className="hidden md:inline">Tutor Garuda</span>
              <span className="md:hidden">AI</span>
            </button>

            {/* Current User Avatar */}
            <div
              onClick={() => {
                setActiveMenu('profil');
                sound.playClick();
              }}
              className="flex items-center gap-1.5 md:gap-2 cursor-pointer bg-sky-700/90 hover:bg-sky-700 border border-sky-400/60 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
            >
              <span className="text-base md:text-lg">{currentUser.avatar}</span>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-bold text-white leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold">
                  {currentUser.points} Poin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal / Slide-Over Drawer Navigasi Pengunjung (Garis Tiga) */}
        {isNavDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-start animate-fade-in">
            <div className="bg-white text-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden border-r border-sky-200">
              {/* Drawer Header with Logo and Close */}
              <div className="bg-sky-600 text-white p-5 border-b border-sky-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
                    <img
                      src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
                      alt="Logo Ruang Pendidikan Pancasila"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Menu Navigasi Pengunjung</h3>
                    <p className="text-xs text-sky-100 font-medium">SMA Negeri 1 Mande (SMANDE)</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsNavDrawerOpen(false)}
                  className="p-2 rounded-xl bg-sky-700 hover:bg-sky-500 text-white transition-colors"
                  title="Tutup Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mode Pengunjung Banner */}
              <div className="bg-sky-50 p-3.5 border-b border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-sky-900">Mode Pengunjung Aktif</span>
                </div>
                <div className="flex gap-1">
                  {(['siswa', 'guru', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`px-2 py-0.5 rounded capitalize font-bold text-[11px] ${
                        currentUser.role === r ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-sky-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Quick Category Filters */}
              <div className="p-3.5 border-b border-sky-100 bg-white space-y-2.5">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari fitur/menu pembelajaran..."
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
                  />
                  {drawerSearch && (
                    <button
                      onClick={() => setDrawerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs w-4 h-4 rounded-full flex items-center justify-center bg-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Chips Filter */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold scrollbar-none">
                  {['Semua', ...Array.from(new Set(navItems.map((n) => n.category)))].map((cat) => {
                    const count = cat === 'Semua' ? navItems.length : navItems.filter((n) => n.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedDrawerCat(cat)}
                        className={`px-2.5 py-1 rounded-xl shrink-0 transition-all flex items-center gap-1 ${
                          selectedDrawerCat === cat
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/60'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          selectedDrawerCat === cat ? 'bg-sky-700 text-sky-100' : 'bg-sky-200/70 text-sky-900'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Menus in Drawer - Single Structured Stack Downwards */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 mb-2 flex items-center justify-between">
                  <span>Daftar Menu Pembelajaran ({filteredNavItems.length}):</span>
                  {selectedDrawerCat !== 'Semua' && (
                    <button
                      onClick={() => setSelectedDrawerCat('Semua')}
                      className="text-[10px] text-sky-600 hover:underline font-bold"
                    >
                      Tampilkan Semua
                    </button>
                  )}
                </div>

                {filteredNavItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Tidak ditemukan menu yang sesuai dengan "{drawerSearch}"
                  </div>
                ) : (
                  filteredNavItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    const showCategoryHeader =
                      selectedDrawerCat === 'Semua' &&
                      !drawerSearch &&
                      (idx === 0 || filteredNavItems[idx - 1].category !== item.category);

                    return (
                      <React.Fragment key={item.id}>
                        {showCategoryHeader && (
                          <div className="pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            <span>Kategori: {item.category}</span>
                            <div className="flex-1 border-t border-slate-100" />
                          </div>
                        )}
                        <button
                          onClick={() => {
                            handleNavigate(item.id);
                            setIsNavDrawerOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all text-left border ${
                            isActive
                              ? 'bg-sky-600 text-white border-sky-500 shadow-md ring-2 ring-sky-300'
                              : 'bg-white hover:bg-sky-50 text-slate-800 border-sky-100 hover:border-sky-300'
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm leading-snug">{item.label}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {item.category}
                              </span>
                            </div>
                            <p
                              className={`text-xs mt-0.5 line-clamp-1 ${
                                isActive ? 'text-sky-100' : 'text-slate-500'
                              }`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      </React.Fragment>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-sky-50 border-t border-sky-100 text-xs text-center font-bold text-sky-900 flex items-center justify-center gap-1.5">
                <span>Made In</span>
                <Heart size={14} className="fill-red-500 text-red-500 inline animate-pulse" />
                <span>Guru Munawar Rois, S.Pd.</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Running Teks Marquee Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 border-b border-sky-300 text-sky-950 py-2.5 px-4 shadow-sm overflow-hidden flex items-center">
        <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider shrink-0 mr-4 bg-sky-700 text-white px-3 py-1 rounded-full shadow-sm">
          <Megaphone size={14} className="text-amber-300" />
          <span>INFO TERKINI</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee font-extrabold tracking-wider text-xs md:text-sm text-sky-950">
            <span className="mx-6 text-sky-950">
              SELAMAT DATANG DI PEMBELAJARAN INTERAKTIF PENDIDIKAN PANCASILA
            </span>
            <span className="mx-2 text-sky-800">★</span>
            <span className="mx-6 font-bold text-sky-900">SMA NEGERI 1 MANDE (SMANDE)</span>
            <span className="mx-2 text-sky-800">★</span>
            <span className="mx-6 text-sky-950">
              SELAMAT DATANG DI PEMBELAJARAN INTERAKTIF PENDIDIKAN PANCASILA
            </span>
            <span className="mx-2 text-sky-800">★</span>
            <span className="mx-6 font-bold text-sky-900">SMA NEGERI 1 MANDE (SMANDE)</span>
          </div>
        </div>
      </div>

      {/* Main Container Content with Neat Window Frame Navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <NavigationWindowFrame
          activeMenuId={activeMenu}
          navItems={navItems}
          onNavigate={handleNavigate}
          onGoBack={handleGoBack}
          canGoBack={navigationHistory.length > 1 || selectedMaterial !== null}
        >
        {/* ================= 1. BERANDA ================= */}
        {activeMenu === 'beranda' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Welcome Banner in Sky Blue theme */}
            <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-blue-600 text-white rounded-3xl p-6 md:p-10 shadow-xl shadow-sky-600/15 relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold">
                  <span>🇮🇩 Selamat Datang di Portal Pembelajaran Pancasila SMA Negeri 1 Mande</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Tumbuh Menjadi Pelajar Berkarakter, Bernalar Kritis & Berjiwa Pancasila
                </h1>

                <p className="text-sm md:text-base text-sky-50 leading-relaxed max-w-2xl font-medium">
                  Platform pembelajaran interaktif Kurikulum Merdeka Fase E & F di <b>SMA Negeri 1 Mande (SMANDE)</b>. Dilengkapi materi berbasis HOTS, 5 game edukasi, kuis penilaian otomatis, simulasi demokrasi, serta asisten AI Tutor Pintar Garuda.
                </p>

                {/* Structured Action Buttons in Hero Banner */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveMenu('materi');
                        sound.playClick();
                      }}
                      className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs md:text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
                    >
                      <span>Mulai Belajar Materi (Fase E & F)</span>
                      <ArrowRight size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setIsNavDrawerOpen(true);
                        sound.playClick();
                      }}
                      className="flex items-center gap-2 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-sky-950 font-black text-xs md:text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-300"
                    >
                      <Menu size={16} className="text-sky-950 stroke-[2.5]" />
                      <span>Buka {navItems.length} Menu Navigasi</span>
                    </button>
                  </div>

                  {/* Quick Feature Chips for Fast Exploration */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-sky-100">
                    <span className="text-[11px] text-sky-200 opacity-90 hidden sm:inline">Pintas Cepat:</span>
                    {[
                      { id: 'galeriPresiden', label: 'Presiden RI (1-8)', icon: Landmark },
                      { id: 'galeriTokoh', label: 'Tokoh Nasional', icon: Users },
                      { id: 'objek3d', label: 'Objek 3D 4 Pilar', icon: Box },
                      { id: 'game', label: '5 Game Edukasi', icon: Gamepad2 },
                      { id: 'simulasi', label: 'Simulasi Demokrasi', icon: Vote },
                      { id: 'glosarium', label: 'Glosarium A-Z', icon: BookMarked },
                      { id: 'kuis', label: 'Kuis Interaktif', icon: CheckSquare },
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveMenu(p.id);
                            sound.playClick();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all text-xs font-bold backdrop-blur-xs active:scale-95"
                        >
                          <Icon size={13} className="text-amber-300" />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Background decorative emblem */}
              <div className="absolute -right-6 -bottom-6 text-[180px] md:text-[240px] opacity-15 pointer-events-none select-none">
                🦅
              </div>
            </div>

            {/* Widget Jam, Waktu, Hari & Tanggal Lengkap Menarik Pengunjung */}
            <ClockWidget
              variant="full"
              onExploreCalendar={() => {
                setActiveMenu('agenda');
                sound.playClick();
              }}
            />

            {/* PUSAT NAVIGASI & PELUNCUR FITUR TERSTRUKTUR (Structured Navigation Hub) */}
            <div className="bg-white border-2 border-sky-200/90 rounded-3xl p-6 md:p-8 shadow-xl shadow-sky-100 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sky-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1.5">
                    <Compass size={14} className="text-sky-600" />
                    <span>Pusat Navigasi & Peluncur Pembelajaran Terstruktur</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    Pilih Jalur Belajar yang Ingin Anda Nikmati
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {navItems.length} fitur terorganisir rapi dalam 4 pilar navigasi untuk kenyamanan pengunjung di SMA Negeri 1 Mande.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsNavDrawerOpen(true);
                    sound.playClick();
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <Menu size={16} />
                  <span>Daftar Menu Vertikal ({navItems.length})</span>
                </button>
              </div>

              {/* 4 Structured Navigation Pillars / Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Zone 1: Materi & Literasi */}
                <div className="bg-gradient-to-b from-sky-50/80 to-white rounded-2xl p-4 border border-sky-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-sky-600" />
                      <span>1. Materi & Literasi</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Bahan ajar resmi Kurikulum Merdeka Fase E & F.</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'materi', label: 'Modul Materi X, XI, XII', desc: 'Capaian Pembelajaran & LKPD', icon: BookOpen },
                      { id: 'video', label: 'Video Animasi Interaktif', desc: 'Visualisasi kasus & studi', icon: Play },
                      { id: 'elibrary', label: 'E-Library Kemdikbud', desc: 'Buku teks & pasal UUD 1945', icon: Library },
                      { id: 'glosarium', label: 'Glosarium Pancasila A-Z', desc: 'Kamus istilah & flashcard', icon: BookMarked },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setActiveMenu(btn.id);
                          sound.playClick();
                        }}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-sky-600 text-slate-700 hover:text-white border border-sky-100 hover:border-sky-600 transition-all text-left shadow-2xs group flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="font-bold text-xs truncate group-hover:text-white">{btn.label}</div>
                          <div className="text-[10px] text-slate-400 group-hover:text-sky-100 truncate">{btn.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone 2: Wawasan Tokoh & 3D */}
                <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-2xl p-4 border border-amber-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Landmark size={14} className="text-amber-600" />
                      <span>2. Wawasan Tokoh & 3D</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Biografi 8 Presiden RI, pahlawan & 3D 4 Pilar.</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'galeriPresiden', label: 'Galeri Presiden RI (1-8)', desc: 'Biografi, warisan & kuis 8 Presiden', icon: Landmark },
                      { id: 'galeriTokoh', label: 'Galeri Tokoh Nasional', desc: 'Perumus Pancasila & pendiri bangsa', icon: Users },
                      { id: 'objek3d', label: 'Objek 3D 4 Pilar', desc: 'Garuda, UUD, Bhinneka, NKRI', icon: Box },
                      { id: 'nusantara', label: 'Peta Budaya 38 Provinsi', desc: 'Eksplorasi adat Nusantara', icon: Compass },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setActiveMenu(btn.id);
                          sound.playClick();
                        }}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-500 text-slate-700 hover:text-sky-950 border border-amber-100 hover:border-amber-400 transition-all text-left shadow-2xs group flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="font-bold text-xs truncate group-hover:text-sky-950">{btn.label}</div>
                          <div className="text-[10px] text-slate-400 group-hover:text-sky-900 truncate">{btn.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-sky-950 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone 3: Interaktif & Game */}
                <div className="bg-gradient-to-b from-emerald-50/80 to-white rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Gamepad2 size={14} className="text-emerald-600" />
                      <span>3. Interaktif & Game</span>
                    </div>
                    <p className="text-[11px] text-slate-500">5 Game edukasi, kuis interaktif & bank soal HOTS.</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'game', label: '5 Game Edukasi Pancasila', desc: 'Platformer, Detektif, Puzzle', icon: Gamepad2 },
                      { id: 'simulasi', label: 'Simulasi Demokrasi', desc: 'Sidang PPKI & Pemilu OSIS', icon: Vote },
                      { id: 'kuis', label: 'Kuis Interaktif 7 Jenis', desc: 'Penilaian langsung & pembahasan', icon: CheckSquare },
                      { id: 'bankSoal', label: 'Bank Soal Asesmen HOTS', desc: 'Latihan soal per tingkat kesulitan', icon: Brain },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setActiveMenu(btn.id);
                          sound.playClick();
                        }}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-emerald-100 hover:border-emerald-600 transition-all text-left shadow-2xs group flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="font-bold text-xs truncate group-hover:text-white">{btn.label}</div>
                          <div className="text-[10px] text-slate-400 group-hover:text-emerald-100 truncate">{btn.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zone 4: Kolaborasi & Sekolah */}
                <div className="bg-gradient-to-b from-indigo-50/80 to-white rounded-2xl p-4 border border-indigo-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-indigo-600" />
                      <span>4. Kolaborasi & Informasi</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Ruang musyawarah, agenda & panel pengampu.</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'kompetisi', label: 'Kompetisi & Lencana', desc: 'Peringkat siswa & badge digital', icon: Award },
                      { id: 'forum', label: 'Forum Musyawarah Kelas', desc: 'Diskusi kasus & etika berbangsa', icon: MessageSquare },
                      { id: 'agenda', label: 'Agenda & Hari Nasional', desc: 'Jadwal belajar & kalender HUT', icon: Calendar },
                      { id: 'dashboardGuru', label: 'Dashboard Guru Pengampu', desc: 'Kelola soal & ekspor nilai', icon: UserCheck },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setActiveMenu(btn.id);
                          sound.playClick();
                        }}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-indigo-600 text-slate-700 hover:text-white border border-indigo-100 hover:border-indigo-600 transition-all text-left shadow-2xs group flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="font-bold text-xs truncate group-hover:text-white">{btn.label}</div>
                          <div className="text-[10px] text-slate-400 group-hover:text-indigo-100 truncate">{btn.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sambutan & Profil Guru Pengampu */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-white border border-sky-200/80 rounded-3xl p-6 shadow-md shadow-sky-100/50 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-sky-100 to-sky-200 border-2 border-sky-300 flex items-center justify-center text-5xl shadow-md shrink-0">
                  👨‍🏫
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                    Sambutan Guru Pengampu Mata Pelajaran
                  </span>
                  <h3 className="text-xl font-bold text-slate-800">Munawar Rois, S.Pd.</h3>
                  <p className="text-xs text-sky-600 font-semibold">
                    Guru Pendidikan Pancasila SMA Negeri 1 Mande (SMANDE)
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 italic leading-relaxed pt-1">
                    "Pendidikan Pancasila bukan sekadar menghafal butir-butir sila dan pasal konstitusi. Inti hakikinya adalah bagaimana nilai ketuhanan, kemanusiaan, persatuan, musyawarah, dan keadilan sosial tersebut hidup dan mewujud dalam setiap langkah nyata siswa-siswi SMA Negeri 1 Mande di sekolah, keluarga, dan masyarakat luas."
                  </p>
                </div>
              </div>

              {/* Quick Learning Stats */}
              <div className="md:col-span-4 bg-white border border-sky-200/80 rounded-3xl p-6 shadow-md shadow-sky-100/50 flex flex-col justify-between">
                <h4 className="font-bold text-sm text-sky-900 flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-amber-500" /> Statistik Pembelajaran SMANDE
                </h4>
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between p-2.5 bg-sky-50 rounded-xl border border-sky-100">
                    <span>Modul Materi Kurikulum</span>
                    <span className="font-bold text-sky-800">Fase E & F (X, XI, XII)</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-sky-50 rounded-xl border border-sky-100">
                    <span>Bank Soal Asesmen</span>
                    <span className="font-bold text-amber-600">{questionsBank.length} Butir HOTS</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-sky-50 rounded-xl border border-sky-100">
                    <span>Mode Game Interaktif</span>
                    <span className="font-bold text-emerald-600">5 Game Edukatif</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-100 text-[11px] text-slate-500 text-center font-medium">
                  Terintegrasi KKTP & 6 Dimensi Profil Pelajar Pancasila
                </div>
              </div>
            </div>

            {/* Kartu Kelas X, XI, dan XII */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pilih Jenjang Pembelajaran</h3>
                  <p className="text-xs text-slate-500">Materi disesuaikan dengan Capaian Pembelajaran Fase E & Fase F</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    grade: 'X' as GradeLevel,
                    fase: 'Fase E',
                    title: 'Kelas X (Sepuluh)',
                    desc: 'Ide Pendiri Bangsa, Piagam Jakarta, Hierarki Norma & UUD 1945, Bhinneka Tunggal Ika, dan NKRI.',
                    badgeColor: 'border-sky-300 bg-sky-100 text-sky-800',
                  },
                  {
                    grade: 'XI' as GradeLevel,
                    fase: 'Fase F',
                    title: 'Kelas XI (Sebelas)',
                    desc: 'Kedudukan Pancasila (Meja Statis & Leitstar Dinamis), Demokrasi Konstitusional, Musyawarah, dan Harmonisasi HAM.',
                    badgeColor: 'border-blue-300 bg-blue-100 text-blue-800',
                  },
                  {
                    grade: 'XII' as GradeLevel,
                    fase: 'Fase F',
                    title: 'Kelas XII (Dua Belas)',
                    desc: 'Penyelenggaraan Negara yang Bersih, Integritas Antikorupsi KPK, Etika Digital & Literasi Menangkal Hoaks.',
                    badgeColor: 'border-amber-300 bg-amber-100 text-amber-900',
                  },
                ].map((k) => (
                  <div
                    key={k.grade}
                    onClick={() => {
                      setSelectedGrade(k.grade);
                      setActiveMenu('materi');
                      sound.playClick();
                    }}
                    className="bg-white hover:bg-sky-50/60 border border-sky-200 hover:border-sky-400 rounded-3xl p-6 cursor-pointer transition-all shadow-md shadow-sky-100/50 hover:shadow-lg group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${k.badgeColor}`}>
                          {k.fase}
                        </span>
                        <GraduationCap size={20} className="text-sky-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                        {k.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">{k.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-sky-100 text-xs font-bold text-sky-600 group-hover:text-sky-700">
                      <span>Buka Modul Kelas {k.grade}</span>
                      <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Unggulan Preview & Pengumuman Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Featured Game */}
              <div className="lg:col-span-7 bg-white border border-sky-200/80 rounded-3xl p-6 shadow-md shadow-sky-100/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5">
                      <Gamepad2 size={14} /> Game Edukasi Unggulan
                    </span>
                    <span className="text-[11px] bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full font-semibold">
                      5 Level Tantangan
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Petualangan Siswa Pancasila (2D Platformer)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Gerakkan karakter siswa, kumpulkan bintang kearifan moral, lompati rintangan permasalahan sosial (hoaks dan intoleransi), dan jawab pos ujian materi di setiap bab pembelajaran!
                  </p>
                </div>

                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 font-medium">
                    Tersedia kontrol keyboard PC & tombol sentuh virtual HP
                  </div>
                  <button
                    onClick={() => {
                      setActiveMenu('game');
                      setActiveGameTab('platformer');
                      sound.playClick();
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white rounded-xl shadow-md shrink-0 transition-all"
                  >
                    Mainkan Sekarang 🎮
                  </button>
                </div>
              </div>

              {/* Right: Pengumuman Terbaru */}
              <div className="lg:col-span-5 bg-white border border-sky-200/80 rounded-3xl p-6 shadow-md shadow-sky-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    📢 Informasi & Agenda Terbaru
                  </h4>
                  <button
                    onClick={() => setActiveMenu('agenda')}
                    className="text-xs text-sky-600 hover:underline font-semibold"
                  >
                    Semua Agenda
                  </button>
                </div>

                <div className="space-y-3">
                  {initialAnnouncements.slice(0, 2).map((ann) => (
                    <div key={ann.id} className="bg-sky-50 border border-sky-100 p-3.5 rounded-2xl text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sky-800">{ann.category}</span>
                        <span className="text-[10px] text-slate-500">{ann.date}</span>
                      </div>
                      <h5 className="font-semibold text-slate-800 mb-1 line-clamp-1">{ann.title}</h5>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MATERI PEMBELAJARAN ================= */}
        {activeMenu === 'materi' && (
          <div className="space-y-6 animate-fade-in">
            {selectedMaterial ? (
              <div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
                >
                  ← Kembali ke Daftar Modul Kelas {selectedGrade}
                </button>
                <MaterialDetailView
                  material={selectedMaterial}
                  onTakeQuiz={handleStartMaterialQuiz}
                  onNextMaterial={() => {
                    const gradeMats = materialsData.filter((m) => m.grade === selectedGrade);
                    const idx = gradeMats.findIndex((m) => m.id === selectedMaterial.id);
                    if (idx < gradeMats.length - 1) {
                      setSelectedMaterial(gradeMats[idx + 1]);
                    }
                  }}
                  onPrevMaterial={() => {
                    const gradeMats = materialsData.filter((m) => m.grade === selectedGrade);
                    const idx = gradeMats.findIndex((m) => m.id === selectedMaterial.id);
                    if (idx > 0) {
                      setSelectedMaterial(gradeMats[idx - 1]);
                    }
                  }}
                  onCompleteMaterial={(matId) => {
                    setCurrentUser((prev) => ({
                      ...prev,
                      completedMaterials: Array.from(new Set([...prev.completedMaterials, matId])),
                      points: prev.points + 50,
                    }));
                  }}
                />
              </div>
            ) : (
              <div>
                {/* Header & Grade Selector */}
                <div className="bg-white border border-sky-200 rounded-3xl p-6 md:p-8 shadow-md flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-sky-700 font-bold">
                      Kurikulum Merdeka Belajar • SMANDE
                    </span>
                    <h2 className="text-2xl font-black text-slate-800">Materi Pembelajaran Pendidikan Pancasila</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih jenjang kelas untuk menelaah bab, infografis, video, kasus, dan LKPD digital.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-sky-50 p-1.5 rounded-2xl border border-sky-200">
                    {(['X', 'XI', 'XII'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setSelectedGrade(g);
                          sound.playClick();
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedGrade === g
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-slate-600 hover:text-sky-700'
                        }`}
                      >
                        Kelas {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Materials Cards for selected grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {materialsData
                    .filter((m) => m.grade === selectedGrade)
                    .map((mat) => (
                      <div
                        key={mat.id}
                        className="bg-white border border-sky-100 hover:border-sky-300 rounded-3xl p-6 shadow-md flex flex-col justify-between group transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                              Bab {mat.chapterNumber}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock size={13} />
                              <span>{mat.durationMinutes} Menit</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-sky-600 transition-colors">
                            {mat.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                            {mat.subtitle}
                          </p>

                          <div className="space-y-1.5 bg-sky-50/70 p-3 rounded-xl border border-sky-100 mb-5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Capaian Pembelajaran:
                            </span>
                            <p className="text-xs text-slate-700 line-clamp-2">
                              {mat.learningObjectives[0]}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-sky-100">
                          <button
                            onClick={() => {
                              setSelectedMaterial(mat);
                              sound.playClick();
                            }}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                          >
                            Buka Materi Lengkap 📖
                          </button>

                          <button
                            onClick={() => handleStartMaterialQuiz(mat.relatedQuizId)}
                            className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-xl border border-sky-200 transition-colors"
                          >
                            Kuis Uji Pemahaman ⚡
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. VIDEO PEMBELAJARAN ================= */}
        {activeMenu === 'video' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header with grade filter */}
            <div className="bg-white border border-sky-200 rounded-3xl p-6 md:p-8 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5 mb-1">
                  <Play size={14} className="text-sky-600" /> Media Audiovisual Edukatif • SMA Negeri 1 Mande
                </span>
                <h2 className="text-2xl font-black text-slate-800">
                  Video Animasi & Penjelasan Interaktif
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tonton animasi edukasi sejarah konstitusi dan demokrasi dengan narasi suara, subtitle real-time, dan putaran visual interaktif.
                </p>
              </div>

              {/* Filter Kelas */}
              <div className="flex items-center gap-1.5 bg-sky-50 p-1.5 rounded-2xl border border-sky-200">
                {(['ALL', 'X', 'XI', 'XII'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setVideoFilterGrade(g);
                      sound.playClick();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      videoFilterGrade === g
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100/50'
                    }`}
                  >
                    {g === 'ALL' ? 'Semua Kelas' : `Kelas ${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Active Interactive Theater Player */}
            <div id="video-theater" className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-extrabold text-sky-900 uppercase tracking-wider">
                    Bioskop Edukasi Pancasila SMANDE (Sedang Diputar)
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Klik video di bawah untuk mengganti judul tayangan
                </div>
              </div>

              <InteractiveVideoPlayer
                material={activeVideoMaterial}
                onTakeQuiz={handleStartMaterialQuiz}
              />
            </div>

            {/* Playlist Grid of All Videos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <span>Pilihan Modul Video Pembelajaran</span>
                  <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                    {materialsData.filter((m) => videoFilterGrade === 'ALL' || m.grade === videoFilterGrade).length} Judul
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {materialsData
                  .filter((m) => videoFilterGrade === 'ALL' || m.grade === videoFilterGrade)
                  .map((m) => {
                    const isSelected = activeVideoMaterial.id === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`bg-white rounded-3xl overflow-hidden shadow-md transition-all flex flex-col justify-between border ${
                          isSelected
                            ? 'border-sky-500 ring-4 ring-sky-400/20 shadow-sky-200'
                            : 'border-sky-100 hover:border-sky-300'
                        }`}
                      >
                        <div>
                          <div
                            onClick={() => {
                              setActiveVideoMaterial(m);
                              sound.playClick();
                              document.getElementById('video-theater')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative aspect-video bg-sky-950 overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={m.video.thumbnail}
                              alt={m.video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                            />
                            <div className="absolute inset-0 bg-sky-950/30 flex items-center justify-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                                  isSelected ? 'bg-amber-400 text-slate-950 ring-4 ring-white/50' : 'bg-sky-600 text-white'
                                }`}
                              >
                                <Play size={20} className="ml-1" />
                              </div>
                            </div>

                            {isSelected && (
                              <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                                ▶ Sedang Diputar
                              </span>
                            )}

                            <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[11px] text-white font-mono">
                              {m.video.duration}
                            </span>
                          </div>

                          <div className="p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1">
                              Kelas {m.grade} • Bab {m.chapterNumber}
                            </span>
                            <h4 className="font-bold text-sm text-slate-800 mb-2 line-clamp-1 hover:text-sky-600 transition-colors">
                              {m.video.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                              {m.video.summary}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 border-t border-sky-50 pt-3">
                          <button
                            onClick={() => {
                              setActiveVideoMaterial(m);
                              sound.playClick();
                              document.getElementById('video-theater')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                            }`}
                          >
                            <Play size={13} />
                            <span>{isSelected ? 'Putar Video Ini' : 'Tonton Video'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMaterial(m);
                              setSelectedGrade(m.grade);
                              setActiveMenu('materi');
                              sound.playClick();
                            }}
                            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                            title="Buka Teori Modul Lengkap"
                          >
                            📖 Modul
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. GAME EDUKASI (5 LENGKAP) ================= */}
        {activeMenu === 'game' && (
          <div className="space-y-6 animate-fade-in">
            {/* Game Category Navigation */}
            <div className="bg-white border border-sky-200 rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5">
                  <Gamepad2 size={15} /> Gamifikasi Belajar Aktif
                </span>
                <h2 className="text-2xl font-black text-slate-800">5 Mode Game Edukasi Pancasila</h2>
                <p className="text-xs text-slate-500">Pilih mode permainan favoritmu untuk belajar sambil berpetualang.</p>
              </div>

              {/* Game Sub-tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {[
                  { id: 'platformer', label: '1. Petualangan 2D' },
                  { id: 'speed', label: '2. Kuis Kilat' },
                  { id: 'detective', label: '3. Detektif Moral' },
                  { id: 'pemilu', label: '4. Simulasi Pemilu' },
                  { id: 'puzzle', label: '5. Puzzle Hierarki' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveGameTab(g.id as any);
                      sound.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeGameTab === g.id
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-sky-50 text-slate-600 hover:text-sky-800 border border-sky-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Game Rendering */}
            {activeGameTab === 'platformer' && (
              <PancasilaPlatformer
                onCompleteScore={(pts) =>
                  setCurrentUser((p) => ({
                    ...p,
                    points: p.points + pts,
                    badges: Array.from(new Set([...p.badges, 'badge-nusantara'])),
                  }))
                }
              />
            )}

            {activeGameTab === 'speed' && (
              <SpeedQuizGame
                onScoreEarned={(pts) =>
                  setCurrentUser((p) => ({
                    ...p,
                    points: p.points + pts,
                    badges: Array.from(new Set([...p.badges, 'badge-kilat'])),
                  }))
                }
              />
            )}

            {activeGameTab === 'detective' && (
              <DetectiveGame
                onCaseSolved={(pts) =>
                  setCurrentUser((p) => ({
                    ...p,
                    points: p.points + pts,
                    badges: Array.from(new Set([...p.badges, 'badge-detektif'])),
                  }))
                }
              />
            )}

            {activeGameTab === 'pemilu' && (
              <ElectionSimGame
                onVoteSubmitted={(pts) =>
                  setCurrentUser((p) => ({
                    ...p,
                    points: p.points + pts,
                    badges: Array.from(new Set([...p.badges, 'badge-demokrasi'])),
                  }))
                }
              />
            )}

            {activeGameTab === 'puzzle' && (
              <PancasilaPuzzleGame
                onCompleted={(pts) =>
                  setCurrentUser((p) => ({
                    ...p,
                    points: p.points + pts,
                    badges: Array.from(new Set([...p.badges, 'badge-konstitusi'])),
                  }))
                }
              />
            )}
          </div>
        )}

        {/* ================= 5. KUIS INTERAKTIF ================= */}
        {activeMenu === 'kuis' && (
          <div className="space-y-6 animate-fade-in">
            <QuizEngine
              questions={activeQuizQuestions || questionsBank}
              quizTitle={activeQuizTitle || 'Asesmen Komprehensif Pendidikan Pancasila SMANDE'}
              studentName={currentUser.name}
              studentClass={currentUser.className || 'XI-1'}
              onFinishQuiz={handleQuizFinish}
              onBackToMaterials={() => {
                setActiveMenu('materi');
                setSelectedMaterial(null);
              }}
            />
          </div>
        )}

        {/* ================= 6. BANK SOAL ================= */}
        {activeMenu === 'bankSoal' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-sky-200 rounded-3xl p-6 md:p-8 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5 mb-1">
                  <Brain size={15} /> Gudang Soal & Latihan
                </span>
                <h2 className="text-2xl font-black text-slate-800">Bank Soal HOTS Kelas X, XI, XII</h2>
                <p className="text-xs text-slate-500">
                  Latihan soal terstruktur berdasarkan bab, tingkat kesulitan, dan 7 jenis tipe soal interaktif di SMA Negeri 1 Mande.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveQuizQuestions(questionsBank);
                  setActiveQuizTitle('Asesmen Mandiri Bank Soal SMANDE');
                  setActiveMenu('kuis');
                  sound.playClick();
                }}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white rounded-xl shadow-md transition-all"
              >
                Kerjakan Seluruh Bank Soal ✍️
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionsBank.map((q, idx) => (
                <div key={q.id} className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-700">
                      Soal #{idx + 1} • Kelas {q.grade}
                    </span>
                    <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full uppercase font-bold">
                      {q.difficulty}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800 leading-snug">{q.prompt}</h4>
                  <div className="text-xs text-slate-500 pt-2 border-t border-sky-100">
                    <span className="text-sky-600 font-bold">Kategori:</span> {q.type.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. KOMPETISI, LENCANA & SERTIFIKAT ================= */}
        {(activeMenu === 'kompetisi' || activeMenu === 'profil') && (
          <ProfileAndCompetitionsView user={currentUser} />
        )}

        {/* ================= 8. SIMULASI DEMOKRASI ================= */}
        {activeMenu === 'simulasi' && (
          <SimulationsView
            onBadgeEarned={(badgeTitle) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + 100,
                badges: Array.from(new Set([...p.badges, 'badge-demokrasi'])),
              }));
            }}
          />
        )}

        {/* ================= OBJEK 3D 4 PILAR ================= */}
        {activeMenu === 'objek3d' && (
          <ThreeDimensionalViewer />
        )}

        {/* ================= GALERI PRESIDEN REPUBLIK INDONESIA ================= */}
        {activeMenu === 'galeriPresiden' && (
          <NationalGalleryView
            initialTab="presiden"
            onAddPoints={(pts) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + pts,
                badges: Array.from(new Set([...p.badges, 'badge-presiden'])),
              }));
            }}
          />
        )}

        {/* ================= GALERI TOKOH NASIONAL ================= */}
        {activeMenu === 'galeriTokoh' && (
          <NationalGalleryView
            initialTab="tokoh"
            onAddPoints={(pts) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + pts,
                badges: Array.from(new Set([...p.badges, 'badge-tokoh'])),
              }));
            }}
          />
        )}

        {/* ================= 9. PETA NUSANTARA ================= */}
        {activeMenu === 'nusantara' && (
          <NusantaraInteractiveMap />
        )}

        {/* ================= 10. E-LIBRARY ================= */}
        {activeMenu === 'elibrary' && (
          <ELibraryView />
        )}

        {/* ================= GLOSARIUM PANCASILA ================= */}
        {activeMenu === 'glosarium' && (
          <GlossaryView />
        )}

        {/* ================= 11. FORUM DISKUSI ================= */}
        {activeMenu === 'forum' && (
          <ForumDiscussionView
            currentUserRole={currentUser.role}
            currentUserName={currentUser.name}
          />
        )}

        {/* ================= 12. AGENDA & TUGAS ================= */}
        {activeMenu === 'agenda' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-sky-200 rounded-3xl p-6 md:p-8 shadow-md">
              <span className="text-xs uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5 mb-1">
                <Calendar size={15} /> Kalender Akademik & Agenda Belajar
              </span>
              <h2 className="text-2xl font-black text-slate-800">Agenda Pembelajaran SMA Negeri 1 Mande</h2>
              <p className="text-xs text-slate-500">Jadwal Asesmen, Tugas LKPD, dan Peringatan Hari Bersejarah Nasional.</p>
            </div>

            {/* Widget Jam & Kalender Live */}
            <ClockWidget variant="compact" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-sky-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-slate-800">Jadwal Tugas & Asesmen Terdekat:</h4>
                <div className="space-y-3">
                  {initialAnnouncements.map((a) => (
                    <div key={a.id} className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-xs">
                      <div className="flex justify-between font-bold text-sky-800 mb-1">
                        <span>{a.category}</span>
                        <span className="text-slate-500">{a.date}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 mb-1">{a.title}</h5>
                      <p className="text-slate-600">{a.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-sky-100 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-slate-800">Peringatan Hari Bersejarah Nasional:</h4>
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">1 Juni</span>
                    <span className="text-sky-700 font-bold">Hari Lahir Pancasila</span>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">17 Agustus</span>
                    <span className="text-red-600 font-bold">Hari Kemerdekaan RI</span>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">18 Agustus</span>
                    <span className="text-emerald-700 font-bold">Hari Konstitusi Republik Indonesia</span>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">1 Oktober</span>
                    <span className="text-amber-700 font-bold">Hari Kesaktian Pancasila</span>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">28 Oktober</span>
                    <span className="text-blue-700 font-bold">Hari Sumpah Pemuda</span>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex justify-between">
                    <span className="font-semibold text-slate-800">10 November</span>
                    <span className="text-red-700 font-bold">Hari Pahlawan Nasional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 13. DASHBOARD GURU ================= */}
        {activeMenu === 'dashboardGuru' && (
          <TeacherDashboard />
        )}

        {/* ================= 15. TENTANG WEBSITE ================= */}
        {activeMenu === 'tentang' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white border border-sky-200 rounded-3xl p-6 md:p-8 shadow-md text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 shadow-md border border-sky-200 mb-3 flex items-center justify-center">
                <img
                  src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
                  alt="Logo Ruang Pendidikan Pancasila SMANDE"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Website Pendidikan Pancasila Interaktif SMANDE</h2>
              <p className="text-xs text-sky-700 font-bold mt-1">
                Platform Media Pembelajaran Mandiri & Terpadu SMA Negeri 1 Mande (Cianjur, Jawa Barat)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-sky-100 p-6 rounded-3xl shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-sky-800">Identitas Sekolah:</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div><b>Nama Sekolah:</b> SMA Negeri 1 Mande (SMANDE)</div>
                  <div><b>NPSN:</b> 20203875</div>
                  <div><b>Alamat:</b> Jl. Arya Wiratanudatar KM 8, Mande, Kab. Cianjur, Jawa Barat</div>
                  <div><b>Kurikulum:</b> Kurikulum Merdeka (Fase E & F)</div>
                  <div><b>Mata Pelajaran:</b> Pendidikan Pancasila (PPKn)</div>
                </div>
              </div>

              <div className="bg-white border border-sky-100 p-6 rounded-3xl shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-sky-800">Tim Pengembang & Pengampu:</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div><b>Guru Pengampu:</b> Munawar Rois, S.Pd.</div>
                  <div><b>NIP:</b> 19710815 199802 1 004</div>
                  <div><b>Email Pembelajaran:</b> munawarrois81@guru.sma.belajar.id</div>
                  <div><b>Teknologi:</b> React, TypeScript, Tailwind CSS (Nuansa Biru Langit), Web Audio API, Gemini AI SDK</div>
                </div>
              </div>
            </div>
          </div>
        )}
        </NavigationWindowFrame>
      </main>

      {/* Footer in Deep Sky Blue */}
      <footer className="mt-auto bg-sky-900 border-t border-sky-800 py-6 text-sky-100 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center">
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg font-black tracking-wide text-white drop-shadow-sm">
            <span>Made In</span>
            <span className="inline-flex items-center justify-center text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
              <Heart size={22} className="fill-red-500 text-red-500 stroke-[2.5]" />
            </span>
            <span>Guru Munawar Rois, S.Pd.</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Tutor Dialog */}
      <AITutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        studentGrade={`Kelas ${selectedGrade}`}
      />
    </div>
  );
}
