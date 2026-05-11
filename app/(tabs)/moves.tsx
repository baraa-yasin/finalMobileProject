import MyMovesScreen from '@/src/components/MyReservePage/MyReservePage';
import { useRouter } from 'expo-router';

export default function MovesPage() {
  const router = useRouter();
  
  // نمرر دالة onNavigate لكي يستطيع المكون التنقل
  return <MyMovesScreen onNavigate={(path: string) => router.push(path as any)} />;
}
