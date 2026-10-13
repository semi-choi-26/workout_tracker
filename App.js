import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@workout_data';

export default function App() {
  const [workouts, setWorkouts] = useState({});
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // 앱 시작 시 저장된 데이터 로드
  useEffect(() => {
    loadWorkouts();
  }, []);

  // 데이터 로드
  const loadWorkouts = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setWorkouts(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    }
  };

  // 데이터 저장
  const saveWorkouts = async (newWorkouts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (error) {
      Alert.alert('오류', '데이터를 저장하는데 실패했습니다.');
    }
  };

  // 운동 기록 추가
  const addWorkout = () => {
    if (!exerciseName.trim()) {
      Alert.alert('알림', '운동 이름을 입력해주세요.');
      return;
    }
    if (!weight || !reps) {
      Alert.alert('알림', '무게와 개수를 입력해주세요.');
      return;
    }

    const newSet = {
      weight: parseFloat(weight),
      reps: parseInt(reps),
      timestamp: new Date().toISOString(),
    };

    const updatedWorkouts = { ...workouts };

    // 같은 운동 이름이 있으면 세트 추가, 없으면 새로 생성
    if (updatedWorkouts[exerciseName]) {
      updatedWorkouts[exerciseName].sets.push(newSet);
    } else {
      updatedWorkouts[exerciseName] = {
        name: exerciseName,
        sets: [newSet],
      };
    }

    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);

    // 입력 필드 초기화 (운동 이름은 유지)
    setWeight('');
    setReps('');
    Alert.alert('성공', '운동 기록이 추가되었습니다!');
  };

  // 운동 삭제
  const deleteWorkout = (name) => {
    Alert.alert(
      '삭제 확인',
      `"${name}" 운동의 모든 기록을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const updatedWorkouts = { ...workouts };
            delete updatedWorkouts[name];
            setWorkouts(updatedWorkouts);
            saveWorkouts(updatedWorkouts);
          },
        },
      ]
    );
  };

  // 세트 삭제
  const deleteSet = (exerciseName, setIndex) => {
    const updatedWorkouts = { ...workouts };
    updatedWorkouts[exerciseName].sets.splice(setIndex, 1);

    // 세트가 모두 삭제되면 운동 자체를 삭제
    if (updatedWorkouts[exerciseName].sets.length === 0) {
      delete updatedWorkouts[exerciseName];
    }

    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>💪 운동 기록</Text>
      </View>

      {/* 입력 폼 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>운동 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 벤치프레스"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>무게 (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="60"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>개수 (회)</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
          <Text style={styles.addButtonText}>기록 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 운동 목록 */}
      <ScrollView style={styles.workoutList}>
        {Object.keys(workouts).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 기록된 운동이 없습니다.</Text>
            <Text style={styles.emptySubText}>위에서 운동을 추가해보세요!</Text>
          </View>
        ) : (
          Object.values(workouts).map((workout) => (
            <View key={workout.name} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <TouchableOpacity onPress={() => deleteWorkout(workout.name)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {workout.sets.map((set, index) => (
                <View key={index} style={styles.setRow}>
                  <Text style={styles.setText}>
                    세트 {index + 1}: {set.weight}kg × {set.reps}회
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteSet(workout.name, index)}
                  >
                    <Text style={styles.deleteSetButton}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.totalSets}>총 {workout.sets.length} 세트</Text>
            </View>
          ))
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
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  workoutCard: {
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
  workoutHeader: {
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
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  setText: {
    fontSize: 16,
    color: '#555',
  },
  deleteSetButton: {
    fontSize: 24,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  totalSets: {
    marginTop: 10,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
