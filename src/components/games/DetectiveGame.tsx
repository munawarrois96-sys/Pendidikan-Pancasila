import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Search, ShieldAlert, Award, CheckCircle, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

interface DetectiveCase {
  id: string;
  title: string;
  location: string;
  chronology: string;
  clues: string[];
  witnesses: { name: string; role: string; testimony: string }[];
  pancasilaDilemma: string;
  choices: {
    id: string;
    action: string;
    pancasilaAnalysis: string;
    isIdeal: boolean;
    points: number;
  }[];
}

const CASES: DetectiveCase[] = [
  {
    id: 'case-1',
    title: 'Kasus Cyberbullying di Grup Angkatan Kelas X',
    location: 'Grup WhatsApp Angkatan & Lorong Sekolah',
    chronology:
      'Seorang siswa bernama Doni sering diejek dan dijadikan bahan stiker meme bernada menghina bentuk tubuh (body shaming) oleh beberapa siswa di grup perpesanan angkatan. Akibatnya Doni menjadi pendiam dan sering tidak masuk sekolah karena trauma psikologis.',
    clues: [
      'Tangkapan layar stiker foto editan bernada merendahkan martabat Doni.',
      'Data absensi: Doni sudah 4 hari tidak masuk sekolah tanpa keterangan sakit.',
      'Pesan keputusasaan Doni di status pribadi media sosialnya.',
    ],
    witnesses: [
      {
        name: 'Ketua Kelas X-2',
        role: 'Saksi Mata',
        testimony: 'Awalnya cuma candaan, tapi makin lama makin keterlaluan. Banyak yang takut menegur karena pembuat stikernya anak yang cukup disegani di kelas.',
      },
      {
        name: 'Ibu Guru BK (Bimbingan Konseling)',
        role: 'Pihak Sekolah',
        testimony: 'Orang tua Doni melapor bahwa anaknya menangis di kamar dan enggan kembali ke sekolah.',
      },
    ],
    pancasilaDilemma:
      'Apakah perundungan dapat dibenarkan atas nama "hanya bercanda antar teman", dan bagaimana Sila ke-2 (Kemanusiaan yang Adil dan Beradab) memandang martabat kemanusiaan?',
    choices: [
      {
        id: 'c1',
        action: 'Bersikap acuh tak acuh karena bukan kita yang diejek, agar tidak dimusuhi teman-teman populer.',
        pancasilaAnalysis: 'Salah besar! Sikap apatis (bystander effect) membiarkan kejahatan moral terjadi dan bertentangan dengan kemanusiaan yang beradab.',
        isIdeal: false,
        points: 10,
      },
      {
        id: 'c2',
        action: 'Membalas menghina pelaku di grup tersebut agar pelaku merasakan hal yang sama.',
        pancasilaAnalysis: 'Kurang tepat! Membalas kejahatan dengan kejahatan hanya akan memperkeruh situasi dan melahirkan konflik baru.',
        isIdeal: false,
        points: 40,
      },
      {
        id: 'c3',
        action: 'Merangkul dan memberi dukungan moral kepada Doni, mengajak admin grup menghapus konten tersebut, serta melaporkan bukti secara bijak kepada wali kelas dan guru BK untuk diselesaikan melalui mediasi restoratif.',
        pancasilaAnalysis: 'Tindakan Sempurna! Menunjukkan empati kemanusiaan (Sila 2), merajut persatuan dan kebersamaan (Sila 3), serta menyelesaikan masalah melalui prosedur dialog pembinaan yang beradab (Sila 4).',
        isIdeal: true,
        points: 100,
      },
    ],
  },
  {
    id: 'case-2',
    title: 'Kasus Hoaks SARA Menjelang Pemilihan Ketua OSIS SMANDE',
    location: 'Media Sosial & Mading Sekolah',
    chronology:
      'Menjelang hari pemilihan ketua OSIS, akun media sosial anonim menyebarkan selebaran digital yang menuduh Paslon nomor urut 2 berniat menghapus kegiatan ekstrakurikuler keagamaan tertentu. Kabar bohong ini sempat membuat para siswa heboh dan berdebat panas.',
    clues: [
      'Poster digital tanpa identitas penyusun yang mencantumkan kutipan palsu paslon 2.',
      'Klarifikasi resmi visi-misi paslon 2 yang justru bertekad menambah anggaran seluruh kegiatan keagamaan.',
      'Munculnya komentar bernada kebencian dan perpecahan antarsiswa di kolom komentar.',
    ],
    witnesses: [
      {
        name: 'Ketua MPK (Majelis Perwakilan Kelas)',
        role: 'Penyelenggara Pemilihan',
        testimony: 'Kami sudah mengonfirmasi ke paslon 2, mereka sama sekali tidak pernah menyatakan hal tersebut. Itu hoaks yang disengaja.',
      },
    ],
    pancasilaDilemma:
      'Bagaimana menjaga iklim demokrasi sekolah agar tetap berpegang pada nilai kejujuran, sportivitas, dan persatuan (Sila 3 dan 4)?',
    choices: [
      {
        id: 'c1',
        action: 'Ikut membagikan postingan tersebut ke grup kelas karena merasa berita itu seru dan viral.',
        pancasilaAnalysis: 'Sangat buruk! Membagikan berita tanpa verifikasi (tabayyun) melanggar etika kewarganegaraan digital dan menyuburkan fitnah.',
        isIdeal: false,
        points: 0,
      },
      {
        id: 'c2',
        action: 'Melakukan cek fakta (fact-checking), melaporkan akun penyebar fitnah ke panitia pemilihan, serta membuat postingan penenang yang mengajak seluruh siswa tetap bersatu dan mengedepankan kampanye adu gagasan.',
        pancasilaAnalysis: 'Keputusan Luar Biasa! Mengamalkan Sila ke-3 (Persatuan Indonesia) dan Sila ke-4 (Demokrasi yang bermoral dan sehat).',
        isIdeal: true,
        points: 100,
      },
    ],
  },
];

