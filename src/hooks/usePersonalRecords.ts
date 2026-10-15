import { useMemo } from 'react';
import { WorkoutData, ExerciseStats } from '../types/workout';
import { calculatePersonalRecords } from '../utils/workoutUtils';

export const usePersonalRecords = (workouts: WorkoutData): ExerciseStats => {
  const personalRecords = useMemo(() => {
    return calculatePersonalRecords(workouts);
  }, [workouts]);

  return personalRecords;
};
