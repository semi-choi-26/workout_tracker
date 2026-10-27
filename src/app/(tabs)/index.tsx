import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessions } from '../../hooks/useSessions';
import { ActiveSession } from '../../components/ActiveSession';

export default function HomeScreen() {
  const {
    isLoading,
    activeSession,
    startNewSession,
    addExercise,
    addSet,
    deleteSet,
    completeSession,
  } = useSessions();

  const handleStartNew = async () => {
    const sessionId = await startNewSession();
    if (sessionId) {
      Alert.alert('시작!', '새 운동 세션이 시작되었습니다');
    }
  };

  const handleAddExercise = async (name: string, category: any) => {
    if (!activeSession) return '';
    return await addExercise(activeSession.id, name, category);
  };

  const handleAddSet = async (exerciseId: string, weight: number, reps: number) => {
    if (!activeSession) return;
    await addSet(activeSession.id, exerciseId, weight, reps);
  };

  const handleDeleteSet = async (exerciseId: string, setId: string) => {
    if (!activeSession) return;
    await deleteSet(activeSession.id, exerciseId, setId);
  };

  const handleComplete = async () => {
    if (!activeSession) return;
    await completeSession(activeSession.id);
    Alert.alert('완료!', '운동 세션이 저장되었습니다');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (activeSession) {
    return (
      <ActiveSession
        session={activeSession}
        onAddExercise={handleAddExercise}
        onAddSet={handleAddSet}
        onDeleteSet={handleDeleteSet}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>💪 운동 기록</Text>
        <Text style={styles.headerSubtitle}>오늘 운동을 시작해보세요!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={styles.emptyText}>진행 중인 운동이 없습니다</Text>
          <Text style={styles.emptySubText}>새 운동 세션을 시작하세요</Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartNew}>
            <Text style={styles.startButtonText}>+ 새 운동 시작</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 운동 기록 방법</Text>
          <Text style={styles.tipText}>1. 새 운동 시작 버튼 클릭</Text>
          <Text style={styles.tipText}>2. 운동 종목 추가</Text>
          <Text style={styles.tipText}>3. 세트별로 무게와 횟수 기록</Text>
          <Text style={styles.tipText}>4. 운동 완료 후 저장</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 20,
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
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tips: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
