import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { WorkoutSession } from '../types/session';
import { ExerciseCategory, getAllCategories, detectCategory } from '../utils/exerciseCategories';

interface ActiveSessionProps {
  session: WorkoutSession;
  onAddExercise: (name: string, category: ExerciseCategory) => Promise<string>;
  onAddSet: (exerciseId: string, weight: number, reps: number) => Promise<void>;
  onDeleteSet: (exerciseId: string, setId: string) => Promise<void>;
  onComplete: () => Promise<void>;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  session,
  onAddExercise,
  onAddSet,
  onDeleteSet,
  onComplete,
}) => {
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>(ExerciseCategory.FULL_BODY);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const categories = getAllCategories();

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) {
      Alert.alert('알림', '운동 이름을 입력하세요');
      return;
    }

    const exerciseId = await onAddExercise(exerciseName, category);
    setSelectedExerciseId(exerciseId);
    setExerciseName('');
  };

  const handleAddSet = async () => {
    if (!selectedExerciseId) {
      Alert.alert('알림', '운동을 먼저 선택하세요');
      return;
    }
    if (!weight || !reps) {
      Alert.alert('알림', '무게와 횟수를 입력하세요');
      return;
    }

    await onAddSet(selectedExerciseId, parseFloat(weight), parseInt(reps, 10));
    setWeight('');
    setReps('');
    Alert.alert('완료', '세트 추가됨!');
  };

  const handleComplete = () => {
    Alert.alert(
      '운동 완료',
      '이 운동 세션을 종료하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '완료', onPress: onComplete },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{session.name}</Text>
        <Text style={styles.stats}>
          {session.exercises.length}개 운동 | {Math.round(session.totalVolume)}kg
        </Text>
      </View>

      {/* 운동 추가 */}
      <View style={styles.addExercise}>
        <Text style={styles.label}>새 운동 추가</Text>
        <TextInput
          style={styles.input}
          placeholder="운동 이름"
          value={exerciseName}
          onChangeText={(text) => {
            setExerciseName(text);
            if (text) setCategory(detectCategory(text));
          }}
        />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            {categories.map(cat => (
              <Picker.Item key={cat.key} label={`${cat.emoji} ${cat.label}`} value={cat.key} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddExercise}>
          <Text style={styles.addBtnText}>운동 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 운동 목록 */}
      <ScrollView style={styles.exercises}>
        {session.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <TouchableOpacity onPress={() => setSelectedExerciseId(exercise.id)}>
              <View style={[
                styles.exerciseHeader,
                selectedExerciseId === exercise.id && styles.exerciseHeaderActive
              ]}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.setCount}>{exercise.sets.length} 세트</Text>
              </View>
            </TouchableOpacity>

            {exercise.sets.map((set, idx) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={styles.setInfo}>
                  {idx + 1}. {set.weight}kg × {set.reps}회
                </Text>
                <TouchableOpacity onPress={() => onDeleteSet(exercise.id, set.id)}>
                  <Text style={styles.deleteBtn}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* 세트 추가 */}
      {selectedExerciseId && (
        <View style={styles.addSet}>
          <Text style={styles.label}>세트 추가</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="무게(kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="횟수"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.addSetBtn} onPress={handleAddSet}>
            <Text style={styles.addBtnText}>세트 추가</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
        <Text style={styles.completeBtnText}>운동 종료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: '#E6F4FE',
  },
  addExercise: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  exercises: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  exerciseHeaderActive: {
    backgroundColor: '#E6F4FE',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  setCount: {
    fontSize: 14,
    color: '#666',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  setInfo: {
    fontSize: 14,
    color: '#555',
  },
  deleteBtn: {
    fontSize: 24,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  addSet: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  addSetBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  completeBtn: {
    backgroundColor: '#6c757d',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
