import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WorkoutSession } from '../types/session';

interface SessionCardProps {
  session: WorkoutSession;
  onPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return '오늘';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '어제';
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[date.getDay()];

    return `${month}/${day} (${dayName})`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(session.date)}</Text>
        {session.status === 'in_progress' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>진행 중</Text>
          </View>
        )}
      </View>

      <Text style={styles.name}>{session.name}</Text>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>운동</Text>
          <Text style={styles.statValue}>{session.exercises.length}개</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>볼륨</Text>
          <Text style={styles.statValue}>{Math.round(session.totalVolume).toLocaleString()}kg</Text>
        </View>
        {session.duration > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>시간</Text>
            <Text style={styles.statValue}>{formatDuration(session.duration)}</Text>
          </View>
        )}
      </View>

      {session.exercises.length > 0 && (
        <View style={styles.exercises}>
          {session.exercises.slice(0, 3).map((exercise) => (
            <Text key={exercise.id} style={styles.exerciseText}>
              • {exercise.name} ({exercise.sets.length} 세트)
            </Text>
          ))}
          {session.exercises.length > 3 && (
            <Text style={styles.moreText}>+{session.exercises.length - 3}개 더</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
  },
  date: {
    fontSize: 13,
    color: '#ADB5BD',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: 'rgba(123, 159, 126, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#7B9F7E',
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B8CAE',
  },
  exercises: {
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    paddingTop: 12,
  },
  exerciseText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  moreText: {
    fontSize: 14,
    color: '#ADB5BD',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
