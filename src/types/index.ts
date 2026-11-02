export type GradeLevel = 'X' | 'XI' | 'XII';

export type UserRole = 'siswa' | 'guru' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  nisnOrNip: string;
  grade?: GradeLevel;
  className?: string; // e.g. "X-1", "XI-Fase F", "XII-MIPA 2"
  school: string;
  avatar: string;
  points: number;
  level: number;
  streakDays: number;
  badges: string[];
  completedMaterials: string[];
  quizScores: Record<string, number>; // quizId -> score
}

export interface MaterialSection {
  id: string;
  grade: GradeLevel;
  chapterNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  learningObjectives: string[];
  summary: string;
  pancasilaPillars: number[]; // e.g. [1, 2, 3, 4, 5]
  contentBlocks: {
    heading: string;
    text: string;
    keyPoints?: string[];
    infographicLabel?: string;
    infographicIcon?: string;
  }[];
  caseStudy: {
    title: string;
    context: string;
    question: string;
    moralGuidance: string;
  };
  video: {
    title: string;
    duration: string;
    thumbnail: string;
    summary: string;
    keyPoints: string[];
  };
  lkpd: {
    title: string;
    instructions: string[];
    questions: {
      id: string;
      prompt: string;
      type: 'essay' | 'table';
    }[];
  };
  relatedQuizId: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'complex_multiple'
  | 'true_false'
  | 'matching'
  | 'short_answer'
  | 'case_study';

export interface Question {
  id: string;
  grade: GradeLevel;
  chapter: number;
  difficulty: 'mudah' | 'sedang' | 'sulit' | 'hots';
  type: QuestionType;
  prompt: string;
  scenario?: string; // context or narrative for case study
  options?: string[]; // for multiple choice
  correctOptionIndex?: number;
  correctOptionsIndices?: number[]; // for complex multiple choice
  correctBoolean?: boolean; // for true/false
  matchingPairs?: { left: string; right: string }[]; // for matching
  correctShortAnswer?: string[]; // acceptable answers
  explanation: string;
  pancasilaPillar?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timestamp: string;
  answers: Record<string, any>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'materi' | 'kuis' | 'game' | 'simulasi' | 'spesial';
  unlockedAt?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  category: 'ppki' | 'musyawarah' | 'osis' | 'hukum' | 'hak_kewajiban';
  badgeTitle: string;
  description: string;
  background: string;
  steps: {
    stepNumber: number;
    title: string;
    narrative: string;
    options: {
      id: string;
      text: string;
      feedback: string;
      silaCorrelation: string;
      isRecommended: boolean;
      score: number;
    }[];
  }[];
  reflectionPrompt: string;
}

export interface EBookItem {
  id: string;
  title: string;
  category: 'Buku Siswa' | 'Modul Ajar' | 'UUD 1945' | 'LKPD' | 'Panduan Profil';
  grade?: GradeLevel;
  author: string;
  year: string;
  pages: number;
  description: string;
  downloadUrl: string;
  readOnlineText?: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatar: string;
  timeAgo: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  userVoted?: boolean;
  replies: {
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    timeAgo: string;
  }[];
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  category: 'Penting' | 'Tugas' | 'Ujian' | 'Kegiatan';
  date: string;
  content: string;
  author: string;
}
