import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useWorkouts } from '../../hooks/useWorkouts';
import { usePersonalRecords } from '../../hooks/usePersonalRecords';
import { WorkoutInput } from '../../components/WorkoutInput';
import { WorkoutCard } from '../../components/WorkoutCard';
import { normalizeExerciseName } from '../../utils/workoutUtils';

export default function HomeScreen() {
  const { workouts, isLoading, addWorkout, deleteWorkout, deleteSet } = useWorkouts();
  const personalRecords = usePersonalRecords(workouts);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>💪 운동 기록</Text>
      </View>

      <WorkoutInput onAddWorkout={addWorkout} />

      <ScrollView style={styles.workoutList}>
        {Object.keys(workouts).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 기록된 운동이 없습니다.</Text>
            <Text style={styles.emptySubText}>위에서 운동을 추가해보세요!</Text>
          </View>
        ) : (
          Object.values(workouts).map((workout) => {
            const normalizedName = normalizeExerciseName(workout.name);
            const record = personalRecords[normalizedName];

            return (
              <WorkoutCard
                key={workout.name}
                workout={workout}
                personalRecord={record}
                onDelete={() => deleteWorkout(workout.name)}
                onDeleteSet={(index) => deleteSet(workout.name, index)}
              />
            );
          })
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  workoutList: {
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
  },
});
