import { ExerciseCategory } from '../utils/exerciseCategories';

export interface WorkoutSet {
  weight: number;
  reps: number;
  timestamp: string;
}

export interface Workout {
  name: string; // 화면 표시용 원본 이름
  category?: ExerciseCategory; // 운동 카테고리 (선택적 - 이전 데이터 호환성)
  sets: WorkoutSet[];
}

export interface WorkoutData {
  [normalizedName: string]: Workout;
}

export interface PersonalRecord {
  exerciseName: string;
  maxWeight: number;
  maxWeightDate: string;
  maxVolume: number; // weight * reps
  maxVolumeDate: string;
  totalVolume: number; // 전체 볼륨
  totalSets: number;
}

export interface ExerciseStats {
  [exerciseName: string]: PersonalRecord;
}
