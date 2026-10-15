import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useWorkouts } from '../../hooks/useWorkouts';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import { PersonalRecordCard } from '../../components/PersonalRecordCard';

export default function RecordsScreen() {
  const { workouts, isLoading } = useWorkouts();
  const personalRecords = usePersonalRecords(workouts);

  const recordsList = Object.values(personalRecords).sort(
    (a, b) => b.maxWeight - a.maxWeight
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 개인 기록</Text>
        <Text style={styles.headerSubtitle}>
          {recordsList.length}개 운동의 기록
        </Text>
      </View>

      <ScrollView style={styles.recordsList}>
        {recordsList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 기록이 없습니다.</Text>
            <Text style={styles.emptySubText}>
              운동을 기록하면 여기에 개인 기록이 표시됩니다!
            </Text>
          </View>
        ) : (
          recordsList.map((record) => (
            <PersonalRecordCard
              key={record.exerciseName}
              record={record}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E6F4FE',
  },
  recordsList: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
