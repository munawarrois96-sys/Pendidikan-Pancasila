import React, { useState } from 'react';
import { eLibraryData } from '../data/eLibraryData';
import { EBookItem } from '../types';
import { sound } from '../utils/audio';
import { BookOpen, Download, Eye, FileText, Search, X } from 'lucide-react';

export const ELibraryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingItem, setReadingItem] = useState<EBookItem | null>(null);

  const categories = ['Semua', 'Buku Siswa', 'Modul Ajar', 'UUD 1945', 'Panduan Profil'];

  const filteredItems = eLibraryData.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-500 rounded-3xl p-6 md:p-8 shadow-xl text-white">
        <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5 mb-2">
          <BookOpen size={14} /> Perpustakaan Digital Pendidikan Pancasila • SMA Negeri 1 Mande (SMANDE)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          E-Library & Modul Referensi Belajar
        </h2>
        <p className="text-xs md:text-sm text-sky-100 max-w-2xl leading-relaxed">
          Akses buku teks utama Kurikulum Merdeka Kemendikbudristek (Kelas X, XI, XII), naskah komprehensif UUD NRI 1945, serta pedoman 45 Butir Sila Pancasila secara gratis untuk siswa SMA Negeri 1 Mande.
        </p>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCategory(c);
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-white text-sky-800 font-bold shadow-md'
                    : 'bg-sky-800/80 text-sky-100 hover:text-white border border-sky-500/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul atau materi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                {item.grade && (
                  <span className="text-[10px] text-amber-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full">
                    Kelas {item.grade}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white mb-2 leading-snug group-hover:text-red-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {item.description}
              </p>

              <div className="text-[11px] text-slate-500 space-y-1 mb-4 border-t border-slate-800/80 pt-2">
                <div>Penerbit: {item.author}</div>
                <div>Tahun: {item.year} • {item.pages} Halaman</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setReadingItem(item);
                  sound.playClick();
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye size={14} /> Baca Digital
              </button>
              <button
                onClick={() => {
                  sound.playCoin();
                  alert(`Mengunduh file dokumen: "${item.title}". File siap dibaca offline!`);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Unduh Modul"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Online Document Reader Modal */}
      {readingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Pembaca Naskah Digital
                </span>
                <h4 className="text-sm font-bold text-white truncate max-w-md">{readingItem.title}</h4>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-xs md:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-950/40">
              {readingItem.readOnlineText || readingItem.description}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Sumber: {readingItem.author}</span>
              <button
                onClick={() => setReadingItem(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 font-bold text-white rounded-xl"
              >
                Tutup Pembaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
