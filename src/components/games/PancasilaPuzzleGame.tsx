import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Puzzle, CheckCircle, RefreshCw, Trophy, ArrowUpDown } from 'lucide-react';

interface HierarchyItem {
  id: string;
  name: string;
  rank: number; // 1 = highest (UUD 1945)
}

const INITIAL_HIERARCHY: HierarchyItem[] = [
  { id: 'h4', name: 'Peraturan Pemerintah (PP)', rank: 4 },
  { id: 'h1', name: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945', rank: 1 },
  { id: 'h6', name: 'Peraturan Daerah Provinsi (Perda Provinsi)', rank: 6 },
  { id: 'h2', name: 'Ketetapan Majelis Permusyawaratan Rakyat (Tap MPR)', rank: 2 },
  { id: 'h7', name: 'Peraturan Daerah Kabupaten/Kota (Perda Kab/Kota)', rank: 7 },
  { id: 'h3', name: 'Undang-Undang / Peraturan Pemerintah Pengganti UU (Perppu)', rank: 3 },
  { id: 'h5', name: 'Peraturan Presiden (Perpres)', rank: 5 },
];

const SILA_SYMBOLS = [
  {
    sila: 1,
    name: 'Bintang Emas',
    soundText: 'Ketuhanan Yang Maha Esa',
    symbolEmoji: '⭐',
    behavior: 'Menghormati kebebasan beribadah pemeluk agama lain dengan tulus.',
  },
  {
    sila: 2,
    name: 'Rantai Baja',
    soundText: 'Kemanusiaan yang Adil dan Beradab',
    symbolEmoji: '⛓️',
    behavior: 'Membela kebenaran, menolak perundungan, dan menjunjung harkat martabat sesama manusia.',
  },
  {
    sila: 3,
    name: 'Pohon Beringin',
    soundText: 'Persatuan Indonesia',
    symbolEmoji: '🌳',
    behavior: 'Mencintai produk dalam negeri, merawat kerukunan, dan bangga berbangsa Indonesia.',
  },
  {
    sila: 4,
    name: 'Kepala Banteng',
    soundText: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
    symbolEmoji: '🐂',
    behavior: 'Mengutamakan musyawarah untuk mencapai mufakat dalam menyelesaikan masalah bersama.',
  },
  {
    sila: 5,
    name: 'Padi dan Kapas',
    soundText: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
    symbolEmoji: '🌾',
    behavior: 'Bersikap adil, hidup sederhana tidak boros, dan menghargai hasil karya orang lain.',
  },
];

export const PancasilaPuzzleGame: React.FC<{ onCompleted?: (pts: number) => void }> = ({ onCompleted }) => {
  const [activeTab, setActiveTab] = useState<'hierarki' | 'pasangSila'>('hierarki');

  // Hierarchy state
  const [hierarchyList, setHierarchyList] = useState<HierarchyItem[]>(INITIAL_HIERARCHY);
  const [hierarchyChecked, setHierarchyChecked] = useState(false);
  const [hierarchySuccess, setHierarchySuccess] = useState(false);

  // Sila match state
  const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({});
  const [selectedSila, setSelectedSila] = useState<number | null>(null);
  const [shuffledBehaviors] = useState(() =>
    [...SILA_SYMBOLS].sort(() => Math.random() - 0.5)
  );

  // Move hierarchy item up or down
  const moveHierarchyItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= hierarchyList.length) return;

    sound.playClick();
    const newList = [...hierarchyList];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setHierarchyList(newList);
    setHierarchyChecked(false);
  };

  const checkHierarchy = () => {
    const isCorrect = hierarchyList.every((item, idx) => item.rank === idx + 1);
    setHierarchyChecked(true);
    setHierarchySuccess(isCorrect);
    if (isCorrect) {
      sound.playVictory();
      if (onCompleted) onCompleted(100);
    } else {
      sound.playWrong();
    }
  };

  const handlePairMatch = (behaviorSila: number) => {
    if (!selectedSila) return;

    if (selectedSila === behaviorSila) {
      sound.playCorrect();
      setMatchedPairs((prev) => ({ ...prev, [selectedSila]: behaviorSila }));
      setSelectedSila(null);

      // Check if all matched
      if (Object.keys(matchedPairs).length + 1 >= 5) {
        sound.playVictory();
        if (onCompleted) onCompleted(100);
      }
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Puzzle size={14} /> Game Puzzle Pancasila
          </span>
          <h3 className="text-lg md:text-xl font-bold">Menyusun Struktur Hukum & Konsep Kebangsaan</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('hierarki');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hierarki'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Hierarki Peraturan (UU 12/2011)
          </button>
          <button
            onClick={() => {
              setActiveTab('pasangSila');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pasangSila'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Memasangkan Sila & Perilaku
          </button>
        </div>
      </div>

      {/* Tab 1: Hierarchy puzzle */}
      {activeTab === 'hierarki' && (
        <div className="max-w-xl mx-auto">
          <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            📌 <b>Instruksi:</b> Urutkan tata urutan peraturan perundang-undangan di Indonesia dari tingkat tertinggi (Nomor 1) hingga terendah (Nomor 7) menggunakan tombol panah atas/bawah.
          </p>

          <div className="space-y-2 mb-6">
            {hierarchyList.map((item, index) => {
              const isCorrectPosition = hierarchyChecked && item.rank === index + 1;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    hierarchyChecked
                      ? isCorrectPosition
                        ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                        : 'bg-red-950/60 border-red-500/70 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                      {index + 1}
                    </span>
                    <span className="text-xs md:text-sm font-medium">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      disabled={index === 0}
                      onClick={() => moveHierarchyItem(index, 'up')}
                      className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                    >
                      ▲
                    </button>
                    <button
                      disabled={index === hierarchyList.length - 1}
                      onClick={() => moveHierarchyItem(index, 'down')}
                      className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={checkHierarchy}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              Periksa Urutan Hierarki 🔍
            </button>
            <button
              onClick={() => {
                setHierarchyList([...INITIAL_HIERARCHY].sort(() => Math.random() - 0.5));
                setHierarchyChecked(false);
                sound.playClick();
              }}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
              title="Acak Ulang"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {hierarchyChecked && (
            <div
              className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                hierarchySuccess
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/60 border-red-500 text-red-200'
              }`}
            >
              {hierarchySuccess
                ? '🎉 Sempurna! Susunan hierarki peraturan perundang-undangan menurut UU No. 12 Tahun 2011 sudah 100% tepat!'
                : '⚠️ Masih ada posisi yang belum tepat. Ingat asas "lex superior derogat legi inferiori", peraturan di atasnya tidak boleh dilanggar oleh peraturan di bawahnya.'}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sila and Behavior match */}
      {activeTab === 'pasangSila' && (
        <div>
          <p className="text-xs text-slate-300 mb-5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            🎯 <b>Instruksi:</b> Klik salah satu Sila di kolom kiri, lalu klik contoh perilaku nyata yang paling sesuai di kolom kanan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: 5 Sila */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pilih Sila Pancasila:
              </span>
              {SILA_SYMBOLS.map((s) => {
                const isMatched = !!matchedPairs[s.sila];
                const isSelected = selectedSila === s.sila;
                return (
                  <button
                    key={s.sila}
                    disabled={isMatched}
                    onClick={() => {
                      setSelectedSila(s.sila);
                      sound.playClick();
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500 text-white'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.symbolEmoji}</span>
                      <div>
                        <div className="font-bold text-amber-400">Sila Ke-{s.sila}: {s.name}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{s.soundText}</p>
                      </div>
                    </div>
                    {isMatched && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Right: Shuffled Behaviors */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pasangkan dengan Perilaku Pengamalan:
              </span>
              {shuffledBehaviors.map((b) => {
                const isMatched = Object.values(matchedPairs).includes(b.sila);
                return (
                  <button
                    key={b.sila}
                    disabled={isMatched || !selectedSila}
                    onClick={() => handlePairMatch(b.sila)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-80 cursor-default'
                        : selectedSila
                        ? 'bg-slate-950 hover:bg-amber-950/40 hover:border-amber-500/50 border-slate-800 text-slate-200 cursor-pointer'
                        : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <p className="leading-relaxed">{b.behavior}</p>
                    {isMatched && <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {Object.keys(matchedPairs).length === 5 && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-center animate-fade-in">
              🎉 <b>Luar Biasa!</b> Kamu berhasil memasangkan seluruh 5 Sila dengan perilaku pengamalannya dalam kehidupan sehari-hari! (+100 Poin)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
