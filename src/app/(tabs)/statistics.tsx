import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { useSessions } from '../../hooks/useSessions';
import { useStatistics } from '../../hooks/useStatistics';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { sessions, isLoading } = useSessions();
  const { weeklyStats, recentPRs } = useStatistics(sessions);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  const categoryLabels = Object.keys(weeklyStats.categoryDistribution).slice(0, 5);
  const categoryData = categoryLabels.map(cat => weeklyStats.categoryDistribution[cat] / 1000);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 통계</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 이번 주 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{weeklyStats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>운동 일수</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {Math.round(weeklyStats.totalVolume / 1000)}k
              </Text>
              <Text style={styles.statLabel}>총 볼륨 (kg)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {Math.round(weeklyStats.totalDuration / 60)}
              </Text>
              <Text style={styles.statLabel}>총 시간 (h)</Text>
            </View>
          </View>
        </View>

        {/* 부위별 분포 차트 */}
        {categoryLabels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>부위별 볼륨 (kg)</Text>
            <BarChart
              data={{
                labels: categoryLabels,
                datasets: [{ data: categoryData.length > 0 ? categoryData : [0] }],
              }}
              width={screenWidth - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix="k"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForLabels: {
                  fontSize: 12,
                },
              }}
              style={styles.chart}
            />
          </View>
        )}

        {/* 최근 개인 기록 */}
        {recentPRs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>최근 개인 기록</Text>
            {recentPRs.map((pr, index) => (
              <View key={index} style={styles.prItem}>
                <View>
                  <Text style={styles.prExercise}>🏆 {pr.exerciseName}</Text>
                  <Text style={styles.prDate}>{pr.date}</Text>
                </View>
                <Text style={styles.prWeight}>{pr.weight}kg</Text>
              </View>
            ))}
          </View>
        )}

        {sessions.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 운동 기록이 없습니다</Text>
            <Text style={styles.emptySubText}>첫 운동을 시작해보세요!</Text>
          </View>
        )}
      </ScrollView>
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
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  prItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  prExercise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  prDate: {
    fontSize: 12,
    color: '#999',
  },
  prWeight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  empty: {
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
