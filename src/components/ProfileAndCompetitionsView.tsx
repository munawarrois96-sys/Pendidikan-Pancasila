import React, { useState } from 'react';
import { UserProfile } from '../types';
import { allBadges, defaultStudents } from '../utils/userStore';
import { sound } from '../utils/audio';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  Star,
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ProfileAndCompetitionsView: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'lencana' | 'leaderboard' | 'sertifikat'>('profil');

  const handlePrintCertificate = () => {
    sound.playVictory();
    window.print();
  };

  // Dimensions of Profil Pelajar Pancasila
  const pppDimensions = [
    { name: 'Beriman, Bertakwa & Berakhlak Mulia', percentage: 95, color: 'from-amber-500 to-amber-600' },
    { name: 'Berkebinekaan Global', percentage: 92, color: 'from-red-500 to-red-600' },
    { name: 'Bergotong Royong', percentage: 96, color: 'from-emerald-500 to-emerald-600' },
    { name: 'Mandiri', percentage: 88, color: 'from-blue-500 to-blue-600' },
    { name: 'Bernalar Kritis', percentage: 90, color: 'from-purple-500 to-purple-600' },
    { name: 'Kreatif', percentage: 86, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950/70 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-slate-950 border-2 border-amber-500/50 flex items-center justify-center text-4xl shadow-xl">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white">{user.name}</h2>
              <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {user.school} • {user.className || 'Kelas XI-1'}
            </p>
            <p className="text-[11px] text-slate-500">NISN / Identitas: {user.nisnOrNip}</p>
          </div>
        </div>

        {/* Quick Stats Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Poin Pancasila</span>
            <span className="text-xl md:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Sparkles size={16} /> {user.points}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Streak Belajar</span>
            <span className="text-xl md:text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame size={16} /> {user.streakDays} Hari
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Tingkat Level</span>
            <span className="text-xl md:text-2xl font-black text-emerald-400">
              Lvl {user.level}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'profil', label: '👤 Portofolio Belajar', icon: UserCheck },
          { id: 'lencana', label: '🎖️ Lencana & Badges', icon: Award },
          { id: 'leaderboard', label: '🏆 Papan Peringkat SMANDE', icon: Trophy },
          { id: 'sertifikat', label: '📜 Sertifikat Kelulusan', icon: Printer },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Portofolio Profil */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 6 Dimensi Profil Pelajar Pancasila */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-400" /> Ketercapaian Dimensi Profil Pelajar Pancasila
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Penilaian holistik berbasis ketuntasan materi, partisipasi musyawarah, dan kuis nilai kebinekaan.
            </p>

            <div className="space-y-4">
              {pppDimensions.map((dim, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-200">{dim.name}</span>
                    <span className="font-mono font-bold text-amber-400">{dim.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                      style={{ width: `${dim.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Achievements */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-sm">Status Progres Belajar</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span>Materi Selesai</span>
                <span className="font-bold text-white">{user.completedMaterials.length} Bab</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span>Lencana Terkoleksi</span>
                <span className="font-bold text-amber-400">{user.badges.length} dari 8</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span>Rata-rata Skor Kuis</span>
                <span className="font-bold text-emerald-400">92 / 100</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sertifikat')}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Lihat Sertifikat Digital Resmi 📜
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Badges Koleksi */}
      {activeTab === 'lencana' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="font-bold text-white text-lg">Koleksi Lencana Kehormatan Siswa</h3>
            <p className="text-xs text-slate-400">Dapatkan lencana dengan menyelesaikan tantangan pembelajaran, kuis, dan simulasi.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {allBadges.map((b) => {
              const isUnlocked = user.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border flex flex-col items-center text-center justify-between transition-all ${
                    isUnlocked
                      ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/40 border-slate-800 opacity-50'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-2xl ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-red-600 text-white shadow-lg'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Award size={28} /> : <Lock size={24} />}
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-white mb-1">{b.name}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{b.description}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? '✓ Terbuka' : 'Terkunci'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center justify-center gap-1.5 mb-1">
              <Trophy size={16} /> Kompetisi Pembelajaran Aktif
            </span>
            <h3 className="text-xl font-black text-white">Papan Peringkat Pelajar Pancasila SMANDE</h3>
            <p className="text-xs text-slate-400 mt-1">
              Diperbarui secara real-time berdasarkan akumulasi poin kuis, game, dan studi kasus.
            </p>
          </div>

          <div className="space-y-3">
            {[...defaultStudents]
              .sort((a, b) => b.points - a.points)
              .map((student, rankIdx) => {
                const isCurrentUser = student.name === user.name;
                const medalColors = [
                  'bg-amber-400 text-slate-950', // 1st
                  'bg-slate-300 text-slate-950', // 2nd
                  'bg-amber-700 text-white',     // 3rd
                ];

                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isCurrentUser
                        ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/40 shadow-xl'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          rankIdx < 3 ? medalColors[rankIdx] : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{rankIdx + 1}
                      </div>

                      <div className="text-2xl">{student.avatar}</div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{student.name}</h5>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.2 rounded-full font-bold">
                              Kamu
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">Kelas {student.className}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-amber-400 flex items-center justify-end gap-1">
                        <Sparkles size={14} /> {student.points}
                      </div>
                      <span className="text-[10px] text-slate-500">Poin Terkumpul</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: Printable Official Certificate */}
      {activeTab === 'sertifikat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Pratinjau sertifikat digital resmi yang dapat dicetak atau disimpan sebagai PDF.
            </span>
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Printer size={16} /> Cetak / Unduh Sertifikat PDF
            </button>
          </div>

          {/* Certificate Container with Indonesian Official Styling */}
          <div
            id="print-certificate"
            className="bg-amber-50 text-slate-900 border-8 border-double border-amber-700/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-4xl mx-auto"
          >
            {/* Watermark Garuda */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-9xl">
              🇮🇩
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🦅</div>
              <h4 className="text-xs md:text-sm uppercase tracking-widest text-sky-900 font-extrabold">
                PEMERINTAH PROVINSI JAWA BARAT • DINAS PENDIDIKAN
              </h4>
              <h2 className="text-lg md:text-xl font-black text-slate-900 mt-0.5">
                SMA NEGERI 1 MANDE (SMANDE)
              </h2>
              <p className="text-[10px] md:text-xs text-slate-600 border-b-2 border-sky-800/40 pb-3 mt-1 max-w-lg mx-auto">
                Jl. Arya Wiratanudatar KM 8, Mande, Kab. Cianjur • Akreditasi A • Kurikulum Merdeka
              </p>
            </div>

            <div className="text-center my-6">
              <span className="text-xs uppercase tracking-widest text-sky-800 font-bold block mb-1">
                SERTIFIKAT PENGHARGAAN PEMBELAJARAN
              </span>
              <p className="text-xs text-slate-600 italic">Nomor: 421.3 / SMANDE / PPKn / 2026</p>
              <p className="text-xs text-slate-700 mt-4">Diberikan dengan penuh kehormatan kepada:</p>
              <h1 className="text-2xl md:text-4xl font-extrabold text-sky-900 my-2 font-serif underline decoration-sky-500">
                {user.name}
              </h1>
              <p className="text-xs font-semibold text-slate-700">
                NISN: {user.nisnOrNip} • Kelas: {user.className || 'XI-1'}
              </p>
            </div>

            <p className="text-xs md:text-sm text-slate-800 leading-relaxed text-center max-w-2xl mx-auto mb-8 font-serif">
              Telah menyelesaikan secara komprehensif seluruh modul pembelajaran, asesmen sumatif otomatis, serta simulasi kehidupan berdemokrasi pada platform digital <b>Pendidikan Pancasila Interaktif SMA Negeri 1 Mande (SMANDE)</b> dengan predikat <b>SANGAT BAIK (TUNTAS PARIPURNA)</b>.
            </p>

            <div className="flex justify-between items-end pt-8 border-t border-sky-800/30 text-xs">
              <div className="text-center">
                <span className="text-[11px] text-slate-600 block">Mengetahui,</span>
                <span className="text-[11px] font-bold text-slate-800 block mb-10">Kepala SMA Negeri 1 Mande</span>
                <div className="font-bold underline text-slate-900">Dr. H. Bambang Suprayitno, M.Pd</div>
                <span className="text-[10px] text-slate-600">NIP. 19680312 199303 1 004</span>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-600 block">Mande, Cianjur, 01 November 2026</span>
                <span className="text-[11px] font-bold text-slate-800 block mb-10">Guru Pengampu Pendidikan Pancasila</span>
                <div className="font-bold underline text-slate-900">Munawar Rois, S.Pd.</div>
                <span className="text-[10px] text-slate-600">NIP. 19710815 199802 1 004</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
