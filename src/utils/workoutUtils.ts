import { WorkoutData, PersonalRecord, ExerciseStats } from '../types/workout';

/**
 * 운동 이름 정규화 함수 (대소문자, 공백 처리)
 */
export const normalizeExerciseName = (name: string): string => {
  return name.trim().toLowerCase();
};

/**
 * 개인 기록 계산 함수
 */
export const calculatePersonalRecords = (workouts: WorkoutData): ExerciseStats => {
  const stats: ExerciseStats = {};

  Object.entries(workouts).forEach(([normalizedName, workout]) => {
    const exerciseName = workout.name;
    let maxWeight = 0;
    let maxWeightDate = '';
    let maxVolume = 0;
    let maxVolumeDate = '';
    let totalVolume = 0;

    workout.sets.forEach((set) => {
      const volume = set.weight * set.reps;
      totalVolume += volume;

      // 최고 중량 기록
      if (set.weight > maxWeight) {
        maxWeight = set.weight;
        maxWeightDate = set.timestamp;
      }

      // 최고 볼륨 기록 (한 세트에서)
      if (volume > maxVolume) {
        maxVolume = volume;
        maxVolumeDate = set.timestamp;
      }
    });

    stats[normalizedName] = {
      exerciseName,
      maxWeight,
      maxWeightDate,
      maxVolume,
      maxVolumeDate,
      totalVolume,
      totalSets: workout.sets.length,
    };
  });

  return stats;
};

/**
 * 날짜 포맷팅 함수
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 시간 포맷팅 함수
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 신기록 체크 함수
 */
export const isNewRecord = (
  currentWeight: number,
  exerciseName: string,
  stats: ExerciseStats
): boolean => {
  const normalizedName = normalizeExerciseName(exerciseName);
  const record = stats[normalizedName];

  if (!record) return true; // 첫 기록

  return currentWeight > record.maxWeight;
};
