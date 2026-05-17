import { Stack } from 'expo-router';
import { AppProviders } from '@/src/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
        <Stack.Screen name="order-history" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProviders>
  );
}
