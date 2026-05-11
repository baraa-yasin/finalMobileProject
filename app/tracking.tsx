import TrackingScreen from '@/src/components/ShipmentTrackingPage/ShipmentTracking';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TrackingPage() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  
  return <TrackingScreen onBack={() => router.back()} orderId={orderId as string} />;
}
