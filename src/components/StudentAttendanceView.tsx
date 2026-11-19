import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  FileText,
  XCircle,
  Clock,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LogIn,
  LogOut,
  ShieldCheck,
  FileDown,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocsFromServer,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  get as rtdbGet,
  onValue,
  ref as rtdbRef,
  remove as rtdbRemove,
  serverTimestamp as rtdbServerTimestamp,
  set as rtdbSet,
  update as rtdbUpdate,
} from 'firebase/database';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { AttendanceStatus, GradeLevel, StudentAttendanceRecord } from '../types';
import {
  CLASS_GROUPS,
  compareAttendanceRecords,
  INDONESIAN_DAYS,
  SMANDE_OFFICIAL_LOGO_URL,
} from '../data/attendanceData';
import { auth, db, googleAuthProvider, handleFirestoreError, OperationType, rtdb } from '../lib/firebase';
import { exportAttendanceToWord } from '../utils/exportAttendanceWord';
import { sound } from '../utils/audio';

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
const ADMIN_EMAIL = 'munawarrois81@guru.sma.belajar.id';

function getCurrentIndonesianDateTime() {
  const now = new Date();
  const dayName = DAYS_ID[now.getDay()];
  const dd = String(now.getDate()).padStart(2, '0');
  const mmNum = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const dateDisplay = `${dd}/${mmNum}/${yyyy}`;
  const isoDate = `${yyyy}-${mmNum}-${dd}`;
  const longDate = `${now.getDate()} ${MONTHS_ID[now.getMonth()]} ${yyyy}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return {
    dayName: dayName === 'Minggu' ? 'Senin' : dayName,
    liveDayName: dayName,
    dateDisplay,
    isoDate,
    longDate,
    timeStr: `${hh}:${min}:${ss} WIB`,
  };
}

/** Matches YYYY-MM-DD against DD/MM/YYYY or "D MMMM YYYY" */
function matchesIsoDate(recordDateStr: string, isoDate: string): boolean {
  if (!isoDate) return true;
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return true;
  const ddmmyyyy = `${d}/${m}/${y}`;
  const monthName = MONTHS_ID[Number(m) - 1] || '';
  const longForm = `${Number(d)} ${monthName} ${y}`.toLowerCase();
  const norm = recordDateStr.trim().toLowerCase();
  return norm === ddmmyyyy || norm === isoDate || norm === longForm;
}

function getStatusBadgeConfig(status: AttendanceStatus) {
  switch (status) {
    case 'HADIR':
      return {
        label: 'HADIR',
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        selectBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        rowBg: 'bg-emerald-50/85 hover:bg-emerald-100/75',
        Icon: CheckCircle2,
      };
    case 'IJIN':
      return {
        label: 'IJIN',
        bg: 'bg-amber-100 text-amber-900 border-amber-300',
        selectBg: 'bg-amber-100 text-amber-900 border-amber-300',
        rowBg: 'bg-amber-50/85 hover:bg-amber-100/75',
        Icon: FileText,
      };
    case 'ALPA':
      return {
        label: 'ALPA',
        bg: 'bg-rose-100 text-rose-900 border-rose-300',
        selectBg: 'bg-rose-100 text-rose-900 border-rose-300',
        rowBg: 'bg-rose-50/85 hover:bg-rose-100/75',
        Icon: XCircle,
      };
  }
}

type TimedAttendanceRecord = StudentAttendanceRecord & { createdAtMs: number };

export const StudentAttendanceView: React.FC = () => {
  const [rtdbRecords, setRtdbRecords] = useState<TimedAttendanceRecord[]>([]);
  const [firestoreRecords, setFirestoreRecords] = useState<TimedAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [liveClock, setLiveClock] = useState(getCurrentIndonesianDateTime);
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);
  const [isAuthBusy, setIsAuthBusy] = useState(false);

  const [sortMode, setSortMode] = useState<'class_name_time' | 'newest'>('class_name_time');

  const records = useMemo<StudentAttendanceRecord[]>(() => {
    const merged = new Map<string, TimedAttendanceRecord>();
    firestoreRecords.forEach((r) => merged.set(r.id, r));
    rtdbRecords.forEach((r) => merged.set(r.id, r));
    const list = Array.from(merged.values());
    if (sortMode === 'newest') {
      list.sort((a, b) => b.createdAtMs - a.createdAtMs);
    } else {
      list.sort(compareAttendanceRecords);
    }
    return list.map(({ createdAtMs: _createdAtMs, ...rest }) => rest);
  }, [rtdbRecords, firestoreRecords, sortMode]);

  // Manual Visitor Entry Form State (clean 5-field top bar matching screenshot)
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('');
  const [newStatus, setNewStatus] = useState<'' | AttendanceStatus>('');
  const [newSubject, setNewSubject] = useState('PENDIDIKAN PANCASILA');
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | AttendanceStatus>('ALL');

  // Pagination & UI State
  const [rowsPerPage, setRowsPerPage] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteRowId, setConfirmDeleteRowId] = useState<string | null>(null);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [confirmDeleteScope, setConfirmDeleteScope] = useState<'filtered' | 'all' | null>(null);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const isTeacherAdmin = Boolean(
    authUser && authUser.emailVerified && authUser.email === ADMIN_EMAIL
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(getCurrentIndonesianDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track Firebase Auth state for teacher management controls
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user && user.emailVerified && user.email) {
        const userDocPath = `users/${user.uid}`;
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (!snap.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: (user.displayName || user.email.split('@')[0] || 'Pengguna').slice(0, 120),
              email: user.email.slice(0, 160),
              role: 'siswa',
              createdAt: serverTimestamp(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userDocPath);
        }
      }
    });
    return () => unsubAuth();
  }, []);

  // Subscribe to real-time attendance records from Firebase Realtime Database & Firestore
  useEffect(() => {
    const attendancePath = 'attendance';

    const unsubRtdb = onValue(
      rtdbRef(rtdb, attendancePath),
      (snapshot) => {
        const val = snapshot.val() as Record<string, Record<string, unknown>> | null;
        if (!val || typeof val !== 'object') {
          setRtdbRecords([]);
          setIsLoading(false);
          return;
        }
        const loaded: TimedAttendanceRecord[] = Object.entries(val).map(([key, data]) => ({
          id: key,
          studentName: String(data.studentName || ''),
          className: String(data.className || ''),
          grade: (data.grade === 'XII' || data.grade === 'XI' ? data.grade : 'X') as GradeLevel,
          dayName: String(data.dayName || 'Senin'),
          dateStr: String(data.dateStr || ''),
          timeStr: String(data.timeStr || ''),
          lessonPeriod: String(data.lessonPeriod || 'PENDIDIKAN PANCASILA'),
          status: (data.status === 'IJIN' || data.status === 'ALPA' ? data.status : 'HADIR') as AttendanceStatus,
          note: String(data.note || ''),
          createdAtMs: typeof data.createdAt === 'number' ? data.createdAt : 0,
        }));
        setRtdbRecords(loaded);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    const q = query(collection(db, attendancePath), orderBy('createdAt', 'desc'));
    const unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        const loaded: TimedAttendanceRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const ts = data.createdAt as { toMillis?: () => number } | undefined;
          return {
            id: docSnap.id,
            studentName: String(data.studentName || ''),
            className: String(data.className || ''),
            grade: (data.grade === 'XII' || data.grade === 'XI' ? data.grade : 'X') as GradeLevel,
            dayName: String(data.dayName || 'Senin'),
            dateStr: String(data.dateStr || ''),
            timeStr: String(data.timeStr || ''),
            lessonPeriod: String(data.lessonPeriod || 'PENDIDIKAN PANCASILA'),
            status: (data.status === 'IJIN' || data.status === 'ALPA' ? data.status : 'HADIR') as AttendanceStatus,
            note: String(data.note || ''),
            createdAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now(),
          };
        });
        setFirestoreRecords(loaded);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        handleFirestoreError(error, OperationType.GET, attendancePath);
      }
    );

    return () => {
      unsubRtdb();
      unsubFirestore();
    };
  }, []);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      const matchClass = selectedClass === 'ALL' || rec.className === selectedClass;
      const matchStatus = selectedStatus === 'ALL' || rec.status === selectedStatus;
      const matchDate = matchesIsoDate(rec.dateStr, selectedIsoDate);
      const matchSearch =
        !q ||
        rec.studentName.toLowerCase().includes(q) ||
        rec.className.toLowerCase().includes(q) ||
        rec.dayName.toLowerCase().includes(q) ||
        rec.dateStr.toLowerCase().includes(q) ||
        rec.lessonPeriod.toLowerCase().includes(q) ||
        rec.note.toLowerCase().includes(q) ||
        rec.status.toLowerCase().includes(q);
      return matchClass && matchStatus && matchDate && matchSearch;
    });
  }, [records, selectedClass, selectedStatus, selectedIsoDate, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedStatus, selectedIsoDate, searchQuery, rowsPerPage]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const hadir = filteredRecords.filter((r) => r.status === 'HADIR').length;
    const ijin = filteredRecords.filter((r) => r.status === 'IJIN').length;
    const alpa = filteredRecords.filter((r) => r.status === 'ALPA').length;
    const distinctClasses = new Set(filteredRecords.map((r) => r.className).filter(Boolean)).size;
    return { total, hadir, ijin, alpa, distinctClasses };
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

  const handleTeacherSignIn = async () => {
    sound.playClick();
    setIsAuthBusy(true);
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch {
      setErrorMsg('Proses masuk Google dibatalkan atau gagal.');
    } finally {
      setIsAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    sound.playClick();
    await signOut(auth);
    showNotice('Berhasil keluar dari akun guru.');
  };

  const handleRefreshData = async () => {
    sound.playClick();
    setIsRefreshing(true);
    try {
      try {
        const snap = await rtdbGet(rtdbRef(rtdb, 'attendance'));
        const val = snap.val() as Record<string, Record<string, unknown>> | null;
        if (val && typeof val === 'object') {
          const loaded: TimedAttendanceRecord[] = Object.entries(val).map(([key, data]) => ({
            id: key,
            studentName: String(data.studentName || ''),
            className: String(data.className || ''),
            grade: (data.grade === 'XII' || data.grade === 'XI' ? data.grade : 'X') as GradeLevel,
            dayName: String(data.dayName || 'Senin'),
            dateStr: String(data.dateStr || ''),
            timeStr: String(data.timeStr || ''),
            lessonPeriod: String(data.lessonPeriod || 'PENDIDIKAN PANCASILA'),
            status: (data.status === 'IJIN' || data.status === 'ALPA' ? data.status : 'HADIR') as AttendanceStatus,
            note: String(data.note || ''),
            createdAtMs: typeof data.createdAt === 'number' ? data.createdAt : 0,
          }));
          setRtdbRecords(loaded);
        }
      } catch {
        // Fallback to Firestore refresh below
      }

      const q = query(collection(db, 'attendance'), orderBy('createdAt', 'desc'));
      const snapFs = await getDocsFromServer(q);
      const loadedFs: TimedAttendanceRecord[] = snapFs.docs.map((docSnap) => {
        const data = docSnap.data();
        const ts = data.createdAt as { toMillis?: () => number } | undefined;
        return {
          id: docSnap.id,
          studentName: String(data.studentName || ''),
          className: String(data.className || ''),
          grade: (data.grade === 'XII' || data.grade === 'XI' ? data.grade : 'X') as GradeLevel,
          dayName: String(data.dayName || 'Senin'),
          dateStr: String(data.dateStr || ''),
          timeStr: String(data.timeStr || ''),
          lessonPeriod: String(data.lessonPeriod || 'PENDIDIKAN PANCASILA'),
          status: (data.status === 'IJIN' || data.status === 'ALPA' ? data.status : 'HADIR') as AttendanceStatus,
          note: String(data.note || ''),
          createdAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now(),
        };
      });
      setFirestoreRecords(loadedFs);
      showNotice('Data absensi berhasil disegarkan.');
    } catch {
      showNotice('Data absensi sudah tersinkronisasi.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim().slice(0, 120);
    if (!trimmedName) {
      setErrorMsg('Silakan isi Nama Lengkap Siswa terlebih dahulu.');
      return;
    }
    if (!newClass) {
      setErrorMsg('Silakan pilih Kelas (X-1 s.d. XII-10) terlebih dahulu.');
      return;
    }
    if (!newStatus) {
      setErrorMsg('Silakan pilih Kehadiran (HADIR, IJIN, atau ALPA).');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    sound.playCorrect();

    const now = getCurrentIndonesianDateTime();
    const gradePrefix = newClass.split('-')[0];
    const grade: GradeLevel = gradePrefix === 'XII' ? 'XII' : gradePrefix === 'XI' ? 'XI' : 'X';
    const safeDayName = INDONESIAN_DAYS.includes(now.dayName as (typeof INDONESIAN_DAYS)[number])
      ? now.dayName
      : 'Senin';
    const resolvedDateStr = now.dateDisplay.slice(0, 60);
    const resolvedTimeStr = now.timeStr.slice(0, 60);
    const resolvedSubject = (newSubject.trim() || 'PENDIDIKAN PANCASILA').slice(0, 100);
    const resolvedNote = (
      newNote.trim() ||
      (newStatus === 'HADIR'
        ? 'Hadir mengikuti pembelajaran'
        : newStatus === 'IJIN'
        ? 'Ijin berhalangan hadir'
        : 'Tidak hadir tanpa keterangan')
    ).slice(0, 300);

    const recordId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const recordPath = `attendance/${recordId}`;

    try {
      await rtdbSet(rtdbRef(rtdb, recordPath), {
        studentName: trimmedName,
        className: newClass,
        grade,
        dayName: safeDayName,
        dateStr: resolvedDateStr,
        timeStr: resolvedTimeStr,
        lessonPeriod: resolvedSubject,
        status: newStatus,
        note: resolvedNote,
        createdAt: rtdbServerTimestamp(),
      });
    } catch {
      // Fallback to Firestore if RTDB rules restrict unauthenticated writes
    }

    try {
      await setDoc(doc(db, 'attendance', recordId), {
        studentName: trimmedName,
        className: newClass,
        grade,
        dayName: safeDayName,
        dateStr: resolvedDateStr,
        timeStr: resolvedTimeStr,
        lessonPeriod: resolvedSubject,
        status: newStatus,
        note: resolvedNote,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setIsSubmitting(false);
      handleFirestoreError(err, OperationType.CREATE, recordPath);
    }

    setIsSubmitting(false);
    setNewName('');
    setNewClass('');
    setNewStatus('');
    setNewNote('');

    showNotice(`Absensi "${trimmedName}" (${newClass}) — ${newStatus} berhasil disimpan.`);
  };

  const handleStatusChange = async (rec: StudentAttendanceRecord, nextStatus: AttendanceStatus) => {
    sound.playClick();
    const nowTime = getCurrentIndonesianDateTime().timeStr;
    const defaultNoteByStatus = (
      nextStatus === 'HADIR'
        ? 'Hadir mengikuti pembelajaran'
        : nextStatus === 'IJIN'
        ? 'Ijin berhalangan hadir'
        : 'Tidak hadir tanpa keterangan'
    ).slice(0, 300);

    const nextTimeStr = (
      rec.timeStr && !rec.timeStr.startsWith('—') ? rec.timeStr : nowTime
    ).slice(0, 60);

    const recordPath = `attendance/${rec.id}`;
    try {
      await rtdbUpdate(rtdbRef(rtdb, recordPath), {
        status: nextStatus,
        timeStr: nextTimeStr,
        note: defaultNoteByStatus,
      });
    } catch {
      // Continue with Firestore update
    }

    try {
      await updateDoc(doc(db, 'attendance', rec.id), {
        status: nextStatus,
        timeStr: nextTimeStr,
        note: defaultNoteByStatus,
      });
      showNotice(`Status absensi "${rec.studentName}" diperbarui menjadi ${nextStatus}.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, recordPath);
    }
  };

  const handleDeleteRecord = async (id: string, name: string) => {
    sound.playClick();
    setConfirmDeleteRowId(null);
    const recordPath = `attendance/${id}`;
    try {
      await rtdbRemove(rtdbRef(rtdb, recordPath));
    } catch {
      // Continue with Firestore delete
    }
    try {
      await deleteDoc(doc(db, 'attendance', id));
      setRtdbRecords((prev) => prev.filter((r) => r.id !== id));
      setFirestoreRecords((prev) => prev.filter((r) => r.id !== id));
      showNotice(`Data absensi "${name}" telah dihapus dari Firebase.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, recordPath);
    }
  };

  const handleDeleteFiltered = async () => {
    if (filteredRecords.length === 0) return;
    sound.playClick();
    setIsDeletingBulk(true);
    const idsToDelete = new Set(filteredRecords.map((r) => r.id));

    for (const rec of filteredRecords) {
      try {
        await rtdbRemove(rtdbRef(rtdb, `attendance/${rec.id}`));
      } catch {
        // Continue deleting in Firestore
      }
    }

    try {
      const batch = writeBatch(db);
      filteredRecords.forEach((rec) => {
        batch.delete(doc(db, 'attendance', rec.id));
      });
      await batch.commit();
      setRtdbRecords((prev) => prev.filter((r) => !idsToDelete.has(r.id)));
      setFirestoreRecords((prev) => prev.filter((r) => !idsToDelete.has(r.id)));
      setConfirmDeleteScope(null);
      setIsDeleteMenuOpen(false);
      showNotice(`${filteredRecords.length} data absensi terfilter berhasil dihapus dari Firebase.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'attendance');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleClearAll = async () => {
    if (records.length === 0) return;
    sound.playClick();
    setIsDeletingBulk(true);
    try {
      await rtdbRemove(rtdbRef(rtdb, 'attendance'));
    } catch {
      // Continue with Firestore batch clear
    }
    try {
      const batch = writeBatch(db);
      records.forEach((rec) => {
        batch.delete(doc(db, 'attendance', rec.id));
      });
      await batch.commit();
      setRtdbRecords([]);
      setFirestoreRecords([]);
      setConfirmDeleteScope(null);
      setIsDeleteMenuOpen(false);
      setSelectedClass('ALL');
      setSelectedStatus('ALL');
      setSelectedIsoDate('');
      setSearchQuery('');
      showNotice('Seluruh data absensi telah dihapus dari Firebase.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'attendance');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleDownloadWord = async () => {
    sound.playClick();
    setIsExportingWord(true);
    try {
      const filterParts: string[] = [];
      filterParts.push(selectedClass === 'ALL' ? 'Semua Kelas (X-1 s.d. XII-10)' : `Kelas ${selectedClass}`);
      filterParts.push(selectedStatus === 'ALL' ? 'Semua Status' : `Status ${selectedStatus}`);
      filterParts.push(selectedIsoDate ? `Tanggal ${selectedIsoDate.split('-').reverse().join('/')}` : 'Semua Tanggal');

      const blob = await exportAttendanceToWord({
        records: filteredRecords,
        filterLabel: filterParts.join(' · '),
        exportedAtWib: `${liveClock.liveDayName}, ${liveClock.longDate} (${liveClock.timeStr})`,
        stats: {
          total: stats.total,
          hadir: stats.hadir,
          ijin: stats.ijin,
          alpa: stats.alpa,
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rekap_Absensi_SMANDE_${selectedClass === 'ALL' ? 'Semua_Kelas' : selectedClass}.docx`;
      link.click();
      URL.revokeObjectURL(url);
      showNotice(`File Word (.docx) berisi ${filteredRecords.length} data absensi berhasil diunduh.`);
    } catch {
      setErrorMsg('Gagal membuat dokumen Word (.docx). Silakan coba kembali.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleDownloadCsv = () => {
    if (filteredRecords.length === 0) return;
    sound.playClick();
    const header = [
      'No',
      'Nama',
      'Kelas',
      'Mata Pelajaran',
      'Hari',
      'Tanggal',
      'Jam',
      'Status',
      'Keterangan',
    ];
    const sortedForCsv = [...filteredRecords].sort(compareAttendanceRecords);
    const rows = sortedForCsv.map((r, idx) => [
      String(idx + 1),
      `"${r.studentName.replace(/"/g, '""')}"`,
      r.className,
      `"${(r.lessonPeriod || 'PENDIDIKAN PANCASILA').replace(/"/g, '""')}"`,
      r.dayName,
      `"${r.dateStr.replace(/"/g, '""')}"`,
      `"${r.timeStr.replace(/"/g, '""')}"`,
      r.status,
      `"${r.note.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Absensi_SMANDE_${selectedClass === 'ALL' ? 'Semua_Kelas' : selectedClass}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice(`File CSV (${filteredRecords.length} data absensi) berhasil diunduh.`);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Manual Visitor Entry Card (Compact Horizontal Form matching Screenshot) */}
      <form
        onSubmit={handleAddRecord}
        className="bg-white border border-sky-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* 1. Nama */}
          <div className="lg:col-span-3">
            <label htmlFor="manual-nama" className="block text-[11px] font-bold text-slate-600 mb-1">
              Nama Siswa <span className="text-rose-600">*</span>
            </label>
            <input
              id="manual-nama"
              type="text"
              required
              maxLength={120}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Contoh: Siti Aisyah"
              className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-sky-200 bg-sky-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* 2. Kelas */}
          <div className="lg:col-span-2">
            <label htmlFor="manual-kelas" className="block text-[11px] font-bold text-slate-600 mb-1">
              Kelas <span className="text-rose-600">*</span>
            </label>
            <select
              id="manual-kelas"
              required
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="w-full px-3 py-2.5 text-xs md:text-sm font-semibold rounded-xl border border-sky-200 bg-sky-50/40 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="">Pilih kelas</option>
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

          {/* 3. Status Kehadiran */}
          <div className="lg:col-span-2">
            <label htmlFor="manual-status" className="block text-[11px] font-bold text-slate-600 mb-1">
              Kehadiran <span className="text-rose-600">*</span>
            </label>
            <select
              id="manual-status"
              required
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as '' | AttendanceStatus)}
              className="w-full px-3 py-2.5 text-xs md:text-sm font-bold rounded-xl border border-sky-200 bg-sky-50/40 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="">Pilih status</option>
              <option value="HADIR">HADIR</option>
              <option value="IJIN">IJIN</option>
              <option value="ALPA">ALPA</option>
            </select>
          </div>

          {/* 4. Mata Pelajaran */}
          <div className="lg:col-span-3">
            <label htmlFor="manual-mapel" className="block text-[11px] font-bold text-slate-600 mb-1">
              Mata Pelajaran
            </label>
            <input
              id="manual-mapel"
              type="text"
              maxLength={100}
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="PENDIDIKAN PANCASILA"
              className="w-full px-3.5 py-2.5 text-xs md:text-sm font-semibold rounded-xl border border-sky-200 bg-sky-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 uppercase"
            />
          </div>

          {/* 5. Simpan absensi */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0a5ea8] hover:bg-[#084d8a] text-white font-bold text-xs md:text-sm shadow-[0_4px_0_#063766] active:translate-y-[2px] active:shadow-[0_2px_0_#063766] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <ClipboardCheck size={15} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan absensi'}</span>
            </button>
          </div>
        </div>

        {/* Neat secondary strip: Live Hari/Tanggal/Jam WIB + Optional Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-sky-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock size={14} className="text-[#0a5ea8] shrink-0" />
            <span>Tercatat otomatis:</span>
            <span className="font-bold text-slate-800">
              {liveClock.liveDayName}, {liveClock.dateDisplay}
            </span>
            <span className="font-mono tabular-nums font-bold text-[#0a5ea8]">
              {liveClock.timeStr}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:w-80">
            <input
              id="manual-ket"
              type="text"
              maxLength={300}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Keterangan tambahan (opsional)..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      </form>

      {/* Feedback & Error Alerts */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold flex items-center justify-between gap-2">
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
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold flex items-center justify-between gap-2">
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

      {/* Rekap Absensi Card (Matching Screenshot Design) */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 md:p-7 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Rekap absensi</h2>

          {authUser ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <ShieldCheck
                size={15}
                className={isTeacherAdmin ? 'text-emerald-600 shrink-0' : 'text-sky-600 shrink-0'}
              />
              <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                {authUser.displayName || authUser.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-3d btn-3d-white px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={12} />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isAuthBusy}
              onClick={handleTeacherSignIn}
              className="btn-3d btn-3d-white px-3 py-1.5 rounded-xl text-xs font-bold text-[#0a5ea8] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <LogIn size={14} />
              <span>{isAuthBusy ? 'Membuka...' : 'Masuk Guru (Google)'}</span>
            </button>
          )}
        </div>

        {/* Official School Crest & Header Divider */}
        <div className="flex items-center gap-4 pb-4 border-b-2 border-[#0a5ea8]">
          <div className="w-14 h-14 rounded-xl bg-white border border-sky-100 p-1 flex items-center justify-center shrink-0">
            <img
              src={SMANDE_OFFICIAL_LOGO_URL}
              alt="Logo SMA Negeri 1 Mande"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-lg md:text-xl font-black text-[#0a5ea8] tracking-tight uppercase">
              SMA NEGERI 1 MANDE
            </div>
            <div className="text-xs md:text-sm text-slate-600 font-medium">
              Rekap Absensi Digital · Mata Pelajaran PENDIDIKAN PANCASILA
            </div>
          </div>
        </div>

        {/* Filter Bar: Tanggal + Semua tanggal + Kelas + Status + Cari */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-tanggal" className="text-xs font-bold text-slate-700">
              Tanggal
            </label>
            <input
              id="filter-tanggal"
              type="date"
              value={selectedIsoDate}
              onChange={(e) => {
                sound.playClick();
                setSelectedIsoDate(e.target.value);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-sky-200 bg-sky-50/40 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer tabular-nums"
            />
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedIsoDate('');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                !selectedIsoDate
                  ? 'border-[#0a5ea8] bg-sky-50 text-[#0a5ea8]'
                  : 'border-sky-300 bg-white text-[#0a5ea8] hover:bg-sky-50'
              }`}
            >
              Semua tanggal
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <select
              aria-label="Filter Kelas"
              value={selectedClass}
              onChange={(e) => {
                sound.playClick();
                setSelectedClass(e.target.value);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-sky-200 bg-sky-50/40 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
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

            <select
              aria-label="Filter Status Kehadiran"
              value={selectedStatus}
              onChange={(e) => {
                sound.playClick();
                setSelectedStatus(e.target.value as 'ALL' | AttendanceStatus);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-sky-200 bg-sky-50/40 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="HADIR">HADIR</option>
              <option value="IJIN">IJIN</option>
              <option value="ALPA">ALPA</option>
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama..."
                className="w-40 sm:w-48 pl-8 pr-3 py-2 text-xs rounded-xl border border-sky-200 bg-sky-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Summary Counters & Color Legend Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black tabular-nums">
            <span className="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900">
              HADIR: {stats.hadir}
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900">
              IJIN: {stats.ijin}
            </span>
            <span className="px-3 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-900">
              ALPA: {stats.alpa}
            </span>
            <span className="px-3 py-1 rounded-lg bg-sky-100 border border-sky-200 text-[#0a5ea8]">
              TOTAL: {stats.total}
            </span>
            <span className="px-2 py-1 text-slate-700 font-bold">
              Kelas: {stats.distinctClasses}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400 inline-block" />
                Hadir
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400 inline-block" />
                Ijin (Tidak Hadir)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-200 border border-rose-400 inline-block" />
                Alpa (Tidak Hadir)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Urutan:</span>
              <select
                aria-label="Urutan Data Absensi"
                value={sortMode}
                onChange={(e) => {
                  sound.playClick();
                  setSortMode(e.target.value as 'class_name_time' | 'newest');
                }}
                className="px-2.5 py-1 rounded-lg border border-sky-200 bg-white text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="class_name_time">Kelas → Nama → Jam</option>
                <option value="newest">Terbaru Masuk</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Baris:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-sky-200 bg-white text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
                <option value={0}>Semua ({filteredRecords.length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deep-Blue Header Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a5ea8] text-white text-xs font-bold">
                <th className="py-3 px-3.5 w-12 whitespace-nowrap">No</th>
                <th className="py-3 px-3.5 min-w-[175px]">Nama</th>
                <th className="py-3 px-3.5 min-w-[85px] whitespace-nowrap">Kelas</th>
                <th className="py-3 px-3.5 min-w-[170px] whitespace-nowrap">Mata Pelajaran</th>
                <th className="py-3 px-3.5 min-w-[90px] whitespace-nowrap">Hari</th>
                <th className="py-3 px-3.5 min-w-[115px] whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-3.5 min-w-[130px] whitespace-nowrap">Jam</th>
                <th className="py-3 px-3.5 min-w-[175px] whitespace-nowrap">Status</th>
                <th className="py-3 px-3.5 min-w-[100px] text-center whitespace-nowrap">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-6 px-4 text-slate-500 font-medium">
                    Memuat data absensi...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-5 px-4 text-slate-600">
                    Belum ada data absensi pada pilihan ini.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec, idx) => {
                  const rowNum = (rowsPerPage === 0 ? 0 : (currentPage - 1) * rowsPerPage) + idx + 1;
                  const badge = getStatusBadgeConfig(rec.status);
                  const StatusIcon = badge.Icon;

                  return (
                    <tr key={rec.id} className={`${badge.rowBg} transition-colors`}>
                      <td className="py-3 px-3.5 font-mono tabular-nums text-slate-700 font-semibold whitespace-nowrap">
                        {rowNum}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{rec.studentName}</div>
                        {rec.note && (
                          <div className="text-[11px] text-slate-600 mt-0.5">{rec.note}</div>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#0a5ea8] tabular-nums whitespace-nowrap">
                        {rec.className}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-800 uppercase whitespace-nowrap">
                        {rec.lessonPeriod || 'PENDIDIKAN PANCASILA'}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-800 whitespace-nowrap">{rec.dayName}</td>
                      <td className="py-3 px-3.5 font-mono tabular-nums text-slate-800 whitespace-nowrap">
                        {rec.dateStr}
                      </td>
                      <td className="py-3 px-3.5 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                        {rec.timeStr}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
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
                              handleStatusChange(rec, e.target.value as AttendanceStatus)
                            }
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 ${badge.selectBg}`}
                          >
                            <option value="HADIR">HADIR</option>
                            <option value="IJIN">IJIN</option>
                            <option value="ALPA">ALPA</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {confirmDeleteRowId === rec.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(rec.id, rec.studentName)}
                              className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Ya
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteRowId(null)}
                              className="px-2 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRowId(rec.id)}
                            title={`Hapus data ${rec.studentName}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 bg-white text-rose-700 hover:bg-rose-600 hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {rowsPerPage > 0 && filteredRecords.length > rowsPerPage && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
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

        {/* Bottom Action Buttons Bar + Hapus Data Menu */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isExportingWord}
              onClick={handleDownloadWord}
              className="px-5 py-2.5 rounded-xl bg-[#0a5ea8] hover:bg-[#084d8a] text-white font-bold text-xs md:text-sm shadow-[0_4px_0_#063766] active:translate-y-[2px] active:shadow-[0_2px_0_#063766] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <FileDown size={15} />
              <span>{isExportingWord ? 'Menyiapkan Word...' : 'Unduh Word (.docx)'}</span>
            </button>

            <button
              type="button"
              disabled={filteredRecords.length === 0}
              onClick={handleDownloadCsv}
              className="btn-3d btn-3d-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold text-[#0a5ea8] border-2 border-[#0a5ea8] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download size={15} />
              <span>Unduh CSV</span>
            </button>

            <button
              type="button"
              disabled={isRefreshing}
              onClick={handleRefreshData}
              className="btn-3d btn-3d-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold text-[#0a5ea8] border-2 border-[#0a5ea8] flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Menyegarkan...' : 'Segarkan data'}</span>
            </button>
          </div>

          {/* Menu / Tombol Hapus Data Terintegrasi Firebase */}
          <div className="relative">
            {confirmDeleteScope ? (
              <div className="flex flex-wrap items-center gap-2 bg-rose-50 border border-rose-300 rounded-xl px-3 py-2">
                <span className="text-xs font-bold text-rose-900">
                  {confirmDeleteScope === 'filtered'
                    ? `Hapus ${filteredRecords.length} data terfilter dari Firebase?`
                    : `Hapus semua (${records.length}) data dari Firebase?`}
                </span>
                <button
                  type="button"
                  disabled={isDeletingBulk}
                  onClick={
                    confirmDeleteScope === 'filtered' ? handleDeleteFiltered : handleClearAll
                  }
                  className="btn-3d btn-3d-rose px-3 py-1 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {isDeletingBulk ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
                <button
                  type="button"
                  disabled={isDeletingBulk}
                  onClick={() => setConfirmDeleteScope(null)}
                  className="btn-3d btn-3d-white px-3 py-1 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={records.length === 0}
                  onClick={() => setIsDeleteMenuOpen((prev) => !prev)}
                  className="btn-3d btn-3d-rose px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  <span>Hapus Data</span>
                </button>

                {isDeleteMenuOpen && records.length > 0 && (
                  <div className="absolute right-0 bottom-12 z-20 w-64 bg-white border border-rose-200 rounded-xl shadow-lg p-2 space-y-1">
                    {filteredRecords.length > 0 && filteredRecords.length < records.length && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDeleteScope('filtered');
                          setIsDeleteMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Hapus Data Terfilter</span>
                        <span className="tabular-nums bg-rose-100 px-1.5 py-0.5 rounded text-[11px]">
                          {filteredRecords.length}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteScope('all');
                        setIsDeleteMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>Hapus Semua Data</span>
                      <span className="tabular-nums bg-rose-100 px-1.5 py-0.5 rounded text-[11px]">
                        {records.length}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
