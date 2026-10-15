import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PersonalRecord } from '../types/workout';
import { formatDate } from '../utils/workoutUtils';

interface PersonalRecordCardProps {
  record: PersonalRecord;
}

export const PersonalRecordCard: React.FC<PersonalRecordCardProps> = ({ record }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.exerciseName}>{record.exerciseName}</Text>

      <View style={styles.recordRow}>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>🏆 최고 중량</Text>
          <Text style={styles.recordValue}>{record.maxWeight}kg</Text>
          <Text style={styles.recordDate}>{formatDate(record.maxWeightDate)}</Text>
        </View>

        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>💪 최고 볼륨</Text>
          <Text style={styles.recordValue}>{record.maxVolume}kg</Text>
          <Text style={styles.recordDate}>{formatDate(record.maxVolumeDate)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>총 볼륨</Text>
          <Text style={styles.statValue}>{record.totalVolume.toLocaleString()}kg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>총 세트</Text>
          <Text style={styles.statValue}>{record.totalSets}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recordItem: {
    flex: 1,
    alignItems: 'center',
  },
  recordLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 11,
    color: '#999',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
