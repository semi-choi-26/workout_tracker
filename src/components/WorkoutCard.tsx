import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Workout, PersonalRecord } from '../types/workout';
import { SetRow } from './SetRow';
import { formatDate } from '../utils/workoutUtils';

interface WorkoutCardProps {
  workout: Workout;
  personalRecord?: PersonalRecord;
  onDelete: () => void;
  onDeleteSet: (index: number) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  personalRecord,
  onDelete,
  onDeleteSet,
}) => {
  const handleDelete = () => {
    Alert.alert(
      '삭제 확인',
      `"${workout.name}" 운동의 모든 기록을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {personalRecord && (
        <View style={styles.recordInfo}>
          <Text style={styles.recordText}>
            🏆 최고 중량: {personalRecord.maxWeight}kg ({formatDate(personalRecord.maxWeightDate)})
          </Text>
          <Text style={styles.recordText}>
            💪 총 볼륨: {personalRecord.totalVolume.toLocaleString()}kg
          </Text>
        </View>
      )}

      {workout.sets.map((set, index) => {
        const isNewRecord = personalRecord && set.weight === personalRecord.maxWeight;
        return (
          <SetRow
            key={index}
            set={set}
            index={index}
            onDelete={() => onDeleteSet(index)}
            isNewRecord={isNewRecord}
          />
        );
      })}

      <Text style={styles.totalSets}>총 {workout.sets.length} 세트</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    fontSize: 24,
  },
  recordInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  recordText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalSets: {
    marginTop: 10,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
