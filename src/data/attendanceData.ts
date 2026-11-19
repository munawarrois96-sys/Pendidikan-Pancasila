import { GradeLevel, StudentAttendanceRecord } from '../types';

export const CLASS_GROUPS: Array<{ grade: GradeLevel; label: string; classes: string[] }> = [
  {
    grade: 'X',
    label: 'Kelas X (Fase E)',
    classes: Array.from({ length: 10 }, (_, i) => `X-${i + 1}`),
  },
  {
    grade: 'XI',
    label: 'Kelas XI (Fase F)',
    classes: Array.from({ length: 10 }, (_, i) => `XI-${i + 1}`),
  },
  {
    grade: 'XII',
    label: 'Kelas XII (Fase F)',
    classes: Array.from({ length: 10 }, (_, i) => `XII-${i + 1}`),
  },
];

export const ALL_ATTENDANCE_CLASSES: string[] = CLASS_GROUPS.flatMap((g) => g.classes);

export const INDONESIAN_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export const SMANDE_OFFICIAL_LOGO_URL =
  '/assets/aistudio/WhatsApp_Image_2026-07-14_at_09.41.14__3__e6c1caac.jpeg';

const GRADE_ORDER: Record<string, number> = { X: 1, XI: 2, XII: 3 };

function getClassSortKey(className: string): [number, number] {
  const [gradePart, numPart] = className.trim().split('-');
  const gradeRank = GRADE_ORDER[gradePart] ?? 99;
  const numRank = parseInt(numPart || '999', 10);
  return [gradeRank, Number.isNaN(numRank) ? 999 : numRank];
}

const MONTHS_LOWER = [
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
];

function getDateSortValue(dateStr: string): number {
  const clean = dateStr.trim();
  // DD/MM/YYYY
  const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const d = Number(slashMatch[1]);
    const m = Number(slashMatch[2]);
    const y = Number(slashMatch[3]);
    return y * 10000 + m * 100 + d;
  }
  // YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return Number(isoMatch[1]) * 10000 + Number(isoMatch[2]) * 100 + Number(isoMatch[3]);
  }
  // "19 November 2026"
  const parts = clean.toLowerCase().split(/\s+/);
  if (parts.length === 3) {
    const d = Number(parts[0]);
    const m = MONTHS_LOWER.indexOf(parts[1]) + 1;
    const y = Number(parts[2]);
    if (!Number.isNaN(d) && m > 0 && !Number.isNaN(y)) {
      return y * 10000 + m * 100 + d;
    }
  }
  return 0;
}

function getTimeSortValue(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return 999999;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3] || 0);
  return h * 3600 + m * 60 + s;
}

/**
 * Canonical sort: Kelas (X-1..X-10, XI-1..XI-10, XII-1..XII-10) -> Nama Siswa (A-Z) -> Tanggal -> Jam
 */
export function compareAttendanceRecords(
  a: StudentAttendanceRecord & { createdAtMs?: number },
  b: StudentAttendanceRecord & { createdAtMs?: number }
): number {
  const [gA, nA] = getClassSortKey(a.className);
  const [gB, nB] = getClassSortKey(b.className);
  if (gA !== gB) return gA - gB;
  if (nA !== nB) return nA - nB;

  const nameCmp = a.studentName.localeCompare(b.studentName, 'id', { sensitivity: 'base' });
  if (nameCmp !== 0) return nameCmp;

  const dateDiff = getDateSortValue(a.dateStr) - getDateSortValue(b.dateStr);
  if (dateDiff !== 0) return dateDiff;

  const timeDiff = getTimeSortValue(a.timeStr) - getTimeSortValue(b.timeStr);
  if (timeDiff !== 0) return timeDiff;

  return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
}

export const defaultAttendanceRecords: StudentAttendanceRecord[] = [];

const LEGACY_STORAGE_KEY = 'smande_attendance_records_v1';
const ATTENDANCE_STORAGE_KEY = 'smande_attendance_records_v2';

export function getStoredAttendance(): StudentAttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (r: StudentAttendanceRecord) =>
            r &&
            typeof r.studentName === 'string' &&
            r.studentName.trim().length > 0 &&
            !String(r.id).startsWith('att-rec-')
        );
      }
    }
  } catch (err) {
    console.error('Error loading attendance records:', err);
  }
  return [];
}

export function saveStoredAttendance(records: StudentAttendanceRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving attendance records:', err);
  }
}

export function clearStoredAttendance(): StudentAttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Error clearing attendance records:', err);
  }
  return [];
}
