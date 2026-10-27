import { ExerciseCategory } from '../utils/exerciseCategories';

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: WorkoutSet[];
  order: number; // 운동 순서
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  name: string; // 예: "가슴 운동", "하체 운동"
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed';
  exercises: Exercise[];
  totalVolume: number; // 총 볼륨 (자동 계산)
  duration: number; // 분 단위 (자동 계산)
}

export interface SessionData {
  sessions: {
    [sessionId: string]: WorkoutSession;
  };
  activeSessionId: string | null;
}

// 통계용 타입
export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number; // 분
  categoryDistribution: {
    [category: string]: number; // 볼륨
  };
  workoutDays: string[]; // 운동한 날짜들
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  totalWorkouts: number;
  totalVolume: number;
  avgWorkoutsPerWeek: number;
  categoryDistribution: {
    [category: string]: number;
  };
}

export interface ExerciseProgress {
  exerciseName: string;
  category: ExerciseCategory;
  data: {
    date: string;
    maxWeight: number;
    totalVolume: number;
  }[];
}
