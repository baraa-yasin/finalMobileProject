import { Tabs } from 'expo-router';
import { Home, User, Bell, Truck } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#14450B', // لون الأخضر الخاص بـ SwiftShift
      headerShown: false 
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'طلباتي',
          tabBarIcon: ({ color }) => <Truck color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}