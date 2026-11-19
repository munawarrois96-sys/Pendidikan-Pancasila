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

export const defaultAttendanceRecords: StudentAttendanceRecord[] = [];

const LEGACY_STORAGE_KEY = 'smande_attendance_records_v1';
const ATTENDANCE_STORAGE_KEY = 'smande_attendance_records_v2';

export function getStoredAttendance(): StudentAttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    // Clear legacy pre-populated sample records so no preset names appear
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
