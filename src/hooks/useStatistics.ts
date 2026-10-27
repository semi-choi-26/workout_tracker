import { useMemo } from 'react';
import { WorkoutSession, WeeklyStats } from '../types/session';

export const useStatistics = (sessions: WorkoutSession[]) => {
  // 이번 주 통계
  const weeklyStats = useMemo((): WeeklyStats => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // 일요일
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekStart && sessionDate <= weekEnd && session.status === 'completed';
    });

    const categoryDistribution: { [key: string]: number } = {};
    let totalVolume = 0;
    let totalDuration = 0;
    const workoutDays: string[] = [];

    weekSessions.forEach(session => {
      totalVolume += session.totalVolume;
      totalDuration += session.duration;

      if (!workoutDays.includes(session.date)) {
        workoutDays.push(session.date);
      }

      session.exercises.forEach(exercise => {
        const category = exercise.category;
        const exerciseVolume = exercise.sets.reduce((sum, set) =>
          sum + (set.weight * set.reps), 0
        );
        categoryDistribution[category] = (categoryDistribution[category] || 0) + exerciseVolume;
      });
    });

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalWorkouts: weekSessions.length,
      totalVolume,
      totalDuration,
      categoryDistribution,
      workoutDays,
    };
  }, [sessions]);

  // 최근 개인 기록
  const recentPRs = useMemo(() => {
    const exerciseMaxWeights: { [name: string]: { weight: number; date: string } } = {};

    sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 10) // 최근 10개 세션
      .forEach(session => {
        session.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            const current = exerciseMaxWeights[exercise.name];
            if (!current || set.weight > current.weight) {
              exerciseMaxWeights[exercise.name] = {
                weight: set.weight,
                date: session.date,
              };
            }
          });
        });
      });

    return Object.entries(exerciseMaxWeights)
      .map(([name, data]) => ({
        exerciseName: name,
        weight: data.weight,
        date: data.date,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [sessions]);

  return {
    weeklyStats,
    recentPRs,
  };
};
