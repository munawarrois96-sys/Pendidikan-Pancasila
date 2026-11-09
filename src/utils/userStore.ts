import { UserProfile, Badge, QuizAttempt, Question } from '../types';
import { questionsBank } from '../data/quizData';

export const allBadges: Badge[] = [
  {
    id: 'badge-pejuang',
    name: 'Pejuang Pancasila',
    description: 'Menyelesaikan modul pembelajaran nilai-nilai luhur Pancasila',
    icon: 'ShieldCheck',
    category: 'materi',
  },
  {
    id: 'badge-konstitusi',
    name: 'Ahli Konstitusi',
    description: 'Meraih skor minimal 90 pada kuis pemahaman UUD NRI 1945',
    icon: 'BookOpenCheck',
    category: 'kuis',
  },
  {
    id: 'badge-demokrasi',
    name: 'Duta Demokrasi',
    description: 'Menuntaskan simulasi pemilihan umum & musyawarah mufakat',
    icon: 'Vote',
    category: 'simulasi',
  },
  {
    id: 'badge-nusantara',
    name: 'Penjelajah Nusantara',
    description: 'Menuntaskan seluruh level game petualangan & eksplorasi budaya 38 provinsi',
    icon: 'Compass',
    category: 'game',
  },
  {
    id: 'badge-detektif',
    name: 'Detektif Moral Pancasila',
    description: 'Menyelesaikan investigasi kasus perundungan dan dilema etika sosial',
    icon: 'SearchCheck',
    category: 'game',
  },
  {
    id: 'badge-kilat',
    name: 'Ksatria Kuis Kilat',
    description: 'Menjawab dengan kecepatan dan ketepatan tinggi dalam Kuis Kilat',
    icon: 'Zap',
    category: 'kuis',
  },
  {
    id: 'badge-integritas',
    name: 'Duta Antikorupsi',
    description: 'Menuntaskan pembelajaran integritas dan tata kelola bersih',
    icon: 'Award',
    category: 'spesial',
  },
  {
    id: 'badge-juara',
    name: 'Bintang Pelajar SMANDE',
    description: 'Mengumpulkan lebih dari 500 Poin Pancasila dalam pembelajaran aktif',
    icon: 'Sparkles',
    category: 'spesial',
  },
];

export const defaultStudents: UserProfile[] = [
  {
    id: 'std-1',
    name: 'Rafi Ahmad Pratama',
    role: 'siswa',
    nisnOrNip: '0067823411',
    grade: 'XI',
    className: 'XI-1',
    school: 'SMA Negeri 1 Mande (SMANDE)',
    avatar: '👨‍🎓',
    points: 420,
    level: 4,
    streakDays: 5,
    badges: ['badge-pejuang', 'badge-demokrasi'],
    completedMaterials: ['mat-x-1', 'mat-xi-1'],
    quizScores: { 'quiz-x-ch1': 95, 'quiz-xi-ch1': 88 },
  },
  {
    id: 'std-2',
    name: 'Siti Nurhaliza',
    role: 'siswa',
    nisnOrNip: '0067823412',
    grade: 'XI',
    className: 'XI-1',
    school: 'SMA Negeri 1 Mande (SMANDE)',
    avatar: '👩‍🎓',
    points: 580,
    level: 5,
    streakDays: 7,
    badges: ['badge-pejuang', 'badge-konstitusi', 'badge-juara'],
    completedMaterials: ['mat-x-1', 'mat-x-2', 'mat-xi-1', 'mat-xi-2'],
    quizScores: { 'quiz-x-ch1': 100, 'quiz-xi-ch1': 92, 'quiz-xi-ch2': 90 },
  },
  {
    id: 'std-3',
    name: 'Budi Santoso',
    role: 'siswa',
    nisnOrNip: '0067823413',
    grade: 'X',
    className: 'X-2',
    school: 'SMA Negeri 1 Mande (SMANDE)',
    avatar: '🧑‍🎓',
    points: 310,
    level: 3,
    streakDays: 3,
    badges: ['badge-pejuang'],
    completedMaterials: ['mat-x-1'],
    quizScores: { 'quiz-x-ch1': 85 },
  },
  {
    id: 'std-4',
    name: 'Anisa Rahmawati',
    role: 'siswa',
    nisnOrNip: '0067823414',
    grade: 'XII',
    className: 'XII-MIPA 1',
    school: 'SMA Negeri 1 Mande (SMANDE)',
    avatar: '🧕',
    points: 640,
    level: 6,
    streakDays: 12,
    badges: ['badge-pejuang', 'badge-konstitusi', 'badge-demokrasi', 'badge-integritas'],
    completedMaterials: ['mat-x-1', 'mat-xi-1', 'mat-xii-1'],
    quizScores: { 'quiz-x-ch1': 98, 'quiz-xii-ch1': 95 },
  },
];

