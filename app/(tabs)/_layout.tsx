import { Tabs } from 'expo-router';
import { Bell, Home, Truck } from 'lucide-react-native';
import MovesBottomNavigation from '@/src/components/MovesBottomNavigation';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={() => <MovesBottomNavigation />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="moves"
        options={{
          title: 'نقلاتي',
          tabBarIcon: ({ color }) => <Truck color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'التنبيهات',
          tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
