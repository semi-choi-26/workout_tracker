import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, SessionData, Exercise, WorkoutSet } from '../types/session';
import { ExerciseCategory } from '../utils/exerciseCategories';

const SESSIONS_STORAGE_KEY = '@workout_sessions';

export const useSessions = () => {
  const [sessionsData, setSessionsData] = useState<SessionData>({
    sessions: {},
    activeSessionId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      if (data) {
        setSessionsData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSessions = async (data: SessionData) => {
    try {
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(data));
      setSessionsData(data);
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  };

  // 새 세션 시작
  const startNewSession = async (name?: string): Promise<string> => {
    const now = new Date();
    const sessionId = `session_${now.getTime()}`;
    const dateStr = now.toISOString().split('T')[0];

    const newSession: WorkoutSession = {
      id: sessionId,
      date: dateStr,
      name: name || `운동 ${dateStr}`,
      startTime: now.toISOString(),
      status: 'in_progress',
      exercises: [],
      totalVolume: 0,
      duration: 0,
    };

    const newData = {
      ...sessionsData,
      sessions: {
        ...sessionsData.sessions,
        [sessionId]: newSession,
      },
      activeSessionId: sessionId,
    };

    await saveSessions(newData);
    return sessionId;
  };

  // 운동 추가
  const addExercise = async (
    sessionId: string,
    exerciseName: string,
    category: ExerciseCategory
  ): Promise<string> => {
    const exerciseId = `ex_${Date.now()}`;
    const session = sessionsData.sessions[sessionId];

    if (!session) return '';

    const newExercise: Exercise = {
      id: exerciseId,
      name: exerciseName,
      category,
      sets: [],
      order: session.exercises.length,
    };

    const updatedSession = {
      ...session,
      exercises: [...session.exercises, newExercise],
    };

    const newData = {
      ...sessionsData,
      sessions: {
        ...sessionsData.sessions,
        [sessionId]: updatedSession,
      },
    };

    await saveSessions(newData);
    return exerciseId;
  };

  // 세트 추가
  const addSet = async (
    sessionId: string,
    exerciseId: string,
    weight: number,
    reps: number
  ): Promise<void> => {
    const session = sessionsData.sessions[sessionId];
    if (!session) return;

    const exerciseIndex = session.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) return;

    const setId = `set_${Date.now()}`;
    const newSet: WorkoutSet = {
      id: setId,
      weight,
      reps,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    const updatedExercises = [...session.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: [...updatedExercises[exerciseIndex].sets, newSet],
    };

    const totalVolume = calculateSessionVolume(updatedExercises);

    const updatedSession = {
      ...session,
      exercises: updatedExercises,
      totalVolume,
    };

    const newData = {
      ...sessionsData,
      sessions: {
        ...sessionsData.sessions,
        [sessionId]: updatedSession,
      },
    };

    await saveSessions(newData);
  };

  // 세트 삭제
  const deleteSet = async (
    sessionId: string,
    exerciseId: string,
    setId: string
  ): Promise<void> => {
    const session = sessionsData.sessions[sessionId];
    if (!session) return;

    const exerciseIndex = session.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) return;

    const updatedExercises = [...session.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedExercises[exerciseIndex].sets.filter(s => s.id !== setId),
    };

    const totalVolume = calculateSessionVolume(updatedExercises);

    const updatedSession = {
      ...session,
      exercises: updatedExercises,
      totalVolume,
    };

    const newData = {
      ...sessionsData,
      sessions: {
        ...sessionsData.sessions,
        [sessionId]: updatedSession,
      },
    };

    await saveSessions(newData);
  };

  // 세션 완료
  const completeSession = async (sessionId: string): Promise<void> => {
    const session = sessionsData.sessions[sessionId];
    if (!session) return;

    const now = new Date();
    const duration = Math.floor(
      (now.getTime() - new Date(session.startTime).getTime()) / 60000
    );

    const updatedSession = {
      ...session,
      status: 'completed' as const,
      endTime: now.toISOString(),
      duration,
    };

    const newData = {
      ...sessionsData,
      sessions: {
        ...sessionsData.sessions,
        [sessionId]: updatedSession,
      },
      activeSessionId: null,
    };

    await saveSessions(newData);
  };

  // 세션 삭제
  const deleteSession = async (sessionId: string): Promise<void> => {
    const { [sessionId]: _, ...remainingSessions } = sessionsData.sessions;

    const newData = {
      ...sessionsData,
      sessions: remainingSessions,
      activeSessionId: sessionsData.activeSessionId === sessionId
        ? null
        : sessionsData.activeSessionId,
    };

    await saveSessions(newData);
  };

  // 활성 세션 가져오기
  const getActiveSession = (): WorkoutSession | null => {
    if (!sessionsData.activeSessionId) return null;
    return sessionsData.sessions[sessionsData.activeSessionId] || null;
  };

  // 세션 목록 가져오기 (최신순)
  const getSessions = (): WorkoutSession[] => {
    return Object.values(sessionsData.sessions)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  };

  return {
    isLoading,
    sessions: getSessions(),
    activeSession: getActiveSession(),
    startNewSession,
    addExercise,
    addSet,
    deleteSet,
    completeSession,
    deleteSession,
  };
};

// 헬퍼 함수: 세션의 총 볼륨 계산
function calculateSessionVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exTotal, set) => {
      return exTotal + (set.weight * set.reps);
    }, 0);
  }, 0);
}
