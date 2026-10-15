import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutData, WorkoutSet } from '../types/workout';
import { normalizeExerciseName } from '../utils/workoutUtils';

const STORAGE_KEY = '@workout_data';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutData>({});
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 데이터 로드
  useEffect(() => {
    loadWorkouts();
  }, []);

  // 데이터 로드
  const loadWorkouts = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setWorkouts(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load workouts:', error);
      throw new Error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 저장
  const saveWorkouts = async (newWorkouts: WorkoutData): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (error) {
      console.error('Failed to save workouts:', error);
      throw new Error('데이터를 저장하는데 실패했습니다.');
    }
  };

  // 운동 기록 추가
  const addWorkout = async (
    exerciseName: string,
    weight: number,
    reps: number
  ): Promise<boolean> => {
    const newSet: WorkoutSet = {
      weight,
      reps,
      timestamp: new Date().toISOString(),
    };

    const updatedWorkouts = { ...workouts };
    const normalizedName = normalizeExerciseName(exerciseName);

    // 같은 운동 이름이 있으면 세트 추가, 없으면 새로 생성
    if (updatedWorkouts[normalizedName]) {
      updatedWorkouts[normalizedName].sets.push(newSet);
      // 기존 운동에 세트를 추가할 때도 가장 최근 입력한 이름으로 업데이트
      updatedWorkouts[normalizedName].name = exerciseName.trim();
    } else {
      updatedWorkouts[normalizedName] = {
        name: exerciseName.trim(),
        sets: [newSet],
      };
    }

    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
    return true;
  };

  // 운동 삭제
  const deleteWorkout = async (name: string): Promise<void> => {
    const normalizedName = normalizeExerciseName(name);
    const updatedWorkouts = { ...workouts };
    delete updatedWorkouts[normalizedName];
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  // 세트 삭제
  const deleteSet = async (exerciseName: string, setIndex: number): Promise<void> => {
    const normalizedName = normalizeExerciseName(exerciseName);
    const updatedWorkouts = { ...workouts };
    updatedWorkouts[normalizedName].sets.splice(setIndex, 1);

    // 세트가 모두 삭제되면 운동 자체를 삭제
    if (updatedWorkouts[normalizedName].sets.length === 0) {
      delete updatedWorkouts[normalizedName];
    }

    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  return {
    workouts,
    isLoading,
    addWorkout,
    deleteWorkout,
    deleteSet,
  };
};
