export type ExamHistoryCourse = {
  id: number;
  title: string;
  slug: string;
};

export type ExamHistoryRecord = {
  course: ExamHistoryCourse;
  attemptsCount: number;
  bestScore: number;
  latestScore: number;
  latestMaxScore: number;
  latestPercentage: number;
  passed: boolean;
  lastAttemptedAt: string;
};

export type AdminExamRecentAttempt = {
  id: number;
  learnerName: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string | null;
};

export type AdminExamTopCourse = {
  courseId: number;
  courseTitle: string;
  attempts: number;
  passCount: number;
  averageScore: number;
};

export type AdminExamOverview = {
  totalAttempts: number;
  uniqueLearners: number;
  passedAttempts: number;
  certificatesIssued: number;
  averageScore: number;
  passRate: number;
  recentAttempts: AdminExamRecentAttempt[];
  topCourses: AdminExamTopCourse[];
};

export type UserExamAccessOverview = {
  courseId: number;
  courseTitle: string;
  courseSlug: string;
  baseAttempts: number;
  extraAttempts: number;
  effectiveAttempts: number;
  attemptsUsed: number;
  remainingAttempts: number;
  passed: boolean;
  note: string;
};
