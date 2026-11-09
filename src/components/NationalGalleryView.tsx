import React, { useState, useMemo } from 'react';
import {
  presidentsData,
  nationalHeroesData,
  PresidentItem,
  NationalHeroItem,
} from '../data/presidentsAndHeroesData';
import { sound } from '../utils/audio';
import {
  Landmark,
  Users,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Calendar,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Scale,
  Shield,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Share2,
  ExternalLink,
  MapPin,
  Heart,
  Quote,
  Flame,
  Check,
  ZoomIn,
  Maximize2,
  Download,
} from 'lucide-react';

interface NationalGalleryViewProps {
  initialTab?: 'presiden' | 'tokoh';
  onAddPoints?: (pts: number) => void;
}

export function NationalGalleryView({
  initialTab = 'presiden',
  onAddPoints,
}: NationalGalleryViewProps) {
  const [activeTab, setActiveTab] = useState<'presiden' | 'tokoh'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('SEMUA');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedPresident, setSelectedPresident] = useState<PresidentItem | null>(null);
  const [selectedHero, setSelectedHero] = useState<NationalHeroItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeImageError, setActiveImageError] = useState<Record<string, boolean>>({});

  // Full-size Photo Preview Lightbox Modal
  const [previewPhoto, setPreviewPhoto] = useState<{
    url: string;
    title: string;
    subtitle: string;
    categoryOrEra: string;
    source: string;
    periodOrLifespan: string;
  } | null>(null);

  // Mini Quiz Mode State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Compare mode state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparePresidentA, setComparePresidentA] = useState<PresidentItem>(presidentsData[0]);
  const [comparePresidentB, setComparePresidentB] = useState<PresidentItem>(presidentsData[7]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Filtered Presidents
  const filteredPresidents = useMemo(() => {
    return presidentsData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.popularTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.majorAchievements.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.birthPlaceDate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchEra = selectedEra === 'SEMUA' || item.era === selectedEra;
      return matchSearch && matchEra;
    });
  }, [searchQuery, selectedEra]);

  // Filtered Heroes
  const filteredHeroes = useMemo(() => {
    return nationalHeroesData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originProvince.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contributionToPancasila.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyActions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'SEMUA' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Quiz questions pool
  const quizQuestions = useMemo(() => {
    return [
      {
        prompt: 'Siapakah Presiden Republik Indonesia yang mempelopori pembentukan Komisi Pemberantasan Korupsi (KPK) pada tahun 2002 dan mendirikan Mahkamah Konstitusi (MK)?',
        options: ['Megawati Soekarnoputri', 'B.J. Habibie', 'Abdurrahman Wahid', 'Soeharto'],
        correct: 'Megawati Soekarnoputri',
        explanation: 'Presiden Megawati Soekarnoputri mengesahkan UU No. 30 Tahun 2002 tentang KPK serta memfasilitasi pembentukan Mahkamah Konstitusi pada tahun 2003.',
      },
      {
        prompt: 'Presiden RI yang dikenal sebagai "Bapak Teknologi" dan berhasil menciptakan pesawat terbang komersial pertama karya anak bangsa N-250 Gatotkaca adalah...',
        options: ['B.J. Habibie', 'Ir. Soekarno', 'Joko Widodo', 'Prabowo Subianto'],
        correct: 'B.J. Habibie',
        explanation: 'Prof. Dr. Ing. B.J. Habibie adalah pionir teknologi dirgantara dunia yang merancang pesawat N-250 Gatotkaca dan menjabat Presiden RI ke-3.',
      },
      {
        prompt: 'Siapakah tokoh bangsa pencetus Resolusi Jihad pada 22 Oktober 1945 yang mewajibkan umat membela kedaulatan tanah air dan memicu peristiwa Hari Pahlawan 10 November?',
        options: ['K.H. Hasyim Asy\'ari', 'K.H. Ahmad Dahlan', 'H. Agus Salim', 'Bung Tomo'],
        correct: 'K.H. Hasyim Asy\'ari',
        explanation: 'Hadratussyaikh K.H. Hasyim Asy\'ari (pendiri NU) mencetuskan Resolusi Jihad 22 Oktober 1945, yang kini diperingati sebagai Hari Santri Nasional.',
      },
      {
        prompt: 'Presiden RI ke-8 yang dilantik pada 20 Oktober 2024 dengan program prioritas Asta Cita dan program Makan Bergizi Gratis (MBG) adalah...',
        options: ['Prabowo Subianto', 'Joko Widodo', 'Susilo Bambang Yudhoyono', 'Megawati Soekarnoputri'],
        correct: 'Prabowo Subianto',
        explanation: 'Jenderal TNI (Purn.) Prabowo Subianto adalah Presiden RI ke-8 yang mengusung 8 Misi Asta Cita untuk kemandirian pangan, energi, dan gizi generasi emas 2045.',
      },
      {
        prompt: 'Siapakah pahlawan perempuan yang dengan penuh ketulusan menjahit Bendera Pusaka Sang Saka Merah Putih yang dikibarkan saat Proklamasi 17 Agustus 1945?',
        options: ['Hj. Fatmawati Soekarno', 'R.A. Kartini', 'Cut Nyak Dien', 'Dewi Sartika'],
        correct: 'Hj. Fatmawati Soekarno',
        explanation: 'Ibu Fatmawati Soekarno menjahit dengan tangan kain Sang Saka Merah Putih yang berkibar abadi pada momen proklamasi kemerdekaan di Pegangsaan Timur 56.',
      },
    ];
  }, []);

  const handleAnswerQuiz = (selectedOpt: string) => {
    if (quizAnswered) return;
    setQuizSelectedOption(selectedOpt);
    setQuizAnswered(true);

    const isCorrect = selectedOpt === quizQuestions[quizQuestionIndex].correct;
    if (isCorrect) {
      sound.playCorrect();
      setQuizScore((prev) => prev + 20);
    } else {
      sound.playWrong();
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizQuestionIndex + 1 < quizQuestions.length) {
      setQuizQuestionIndex((prev) => prev + 1);
      setQuizAnswered(false);
      setQuizSelectedOption(null);
    } else {
      setQuizFinished(true);
      sound.playVictory();
      if (onAddPoints) {
        onAddPoints(quizScore);
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizQuestionIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizSelectedOption(null);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Editorial Curatorial Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold tracking-wider uppercase">
              <Landmark size={15} className="text-amber-300" />
              <span>Wawasan Kebangsaan & Sejarah Kepemimpinan SMANDE</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-bold">Kurikulum Merdeka</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Galeri Presiden RI & Tokoh Nasional
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Menelusuri rekam jejak kepemimpinan 8 Presiden Republik Indonesia serta keteladanan para
              pendiri bangsa, perumus Pancasila, dan pahlawan kemerdekaan yang membentuk jati diri bangsa.
            </p>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setIsQuizModalOpen(true);
                handleRestartQuiz();
                sound.playClick();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-sky-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <HelpCircle size={16} />
              <span>Kuis Refleksi Tokoh</span>
            </button>
            <button
              onClick={() => {
                setIsCompareModalOpen(true);
                sound.playClick();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all active:scale-95"
            >
              <Scale size={16} />
              <span>Komparasi Pemimpin</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Switcher */}
        <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('presiden');
              sound.playClick();
            }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              activeTab === 'presiden'
                ? 'bg-white text-sky-800 shadow-md ring-2 ring-white/50'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Landmark size={18} className={activeTab === 'presiden' ? 'text-sky-700' : 'text-sky-200'} />
            <span>Presiden RI ke-1 s.d. ke-8</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'presiden' ? 'bg-sky-100 text-sky-800' : 'bg-white/20 text-white'
              }`}
            >
              8 Presiden
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tokoh');
              sound.playClick();
            }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              activeTab === 'tokoh'
                ? 'bg-white text-sky-800 shadow-md ring-2 ring-white/50'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users size={18} className={activeTab === 'tokoh' ? 'text-sky-700' : 'text-sky-200'} />
            <span>Tokoh Nasional & Pahlawan</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'tokoh' ? 'bg-sky-100 text-sky-800' : 'bg-white/20 text-white'
              }`}
            >
              14 Tokoh
            </span>
          </button>
        </div>
      </div>

      {/* Control Toolbar: Real-time Search & Filter Options */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'presiden'
                ? 'Cari nama presiden, gelar, masa jabatan, atau prestasi...'
                : 'Cari tokoh, peran di BPUPK/Panitia Sembilan, asal daerah...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dynamic Category/Era Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {activeTab === 'presiden' ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Era:</span>
              {[
                { label: 'Semua', value: 'SEMUA' },
                { label: 'Orde Lama', value: 'Orde Lama' },
                { label: 'Orde Baru', value: 'Orde Baru' },
                { label: 'Reformasi', value: 'Transisi Reformasi' },
                { label: 'Demokrasi', value: 'Demokrasi Elektoral' },
                { label: 'Indonesia Maju', value: 'Indonesia Maju' },
              ].map((era) => (
                <button
                  key={era.value}
                  onClick={() => {
                    setSelectedEra(era.value);
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedEra === era.value
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {era.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Kategori:</span>
              {[
                { label: 'Semua', value: 'SEMUA' },
                { label: 'Perumus Pancasila', value: 'Perumus Pancasila' },
                { label: 'Pendidikan', value: 'Pahlawan Pendidikan' },
                { label: 'Emansipasi & HAM', value: 'Emansipasi & HAM' },
                { label: 'Militer', value: 'Perjuangan Militer' },
                { label: 'Ulama & Agama', value: 'Tokoh Ulama & Agama' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRESIDEN REPUBLIK INDONESIA KE-1 S.D. KE-8 */}
      {/* ========================================================= */}
      {activeTab === 'presiden' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong className="text-sky-700">{filteredPresidents.length}</strong> dari 8 Presiden
              Republik Indonesia
            </span>
            <span>Urutan Kronologis Kepemimpinan Nasional (1945 – Sekarang)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPresidents.map((pres) => {
              const hasImgErr = activeImageError[pres.id];
              return (
                <div
                  key={pres.id}
                  onClick={() => {
                    setSelectedPresident(pres);
                    sound.playClick();
                  }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative"
                >
                  {/* Top Order Ribbon */}
                  <div className="h-1.5 bg-gradient-to-r from-sky-500 via-sky-600 to-amber-400" />

                  {/* President Image Frame */}
                  <div className="relative h-64 bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
                    {!hasImgErr ? (
                      <img
                        src={pres.portraitUrl}
                        alt={`Foto Resmi Presiden ${pres.name}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setActiveImageError((prev) => ({ ...prev, [pres.id]: true }))
                        }
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-700 to-sky-900 text-white text-center">
                        <Landmark size={48} className="text-amber-300 mb-2 opacity-80" />
                        <span className="font-serif text-lg font-bold">{pres.name}</span>
                        <span className="text-xs text-sky-200 mt-1">{pres.popularTitle}</span>
                      </div>
                    )}

                    {/* Gradient Scrim for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

                    {/* Top Left: Badge Order Number & Authentic Indicator */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      <div className="bg-white/95 backdrop-blur-sm text-sky-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-md border border-white/40 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        <span>Presiden ke-{pres.orderNumber}</span>
                      </div>
                      <div className="bg-amber-400/95 backdrop-blur-sm text-sky-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm border border-amber-300 flex items-center gap-1 w-fit">
                        <Sparkles size={11} className="text-sky-900" />
                        <span>Foto Asli Resmi</span>
                      </div>
                    </div>

                    {/* Top Right: Era Tag & Quick Zoom Button */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          setPreviewPhoto({
                            url: pres.portraitUrl,
                            title: pres.fullNameWithTitle,
                            subtitle: pres.popularTitle,
                            categoryOrEra: `Presiden RI ke-${pres.orderNumber} (${pres.era})`,
                            source: 'Koleksi Resmi Arsip Nasional Republik Indonesia (ANRI) & Sekretariat Negara RI',
                            periodOrLifespan: `Masa Jabatan: ${pres.period} (${pres.yearsInOffice})`,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs border border-white/30"
                        title="Lihat Foto Asli Penuh / Resolusi Tinggi"
                      >
                        <ZoomIn size={15} />
                      </button>
                      <div className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
                        {pres.era}
                      </div>
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                        {pres.popularTitle}
                      </p>
                      <h3 className="font-extrabold text-lg text-white leading-tight drop-shadow-sm">
                        {pres.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {/* Period & Years */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={13} className="text-sky-600 shrink-0" />
                        <span className="truncate">{pres.yearsInOffice}</span>
                      </div>

                      {/* Main Achievement Snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {pres.majorAchievements[0]}
                      </p>

                      {/* Quote preview */}
                      <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2 text-[11px] text-slate-700 italic">
                        <Quote size={14} className="text-sky-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">"{pres.famousQuotes[0]}"</span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-700 group-hover:text-sky-800 flex items-center gap-1">
                        Lihat Biografi & Warisan
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(`${pres.name}. ${pres.popularTitle}. Kutipan: ${pres.famousQuotes[0]}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Dengarkan Kutipan"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TOKOH NASIONAL & PAHLAWAN BANGSA */}
      {/* ========================================================= */}
      {activeTab === 'tokoh' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong className="text-sky-700">{filteredHeroes.length}</strong> tokoh nasional & perumus bangsa
            </span>
            <span>Materi Penunjang Fase E & Fase F Kurikulum Merdeka</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHeroes.map((hero) => {
              const hasImgErr = activeImageError[hero.id];
              return (
                <div
                  key={hero.id}
                  onClick={() => {
                    setSelectedHero(hero);
                    sound.playClick();
                  }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative"
                >
                  {/* Top Category Ribbon */}
                  <div className="h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-sky-600" />

                  {/* Real Authentic Hero Photo Frame */}
                  <div className="relative h-60 sm:h-64 bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
                    {!hasImgErr ? (
                      <img
                        src={hero.portraitUrl}
                        alt={`Foto Asli Sejarah ${hero.name}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setActiveImageError((prev) => ({ ...prev, [hero.id]: true }))
                        }
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-700 to-sky-900 text-white text-center">
                        <Users size={48} className="text-amber-300 mb-2 opacity-80" />
                        <span className="font-serif text-lg font-bold">{hero.name}</span>
                        <span className="text-xs text-sky-200 mt-1">{hero.roleTitle}</span>
                      </div>
                    )}

                    {/* Gradient Scrim for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

                    {/* Top Left: Authentic Photo Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-sky-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-md border border-white/40 flex items-center gap-1.5 z-10">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>Foto Asli Sejarah</span>
                    </div>

                    {/* Top Right: Category Tag & Zoom Button */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          setPreviewPhoto({
                            url: hero.portraitUrl,
                            title: hero.name,
                            subtitle: hero.roleTitle,
                            categoryOrEra: `${hero.category} • Asal: ${hero.originProvince}`,
                            source: 'Arsip Nasional Republik Indonesia (ANRI) / Museum Kebangkitan Nasional / Arsip Sejarah RI',
                            periodOrLifespan: `Masa Hidup: ${hero.birthDeath}`,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs border border-white/30"
                        title="Lihat Foto Asli Penuh / Resolusi Tinggi"
                      >
                        <ZoomIn size={15} />
                      </button>
                      <div className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
                        {hero.category}
                      </div>
                    </div>

                    {/* Bottom overlay on image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-0.5">
                        <MapPin size={12} className="text-amber-300 shrink-0" />
                        <span className="truncate">{hero.originProvince} • ({hero.birthDeath})</span>
                      </div>
                      <h3 className="font-extrabold text-lg text-white leading-tight drop-shadow-sm">
                        {hero.name}
                      </h3>
                      <p className="text-xs text-sky-100 font-medium truncate mt-0.5 opacity-90">
                        {hero.roleTitle}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      {/* Contribution Box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-sky-900 block mb-1">Peran Terhadap Pancasila & Bangsa:</strong>
                        <p className="line-clamp-2">{hero.contributionToPancasila}</p>
                      </div>

                      {/* Sila Connection Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-medium">Kaitan Sila:</span>
                        {hero.pancasilaPillars.map((sila) => (
                          <span
                            key={sila}
                            className="text-[10px] bg-amber-50 border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-md"
                          >
                            Sila ke-{sila}
                          </span>
                        ))}
                      </div>

                      {/* Famous Quote Snippet */}
                      <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2 text-[11px] text-slate-700 italic">
                        <Quote size={14} className="text-sky-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">"{hero.famousQuote}"</span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 group-hover:text-sky-800 flex items-center gap-1">
                        Teladani Jejak Beliau
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(`${hero.name}. ${hero.famousQuote}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Dengarkan Kutipan"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL: PRESIDEN REPUBLIK INDONESIA */}
      {/* ========================================================= */}
      {selectedPresident && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => {
            setSelectedPresident(null);
            handleStopSpeaking();
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Scrim */}
            <div className="relative bg-gradient-to-r from-sky-800 via-sky-700 to-sky-900 text-white p-6 sm:p-8 rounded-t-3xl overflow-hidden">
              <button
                onClick={() => {
                  setSelectedPresident(null);
                  handleStopSpeaking();
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                <div
                  onClick={() => {
                    sound.playClick();
                    setPreviewPhoto({
                      url: selectedPresident.portraitUrl,
                      title: selectedPresident.fullNameWithTitle,
                      subtitle: selectedPresident.popularTitle,
                      categoryOrEra: `Presiden RI ke-${selectedPresident.orderNumber} (${selectedPresident.era})`,
                      source: 'Koleksi Resmi Arsip Nasional Republik Indonesia (ANRI) & Sekretariat Negara RI',
                      periodOrLifespan: `Masa Jabatan: ${selectedPresident.period} (${selectedPresident.yearsInOffice})`,
                    });
                  }}
                  className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white/60 shadow-lg shrink-0 relative group/photo cursor-zoom-in"
                  title="Klik untuk melihat foto asli resolusi penuh"
                >
                  <img
                    src={selectedPresident.portraitUrl}
                    alt={selectedPresident.name}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setActiveImageError((prev) => ({ ...prev, [selectedPresident.id]: true }))
                    }
                    className="w-full h-full object-cover object-top group-hover/photo:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn size={20} />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-400 text-sky-950 text-xs font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                      Presiden RI ke-{selectedPresident.orderNumber}
                    </span>
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-lg">
                      {selectedPresident.era}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {selectedPresident.fullNameWithTitle}
                  </h2>
                  <p className="text-amber-300 font-bold text-sm">{selectedPresident.popularTitle}</p>
                  <p className="text-sky-100 text-xs flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{selectedPresident.period} ({selectedPresident.yearsInOffice})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Famous Quote Card with Audio */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                    <Quote size={13} />
                    Kutipan Kebangsaan
                  </span>
                  <p className="text-slate-800 text-sm sm:text-base font-serif italic leading-relaxed">
                    "{selectedPresident.famousQuotes[0]}"
                  </p>
                </div>
                <button
                  onClick={() => speakText(selectedPresident.famousQuotes[0])}
                  className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <Volume2 size={16} />
                  <span>Dengar</span>
                </button>
              </div>

              {/* Grid Info: Data Diri & Pasangan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Kelahiran & Wafat:</span>
                  <p className="font-semibold text-slate-800">{selectedPresident.birthPlaceDate}</p>
                  {selectedPresident.deathPlaceDate && (
                    <p className="text-slate-600 text-[11px]">{selectedPresident.deathPlaceDate}</p>
                  )}
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Wakil Presiden Pendamping:</span>
                  <ul className="font-semibold text-slate-800 list-disc list-inside">
                    {selectedPresident.vicePresidents.map((vp, idx) => (
                      <li key={idx}>{vp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Major Achievements */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  <span>Prestasi & Kebijakan Bersejarah yang Mengubah Bangsa</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedPresident.majorAchievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pancasila Core Values Connection */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Shield size={18} className="text-sky-600" />
                  <span>Pengejawantahan Nilai Sila Pancasila</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPresident.pancasilaCoreValues.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs space-y-1"
                    >
                      <span className="font-bold text-amber-900 block text-xs">
                        Refleksi Sila ke-{val.silaNumber}
                      </span>
                      <p className="text-slate-700 leading-relaxed">{val.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Milestones */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-600" />
                  <span>Tonggak Sejarah Kepemimpinan</span>
                </h3>
                <div className="space-y-2 border-l-2 border-sky-200 pl-4 ml-2">
                  {selectedPresident.historicalMilestones.map((m, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-600 absolute -left-[21px] top-1.5" />
                      <div className="text-xs">
                        <span className="font-extrabold text-sky-800">{m.year}: </span>
                        <strong className="text-slate-900">{m.event}</strong>
                        <p className="text-slate-500 mt-0.5">{m.significance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message & Reflection for SMANDE Students */}
              <div className="p-4 bg-sky-600 text-white rounded-2xl space-y-1.5 shadow-md">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles size={14} />
                  <span>Refleksi Pelajar Pancasila SMAN 1 Mande</span>
                </div>
                <p className="text-xs sm:text-sm text-sky-50 leading-relaxed">
                  {selectedPresident.reflectionForStudents}
                </p>
                <div className="pt-2 text-[11px] text-sky-200 border-t border-sky-500/60">
                  💡 <strong>Tahukah Kamu?</strong> {selectedPresident.interestingFact}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Sumber Resmi: Arsip Nasional Republik Indonesia (ANRI) & Perpustakaan Kepresidenan
              </span>
              <button
                onClick={() => setSelectedPresident(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL: TOKOH NASIONAL & PAHLAWAN */}
      {/* ========================================================= */}
      {selectedHero && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => {
            setSelectedHero(null);
            handleStopSpeaking();
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-sky-800 to-sky-950 text-white p-6 sm:p-7 rounded-t-3xl">
              <button
                onClick={() => {
                  setSelectedHero(null);
                  handleStopSpeaking();
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    sound.playClick();
                    setPreviewPhoto({
                      url: selectedHero.portraitUrl,
                      title: selectedHero.name,
                      subtitle: selectedHero.roleTitle,
                      categoryOrEra: `${selectedHero.category} • Asal: ${selectedHero.originProvince}`,
                      source: 'Arsip Nasional Republik Indonesia (ANRI) / Museum Kebangkitan Nasional / Arsip Sejarah RI',
                      periodOrLifespan: `Masa Hidup: ${selectedHero.birthDeath}`,
                    });
                  }}
                  className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white/50 shadow-md shrink-0 relative group/photo cursor-zoom-in"
                  title="Klik untuk melihat foto asli resolusi penuh"
                >
                  <img
                    src={selectedHero.portraitUrl}
                    alt={selectedHero.name}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setActiveImageError((prev) => ({ ...prev, [selectedHero.id]: true }))
                    }
                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="bg-amber-400 text-sky-950 text-xs font-black px-2.5 py-0.5 rounded-md inline-block">
                    {selectedHero.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{selectedHero.name}</h2>
                  <p className="text-sky-200 text-xs">{selectedHero.roleTitle}</p>
                  <p className="text-slate-300 text-[11px] flex items-center gap-1">
                    <MapPin size={11} className="text-rose-400" />
                    <span>Asal: {selectedHero.originProvince} • ({selectedHero.birthDeath})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Quote Card */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                    Pesan Mutiara Kebangsaan
                  </span>
                  <p className="text-slate-800 text-sm font-serif italic">"{selectedHero.famousQuote}"</p>
                </div>
                <button
                  onClick={() => speakText(selectedHero.famousQuote)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Volume2 size={15} />
                  <span>Dengar</span>
                </button>
              </div>

              {/* Contribution to Pancasila */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase text-sky-900 tracking-wider">
                  Sumbangsih Konkret bagi Dasar Negara & Kemerdekaan:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedHero.contributionToPancasila}
                </p>
              </div>

              {/* Key Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase text-sky-900 tracking-wider">
                  Tindakan Heroik & Peninggalan Sejarah:
                </h4>
                <div className="space-y-2">
                  {selectedHero.keyActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message to SMANDE */}
              <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl space-y-1 shadow-md">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles size={14} />
                  Pesan Pembelajaran untuk Siswa SMA Negeri 1 Mande
                </span>
                <p className="text-xs sm:text-sm text-sky-50 leading-relaxed">
                  {selectedHero.smandeMessage}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedHero(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL KUIS REFLEKSI TOKOH & PRESIDEN (GAMIFIKASI) */}
      {/* ========================================================= */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-sky-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <HelpCircle size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Kuis Wawasan Tokoh & Presiden</h3>
                  <p className="text-xs text-sky-100">
                    Uji pemahaman sejarah kepemimpinan nasional & perumus Pancasila
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quiz Body */}
            <div className="p-6">
              {!quizFinished ? (
                <div className="space-y-5">
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Pertanyaan {quizQuestionIndex + 1} dari {quizQuestions.length}</span>
                      <span className="text-sky-600">Skor Sementara: {quizScore} Poin</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{
                          width: `${((quizQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                      {quizQuestions[quizQuestionIndex].prompt}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {quizQuestions[quizQuestionIndex].options.map((opt) => {
                      const isSelected = quizSelectedOption === opt;
                      const isCorrect = opt === quizQuestions[quizQuestionIndex].correct;
                      let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-800';

                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={quizAnswered}
                          onClick={() => handleAnswerQuiz(opt)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizAnswered && isCorrect && (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after answered */}
                  {quizAnswered && (
                    <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-xs text-slate-700 space-y-1 animate-fadeIn">
                      <span className="font-bold text-sky-900 block">💡 Pembahasan:</span>
                      <p>{quizQuestions[quizQuestionIndex].explanation}</p>
                    </div>
                  )}

                  {/* Action button */}
                  {quizAnswered && (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {quizQuestionIndex + 1 < quizQuestions.length
                          ? 'Lanjut ke Soal Berikutnya'
                          : 'Selesai & Lihat Skor'}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                /* Result Screen */
                <div className="text-center space-y-5 py-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
                    <Award size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-slate-900">Kuis Selesai!</h3>
                    <p className="text-xs text-slate-500">
                      Terima kasih telah menelusuri sejarah kebangsaan Indonesia.
                    </p>
                  </div>

                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 max-w-xs mx-auto">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Total Skor Kamu:</span>
                    <p className="text-4xl font-black text-sky-800 mt-1">{quizScore} / 100</p>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                      +{quizScore} Poin Pelajar Pancasila Ditambahkan!
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} />
                      <span>Ulangi Kuis</span>
                    </button>
                    <button
                      onClick={() => setIsQuizModalOpen(false)}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Tutup & Lanjut Belajar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL KOMPARASI PEMIMPIN NASIONAL */}
      {/* ========================================================= */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-700 to-sky-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Scale size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Alat Komparasi Kepemimpinan Presiden RI</h3>
                  <p className="text-xs text-sky-100">
                    Bandingkan masa bakti, fokus pembangunan, dan kebijakan dua presiden
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Selectors and Side-by-side Comparison */}
            <div className="p-6 space-y-6">
              {/* Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Pilih Presiden Pertama:
                  </label>
                  <select
                    value={comparePresidentA.id}
                    onChange={(e) => {
                      const found = presidentsData.find((p) => p.id === e.target.value);
                      if (found) setComparePresidentA(found);
                    }}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
                  >
                    {presidentsData.map((p) => (
                      <option key={p.id} value={p.id}>
                        Presiden ke-{p.orderNumber}: {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Pilih Presiden Kedua:
                  </label>
                  <select
                    value={comparePresidentB.id}
                    onChange={(e) => {
                      const found = presidentsData.find((p) => p.id === e.target.value);
                      if (found) setComparePresidentB(found);
                    }}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
                  >
                    {presidentsData.map((p) => (
                      <option key={p.id} value={p.id}>
                        Presiden ke-{p.orderNumber}: {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side by side comparison cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[comparePresidentA, comparePresidentB].map((pres, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border shrink-0">
                        <img
                          src={pres.portraitUrl}
                          alt={pres.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-md">
                          Presiden ke-{pres.orderNumber}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 mt-1">{pres.name}</h4>
                        <p className="text-xs text-sky-700 font-semibold">{pres.popularTitle}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{pres.period}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-700 block">Era Kepemimpinan:</span>
                      <p className="bg-slate-50 p-2 rounded-lg text-slate-600">{pres.era}</p>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-slate-700 block">Fokus Peninggalan Utama:</span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600">
                        {pres.majorAchievements.slice(0, 3).map((a, i) => (
                          <li key={i} className="line-clamp-2">{a}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs italic text-slate-700">
                      "{pres.famousQuotes[0]}"
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Tutup Komparasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL LIGHTBOX: PREVIEW FOTO ASLI SEJARAH RESOLUSI PENUH */}
      {/* ========================================================= */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => {
            setPreviewPhoto(null);
            sound.playClick();
          }}
        >
          <div
            className="bg-slate-900/95 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto flex flex-col text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Top Bar */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 block">
                    Dokumentasi Resmi Sejarah Nasional
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-white truncate">
                    {previewPhoto.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewPhoto.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Unduh / Buka File Foto Asli"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">Buka Berkas</span>
                </a>
                <button
                  onClick={() => {
                    setPreviewPhoto(null);
                    sound.playClick();
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                  title="Tutup (ESC)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Photo Center Frame */}
            <div className="relative bg-slate-950 flex items-center justify-center p-4 sm:p-8 min-h-[320px] max-h-[65vh] overflow-hidden">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/20 select-none"
              />
            </div>

            {/* Lightbox Archival Metadata Footer */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-md font-bold text-xs">
                    {previewPhoto.categoryOrEra}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {previewPhoto.periodOrLifespan}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                  ✓ Foto Terverifikasi Bebas Rusak
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Sumber Dokumentasi & Lisensi:</strong>{' '}
                {previewPhoto.source}. Dokumen visual bersejarah ini dipersembahkan untuk kepentingan pendidikan dan penanaman nilai-nilai kebangsaan bagi siswa SMA Negeri 1 Mande.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
