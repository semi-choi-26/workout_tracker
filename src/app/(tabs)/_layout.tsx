import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6B8CAE',
        tabBarInactiveTintColor: '#ADB5BD',
        tabBarStyle: {
          height: (Platform.OS === 'ios' ? 60 : 60) + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopColor: '#DEE2E6',
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: '통계',
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
