import AddDriverScreen from '@/src/components/Drivers/AddDriverScreen';
import { useRouter } from 'expo-router';

export default function AddDriverPage() {
  const router = useRouter();
  return <AddDriverScreen onBack={() => router.back()} />;
}

