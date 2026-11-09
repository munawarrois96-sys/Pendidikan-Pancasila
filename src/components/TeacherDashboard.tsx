import React, { useState, useEffect } from 'react';
import { QuizAttempt, Question, SchoolAnnouncement, UserProfile, GradeLevel } from '../types';
import { initialAttempts, getStoredStudents, saveStoredStudents, resetStoredStudents } from '../utils/userStore';
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
  Edit,
  UserPlus,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Printer,
  Sparkles,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

interface TeacherDashboardProps {
  students?: UserProfile[];
  onUpdateStudents?: (students: UserProfile[]) => void;
  onNavigateToCertificate?: (student: UserProfile) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students: propStudents,
  onUpdateStudents,
  onNavigateToCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'rekapNilai' | 'bankSoal' | 'analisis' | 'pengumuman' | 'dataSiswa'>('dataSiswa');
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);
  const [allQuestions, setAllQuestions] = useState<Question[]>(questionsBank);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(initialAnnouncements);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'Semua' | 'X' | 'XI' | 'XII'>('Semua');

  // ================= DATA SISWA STATE & CRUD =================
  const [studentsList, setStudentsList] = useState<UserProfile[]>(() => {
    if (propStudents && propStudents.length > 0) return propStudents;
    return getStoredStudents();
  });

  useEffect(() => {
    if (propStudents && propStudents.length > 0) {
      setStudentsList(propStudents);
    }
  }, [propStudents]);

  const updateAndPersistStudents = (newStudents: UserProfile[]) => {
    setStudentsList(newStudents);
    saveStoredStudents(newStudents);
    if (onUpdateStudents) {
      onUpdateStudents(newStudents);
    }
  };

  // Student filtering & view state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<'Semua' | 'X' | 'XI' | 'XII'>('Semua');
  const [studentViewMode, setStudentViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state for student CRUD
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<UserProfile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserProfile | null>(null);

  // Add student form state
  const [formName, setFormName] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formGrade, setFormGrade] = useState<GradeLevel>('XI');
  const [formClassName, setFormClassName] = useState('XI-1');
  const [formAvatar, setFormAvatar] = useState('👨‍🎓');
  const [formPoints, setFormPoints] = useState(350);
  const [formLevel, setFormLevel] = useState(3);

  // Edit student form state
  const [editFormName, setEditFormName] = useState('');
  const [editFormNisn, setEditFormNisn] = useState('');
  const [editFormGrade, setEditFormGrade] = useState<GradeLevel>('XI');
  const [editFormClassName, setEditFormClassName] = useState('XI-1');
  const [editFormAvatar, setEditFormAvatar] = useState('👨‍🎓');
  const [editFormPoints, setEditFormPoints] = useState(350);
  const [editFormLevel, setEditFormLevel] = useState(3);

  const avatarOptions = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '🧕', '👦', '👧', '🦅', '🇮🇩', '🌟', '📚', '🎯', '✨'];

  // Open Edit Modal with pre-filled data
  const handleOpenEditModal = (student: UserProfile) => {
    sound.playClick();
    setStudentToEdit(student);
    setEditFormName(student.name);
    setEditFormNisn(student.nisnOrNip);
    setEditFormGrade((student.grade as GradeLevel) || 'XI');
    setEditFormClassName(student.className || `${student.grade || 'XI'}-1`);
    setEditFormAvatar(student.avatar || '👨‍🎓');
    setEditFormPoints(student.points || 0);
    setEditFormLevel(student.level || 1);
  };

  // Submit Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNisn.trim()) return;

    sound.playCorrect();
    const newStudent: UserProfile = {
      id: `std-${Date.now()}`,
      name: formName.trim(),
      role: 'siswa',
      nisnOrNip: formNisn.trim(),
      grade: formGrade,
      className: formClassName.trim() || `${formGrade}-1`,
      school: 'SMA Negeri 1 Mande (SMANDE)',
      avatar: formAvatar,
      points: Number(formPoints) || 100,
      level: Number(formLevel) || 1,
      streakDays: 1,
      badges: ['badge-pejuang'],
      completedMaterials: [],
      quizScores: {},
    };

    const updated = [newStudent, ...studentsList];
    updateAndPersistStudents(updated);
    setShowAddStudentModal(false);

    // Reset form
    setFormName('');
    setFormNisn('');
    setFormClassName('XI-1');
    setFormPoints(350);
    setFormLevel(3);
  };

  // Submit Edit Student
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit || !editFormName.trim() || !editFormNisn.trim()) return;

    sound.playCorrect();
    const updated = studentsList.map((s) => {
      if (s.id === studentToEdit.id) {
        return {
          ...s,
          name: editFormName.trim(),
          nisnOrNip: editFormNisn.trim(),
          grade: editFormGrade,
          className: editFormClassName.trim() || `${editFormGrade}-1`,
          avatar: editFormAvatar,
          points: Number(editFormPoints) || 0,
          level: Number(editFormLevel) || 1,
        };
      }
      return s;
    });

    updateAndPersistStudents(updated);
    setStudentToEdit(null);
  };

  // Confirm Delete Student
  const handleConfirmDeleteStudent = () => {
    if (!studentToDelete) return;
    sound.playClick();
    const updated = studentsList.filter((s) => s.id !== studentToDelete.id);
    updateAndPersistStudents(updated);
    setStudentToDelete(null);
  };

  // Reset to default students
  const handleResetStudents = () => {
    if (window.confirm('Apakah Bapak/Ibu Guru yakin ingin mengembalikan daftar siswa ke data awal bawaan SMA Negeri 1 Mande?')) {
      sound.playClick();
      const defaults = resetStoredStudents();
      updateAndPersistStudents(defaults);
    }
  };

  // Export Students to CSV
  const handleExportStudentsCSV = () => {
    sound.playClick();
    const headers = 'ID,Nama Lengkap,NISN,Jenjang,Rombel/Kelas,Poin,Level,Jumlah Lencana,Sekolah\n';
    const rows = studentsList
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.nisnOrNip}","Kelas ${s.grade || '-'}","${s.className || '-'}","${s.points}","${s.level}","${s.badges?.length || 0}","${s.school || 'SMA Negeri 1 Mande'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_Siswa_Pancasila_SMANDE_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered students list
  const filteredStudents = studentsList.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisnOrNip.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.className && s.className.toLowerCase().includes(studentSearch.toLowerCase()));
    const matchGrade = studentGradeFilter === 'Semua' || s.grade === studentGradeFilter;
    return matchSearch && matchGrade;
  });

  // ================= EXISTING QUESTION FORM STATE =================
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

  // Handle export to CSV/Excel for attempts
  const handleExportAttemptsCSV = () => {
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
    <div className="space-y-6 animate-fade-in">
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
            onClick={activeTab === 'dataSiswa' ? handleExportStudentsCSV : handleExportAttemptsCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <FileSpreadsheet size={15} /> Unduh Rekap Excel (CSV)
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-sky-200 pb-2 overflow-x-auto">
        {[
          { id: 'dataSiswa', label: '👥 Data Siswa & Rombel (CRUD)', icon: Users },
          { id: 'rekapNilai', label: '📊 Rekap Nilai Siswa', icon: BarChart3 },
          { id: 'bankSoal', label: '🧠 Manajemen Bank Soal', icon: HelpCircle },
          { id: 'analisis', label: '📈 Analisis Ketuntasan TP', icon: CheckCircle2 },
          { id: 'pengumuman', label: '📢 Pengumuman Kelas', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: DATA SISWA & ROMBEL (FULL CRUD) ================= */}
      {activeTab === 'dataSiswa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Header & Controls Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">Kelola Data Siswa & Rombel SMANDE</h3>
                <span className="text-xs bg-sky-950 text-sky-300 border border-sky-600/50 px-2.5 py-0.5 rounded-full font-bold">
                  {studentsList.length} Siswa Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Bapak/Ibu Guru dapat <b>menambah</b> siswa baru, <b>mengedit</b> profil/kelas/poin, <b>menghapus</b> siswa, dan <b>mencetak sertifikat</b> resmi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddStudentModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                <UserPlus size={16} />
                <span>+ Tambah Siswa Baru</span>
              </button>

              <button
                onClick={handleExportStudentsCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
                title="Ekspor Seluruh Data Siswa ke CSV"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Ekspor CSV</span>
              </button>

              <button
                onClick={handleResetStudents}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                title="Kembalikan ke Data Bawaan SMANDE"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset Awal</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setStudentViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    studentViewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Kartu"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setStudentViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all ${
                    studentViewMode === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Tabel"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Class Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, NISN, atau rombel..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {studentSearch && (
                <button
                  onClick={() => setStudentSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center bg-slate-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grade Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] font-bold mr-1 hidden sm:inline">Jenjang:</span>
              {(['Semua', 'X', 'XI', 'XII'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setStudentGradeFilter(g);
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    studentGradeFilter === g
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {g === 'Semua' ? 'Semua Kelas' : `Kelas ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* Student Content: Cards View */}
          {studentViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStudents.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-slate-950/50 rounded-2xl border border-slate-800">
                  Tidak ditemukan siswa dengan kata kunci "{studentSearch}" di {studentGradeFilter === 'Semua' ? 'semua kelas' : `Kelas ${studentGradeFilter}`}.
                </div>
              ) : (
                filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-md"
                  >
                    <div>
                      {/* Top Header of Card: Avatar & Class Pill */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-4xl p-1 bg-slate-900 rounded-2xl border border-slate-800">{s.avatar || '👨‍🎓'}</span>
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase bg-sky-950 text-sky-300 border border-sky-600/40 px-2 py-0.5 rounded-full inline-block">
                            {s.className || `Kelas ${s.grade || 'XI'}`}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            NISN: {s.nisnOrNip}
                          </div>
                        </div>
                      </div>

                      {/* Name & School */}
                      <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {s.school || 'SMA Negeri 1 Mande'}
                      </p>

                      {/* Points, Level, Badges */}
                      <div className="mt-3 pt-3 border-t border-slate-850 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Poin</span>
                          <b className="text-amber-400 font-extrabold text-xs">{s.points}</b>
                        </div>
                        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Level</span>
                          <b className="text-emerald-400 font-extrabold text-xs">{s.level}</b>
                        </div>
                        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Lencana</span>
                          <b className="text-sky-400 font-extrabold text-xs">{s.badges?.length || 0}</b>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-850 flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="flex-1 py-1.5 px-2 bg-slate-850 hover:bg-sky-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-700/80"
                        title="Edit Data Siswa"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setStudentToDelete(s);
                        }}
                        className="py-1.5 px-2.5 bg-slate-850 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center border border-slate-700/80"
                        title="Hapus Data Siswa"
                      >
                        <Trash2 size={13} />
                      </button>

                      {onNavigateToCertificate && (
                        <button
                          onClick={() => {
                            sound.playVictory();
                            onNavigateToCertificate(s);
                          }}
                          className="py-1.5 px-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-sky-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center border border-amber-500/30"
                          title="Cetak Sertifikat Siswa Ini"
                        >
                          <Printer size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Student Content: Table View */}
          {studentViewMode === 'table' && (
            <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Siswa</th>
                    <th className="p-3">NISN</th>
                    <th className="p-3">Kelas & Rombel</th>
                    <th className="p-3 text-center">Poin</th>
                    <th className="p-3 text-center">Level</th>
                    <th className="p-3 text-center">Lencana</th>
                    <th className="p-3 text-right">Aksi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Tidak ada data siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 font-semibold text-white flex items-center gap-2.5">
                          <span className="text-xl">{s.avatar || '👨‍🎓'}</span>
                          <div>
                            <div className="font-bold text-white">{s.name}</div>
                            <div className="text-[10px] text-slate-400">{s.school || 'SMAN 1 Mande'}</div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-300">{s.nisnOrNip}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                            {s.className || `Kelas ${s.grade || 'XI'}`}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-amber-400">{s.points}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-400">{s.level}</td>
                        <td className="p-3 text-center font-mono text-sky-400">{s.badges?.length || 0}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(s)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Edit Siswa"
                            >
                              <Edit size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                sound.playClick();
                                setStudentToDelete(s);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg text-xs transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 size={13} />
                            </button>
                            {onNavigateToCertificate && (
                              <button
                                onClick={() => {
                                  sound.playVictory();
                                  onNavigateToCertificate(s);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-amber-500 text-amber-400 hover:text-sky-950 rounded-lg text-xs transition-colors"
                                title="Cetak Sertifikat"
                              >
                                <Printer size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= MODAL: TAMBAH SISWA BARU ================= */}
          {showAddStudentModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <UserPlus size={20} className="text-emerald-400" />
                    <h4 className="text-lg font-bold text-white">Tambah Siswa Baru SMANDE</h4>
                  </div>
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nama Lengkap Siswa:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Farhan Al-Fatih"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">NISN (10 Digit):</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 0067823415"
                        value={formNisn}
                        onChange={(e) => setFormNisn(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Tingkat Jenjang:</label>
                      <select
                        value={formGrade}
                        onChange={(e) => {
                          const g = e.target.value as GradeLevel;
                          setFormGrade(g);
                          setFormClassName(`${g}-1`);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="X">Kelas X (Fase E)</option>
                        <option value="XI">Kelas XI (Fase F)</option>
                        <option value="XII">Kelas XII (Fase F)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rombel / Nama Kelas:</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: XI-1 atau XII-MIPA 2"
                        value={formClassName}
                        onChange={(e) => setFormClassName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Poin Pancasila Awal:</label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={formPoints}
                        onChange={(e) => setFormPoints(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Pilih Avatar Emoji:</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setFormAvatar(av)}
                          className={`text-2xl p-2 rounded-xl transition-all ${
                            formAvatar === av
                              ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-110'
                              : 'bg-slate-950 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg transition-all"
                    >
                      Simpan Siswa
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= MODAL: EDIT DATA SISWA ================= */}
          {studentToEdit && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Edit size={20} className="text-sky-400" />
                    <h4 className="text-lg font-bold text-white">Edit Data Siswa</h4>
                  </div>
                  <button
                    onClick={() => setStudentToEdit(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleEditStudentSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Nama Lengkap Siswa:</label>
                    <input
                      type="text"
                      required
                      value={editFormName}
                      onChange={(e) => setEditFormName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">NISN:</label>
                      <input
                        type="text"
                        required
                        value={editFormNisn}
                        onChange={(e) => setEditFormNisn(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Tingkat Jenjang:</label>
                      <select
                        value={editFormGrade}
                        onChange={(e) => setEditFormGrade(e.target.value as GradeLevel)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rombel/Kelas:</label>
                      <input
                        type="text"
                        required
                        value={editFormClassName}
                        onChange={(e) => setEditFormClassName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Poin:</label>
                      <input
                        type="number"
                        min="0"
                        value={editFormPoints}
                        onChange={(e) => setEditFormPoints(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Level:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={editFormLevel}
                        onChange={(e) => setEditFormLevel(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Avatar Emoji:</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setEditFormAvatar(av)}
                          className={`text-2xl p-2 rounded-xl transition-all ${
                            editFormAvatar === av
                              ? 'bg-sky-600 ring-2 ring-sky-300 scale-110'
                              : 'bg-slate-950 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStudentToEdit(null)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-lg transition-all"
                    >
                      Perbarui Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= MODAL: KONFIRMASI HAPUS SISWA ================= */}
          {studentToDelete && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2.5 bg-red-950/80 rounded-2xl border border-red-500/30">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Konfirmasi Hapus Siswa</h4>
                    <p className="text-[11px] text-slate-400">Perintah Guru Pengampu SMANDE</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400">Nama Siswa:</div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{studentToDelete.avatar || '👨‍🎓'}</span>
                    <span>{studentToDelete.name}</span>
                  </div>
                  <div className="text-slate-400 pt-1 text-[11px]">
                    NISN: <span className="text-slate-200 font-mono">{studentToDelete.nisnOrNip}</span> • Kelas: <span className="text-amber-400 font-bold">{studentToDelete.className}</span>
                  </div>
                </div>

                <p className="text-xs text-red-300 leading-relaxed">
                  Apakah Bapak/Ibu Guru yakin ingin menghapus data siswa ini? Tindakan ini akan menghapus data pendaftaran siswa dari sistem portal.
                </p>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setStudentToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmDeleteStudent}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Ya, Hapus Siswa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: REKAP NILAI SISWA ================= */}
      {activeTab === 'rekapNilai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Riwayat Pengerjaan & Evaluasi Siswa</h3>
              <p className="text-xs text-slate-400">Total data tercatat: {attempts.length} pengerjaan</p>
            </div>

            <button
              onClick={handleExportAttemptsCSV}
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

      {/* ================= TAB 3: MANAJEMEN BANK SOAL ================= */}
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
              .map((q) => (
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

      {/* ================= TAB 4: ANALISIS KETUNTASAN BELAJAR ================= */}
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

      {/* ================= TAB 5: PENGUMUMAN PEMBELAJARAN ================= */}
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
    </div>
  );
};
