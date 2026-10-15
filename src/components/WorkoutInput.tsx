import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface WorkoutInputProps {
  onAddWorkout: (exerciseName: string, weight: number, reps: number) => Promise<boolean>;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({ onAddWorkout }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleAddWorkout = async () => {
    if (!exerciseName.trim()) {
      Alert.alert('알림', '운동 이름을 입력해주세요.');
      return;
    }
    if (!weight || !reps) {
      Alert.alert('알림', '무게와 개수를 입력해주세요.');
      return;
    }

    try {
      const success = await onAddWorkout(
        exerciseName,
        parseFloat(weight),
        parseInt(reps, 10)
      );

      if (success) {
        // 입력 필드 초기화 (운동 이름은 유지)
        setWeight('');
        setReps('');
        Alert.alert('성공', '운동 기록이 추가되었습니다!');
      }
    } catch (error) {
      Alert.alert('오류', '운동 기록 추가에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>운동 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 벤치프레스"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>무게 (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="60"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>개수 (회)</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddWorkout}>
        <Text style={styles.addButtonText}>기록 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
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
});
