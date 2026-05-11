import DriversListScreen from '@/src/components/Drivers/DriversListScreen';
import { useRouter } from 'expo-router';

export default function DriversPage() {
  const router = useRouter();
  return <DriversListScreen onBack={() => router.back()} />;
}

