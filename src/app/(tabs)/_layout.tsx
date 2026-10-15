import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: (Platform.OS === 'ios' ? 60 : 60) + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '운동 기록',
          tabBarIcon: ({ color }) => <TabBarIcon name="💪" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '개인 기록',
          tabBarIcon: ({ color }) => <TabBarIcon name="🏆" color={String(color)} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ fontSize: 24, color }}>{name}</Text>
  );
}
