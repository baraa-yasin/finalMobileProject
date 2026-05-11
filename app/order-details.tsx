import OrderDetailsScreen from '@/src/components/OrderDetailsPage/OrderDetails';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  return <OrderDetailsScreen orderId={orderId as string} onBack={() => router.back()} />;
}

