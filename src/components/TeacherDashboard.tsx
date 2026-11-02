import React, { useState } from 'react';
import { QuizAttempt, Question, SchoolAnnouncement } from '../types';
import { defaultStudents, initialAttempts } from '../utils/userStore';
import { questionsBank } from '../data/quizData';
import { initialAnnouncements } from '../data/forumAndAnnouncements';
import { sound } from '../utils/audio';
import {
  Users,
  BookOpen,
  HelpCircle,
  BarChart3,
  Bell,
  Download,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Filter,
  Award,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rekapNilai' | 'bankSoal' | 'analisis' | 'pengumuman' | 'dataSiswa'>('rekapNilai');
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);
  const [allQuestions, setAllQuestions] = useState<Question[]>(questionsBank);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(initialAnnouncements);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'Semua' | 'X' | 'XI' | 'XII'>('Semua');

  // New question form state
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newGrade, setNewGrade] = useState<'X' | 'XI' | 'XII'>('XI');
  const [newDifficulty, setNewDifficulty] = useState<'mudah' | 'sedang' | 'sulit' | 'hots'>('sedang');
  const [newExplanation, setNewExplanation] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);

  // New announcement form state
  const [showAddAnnounce, setShowAddAnnounce] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'Penting' | 'Tugas' | 'Ujian' | 'Kegiatan'>('Penting');
  const [annContent, setAnnContent] = useState('');

  // Handle export to CSV/Excel
  const handleExportCSV = () => {
    sound.playClick();
    const headers = 'ID,Nama Siswa,Kelas,Kuis,Skor,Jumlah Benar,Total Soal,Tanggal\n';
    const rows = attempts
      .map(
        (a) =>
          `"${a.id}","${a.studentName}","${a.studentClass}","${a.quizTitle}",${a.score},${a.correctCount},${a.totalQuestions},"${a.timestamp}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Nilai_Pancasila_SMANDE_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newExplanation.trim()) return;

    sound.playCorrect();
    const createdQ: Question = {
      id: `q-custom-${Date.now()}`,
      grade: newGrade,
      chapter: 1,
      difficulty: newDifficulty,
      type: 'multiple_choice',
      prompt: newPrompt,
      options: [newOptionA || 'Pilihan A', newOptionB || 'Pilihan B', newOptionC || 'Pilihan C', newOptionD || 'Pilihan D'],
      correctOptionIndex: newCorrectIdx,
      explanation: newExplanation,
      pancasilaPillar: 1,
    };

    setAllQuestions([createdQ, ...allQuestions]);
    setShowAddQuestionModal(false);
    setNewPrompt('');
    setNewExplanation('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    sound.playCorrect();
    const newAnn: SchoolAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      category: annCategory,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Munawar Rois, S.Pd. (Guru)',
      content: annContent,
    };

    setAnnouncements([newAnn, ...announcements]);
    setShowAddAnnounce(false);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-500 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5 mb-1">
            <Award size={14} /> Panel Guru & Administrator • SMA Negeri 1 Mande (SMANDE)
          </span>
          <h2 className="text-2xl font-black text-white">Dashboard Pembelajaran Pendidikan Pancasila</h2>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            Pengampu: <span className="text-white font-bold">Munawar Rois, S.Pd.</span> • NIP: 197108151998021004
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <FileSpreadsheet size={15} /> Unduh Rekap Excel (CSV)
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-sky-200 pb-2 overflow-x-auto">
        {[
          { id: 'rekapNilai', label: '📊 Rekap Nilai Siswa', icon: BarChart3 },
          { id: 'bankSoal', label: '🧠 Manajemen Bank Soal', icon: HelpCircle },
          { id: 'analisis', label: '📈 Analisis Ketuntasan TP', icon: CheckCircle2 },
          { id: 'pengumuman', label: '📢 Pengumuman Kelas', icon: Bell },
          { id: 'dataSiswa', label: '👥 Data Siswa & Rombel', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Rekap Nilai Siswa */}
      {activeTab === 'rekapNilai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Riwayat Pengerjaan & Evaluasi Siswa</h3>
              <p className="text-xs text-slate-400">Total data tercatat: {attempts.length} pengerjaan</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Judul Asesmen</th>
                  <th className="p-3">Skor</th>
                  <th className="p-3">Ketuntasan (KKTP: 75)</th>
                  <th className="p-3">Waktu Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attempts.map((att) => {
                  const isPassed = att.score >= 75;
                  return (
                    <tr key={att.id} className="hover:bg-slate-850 transition-colors">
                      <td className="p-3 font-semibold text-white">{att.studentName}</td>
                      <td className="p-3">{att.studentClass}</td>
                      <td className="p-3 text-slate-300">{att.quizTitle}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{att.score}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPassed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-950 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {isPassed ? 'TUNTAS' : 'REMEDIAL'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{att.timestamp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Manajemen Bank Soal */}
      {activeTab === 'bankSoal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Kelola Bank Soal Pembelajaran</h3>
              <p className="text-xs text-slate-400">Total soal aktif: {allQuestions.length} butir</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Grade Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['Semua', 'X', 'XI', 'XII'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGradeFilter(g)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      selectedGradeFilter === g
                        ? 'bg-red-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Kelas {g}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <PlusCircle size={15} /> Tambah Soal Baru
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {allQuestions
              .filter(
                (q) => selectedGradeFilter === 'Semua' || q.grade === selectedGradeFilter
              )
              .map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700">
                        Kelas {q.grade}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400">Tipe: {q.type}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug">{q.prompt}</h4>
                    <p className="text-xs text-slate-400 italic">💡 Pembahasan: {q.explanation}</p>
                  </div>

                  <button
                    onClick={() => {
                      setAllQuestions(allQuestions.filter((item) => item.id !== q.id));
                      sound.playClick();
                    }}
                    className="p-2 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded-lg transition-colors self-end md:self-center"
                    title="Hapus Soal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
          </div>

          {/* Add Question Modal */}
          {showAddQuestionModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Tambah Butir Soal Baru</h4>
                <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Jenjang Kelas:</label>
                      <select
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Tingkat Kesulitan:</label>
                      <select
                        value={newDifficulty}
                        onChange={(e) => setNewDifficulty(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        <option value="mudah">Mudah</option>
                        <option value="sedang">Sedang</option>
                        <option value="sulit">Sulit</option>
                        <option value="hots">HOTS (Analisis Tinggi)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Pertanyaan / Narasi Soal:</label>
                    <textarea
                      rows={3}
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="Tuliskan butir soal di sini..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-400">Pilihan Jawaban (Pilihan Ganda):</label>
                    <input
                      type="text"
                      placeholder="Pilihan A"
                      value={newOptionA}
                      onChange={(e) => setNewOptionA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pilihan B"
                      value={newOptionB}
                      onChange={(e) => setNewOptionB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pilihan C"
                      value={newOptionC}
                      onChange={(e) => setNewOptionC(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pilihan D"
                      value={newOptionD}
                      onChange={(e) => setNewOptionD(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Kunci Jawaban Benar:</label>
                    <select
                      value={newCorrectIdx}
                      onChange={(e) => setNewCorrectIdx(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option value={0}>Pilihan A</option>
                      <option value={1}>Pilihan B</option>
                      <option value={2}>Pilihan C</option>
                      <option value={3}>Pilihan D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Pembahasan / Rasionalisasi Kunci:</label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Jelaskan alasan jawaban benar berlandaskan nilai Pancasila..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddQuestionModal(false)}
                      className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg"
                    >
                      Simpan Soal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Analisis Ketuntasan Belajar */}
      {activeTab === 'analisis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Rata-Rata Nilai Sekolah</span>
              <div className="text-3xl font-extrabold text-amber-400 my-1">90.8</div>
              <span className="text-xs text-emerald-400">Target KKTP 75 Terlampaui</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Persentase Ketuntasan</span>
              <div className="text-3xl font-extrabold text-emerald-400 my-1">92.4%</div>
              <span className="text-xs text-slate-400">Siswa Lulus Asesmen Sumatif</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Materi Paling Dikuasai</span>
              <div className="text-lg font-bold text-white my-1">Bhinneka Tunggal Ika</div>
              <span className="text-xs text-amber-400">Akurasi 96%</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <h4 className="font-bold text-white text-sm mb-3">
              Analisis Butir Soal yang Membutuhkan Pengayaan (Remedial):
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Hierarki Peraturan Perundang-undangan (UU 12/2011)</span>
                  <p className="text-slate-400 text-[11px]">Banyak siswa keliru membedakan urutan posisi Tap MPR dengan Perppu.</p>
                </div>
                <span className="text-red-400 font-bold">Akurasi 68%</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Perbedaan Ideologi Terbuka vs Tertutup</span>
                  <p className="text-slate-400 text-[11px]">Perlu penguatan konsep dimensi idealisme dan dimensi realitas Pancasila.</p>
                </div>
                <span className="text-amber-400 font-bold">Akurasi 74%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pengumuman Pembelajaran */}
      {activeTab === 'pengumuman' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Kelola Pengumuman & Agenda Tugas</h3>
              <p className="text-xs text-slate-400">Pengumuman langsung tampil di Beranda siswa</p>
            </div>

            <button
              onClick={() => setShowAddAnnounce(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <PlusCircle size={15} /> Buat Pengumuman Baru
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{ann.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>

                <button
                  onClick={() => {
                    setAnnouncements(announcements.filter((a) => a.id !== ann.id));
                    sound.playClick();
                  }}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Announcement Modal */}
          {showAddAnnounce && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Buat Pengumuman Pembelajaran</h4>
                <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Kategori Pengumuman:</label>
                    <select
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    >
                      <option value="Penting">Penting</option>
                      <option value="Tugas">Tugas / LKPD</option>
                      <option value="Ujian">Asesmen / Ujian</option>
                      <option value="Kegiatan">Kegiatan Sekolah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Judul Pengumuman:</label>
                    <input
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="Contoh: Asesmen Sumatif Bab 2 Dimulai..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Isi Pesan:</label>
                    <textarea
                      rows={4}
                      required
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Tuliskan pesan instruksi untuk peserta didik..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddAnnounce(false)}
                      className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg"
                    >
                      Terbitkan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Data Siswa & Rombel */}
      {activeTab === 'dataSiswa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4">Daftar Peserta Didik Aktif SMANDE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {defaultStudents.map((s) => (
              <div key={s.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center">
                <div className="text-4xl mb-2">{s.avatar}</div>
                <h5 className="font-bold text-sm text-white">{s.name}</h5>
                <span className="text-xs text-amber-400 font-medium">Kelas {s.className}</span>
                <p className="text-[11px] text-slate-400 mt-1">NISN: {s.nisnOrNip}</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-slate-300 flex justify-between">
                  <span>Poin: <b className="text-amber-400">{s.points}</b></span>
                  <span>Level: <b className="text-emerald-400">{s.level}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