export const DetectiveGame: React.FC<{ onCaseSolved?: (pts: number) => void }> = ({ onCaseSolved }) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const activeCase = CASES[selectedCaseIdx];
  const chosen = activeCase.choices.find((c) => c.id === selectedChoiceId);

  const handleChoose = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setHasEvaluated(true);
    const c = activeCase.choices.find((item) => item.id === choiceId);
    if (c?.isIdeal) {
      sound.playVictory();
      if (onCaseSolved) onCaseSolved(c.points);
    } else {
      sound.playWrong();
    }
  };

  const handleNextCase = () => {
    if (selectedCaseIdx < CASES.length - 1) {
      setSelectedCaseIdx((prev) => prev + 1);
      setSelectedChoiceId(null);
      setHasEvaluated(false);
      sound.playClick();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Search size={14} /> Game Detektif Pancasila
          </span>
          <h3 className="text-lg md:text-xl font-bold">Investigasi Dilema Moral Remaja</h3>
        </div>

        <div className="flex gap-2">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseIdx(i);
                setSelectedChoiceId(null);
                setHasEvaluated(false);
                sound.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCaseIdx === i
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Kasus #{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Case Narrative and Clues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-2">
              <ShieldAlert size={14} />
              <span>Lokasi Kasus: {activeCase.location}</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{activeCase.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{activeCase.chronology}</p>
          </div>

          {/* Clues */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Search size={13} /> Bukti & Fakta Lapangan:
            </span>
            <ul className="space-y-1.5">
              {activeCase.clues.map((clue, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Witnesses */}
          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
              <MessageSquare size={13} /> Keterangan Saksi:
            </span>
            <div className="space-y-2 mt-2">
              {activeCase.witnesses.map((w, idx) => (
                <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200">
                    {w.name} <span className="text-slate-500 font-normal">({w.role})</span>
                  </div>
                  <p className="text-slate-400 italic mt-0.5">"{w.testimony}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Decision Panel */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1">
              <AlertCircle size={13} /> Dilema Nilai Pancasila
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{activeCase.pancasilaDilemma}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Keputusan Anda sebagai Detektif Moral:
            </h5>
            <div className="space-y-2.5">
              {activeCase.choices.map((choice) => (
                <button
                  key={choice.id}
                  disabled={hasEvaluated}
                  onClick={() => handleChoose(choice.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all leading-snug flex items-start justify-between gap-3 ${
                    selectedChoiceId === choice.id
                      ? choice.isIdeal
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                        : 'bg-red-950/70 border-red-500 text-red-200'
                      : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>{choice.action}</span>
                  <ChevronRight size={16} className="shrink-0 text-slate-400 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Analysis */}
          {hasEvaluated && chosen && (
            <div
              className={`p-4 rounded-xl border animate-fade-in ${
                chosen.isIdeal
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                  : 'bg-red-950/50 border-red-500/60 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {chosen.isIdeal ? (
                  <>
                    <CheckCircle size={18} className="text-emerald-400" />
                    <span>Solusi Berintegritas Tinggi (+{chosen.points} Poin)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={18} className="text-red-400" />
                    <span>Perlu Peningkatan Pemahaman Moral</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{chosen.pancasilaAnalysis}</p>

              {selectedCaseIdx < CASES.length - 1 && (
                <button
                  onClick={handleNextCase}
                  className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Lanjut ke Kasus Selanjutnya ⏩
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
