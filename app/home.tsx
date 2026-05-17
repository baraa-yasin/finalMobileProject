import HomeScreen from '@/src/components/Home/HomeScreen';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();
  return <HomeScreen onNavigate={(path: string) => router.push(path as any)} />;
}
