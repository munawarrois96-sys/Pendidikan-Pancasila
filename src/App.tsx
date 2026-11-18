import React, { useState, useEffect, useRef } from 'react';
import { materialsData } from './data/materialsData';
import { questionsBank } from './data/quizData';
import { initialAnnouncements } from './data/forumAndAnnouncements';
import { defaultStudents, defaultTeacher, defaultAdmin, getStoredStudents, saveStoredStudents } from './utils/userStore';
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
import { InteractiveVideoPlayer } from './components/InteractiveVideoPlayer';
import { NavigationWindowFrame } from './components/NavigationWindowFrame';
import { ClockWidget } from './components/ClockWidget';
import { GlossaryView } from './components/GlossaryView';
import { ThreeDimensionalViewer } from './components/ThreeDimensionalViewer';
import { NationalGalleryView } from './components/NationalGalleryView';
import { TkaSimulationView } from './components/TkaSimulationView';
import { TeacherToolkitView } from './components/TeacherToolkitView';
import { CpnsSimulationView } from './components/CpnsSimulationView';
import { PppkSimulationView } from './components/PppkSimulationView';

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
  Info,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Clock,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Compass,
  Heart,
  Search,
  Landmark,
  Users,
  Wrench,
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
  const [students, setStudents] = useState<UserProfile[]>(getStoredStudents);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const list = getStoredStudents();
    return list[0] || defaultStudents[0];
  });
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  const handleUpdateStudents = (newStudents: UserProfile[]) => {
    setStudents(newStudents);
    saveStoredStudents(newStudents);
  };

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.setMuted(next);
  };

  const handleRoleChange = (role: 'siswa' | 'guru' | 'admin') => {
    sound.playClick();
    if (role === 'siswa') setCurrentUser(students[0] || defaultStudents[0]);
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

  // Navigation Drawer, Top Dropdowns & Live Search State
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [selectedDrawerCat, setSelectedDrawerCat] = useState('Semua');
  const [openNavGroup, setOpenNavGroup] = useState<'belajar' | 'mainUji' | 'guruProfil' | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape') {
        setOpenNavGroup(null);
        setIsSearchFocused(false);
        setIsNavDrawerOpen(false);
        searchInputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenNavGroup(null);
        setIsSearchFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 20 Main Navigation Items with categories for clear visitor navigation
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home, category: 'Utama', desc: 'Sambutan guru, profil sekolah, dan gambaran umum' },
    { id: 'simulasiCpns', label: 'Simulasi CPNS (SKD 110 Soal)', icon: Award, category: 'Asesmen', desc: 'Simulasi CAT BKN: TKP (45), TIU (35), TWK (30), durasi 100 menit, skor maks 550' },
    { id: 'simulasiPppk', label: 'Simulasi PPPK (145 Soal)', icon: UserCheck, category: 'Asesmen', desc: 'Seleksi Kompetensi Teknis (90), Manajerial (25), Sosio-Kultural (20), Wawancara (10)' },
    { id: 'simulasiTka', label: 'Simulasi TKA Pancasila (30 Soal)', icon: GraduationCap, category: 'Asesmen', desc: 'Simulasi TKA SMA (PPKn/PKN) 30 Soal HOTS Kelas 12 (4 Elemen)' },
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
    { id: 'toolGuru', label: 'TOOL Guru (10 Alat)', icon: Wrench, category: 'Manajemen', desc: '10 Alat bantu mengajar: timer, acak nama, kelompok, scan, LJK, jadwal' },
    { id: 'dashboardGuru', label: 'Dashboard Guru', icon: UserCheck, category: 'Manajemen', desc: 'Panel guru, bank soal & rekap ekspor nilai' },
    { id: 'tentang', label: 'Tentang Web', icon: Info, category: 'Informasi', desc: 'Profil SMA Negeri 1 Mande & tim pengampu' },
  ];

  const filteredNavItems = navItems.filter((item) => {
    const matchSearch = item.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                        item.desc.toLowerCase().includes(drawerSearch.toLowerCase()) ||
                        item.category.toLowerCase().includes(drawerSearch.toLowerCase());
    const matchCategory = selectedDrawerCat === 'Semua' || item.category === selectedDrawerCat;
    return matchSearch && matchCategory;
  });

  // Top-level Dropdown Groups matching Screenshot Layout
  const navGroups: Array<{
    key: 'belajar' | 'mainUji' | 'guruProfil';
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconColor: string;
    itemIds: string[];
  }> = [
    {
      key: 'belajar',
      label: 'Belajar',
      icon: BookOpen,
      iconColor: 'text-emerald-600',
      itemIds: ['materi', 'video', 'elibrary', 'glosarium', 'galeriPresiden', 'galeriTokoh', 'nusantara'],
    },
    {
      key: 'mainUji',
      label: 'Main & Uji',
      icon: Gamepad2,
      iconColor: 'text-indigo-600',
      itemIds: ['game', 'simulasi', 'objek3d', 'kuis', 'bankSoal', 'simulasiTka', 'simulasiCpns', 'simulasiPppk'],
    },
    {
      key: 'guruProfil',
      label: 'Guru & Profil',
      icon: Briefcase,
      iconColor: 'text-rose-600',
      itemIds: ['toolGuru', 'dashboardGuru', 'kompetisi', 'forum', 'agenda', 'tentang'],
    },
  ];

  // Header live search results across menus and material chapters
  const searchQuery = headerSearch.trim().toLowerCase();
  const headerNavMatches = searchQuery
    ? navItems
        .filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery) ||
            item.desc.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery)
        )
        .slice(0, 6)
    : [];
  const headerMaterialMatches = searchQuery
    ? materialsData
        .filter(
          (mat) =>
            mat.title.toLowerCase().includes(searchQuery) ||
            mat.summary.toLowerCase().includes(searchQuery) ||
            `kelas ${mat.grade}`.toLowerCase().includes(searchQuery)
        )
        .slice(0, 4)
    : [];

  // Helper for hierarchical Breadcrumbs
  const currentNavItem = navItems.find((n) => n.id === activeMenu) || navItems[0];
  const gameLabels: Record<typeof activeGameTab, string> = {
    platformer: '1. Petualangan 2D',
    speed: '2. Kuis Kilat',
    detective: '3. Detektif Moral',
    pemilu: '4. Simulasi Pemilu',
    puzzle: '5. Puzzle Hierarki',
  };

  type BreadcrumbEntry = {
    label: string;
    onClick?: () => void;
    isCurrent?: boolean;
  };

  const getBreadcrumbs = (): BreadcrumbEntry[] => {
    const crumbs: BreadcrumbEntry[] = [
      {
        label: 'Beranda',
        onClick: activeMenu === 'beranda' ? undefined : () => handleNavigate('beranda'),
        isCurrent: activeMenu === 'beranda',
      },
    ];

    if (activeMenu === 'beranda') {
      crumbs.push({
        label: 'Portal Utama SMANDE',
        isCurrent: true,
      });
      return crumbs;
    }

    // Category level (opens drawer filtered to that category)
    crumbs.push({
      label: currentNavItem.category,
      onClick: () => {
        sound.playClick();
        setSelectedDrawerCat(currentNavItem.category);
        setDrawerSearch('');
        setIsNavDrawerOpen(true);
      },
    });

    // Determine if there is a deeper sub-level
    if (activeMenu === 'materi') {
      crumbs.push({
        label: currentNavItem.label,
        onClick: selectedMaterial
          ? () => {
              sound.playClick();
              setSelectedMaterial(null);
            }
          : undefined,
      });
      crumbs.push({
        label: `Kelas ${selectedGrade}`,
        onClick: selectedMaterial
          ? () => {
              sound.playClick();
              setSelectedMaterial(null);
            }
          : undefined,
        isCurrent: !selectedMaterial,
      });
      if (selectedMaterial) {
        crumbs.push({
          label: `Bab ${selectedMaterial.chapterNumber}: ${selectedMaterial.title}`,
          isCurrent: true,
        });
      }
      return crumbs;
    }

    if (activeMenu === 'video') {
      crumbs.push({
        label: currentNavItem.label,
      });
      crumbs.push({
        label: videoFilterGrade === 'ALL' ? 'Semua Kelas' : `Kelas ${videoFilterGrade}`,
      });
      crumbs.push({
        label: activeVideoMaterial.video.title,
        isCurrent: true,
      });
      return crumbs;
    }

    if (activeMenu === 'game') {
      crumbs.push({
        label: currentNavItem.label,
      });
      crumbs.push({
        label: gameLabels[activeGameTab],
        isCurrent: true,
      });
      return crumbs;
    }

    if (activeMenu === 'kuis' && activeQuizTitle) {
      crumbs.push({
        label: currentNavItem.label,
        onClick: () => {
          sound.playClick();
          setActiveQuizQuestions(null);
          setActiveQuizTitle('');
        },
      });
      crumbs.push({
        label: activeQuizTitle,
        isCurrent: true,
      });
      return crumbs;
    }

    crumbs.push({
      label: currentNavItem.label,
      isCurrent: true,
    });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50/40 text-slate-800 flex flex-col font-sans transition-all duration-200">
      {/* 1. Soft Pastel Sky-Blue Top Hero Logo Banner (Non-sticky so page breathes) */}
      <div className="w-full bg-gradient-to-b from-sky-200/80 via-sky-100/75 to-sky-50/90 border-b border-sky-200/60 py-5 sm:py-7 px-4 flex justify-center items-center">
        <button
          type="button"
          onClick={() => {
            handleNavigate('beranda');
            setOpenNavGroup(null);
          }}
          className="bg-white rounded-3xl p-3 sm:p-4 w-44 h-44 sm:w-52 sm:h-52 shadow-xl shadow-sky-900/10 border border-white hover:scale-[1.02] active:scale-[0.99] transition-transform flex items-center justify-center cursor-pointer"
          title="Kembali ke Beranda Ruang Pendidikan Pancasila"
        >
          <img
            src="/assets/aistudio/Logo_Pembelajaran_Interaktif_Pendidikan_Pancasila__1__a1b85239.png"
            alt="Logo Ruang Pendidikan Pancasila SMA Negeri 1 Mande"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* 2. Clean Sticky White Navbar (Title Left, Hamburger + Live Search Right, 4 Primary Tabs Row) */}
      <header
        ref={navContainerRef}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5 space-y-2.5">
          {/* Row 1: 2-line Deep Sky-Blue Brand Title + Outlined Hamburger & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => {
                handleNavigate('beranda');
                setOpenNavGroup(null);
              }}
              className="text-left group cursor-pointer shrink-0"
            >
              <div className="font-extrabold text-sm sm:text-base md:text-lg text-sky-800 leading-tight tracking-tight group-hover:text-sky-600 transition-colors">
                Ruang Pembelajaran Interaktif
              </div>
              <div className="font-extrabold text-sm sm:text-base md:text-lg text-sky-800 leading-tight tracking-tight group-hover:text-sky-600 transition-colors">
                Pendidikan Pancasila
              </div>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Outlined Square Hamburger Button (Pojok Kanan Atas) */}
              <button
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(true);
                  setOpenNavGroup(null);
                  sound.playClick();
                }}
                aria-label="Buka Menu Navigasi Lengkap"
                title={`Buka semua ${navItems.length} menu navigasi`}
                className="w-10 h-10 rounded-xl border-2 border-sky-600 bg-white hover:bg-sky-50 text-sky-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-95"
              >
                <Menu size={20} strokeWidth={2.25} />
              </button>

              {/* Rounded-Full Live Search Bar with / Shortcut */}
              <div className="relative flex-1 sm:w-72 md:w-80">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={headerSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setHeaderSearch(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Cari materi, tool, game... (tekan /)"
                  aria-label="Cari materi, tool, dan fitur pembelajaran"
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-sky-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all"
                />
                {headerSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeaderSearch('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.length > 0 && (
                  <div className="absolute right-0 left-0 sm:left-auto sm:w-96 mt-2 bg-white rounded-2xl shadow-2xl border border-sky-200 p-2.5 z-50 max-h-96 overflow-y-auto space-y-2">
                    {headerNavMatches.length === 0 && headerMaterialMatches.length === 0 ? (
                      <div className="py-5 text-center text-xs text-slate-500">
                        Tidak ditemukan hasil untuk &ldquo;{headerSearch}&rdquo;
                      </div>
                    ) : (
                      <>
                        {headerNavMatches.length > 0 && (
                          <div className="space-y-1">
                            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Menu &amp; Fitur
                            </div>
                            {headerNavMatches.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    handleNavigate(item.id);
                                    setHeaderSearch('');
                                    setIsSearchFocused(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 text-left transition-colors cursor-pointer"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                                    <Icon size={16} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-800 truncate">
                                      {item.label}
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">
                                      {item.desc}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {headerMaterialMatches.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-slate-100">
                            <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Bab Materi Pembelajaran
                            </div>
                            {headerMaterialMatches.map((mat) => (
                              <button
                                key={mat.id}
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedGrade(mat.grade);
                                  setActiveMenu('materi');
                                  setSelectedMaterial(mat);
                                  setHeaderSearch('');
                                  setIsSearchFocused(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 text-left transition-colors cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-black">
                                  {mat.grade}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-slate-800 truncate">
                                    Bab {mat.chapterNumber}: {mat.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    Kelas {mat.grade} • Kurikulum Merdeka
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: 4 Clean Horizontal Navigation Tabs (Beranda, Belajar ▾, Main & Uji ▾, Guru & Profil ▾) */}
          <nav aria-label="Navigasi Utama" className="flex items-center gap-2 sm:gap-3 flex-wrap pt-0.5">
            {/* Tab 1: Beranda */}
            <button
              type="button"
              onClick={() => {
                handleNavigate('beranda');
                setOpenNavGroup(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeMenu === 'beranda'
                  ? 'border-2 border-sky-500 bg-sky-50/70 text-sky-700 shadow-2xs'
                  : 'border border-transparent text-slate-600 hover:text-sky-800 hover:bg-sky-50'
              }`}
            >
              <Home size={15} className={activeMenu === 'beranda' ? 'text-sky-600' : 'text-amber-600'} />
              <span>Beranda</span>
            </button>

            {/* Tabs 2-4: Grouped Dropdown Menus */}
            {navGroups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = openNavGroup === group.key;
              const isGroupActive = group.itemIds.includes(activeMenu);
              const groupItems = group.itemIds
                .map((id) => navItems.find((n) => n.id === id))
                .filter((n): n is (typeof navItems)[number] => Boolean(n));

              return (
                <div key={group.key} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => {
                      sound.playClick();
                      setOpenNavGroup(isOpen ? null : group.key);
                      setIsSearchFocused(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isGroupActive || isOpen
                        ? 'border-2 border-sky-500 bg-sky-50/70 text-sky-800'
                        : 'border border-transparent text-slate-700 hover:text-sky-800 hover:bg-sky-50'
                    }`}
                  >
                    <GroupIcon size={15} className={group.iconColor} />
                    <span>{group.label}</span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-sky-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-sky-200 p-2 z-50 space-y-1 max-h-[75vh] overflow-y-auto">
                      {groupItems.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemActive = activeMenu === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              handleNavigate(item.id);
                              setOpenNavGroup(null);
                            }}
                            className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isItemActive
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'hover:bg-sky-50 text-slate-700'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                isItemActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'
                              }`}
                            >
                              <ItemIcon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs sm:text-sm leading-snug truncate">
                                {item.label}
                              </div>
                              <div
                                className={`text-[11px] truncate ${
                                  isItemActive ? 'text-sky-100' : 'text-slate-500'
                                }`}
                              >
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Slide-Over Drawer Navigasi Pengunjung (Opens from Top-Right Hamburger) */}
        {isNavDrawerOpen && (
          <div
            onClick={() => setIsNavDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden border-l border-sky-200"
            >
              {/* Drawer Header */}
              <div className="bg-sky-700 text-white p-5 border-b border-sky-600 flex items-center justify-between">
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
                  type="button"
                  onClick={() => setIsNavDrawerOpen(false)}
                  className="p-2 rounded-xl bg-sky-800 hover:bg-sky-600 text-white transition-colors cursor-pointer"
                  title="Tutup Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Utilities: Role Switcher, Sound Toggle, Clock */}
              <div className="bg-sky-50 p-3.5 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-700" />
                  <span className="font-bold text-sky-900">Mode Pengunjung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleSound}
                    title={isSoundMuted ? 'Nyalakan Audio SFX' : 'Bisukan Audio SFX'}
                    className="p-1.5 rounded-lg bg-white hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                  >
                    {isSoundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <div className="flex gap-1">
                    {(['siswa', 'guru', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`px-2 py-0.5 rounded capitalize font-bold text-[11px] cursor-pointer ${
                          currentUser.role === r ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-sky-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
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
                      type="button"
                      onClick={() => setDrawerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs w-4 h-4 rounded-full flex items-center justify-center bg-slate-200 cursor-pointer"
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
                        type="button"
                        onClick={() => setSelectedDrawerCat(cat)}
                        className={`px-2.5 py-1 rounded-xl shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
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

              {/* All Menus in Drawer */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 mb-2 flex items-center justify-between">
                  <span>Daftar Menu Pembelajaran ({filteredNavItems.length}):</span>
                  {selectedDrawerCat !== 'Semua' && (
                    <button
                      type="button"
                      onClick={() => setSelectedDrawerCat('Semua')}
                      className="text-[10px] text-sky-600 hover:underline font-bold cursor-pointer"
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
                          type="button"
                          onClick={() => {
                            handleNavigate(item.id);
                            setIsNavDrawerOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all text-left border cursor-pointer ${
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
                <Heart size={14} className="fill-red-500 text-red-500 inline" />
                <span>Guru Munawar Rois, S.Pd.</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. Deep Ocean-Blue Scrolling Welcome Strip */}
      <div className="w-full bg-gradient-to-r from-sky-800 via-blue-700 to-sky-800 text-white py-2 overflow-hidden border-b border-sky-900/20">
        <div className="animate-marquee text-xs sm:text-sm font-bold tracking-wide">
          <div className="flex items-center shrink-0">
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
            <span className="mx-6">★ Selamat Datang di Pembelajaran Pendidikan Pancasila ★</span>
          </div>
        </div>
      </div>

      {/* 4. Hierarchical Breadcrumbs Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white/95 backdrop-blur-sm border-b border-sky-200/80 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-x-auto whitespace-nowrap py-0.5">
            {breadcrumbs.map((crumb, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                  {idx > 0 && (
                    <ChevronRight size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
                  )}
                  {crumb.onClick && !isLast ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-sky-700 hover:underline transition-colors cursor-pointer"
                    >
                      {isFirst && <Home size={14} className="text-sky-600 shrink-0" />}
                      <span>{crumb.label}</span>
                    </button>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={`inline-flex items-center gap-1.5 ${
                        isLast ? 'font-bold text-sky-800' : 'font-medium text-slate-600'
                      }`}
                    >
                      {isFirst && <Home size={14} className="text-sky-600 shrink-0" />}
                      <span className="truncate max-w-[240px] sm:max-w-[420px]">{crumb.label}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <span className="hidden md:inline-block text-xs text-slate-400 shrink-0">
            Posisi Hierarki Halaman
          </span>
        </div>
      </nav>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {(() => {
          const renderSections = () => (
            <>
        {/* ================= 1. BERANDA ================= */}
        {activeMenu === 'beranda' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Welcome Banner in Deep Ocean Blue */}
            <div className="bg-gradient-to-br from-sky-800 via-blue-800 to-sky-900 text-white rounded-3xl p-6 md:p-10 shadow-xl shadow-sky-900/20 relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold">
                  <span>🇮🇩 SMA Negeri 1 Mande</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Belajar Pendidikan <span className="text-amber-300">Pancasila</span>
                </h1>

                <p className="text-sm md:text-base text-sky-100 leading-relaxed max-w-2xl font-medium">
                  Platform pembelajaran interaktif Kurikulum Merdeka Fase E & F di <b>SMA Negeri 1 Mande (SMANDE)</b>. Tumbuh menjadi pelajar berkarakter, bernalar kritis, dilengkapi materi HOTS, 5 game edukasi, simulasi demokrasi, dan objek 3D 4 Pilar Kebangsaan.
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
                      { id: 'simulasiCpns', label: 'Simulasi CPNS SKD (110 Soal) 🇮🇩', icon: Award },
                      { id: 'simulasiPppk', label: 'Simulasi PPPK (145 Soal) 🎓', icon: UserCheck },
                      { id: 'simulasiTka', label: 'Simulasi TKA (30 Soal) ⭐', icon: GraduationCap },
                      { id: 'toolGuru', label: 'TOOL Guru (10 Alat) 🛠️', icon: Wrench },
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
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold backdrop-blur-xs active:scale-95 ${
                            p.id === 'simulasiTka'
                              ? 'bg-amber-400 text-sky-950 border-amber-300 shadow-md font-black'
                              : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                          }`}
                        >
                          <Icon size={13} className={p.id === 'simulasiTka' ? 'text-sky-950' : 'text-amber-300'} />
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

            {/* SPESIAL TKA: BANNER SIMULASI TKA PENDIDIKAN PANCASILA SMA (PPKn / PKN) */}
            <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-amber-300/80 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles size={13} />
                    <span>BARU: Simulasi TKA SMA Kelas 12</span>
                  </span>
                  <span className="bg-white/20 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full">
                    Kurikulum Merdeka (Eks PPKn / PKN)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                  Simulasi TKA Pendidikan Pancasila SMA — 30 Soal Standar Ujian
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  Terdiri dari <strong>20 Pilihan Ganda</strong>, <strong>5 Kategori Benar/Salah (3 Pernyataan)</strong>, dan <strong>5 Multi Jawaban (3 dari 5 Opsi)</strong>. Menguji 4 Elemen (Pancasila, UUD NRI 1945, Bhinneka Tunggal Ika, NKRI) pada 3 level kognitif: Pemahaman, Penerapan, dan Penalaran (HOTS).
                </p>
                <div className="flex items-center gap-3 text-xs text-amber-300 font-bold pt-1 flex-wrap">
                  <span>⏱️ 60 Menit</span>
                  <span>•</span>
                  <span>📊 Skor Instan & Analisis 4 Elemen</span>
                  <span>•</span>
                  <span>💡 Pembahasan Mendalam</span>
                </div>
              </div>

              <div className="z-10 shrink-0">
                <button
                  onClick={() => {
                    setActiveMenu('simulasiTka');
                    sound.playClick();
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-sky-950 font-black text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border border-amber-300"
                >
                  <GraduationCap size={20} />
                  <span>Mulai Simulasi TKA (30 Soal)</span>
                </button>
              </div>
            </div>

            {/* SPESIAL SIMULASI ASN: CPNS (110 SOAL) & PPPK (145 SOAL) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Simulasi CPNS SKD */}
              <div className="bg-gradient-to-br from-red-900 via-rose-900 to-red-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-400/80 relative overflow-hidden flex flex-col justify-between space-y-4">
                <div className="space-y-2 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Award size={13} />
                      <span>BARU: CAT BKN CPNS SKD</span>
                    </span>
                    <span className="bg-white/20 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full">
                      110 Soal • 100 Menit
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Simulasi SKD CPNS (110 Soal)
                  </h3>
                  <p className="text-xs text-red-100 leading-relaxed font-medium">
                    Sistem CAT BKN resmi: <b>TKP</b> (45 soal, bobot 1–5), <b>TIU</b> (35 soal, benar 5), dan <b>TWK</b> (30 soal, benar 5). Total nilai maksimal 550 dengan verifikasi passing grade otomatis.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-amber-300 font-bold pt-1 flex-wrap">
                    <span>⏱️ 100 Menit (130m Netra)</span>
                    <span>•</span>
                    <span>📊 Skor Maks: 550</span>
                    <span>•</span>
                    <span>💡 Pembahasan Lengkap</span>
                  </div>
                </div>

                <div className="z-10 pt-1">
                  <button
                    onClick={() => {
                      setActiveMenu('simulasiCpns');
                      sound.playClick();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-amber-300"
                  >
                    <Award size={18} />
                    <span>Mulai Simulasi CPNS (110 Soal)</span>
                  </button>
                </div>

                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 pointer-events-none select-none">
                  🇮🇩
                </div>
              </div>

              {/* Card 2: Simulasi PPPK */}
              <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-sky-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-sky-400/80 relative overflow-hidden flex flex-col justify-between space-y-4">
                <div className="space-y-2 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-sky-400 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <UserCheck size={13} />
                      <span>BARU: SELEKSI KOMPETENSI PPPK</span>
                    </span>
                    <span className="bg-white/20 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full">
                      145 Soal • 130 Menit
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Simulasi Seleksi PPPK (145 Soal)
                  </h3>
                  <p className="text-xs text-sky-100 leading-relaxed font-medium">
                    Standar KemenPAN-RB: <b>Kompetensi Teknis</b> (90 soal), <b>Manajerial</b> (25 soal), <b>Sosial Kultural</b> (20 soal), dan <b>Wawancara</b> (10 soal). Total nilai maksimal 670.
                  </p>
                  <div className="flex items-center gap-3 text-xs text-sky-300 font-bold pt-1 flex-wrap">
                    <span>⏱️ 130 Menit (120m + 10m)</span>
                    <span>•</span>
                    <span>📊 Skor Maks: 670</span>
                    <span>•</span>
                    <span>💡 Nilai Bertingkat 1-4</span>
                  </div>
                </div>

                <div className="z-10 pt-1">
                  <button
                    onClick={() => {
                      setActiveMenu('simulasiPppk');
                      sound.playClick();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-300 hover:to-blue-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-sky-300"
                  >
                    <UserCheck size={18} />
                    <span>Mulai Simulasi PPPK (145 Soal)</span>
                  </button>
                </div>

                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 pointer-events-none select-none">
                  🎓
                </div>
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
                      { id: 'simulasiCpns', label: 'Simulasi CPNS SKD (110 Soal) 🇮🇩', desc: 'TKP (45), TIU (35), TWK (30) BKN CAT', icon: Award },
                      { id: 'simulasiPppk', label: 'Simulasi PPPK (145 Soal) 🎓', desc: 'Teknis (90), Manajerial, Sosio, Wawancara', icon: UserCheck },
                      { id: 'simulasiTka', label: 'Simulasi TKA Pancasila (30 Soal) ⭐', desc: 'Tes Kemampuan Akademik HOTS Kelas 12', icon: GraduationCap },
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
                      { id: 'toolGuru', label: 'TOOL Guru (10 Alat Bantu) 🛠️', desc: 'Timer, acak nama, scan, LJK, jadwal', icon: Wrench },
                      { id: 'kompetisi', label: 'Kompetisi & Lencana', desc: 'Peringkat siswa & badge digital', icon: Award },
                      { id: 'forum', label: 'Forum Musyawarah Kelas', desc: 'Diskusi kasus & etika berbangsa', icon: MessageSquare },
                      { id: 'agenda', label: 'Agenda & Hari Nasional', desc: 'Jadwal belajar & kalender HUT', icon: Calendar },
                      { id: 'dashboardGuru', label: 'Dashboard Guru Pengampu', desc: 'Kelola soal, siswa & nilai', icon: UserCheck },
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
        {activeMenu === 'kompetisi' && (
          <ProfileAndCompetitionsView user={currentUser} students={students} />
        )}

        {/* ================= SIMULASI TKA PENDIDIKAN PANCASILA SMA (30 SOAL) ================= */}
        {activeMenu === 'simulasiTka' && (
          <TkaSimulationView
            onAddPoints={(pts) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + pts,
              }));
            }}
            onNavigateHome={() => setActiveMenu('beranda')}
          />
        )}

        {/* ================= SIMULASI CPNS (SKD 110 SOAL) ================= */}
        {activeMenu === 'simulasiCpns' && (
          <CpnsSimulationView
            onAddPoints={(pts) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + pts,
              }));
            }}
            onNavigateHome={() => setActiveMenu('beranda')}
          />
        )}

        {/* ================= SIMULASI PPPK (145 SOAL) ================= */}
        {activeMenu === 'simulasiPppk' && (
          <PppkSimulationView
            onAddPoints={(pts) => {
              setCurrentUser((p) => ({
                ...p,
                points: p.points + pts,
              }));
            }}
            onNavigateHome={() => setActiveMenu('beranda')}
          />
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

        {/* ================= TOOL GURU (10 ALAT BANTU MENGAJAR) ================= */}
        {activeMenu === 'toolGuru' && (
          <TeacherToolkitView students={students} />
        )}

        {/* ================= 13. DASHBOARD GURU ================= */}
        {activeMenu === 'dashboardGuru' && (
          <TeacherDashboard
            students={students}
            onUpdateStudents={handleUpdateStudents}
            onNavigateToCertificate={(selectedStd) => {
              setCurrentUser(selectedStd);
              setActiveMenu('kompetisi');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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
            </>
          );

          return activeMenu === 'beranda' ? (
            renderSections()
          ) : (
            <NavigationWindowFrame
              activeMenuId={activeMenu}
              navItems={navItems}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              canGoBack={navigationHistory.length > 1 || selectedMaterial !== null}
            >
              {renderSections()}
            </NavigationWindowFrame>
          );
        })()}
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
    </div>
  );
}
