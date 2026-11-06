import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Search,
  Volume2,
  Bookmark,
  Share2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  RotateCw,
  Tag,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2,
  Scale,
  Award,
  ChevronDown
} from 'lucide-react';
import { glossaryData, glossaryCategories, GlossaryItem } from '../data/glossaryData';
import { sound } from '../utils/audio';

const ALPHABET = [
  'Semua',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'U',
  'W',
  'Y',
];

export const GlossaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smande_glossary_favs');
      return saved ? JSON.parse(saved) : ['bhinneka-tunggal-ika', 'profil-pelajar-pancasila'];
    } catch {
      return ['bhinneka-tunggal-ika'];
    }
  });
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<GlossaryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flashcard Mode state
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Toggle favorite
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('smande_glossary_favs', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  // Text to speech Indonesian
  const speakTerm = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy definition
  const handleCopy = (item: GlossaryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    const text = `${item.term} (${item.category}):\n${item.definition}\nContoh: ${item.contextExample}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered glossary items
  const filteredItems = useMemo(() => {
    return glossaryData.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contextExample.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLetter =
        selectedLetter === 'Semua' || item.letter.toUpperCase() === selectedLetter.toUpperCase();

      const matchesCategory =
        selectedCategory === 'Semua Kategori' || item.category === selectedCategory;

      const matchesFav = !onlyFavorites || favorites.includes(item.id);

      return matchesSearch && matchesLetter && matchesCategory && matchesFav;
    });
  }, [searchQuery, selectedLetter, selectedCategory, onlyFavorites, favorites]);

  // Term of the day (stable by current date)
  const termOfTheDay = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % glossaryData.length;
    return glossaryData[index] || glossaryData[0];
  }, []);

  const flashcardItem = filteredItems[currentFlashcardIndex] || filteredItems[0] || glossaryData[0];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-sky-600/15 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold">
            <BookMarked size={14} className="text-amber-300" />
            <span>Kamus Resmi Pendidikan Pancasila SMANDE</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Glosarium & Ensiklopedia Istilah Pancasila
          </h2>

          <p className="text-xs md:text-sm text-sky-100 leading-relaxed font-medium">
            Kamus istilah komprehensif memuat konsep-konsep kunci ideologi Pancasila, UUD NRI Tahun
            1945, tata kelola negara hukum, hak asasi manusia, kebinekaan, dan demokrasi. Dilengkapi
            contoh nyata kehidupan sehari-hari di SMA Negeri 1 Mande.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                sound.playClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                isFlashcardMode
                  ? 'bg-amber-400 text-sky-950 font-black'
                  : 'bg-white text-sky-700 hover:bg-sky-50'
              }`}
            >
              <RotateCw size={15} />
              <span>{isFlashcardMode ? 'Tutup Mode Kartu Belajar' : 'Mode Kartu Hafalan (Flashcard)'}</span>
            </button>

            <button
              onClick={() => {
                setOnlyFavorites(!onlyFavorites);
                sound.playClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                onlyFavorites
                  ? 'bg-amber-400 text-sky-950 border-amber-300 font-extrabold shadow-sm'
                  : 'bg-sky-700/80 hover:bg-sky-700 border-sky-400 text-white'
              }`}
            >
              <Bookmark size={14} className={onlyFavorites ? 'fill-sky-950' : 'text-amber-300'} />
              <span>Istilah Favorit ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-6 -bottom-8 text-[140px] md:text-[180px] opacity-10 pointer-events-none select-none">
          📖
        </div>
      </div>

      {/* 2. Flashcard Mode (Interactive Learning) */}
      {isFlashcardMode && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-sky-50 border-2 border-amber-300 rounded-3xl p-6 shadow-lg animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-sky-950 flex items-center justify-center font-black text-sm">
                🗂️
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  Mode Kartu Belajar Interaktif (Flashcard)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Kartu ke-{currentFlashcardIndex + 1} dari {filteredItems.length} istilah
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentFlashcardIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredItems.length - 1
                  );
                  setIsCardFlipped(false);
                  sound.playClick();
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ◀ Sebelumnya
              </button>
              <button
                onClick={() => {
                  setCurrentFlashcardIndex((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : 0
                  );
                  setIsCardFlipped(false);
                  sound.playClick();
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors shadow-sm"
              >
                Berikutnya ▶
              </button>
            </div>
          </div>

          {/* Flashcard Body */}
          {flashcardItem && (
            <div
              onClick={() => {
                setIsCardFlipped(!isCardFlipped);
                sound.playClick();
              }}
              className="bg-white rounded-2xl p-6 md:p-8 border-2 border-sky-300 shadow-md cursor-pointer hover:border-sky-500 transition-all min-h-[220px] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px]">
                    {flashcardItem.category}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">
                    Klik kartu untuk membalik (Tampilkan {isCardFlipped ? 'Pertanyaan' : 'Makna / Definisi'})
                  </span>
                </div>

                {!isCardFlipped ? (
                  <div className="text-center py-6 space-y-3">
                    <span className="text-xs uppercase tracking-wider text-amber-600 font-extrabold">
                      Istilah:
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">
                      {flashcardItem.term}
                    </h3>
                    <p className="text-xs text-slate-400">
                      💡 Bisakah kamu menjelaskan makna istilah ini sebelum membalik kartu?
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 py-2 animate-fade-in">
                    <span className="text-xs uppercase tracking-wider text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Definisi & Makna:
                    </span>
                    <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                      {flashcardItem.definition}
                    </p>
                    <div className="p-3 bg-sky-50 rounded-xl text-xs text-sky-900 border border-sky-100 font-medium">
                      <b>Contoh Kontekstual:</b> {flashcardItem.contextExample}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span className="text-[11px]">Sentuh atau klik di mana saja untuk membalik</span>
                <span className="text-amber-600 font-bold text-[11px]">
                  {isCardFlipped ? 'Sisi Jawaban ✓' : 'Sisi Pertanyaan ?'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Istilah Hari Ini (Term of the Day) Card */}
      {!isFlashcardMode && termOfTheDay && (
        <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-200 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-sky-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold border border-amber-200">
                  Istilah Hari Ini • {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {termOfTheDay.category}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{termOfTheDay.term}</span>
                <button
                  onClick={(e) => speakTerm(`${termOfTheDay.term}. ${termOfTheDay.definition}`, e)}
                  title="Dengarkan pengucapan & makna"
                  className="p-1 rounded-lg text-sky-600 hover:bg-sky-100 transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {termOfTheDay.definition}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setActiveModalItem(termOfTheDay)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Baca Selengkapnya
            </button>
          </div>
        </div>
      )}

      {/* 4. Controls: Search, Alphabet Index & Category Filters */}
      <div className="bg-white border border-sky-200 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari istilah, konsep, kata kunci atau makna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-auto shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 cursor-pointer"
            >
              {glossaryCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alphabet Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ALPHABET.map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => {
                  setSelectedLetter(letter);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm scale-105'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-800 border border-slate-200/80'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Menampilkan <span className="font-extrabold text-sky-700">{filteredItems.length}</span>{' '}
            dari total {glossaryData.length} istilah terdaftar
          </div>
          {(searchQuery || selectedLetter !== 'Semua' || selectedCategory !== 'Semua Kategori' || onlyFavorites) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLetter('Semua');
                setSelectedCategory('Semua Kategori');
                setOnlyFavorites(false);
                sound.playClick();
              }}
              className="text-sky-600 hover:text-sky-800 font-bold underline text-[11px]"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* 5. Glossary Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sky-200 shadow-sm space-y-3">
          <div className="text-4xl">🔍</div>
          <h4 className="font-bold text-base text-slate-800">Istilah Tidak Ditemukan</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada istilah yang cocok dengan kata kunci atau filter yang Anda pilih. Coba gunakan
            kata kunci lain atau klik tombol "Reset Semua Filter".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isFav = favorites.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveModalItem(item);
                  sound.playClick();
                }}
                className="bg-white border border-sky-200 hover:border-sky-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
              >
                <div>
                  {/* Top Header inside Card */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center shrink-0">
                        {item.letter}
                      </span>
                      <span className="text-[10px] font-bold text-sky-700 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200/60 line-clamp-1">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => speakTerm(`${item.term}. ${item.definition}`, e)}
                        title="Dengarkan pengucapan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <Volume2 size={15} />
                      </button>

                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav
                            ? 'text-amber-500 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark size={15} className={isFav ? 'fill-amber-500' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Term Title */}
                  <h4 className="text-base font-extrabold text-slate-800 group-hover:text-sky-600 transition-colors mb-2 leading-snug">
                    {item.term}
                  </h4>

                  {/* Definition preview */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {item.definition}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {/* Related badges */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    {item.silaRelated && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/60 truncate max-w-[200px]">
                        🇮🇩 {item.silaRelated}
                      </span>
                    )}
                    {item.articleRelated && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">
                        ⚖️ {item.articleRelated}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-bold text-sky-600 group-hover:underline flex items-center gap-1">
                      Pelajari Contoh & Detail <ArrowRight size={12} />
                    </span>

                    <button
                      onClick={(e) => handleCopy(item, e)}
                      title="Salin definisi"
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                    >
                      {isCopied ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Detail Modal Dialog */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {activeModalItem.letter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {activeModalItem.category}
                    </span>
                    <button
                      onClick={() => toggleFavorite(activeModalItem.id)}
                      className={`p-1 rounded-md text-xs transition-colors ${
                        favorites.includes(activeModalItem.id)
                          ? 'text-amber-500'
                          : 'text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Bookmark
                        size={15}
                        className={favorites.includes(activeModalItem.id) ? 'fill-amber-500' : ''}
                      />
                    </button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {activeModalItem.term}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Definisi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Definisi Lengkap
                </span>
                <button
                  onClick={() =>
                    speakTerm(
                      `${activeModalItem.term}. ${activeModalItem.definition}. Contoh: ${activeModalItem.contextExample}`
                    )
                  }
                  className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-bold"
                >
                  <Volume2 size={14} />
                  <span>Dengarkan Audio</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeModalItem.definition}
              </p>
            </div>

            {/* Contoh Nyata */}
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-sky-800">
                Contoh Nyata di Sekolah / Masyarakat
              </span>
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-slate-700 leading-relaxed font-medium">
                {activeModalItem.contextExample}
              </div>
            </div>

            {/* Hubungan Sila & Pasal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeModalItem.silaRelated && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                  <div className="font-extrabold text-[11px] mb-0.5 text-amber-800">
                    🇮🇩 Kaitan Nilai Pancasila
                  </div>
                  <div>{activeModalItem.silaRelated}</div>
                </div>
              )}

              {activeModalItem.articleRelated && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                  <div className="font-extrabold text-[11px] mb-0.5 text-emerald-800">
                    ⚖️ Landasan Hukum / Konstitusi
                  </div>
                  <div>{activeModalItem.articleRelated}</div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag size={13} className="text-slate-400 mr-1" />
              {activeModalItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleCopy(activeModalItem)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {copiedId === activeModalItem.id ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Salin Penjelasan</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
