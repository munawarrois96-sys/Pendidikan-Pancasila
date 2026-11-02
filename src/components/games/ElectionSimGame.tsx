import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Vote, Users, MessageSquare, BarChart3, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface Candidate {
  number: number;
  name: string;
  viceName: string;
  tagline: string;
  avatarLeader: string;
  avatarVice: string;
  vision: string;
  missions: string[];
  debateAnswers: { question: string; answer: string }[];
  votes: number;
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    number: 1,
    name: 'Muhammad Ilham Pratama',
    viceName: 'Clarissa Aurelia',
    tagline: '"SMANDE Digital, Berkarakter & Inklusif"',
    avatarLeader: '👨‍💼',
    avatarVice: '👩‍💼',
    vision: 'Mewujudkan OSIS SMANDE sebagai wadah kolaborasi inovatif yang berakar pada nilai-nilai Pancasila dan berwawasan global.',
    missions: [
      'Digitalisasi aspirasi siswa melalui kotak saran online transparan.',
      'Penguatan program peer-tutoring (tutor sebaya) antarangkatan.',
      'Festival seni dan budaya kebinekaan nusantara tahunan.',
    ],
    debateAnswers: [
      {
        question: 'Bagaimana paslon 1 mengatasi potensi bullying di sekolah?',
        answer: 'Kami akan membentuk "Satgas Sahabat Sebaya" bekerja sama dengan guru BK dan membuat sistem pelaporan anonim yang aman tanpa takut intimidasi.',
      },
    ],
    votes: 342,
  },
  {
    idNumber: 2,
    number: 2,
    name: 'Nadhira Putri Salsabila',
    viceName: 'Bagas Aditya Wardhana',
    tagline: '"Aksi Nyata, Peduli Lingkungan & Berprestasi"',
    avatarLeader: '👩‍🎓',
    avatarVice: '👨‍🎓',
    vision: 'Menjadikan seluruh siswa SMANDE pelopor gaya hidup hijau, peduli sosial, dan unggul dalam ajang prestasi akademik maupun non-akademik.',
    missions: [
      'Gerakan Green School: Bank sampah sekolah dan pengurangan sampah plastik.',
      'Pendampingan intensif kompetisi sains, riset, dan debat tingkat nasional.',
      'Bakti sosial rutin membantu masyarakat sekitar sekolah yang membutuhkan.',
    ],
    debateAnswers: [
      {
        question: 'Bagaimana paslon 2 memastikan keterlibatan siswa dari semua kelas?',
        answer: 'Kami akan mengadakan rapat dengar pendapat berkala di setiap jenjang kelas X, XI, XII secara bergilir agar tidak ada suara yang terabaikan.',
      },
    ],
    votes: 418,
  } as any,
  {
    number: 3,
    name: 'Reza Firmansyah',
    viceName: 'Siti Zahra',
    tagline: '"Harmoni Kreativitas, Sportif & Berdaya Saing"',
    avatarLeader: '🧑‍💻',
    avatarVice: '🧕',
    vision: 'Mengembangkan ruang kreasi minat bakat tanpa batas dengan menjunjung tinggi sportivitas dan gotong royong.',
    missions: [
      'Revitalisasi seluruh ekstrakurikuler seni, olahraga, dan teknologi.',
      'Turnamen E-Sport dan Porseni antarkelas yang sportif dan mendidik.',
      'Workshop kewirausahaan siswa dan pameran karya kreatif.',
    ],
    debateAnswers: [
      {
        question: 'Bagaimana paslon 3 menjaga transparansi penggunaan dana kegiatan?',
        answer: 'Laporan pertanggungjawaban (LPJ) keuangan OSIS akan dipublikasikan secara terbuka di papan pengumuman dan website sekolah setiap selesai acara.',
      },
    ],
    votes: 289,
  },
];