export const defaultTeacher: UserProfile = {
  id: 'tch-1',
  name: 'Munawar Rois, S.Pd.',
  role: 'guru',
  nisnOrNip: '197108151998021004',
  school: 'SMA Negeri 1 Mande (SMANDE)',
  avatar: '👨‍🏫',
  points: 1500,
  level: 10,
  streakDays: 30,
  badges: ['badge-pejuang', 'badge-konstitusi', 'badge-demokrasi', 'badge-juara'],
  completedMaterials: ['mat-x-1', 'mat-x-2', 'mat-xi-1', 'mat-xii-1'],
  quizScores: {},
};

export const defaultAdmin: UserProfile = {
  id: 'adm-1',
  name: 'Admin Kurikulum SMANDE',
  role: 'admin',
  nisnOrNip: '198501012010011002',
  school: 'SMA Negeri 1 Mande (SMANDE)',
  avatar: '⚙️',
  points: 2000,
  level: 10,
  streakDays: 45,
  badges: ['badge-juara'],
  completedMaterials: [],
  quizScores: {},
};

// Initial student attempts for teacher analytics
export const initialAttempts: QuizAttempt[] = [
  {
    id: 'att-1',
    quizId: 'quiz-x-ch1',
    quizTitle: 'Asesmen Bab 1: Menggali Ide Pendiri Bangsa',
    studentId: 'std-1',
    studentName: 'Rafi Ahmad Pratama',
    studentClass: 'XI-1',
    score: 95,
    totalQuestions: 5,
    correctCount: 5,
    timestamp: '2026-10-28 09:15',
    answers: {},
  },
  {
    id: 'att-2',
    quizId: 'quiz-x-ch1',
    quizTitle: 'Asesmen Bab 1: Menggali Ide Pendiri Bangsa',
    studentId: 'std-2',
    studentName: 'Siti Nurhaliza',
    studentClass: 'XI-1',
    score: 100,
    totalQuestions: 5,
    correctCount: 5,
    timestamp: '2026-10-28 09:20',
    answers: {},
  },
  {
    id: 'att-3',
    quizId: 'quiz-xi-ch1',
    quizTitle: 'Asesmen Bab 1: Pancasila Ideologi Terbuka',
    studentId: 'std-3',
    studentName: 'Budi Santoso',
    studentClass: 'X-2',
    score: 72,
    totalQuestions: 5,
    correctCount: 3,
    timestamp: '2026-10-29 14:02',
    answers: {},
  },
  {
    id: 'att-4',
    quizId: 'quiz-xii-ch1',
    quizTitle: 'Asesmen Integritas & Antikorupsi',
    studentId: 'std-4',
    studentName: 'Anisa Rahmawati',
    studentClass: 'XII-MIPA 1',
    score: 96,
    totalQuestions: 5,
    correctCount: 5,
    timestamp: '2026-10-30 11:45',
    answers: {},
  },
];

const STUDENTS_STORAGE_KEY = 'smande_students_store_v1';

export function getStoredStudents(): UserProfile[] {
  if (typeof window === 'undefined') return defaultStudents;
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading stored students:', err);
  }
  return defaultStudents;
}

export function saveStoredStudents(students: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving stored students:', err);
  }
}

export function resetStoredStudents(): UserProfile[] {
  if (typeof window === 'undefined') return defaultStudents;
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
  } catch (err) {
    console.error('Error resetting stored students:', err);
  }
  return defaultStudents;
}

