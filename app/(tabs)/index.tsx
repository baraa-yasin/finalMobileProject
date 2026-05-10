import HomeScreen from '@/src/components/Home/HomeScreen';
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  // نمرر الـ router لكي تستطيع الشاشة الانتقال
  return <HomeScreen onNavigate={(path: string) => router.push(path as any)} />;
}