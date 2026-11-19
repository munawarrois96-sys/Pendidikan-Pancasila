import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  FileText,
  XCircle,
  Clock,
  Calendar,
  Download,
  Trash2,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import { AttendanceStatus, GradeLevel, StudentAttendanceRecord } from '../types';
import {
  CLASS_GROUPS,
  INDONESIAN_DAYS,
  getStoredAttendance,
  saveStoredAttendance,
  clearStoredAttendance,
} from '../data/attendanceData';
import { sound } from '../utils/audio';

const LESSON_PERIOD_OPTIONS = [
  'Jam ke-1 & 2 (07:00 - 08:30)',
  'Jam ke-3 & 4 (08:30 - 10:00)',
  'Jam ke-5 & 6 (10:15 - 11:45)',
  'Jam ke-7 & 8 (12:30 - 14:00)',
  'Jam ke-2 & 3 (07:45 - 09:15)',
];

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getCurrentIndonesianDateTime() {
  const now = new Date();
  const dayName = DAYS_ID[now.getDay()];
  const dateStr = `${now.getDate()} ${MONTHS_ID[now.getMonth()]} ${now.getFullYear()}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return {
    dayName: dayName === 'Minggu' ? 'Senin' : dayName,
    liveDayName: dayName,
    dateStr,
    timeStr: `${hh}:${mm}:${ss} WIB`,
  };
}

function getStatusBadgeConfig(status: AttendanceStatus) {
  switch (status) {
    case 'HADIR':
      return {
        label: 'HADIR',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        selectBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        Icon: CheckCircle2,
      };
    case 'IJIN':
      return {
        label: 'IJIN',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        selectBg: 'bg-amber-50 text-amber-800 border-amber-300',
        Icon: FileText,
      };
    case 'ALPA':
      return {
        label: 'ALPA',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        selectBg: 'bg-rose-50 text-rose-800 border-rose-300',
        Icon: XCircle,
      };
  }
}

export const StudentAttendanceView: React.FC = () => {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>(getStoredAttendance);
  const [liveClock, setLiveClock] = useState(getCurrentIndonesianDateTime);

  // Manual Visitor Entry Form State (always visible)
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newStatus, setNewStatus] = useState<'' | AttendanceStatus>('');
  const [newDay, setNewDay] = useState<string>(() => getCurrentIndonesianDateTime().dayName);
  const [newDateStr, setNewDateStr] = useState<string>(() => getCurrentIndonesianDateTime().dateStr);
  const [newTimeStr, setNewTimeStr] = useState<string>(() => getCurrentIndonesianDateTime().timeStr);
  const [newPeriod, setNewPeriod] = useState<string>(LESSON_PERIOD_OPTIONS[0]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | AttendanceStatus>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Pagination & UI State
  const [rowsPerPage, setRowsPerPage] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(getCurrentIndonesianDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load shared attendance data from server (starts empty; syncs with localStorage fallback)
  useEffect(() => {
    let active = true;
    fetch('/api/attendance')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data || !Array.isArray(data.records)) return;
        if (data.records.length > 0) {
          setRecords(data.records);
          saveStoredAttendance(data.records);
        }
      })
      .catch(() => {
        // Fallback already initialized from localStorage
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      const matchClass = selectedClass === 'ALL' || rec.className === selectedClass;
      const matchStatus = selectedStatus === 'ALL' || rec.status === selectedStatus;
      const matchDay = selectedDay === 'ALL' || rec.dayName === selectedDay;
      const matchSearch =
        !q ||
        rec.studentName.toLowerCase().includes(q) ||
        rec.className.toLowerCase().includes(q) ||
        rec.dayName.toLowerCase().includes(q) ||
        rec.dateStr.toLowerCase().includes(q) ||
        rec.note.toLowerCase().includes(q) ||
        rec.status.toLowerCase().includes(q);
      return matchClass && matchStatus && matchDay && matchSearch;
    });
  }, [records, selectedClass, selectedStatus, selectedDay, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedStatus, selectedDay, searchQuery, rowsPerPage]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const hadir = filteredRecords.filter((r) => r.status === 'HADIR').length;
    const ijin = filteredRecords.filter((r) => r.status === 'IJIN').length;
    const alpa = filteredRecords.filter((r) => r.status === 'ALPA').length;
    const hadirPct = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { total, hadir, ijin, alpa, hadirPct };
  }, [filteredRecords]);

  const totalPages = rowsPerPage === 0 ? 1 : Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));
  const paginatedRecords = useMemo(() => {
    if (rowsPerPage === 0) return filteredRecords;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage, rowsPerPage]);

  const showNotice = (msg: string) => {
    setErrorMsg(null);
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleFillNowTime = () => {
    sound.playClick();
    const now = getCurrentIndonesianDateTime();
    setNewDay(now.dayName);
    setNewDateStr(now.dateStr);
    setNewTimeStr(now.timeStr);
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setErrorMsg('Silakan isi Nama Lengkap Siswa terlebih dahulu.');
      return;
    }
    if (!newClass) {
      setErrorMsg('Silakan pilih Kelas (X-1 s.d. XII-10) terlebih dahulu.');
      return;
    }
    if (!newStatus) {
      setErrorMsg('Silakan pilih Status Kehadiran (HADIR, IJIN, atau ALPA).');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    sound.playCorrect();

    const now = getCurrentIndonesianDateTime();
    const grade = newClass.split('-')[0] as GradeLevel;
    const resolvedNote =
      newNote.trim() ||
      (newStatus === 'HADIR'
        ? 'Hadir mengikuti pembelajaran'
        : newStatus === 'IJIN'
        ? 'Ijin berhalangan hadir'
        : 'Tidak hadir tanpa keterangan');

    const entry: StudentAttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentName: trimmedName,
      className: newClass,
      grade,
      dayName: newDay || now.dayName,
      dateStr: newDateStr.trim() || now.dateStr,
      timeStr: newStatus === 'ALPA' ? '— (Tanpa Keterangan)' : newTimeStr.trim() || now.timeStr,
      lessonPeriod: newPeriod,
      status: newStatus,
      note: resolvedNote,
    };

    const nextRecords = [entry, ...records];
    setRecords(nextRecords);
    saveStoredAttendance(nextRecords);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.records)) {
          setRecords(data.records);
          saveStoredAttendance(data.records);
        }
      }
    } catch {
      // Keep localStorage copy if server request fails
    } finally {
      setIsSubmitting(false);
    }

    // Reset manual fields for next visitor while keeping current clock fresh
    setNewName('');
    setNewClass('');
    setNewStatus('');
    setNewNote('');
    setNewDay(now.dayName);
    setNewDateStr(now.dateStr);
    setNewTimeStr(now.timeStr);

    showNotice(`Absensi "${entry.studentName}" (${entry.className}) — ${entry.status} berhasil dicatat.`);
  };

  const handleStatusChange = async (id: string, nextStatus: AttendanceStatus) => {
    sound.playClick();
    const nowTime = getCurrentIndonesianDateTime().timeStr;
    const defaultNoteByStatus =
      nextStatus === 'HADIR'
        ? 'Hadir mengikuti pembelajaran'
        : nextStatus === 'IJIN'
        ? 'Ijin berhalangan hadir'
        : 'Tidak hadir tanpa keterangan';

    let nextTimeStr = nowTime;
    const updated = records.map((rec) => {
      if (rec.id !== id) return rec;
      nextTimeStr =
        nextStatus === 'ALPA'
          ? '— (Tanpa Keterangan)'
          : rec.timeStr.startsWith('—')
          ? nowTime
          : rec.timeStr;
      return {
        ...rec,
        status: nextStatus,
        timeStr: nextTimeStr,
        note: defaultNoteByStatus,
      };
    });

    setRecords(updated);
    saveStoredAttendance(updated);

    try {
      await fetch(`/api/attendance/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, timeStr: nextTimeStr, note: defaultNoteByStatus }),
      });
    } catch {
      // Keep local update
    }
    showNotice(`Status absensi diperbarui menjadi ${nextStatus}.`);
  };

  const handleDeleteRecord = async (id: string, name: string) => {
    sound.playClick();
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveStoredAttendance(updated);
    try {
      await fetch(`/api/attendance/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // Keep local update
    }
    showNotice(`Data absensi "${name}" telah dihapus.`);
  };

  const handleClearAll = async () => {
    sound.playClick();
    const cleared = clearStoredAttendance();
    setRecords(cleared);
    setConfirmClearAll(false);
    setSelectedClass('ALL');
    setSelectedStatus('ALL');
    setSelectedDay('ALL');
    setSearchQuery('');
    try {
      await fetch('/api/attendance', { method: 'DELETE' });
    } catch {
      // Keep local clear
    }
    showNotice('Seluruh daftar absensi telah dikosongkan.');
  };

  const handleDownloadCsv = () => {
    if (filteredRecords.length === 0) return;
    sound.playClick();
    const header = [
      'No',
      'Nama Siswa',
      'Kelas',
      'Jenjang',
      'Hari',
      'Tanggal',
      'Jam Detail',
      'Jam Pelajaran',
      'Kehadiran',
      'Keterangan',
    ];
    const rows = filteredRecords.map((r, idx) => [
      String(idx + 1),
      `"${r.studentName.replace(/"/g, '""')}"`,
      r.className,
      r.grade,
      r.dayName,
      `"${r.dateStr.replace(/"/g, '""')}"`,
      `"${r.timeStr.replace(/"/g, '""')}"`,
      `"${r.lessonPeriod.replace(/"/g, '""')}"`,
      r.status,
      `"${r.note.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Absensi_Siswa_SMANDE_${selectedClass === 'ALL' ? 'Semua_Kelas' : selectedClass}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice(`File CSV (${filteredRecords.length} data absensi) berhasil diunduh.`);
  };

  const resetFilters = () => {
    sound.playClick();
    setSelectedClass('ALL');
    setSelectedStatus('ALL');
    setSelectedDay('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Live Indonesian Clock Strip */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Absensi Siswa SMANDE (Kelas X-1 s.d. XII-10)
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                Pengunjung website dapat mengisi <strong>Nama</strong>, memilih <strong>Kelas (X-1 s.d. XII-10)</strong>, dan memilih status kehadiran{' '}
                <span className="font-bold text-emerald-700">HADIR</span>,{' '}
                <span className="font-bold text-amber-700">IJIN</span>, atau{' '}
                <span className="font-bold text-rose-700">ALPA</span> secara manual beserta hari &amp; jam detail.
              </p>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
            <Clock size={18} className="text-sky-600 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">
                {liveClock.liveDayName}, {liveClock.dateStr}
              </div>
              <div className="text-base font-black text-slate-900 font-mono tabular-nums">
                {liveClock.timeStr}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Error Banners */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-700 hover:text-rose-900 text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Always-Visible Manual Visitor Attendance Form */}
      <form
        onSubmit={handleAddRecord}
        className="bg-white border-2 border-sky-300 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900">
                Isi Absensi Siswa (Manual oleh Pengunjung)
              </h3>
              <p className="text-[11px] text-slate-500">
                Masukkan Nama Anda, pilih Kelas, dan pilih Kehadiran lalu klik Simpan Absensi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillNowTime}
            className="btn-3d btn-3d-white px-3 py-1.5 rounded-xl text-[11px] font-bold text-sky-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Perbarui Jam Sekarang (WIB)</span>
          </button>
        </div>

        {/* Primary Required Fields: Nama, Kelas, Kehadiran */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="manual-nama" className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Nama Lengkap Siswa <span className="text-rose-600">*</span>
            </label>
            <input
              id="manual-nama"
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ketik nama lengkap Anda..."
              className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-sky-300 bg-sky-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="manual-kelas" className="block text-xs font-bold text-slate-800 mb-1.5">
              2. Kelas (X-1 s.d. XII-10) <span className="text-rose-600">*</span>
            </label>
            <select
              id="manual-kelas"
              required
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs md:text-sm font-semibold rounded-xl border border-sky-300 bg-sky-50/40 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="">-- Pilih Kelas --</option>
              {CLASS_GROUPS.map((group) => (
                <optgroup key={group.grade} label={group.label}>
                  {group.classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="manual-status" className="block text-xs font-bold text-slate-800 mb-1.5">
              3. Kehadiran (HADIR / IJIN / ALPA) <span className="text-rose-600">*</span>
            </label>
            <select
              id="manual-status"
              required
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as '' | AttendanceStatus)}
              className="w-full px-3.5 py-2.5 text-xs md:text-sm font-bold rounded-xl border border-sky-300 bg-sky-50/40 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="">-- Pilih Kehadiran --</option>
              <option value="HADIR">HADIR</option>
              <option value="IJIN">IJIN</option>
              <option value="ALPA">ALPA</option>
            </select>
          </div>
        </div>

        {/* Detail Hari, Tanggal, Jam WIB, Jam Pelajaran, Keterangan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div>
            <label htmlFor="manual-hari" className="block text-[11px] font-bold text-slate-600 mb-1">
              Hari
            </label>
            <select
              id="manual-hari"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {INDONESIAN_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="manual-tanggal" className="block text-[11px] font-bold text-slate-600 mb-1">
              Tanggal Detail
            </label>
            <input
              id="manual-tanggal"
              type="text"
              value={newDateStr}
              onChange={(e) => setNewDateStr(e.target.value)}
              placeholder="18 November 2026"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label htmlFor="manual-jam" className="block text-[11px] font-bold text-slate-600 mb-1">
              Jam Detail (WIB)
            </label>
            <input
              id="manual-jam"
              type="text"
              value={newTimeStr}
              onChange={(e) => setNewTimeStr(e.target.value)}
              placeholder="07:05:12 WIB"
              className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label htmlFor="manual-jp" className="block text-[11px] font-bold text-slate-600 mb-1">
              Jam Pelajaran
            </label>
            <select
              id="manual-jp"
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {LESSON_PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="manual-ket" className="block text-[11px] font-bold text-slate-600 mb-1">
              Keterangan (Opsional)
            </label>
            <input
              id="manual-ket"
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Contoh: Hadir / Ijin sakit"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-3d btn-3d-sky px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <ClipboardCheck size={16} />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Absensi'}</span>
          </button>
        </div>
      </form>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-sky-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Data</span>
            <Users size={15} className="text-sky-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900 tabular-nums">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {selectedClass === 'ALL' ? 'Semua Kelas (X–XII)' : `Kelas ${selectedClass}`}
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>HADIR</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-emerald-800 tabular-nums">{stats.hadir}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5 tabular-nums">{stats.hadirPct}% kehadiran</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700">
            <span>IJIN</span>
            <FileText size={15} className="text-amber-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-amber-800 tabular-nums">{stats.ijin}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Sakit / Dispen / Ijin</div>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700">
            <span>ALPA</span>
            <XCircle size={15} className="text-rose-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-rose-800 tabular-nums">{stats.alpa}</div>
          <div className="text-[11px] text-rose-700 mt-0.5">Tanpa keterangan</div>
        </div>

        <div className="bg-white border border-indigo-200 rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Persentase Hadir</span>
            <Calendar size={15} className="text-indigo-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-indigo-900 tabular-nums">{stats.hadirPct}%</div>
          <div className="w-full h-1.5 bg-indigo-100 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${stats.hadirPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar & Table Controls */}
      <div className="bg-white border border-sky-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-900">
            <Filter size={15} className="text-sky-600" />
            <span>Filter Daftar Kehadiran (Kelas, Status &amp; Hari)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={filteredRecords.length === 0}
              onClick={handleDownloadCsv}
              className="btn-3d btn-3d-emerald px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download size={15} />
              <span>Unduh CSV</span>
            </button>

            {records.length > 0 && !confirmClearAll && (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="btn-3d btn-3d-white px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Kosongkan Daftar</span>
              </button>
            )}

            {confirmClearAll && (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl px-2.5 py-1">
                <span className="text-[11px] font-bold text-rose-800">Hapus semua?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn-3d btn-3d-rose px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="btn-3d btn-3d-white px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="filter-cari" className="block text-[11px] font-bold text-slate-600 mb-1">
              Cari Nama Siswa / Keterangan
            </label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="filter-cari"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama siswa atau kelas..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="filter-kelas" className="block text-[11px] font-bold text-slate-600 mb-1">
              Dropdown Kelas (X-1 s.d. XII-10)
            </label>
            <select
              id="filter-kelas"
              value={selectedClass}
              onChange={(e) => {
                sound.playClick();
                setSelectedClass(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-sky-300 bg-sky-50/70 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="ALL">Semua Kelas (X-1 s.d. XII-10)</option>
              {CLASS_GROUPS.map((group) => (
                <optgroup key={group.grade} label={group.label}>
                  {group.classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="block text-[11px] font-bold text-slate-600 mb-1">
              Dropdown Status (HADIR / IJIN / ALPA)
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => {
                sound.playClick();
                setSelectedStatus(e.target.value as 'ALL' | AttendanceStatus);
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-sky-300 bg-sky-50/70 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="ALL">Semua Status (HADIR, IJIN, ALPA)</option>
              <option value="HADIR">HADIR</option>
              <option value="IJIN">IJIN</option>
              <option value="ALPA">ALPA</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-hari" className="block text-[11px] font-bold text-slate-600 mb-1">
              Dropdown Hari
            </label>
            <select
              id="filter-hari"
              value={selectedDay}
              onChange={(e) => {
                sound.playClick();
                setSelectedDay(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-sky-300 bg-sky-50/70 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="ALL">Semua Hari (Senin – Sabtu)</option>
              {INDONESIAN_DAYS.map((day) => (
                <option key={day} value={day}>
                  Hari {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Data Table Directly Visible to Visitors */}
      <div className="bg-white border border-sky-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-sky-100 bg-sky-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Daftar Kehadiran Siswa ({filteredRecords.length} Data)
            </h3>
            <p className="text-[11px] text-slate-500">
              Data hasil pengisian manual pengunjung ditampilkan langsung secara terbuka di sini.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 font-semibold">Tampilkan:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg border border-sky-200 bg-white text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value={30}>30 Baris</option>
              <option value={60}>60 Baris</option>
              <option value={0}>Semua Data ({filteredRecords.length})</option>
            </select>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <ClipboardCheck size={22} />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Belum ada data absensi siswa.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Daftar absensi masih kosong. Silakan isi <strong>Nama Lengkap</strong>, pilih <strong>Kelas (X-1 s.d. XII-10)</strong>, dan pilih <strong>Kehadiran (HADIR / IJIN / ALPA)</strong> pada formulir di atas.
            </p>
          </div>
        ) : paginatedRecords.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">
              Tidak ada data absensi yang cocok dengan filter saat ini.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-3d btn-3d-sky px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4 min-w-[170px]">Nama Siswa</th>
                  <th className="py-3 px-4 w-24">Kelas</th>
                  <th className="py-3 px-4 min-w-[165px]">Hari &amp; Tanggal Detail</th>
                  <th className="py-3 px-4 min-w-[185px]">Jam Detail &amp; JP</th>
                  <th className="py-3 px-4 min-w-[195px]">Status (HADIR / IJIN / ALPA)</th>
                  <th className="py-3 px-4 min-w-[200px]">Keterangan</th>
                  <th className="py-3 px-4 w-14 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedRecords.map((rec, idx) => {
                  const rowNum = (rowsPerPage === 0 ? 0 : (currentPage - 1) * rowsPerPage) + idx + 1;
                  const badge = getStatusBadgeConfig(rec.status);
                  const StatusIcon = badge.Icon;

                  return (
                    <tr key={rec.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500 font-semibold">
                        {rowNum}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {rec.studentName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-900 font-bold text-[11px] tabular-nums">
                          {rec.className}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{rec.dayName}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">{rec.dateStr}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono tabular-nums font-bold text-slate-800">
                          {rec.timeStr}
                        </div>
                        <div className="text-[11px] text-slate-500">{rec.lessonPeriod}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-black shrink-0 ${badge.bg}`}
                          >
                            <StatusIcon size={12} />
                            <span>{badge.label}</span>
                          </span>
                          <select
                            aria-label={`Ubah status ${rec.studentName}`}
                            value={rec.status}
                            onChange={(e) =>
                              handleStatusChange(rec.id, e.target.value as AttendanceStatus)
                            }
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 ${badge.selectBg}`}
                          >
                            <option value="HADIR">HADIR</option>
                            <option value="IJIN">IJIN</option>
                            <option value="ALPA">ALPA</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{rec.note}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id, rec.studentName)}
                          title={`Hapus data ${rec.studentName}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {rowsPerPage > 0 && filteredRecords.length > rowsPerPage && (
          <div className="px-5 py-3 border-t border-sky-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 font-semibold tabular-nums">
              Halaman {currentPage} dari {totalPages} ({filteredRecords.length} total data)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn-3d btn-3d-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="btn-3d btn-3d-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
