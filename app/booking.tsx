import { BookingScreen } from '@/src/components/Moves/BookingScreen';
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  return <BookingScreen onBack={() => router.back()} />;
}