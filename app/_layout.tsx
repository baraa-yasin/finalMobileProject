import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* الشاشة الأولى اللي بتشتغل هي index.tsx */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      {/* (tabs) هو المجلد اللي فيه الشاشات بعد تسجيل الدخول */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}