export const ElectionSimGame: React.FC<{ onVoteSubmitted?: (pts: number) => void }> = ({ onVoteSubmitted }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [step, setStep] = useState<'intro' | 'debate' | 'ballot' | 'counting' | 'result'>('intro');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [userVotedCandidate, setUserVotedCandidate] = useState<number | null>(null);
  const [countingProgress, setCountingProgress] = useState(0);

  const handleVote = (candidateNumber: number) => {
    setUserVotedCandidate(candidateNumber);
    sound.playClick();
  };

  const submitBallot = () => {
    if (!userVotedCandidate) return;
    sound.playVictory();

    // Increment votes
    setCandidates((prev) =>
      prev.map((c) => (c.number === userVotedCandidate ? { ...c, votes: c.votes + 1 } : c))
    );

    setStep('counting');

    // Simulate animated quick count tally
    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        setCountingProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setStep('result');
          sound.playVictory();
          if (onVoteSubmitted) onVoteSubmitted(80);
        }, 600);
      } else {
        setCountingProgress(p);
      }
    }, 200);
  };

  const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Vote size={14} /> Simulasi Pemilu & Pilketos
          </span>
          <h3 className="text-lg md:text-xl font-bold">Laboratorium Demokrasi SMANDE</h3>
        </div>

        {/* Steps Navigation */}
        <div className="flex items-center gap-2 text-xs">
          {[
            { id: 'intro', label: '1. Visi Misi' },
            { id: 'debate', label: '2. Debat Terbuka' },
            { id: 'ballot', label: '3. Bilik Suara' },
            { id: 'result', label: '4. Hasil & Rekap' },
          ].map((st) => (
            <button
              key={st.id}
              disabled={step === 'counting'}
              onClick={() => {
                if (st.id === 'result' && !userVotedCandidate) return;
                setStep(st.id as any);
                sound.playClick();
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                step === st.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Candidate Intro */}
      {step === 'intro' && (
        <div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-6 text-xs text-slate-300 flex items-center justify-between">
            <span>
              ℹ️ Pelajari visi, misi, dan program kerja ketiga pasangan calon ketua dan wakil ketua OSIS SMANDE sebelum menentukan pilihanmu secara cerdas.
            </span>
            <button
              onClick={() => {
                setStep('debate');
                sound.playClick();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg transition-all shrink-0 ml-4"
            >
              Lanjut ke Sesi Debat ⏩
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {candidates.map((c) => (
              <div
                key={c.number}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm">
                      #{c.number}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Paslon Resmi</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl bg-slate-900 p-2 rounded-xl border border-slate-800">
                      {c.avatarLeader} {c.avatarVice}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400">& {c.viceName}</p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-amber-300 italic mb-3">{c.tagline}</p>

                  <div className="text-xs text-slate-300 mb-3">
                    <span className="font-bold text-slate-200 block mb-1">Visi:</span>
                    <p className="leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      {c.vision}
                    </p>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-slate-200 block mb-1">Misi Unggulan:</span>
                    <ul className="space-y-1 list-disc list-inside text-slate-400">
                      {c.missions.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Debate Session */}
      {step === 'debate' && (
        <div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-amber-300">Sesi Debat Publik & Tanya Jawab Interaktif</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Simak bagaimana setiap calon merespons isu krusial di lingkungan sekolah.
              </p>
            </div>
            <button
              onClick={() => {
                setStep('ballot');
                sound.playClick();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg text-xs transition-all shrink-0 ml-4"
            >
              Masuk ke Bilik Suara 🗳️
            </button>
          </div>

          <div className="space-y-4">
            {candidates.map((c) => (
              <div key={c.number} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                    #{c.number}
                  </span>
                  <h5 className="font-bold text-sm text-white">{c.name} & {c.viceName}</h5>
                </div>
                {c.debateAnswers.map((da, idx) => (
                  <div key={idx} className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                    <span className="font-semibold text-amber-400 block mb-1">Pertanyaan: {da.question}</span>
                    <p className="text-slate-300 italic">"{da.answer}"</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Virtual Ballot Box (TPS 01 SMANDE) */}
      {step === 'ballot' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-red-400 font-bold flex items-center justify-center gap-1.5 mb-1">
              <ShieldCheck size={16} /> Asas Pemilu: LUBER JURDIL
            </span>
            <h4 className="text-xl font-bold">Surat Suara Elektronik TPS 01 SMANDE</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Pilihanmu dijamin rahasia dan bebas dari paksaan pihak mana pun. Coblos (klik) salah satu foto pasangan calon berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {candidates.map((c) => {
              const isSelected = userVotedCandidate === c.number;
              return (
                <div
                  key={c.number}
                  onClick={() => handleVote(c.number)}
                  className={`cursor-pointer rounded-2xl p-4 border text-center transition-all ${
                    isSelected
                      ? 'bg-red-950/70 border-red-500 ring-2 ring-red-500 scale-102 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-slate-800 font-bold text-xs flex items-center justify-center mb-2 border border-slate-700 text-white">
                    {c.number}
                  </div>
                  <div className="text-4xl my-2">{c.avatarLeader} {c.avatarVice}</div>
                  <h5 className="font-bold text-xs text-white mb-0.5">{c.name}</h5>
                  <p className="text-[11px] text-slate-400 mb-3">& {c.viceName}</p>

                  <div
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ Terpilih Dicoblos' : 'Pilih Paslon Ini'}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            disabled={!userVotedCandidate}
            onClick={submitBallot}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all ${
              userVotedCandidate
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {userVotedCandidate
              ? `Masukkan Suara untuk Paslon #${userVotedCandidate} ke Kotak Suara 🗳️`
              : 'Pilih salah satu pasangan calon di atas untuk mencoblos'}
          </button>
        </div>
      )}

      {/* Step 4: Counting Animation */}
      {step === 'counting' && (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="text-4xl animate-bounce mb-3">🗳️</div>
          <h4 className="text-xl font-bold mb-2">Penghitungan Suara (Quick Count) Berlangsung...</h4>
          <p className="text-xs text-slate-400 mb-6">
            Sistem saksi dan panitia pemilihan memverifikasi keabsahan suara secara transparan dan akuntabel.
          </p>

          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${countingProgress}%` }}
            />
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold">{countingProgress}% Data Masuk</span>
        </div>
      )}

      {/* Step 5: Election Results */}
      {step === 'result' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-2">
              <Award size={32} />
            </div>
            <h4 className="text-xl font-bold text-amber-300">Hasil Resmi Pemilihan Ketua OSIS SMANDE</h4>
            <p className="text-xs text-slate-400">Total Suara Sah Masuk: {totalVotes} Pemilih</p>
          </div>

          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-950 to-red-950/60 border border-amber-500/40 p-5 rounded-2xl text-center mb-6">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
              🏆 Pasangan Calon Terpilih
            </span>
            <div className="text-3xl my-1">{winner.avatarLeader} {winner.avatarVice}</div>
            <h3 className="text-lg font-black text-white">Paslon #{winner.number}: {winner.name} & {winner.viceName}</h3>
            <p className="text-xs text-slate-300 mt-1 italic font-medium">"{winner.tagline}"</p>
          </div>

          {/* Voting Bars */}
          <div className="space-y-3 mb-6">
            {candidates.map((c) => {
              const percentage = ((c.votes / totalVotes) * 100).toFixed(1);
              return (
                <div key={c.number} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">
                      #{c.number} {c.name} & {c.viceName}
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {c.votes} Suara ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.number === winner.number ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed text-center">
            <b>Refleksi Demokrasi:</b> Siapapun yang terpilih, seluruh warga sekolah bersatu mendukung kepengurusan baru demi kemajuan bersama (Implementasi Sila ke-3 dan Sila ke-4).
          </div>
        </div>
      )}
    </div>
  );
};
