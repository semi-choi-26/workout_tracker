import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessions } from '../../hooks/useSessions';
import { SessionCard } from '../../components/SessionCard';

export default function HistoryScreen() {
  const { sessions, isLoading } = useSessions();

  const completedSessions = sessions.filter(s => s.status === 'completed');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>히스토리</Text>
        <Text style={styles.headerSubtitle}>{completedSessions.length}개 세션</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {completedSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 완료된 운동이 없습니다</Text>
            <Text style={styles.emptySubText}>첫 운동을 시작해보세요!</Text>
          </View>
        ) : (
          completedSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B8CAE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#6B8CAE',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6C757D',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#ADB5BD',
  },
});
