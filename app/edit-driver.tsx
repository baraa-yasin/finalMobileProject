import EditDriverScreen from '@/src/components/Drivers/EditDriverScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditDriverPage() {
  const router = useRouter();
  const { driverId } = useLocalSearchParams();

  return <EditDriverScreen driverId={driverId as string} onBack={() => router.back()} />;
}

