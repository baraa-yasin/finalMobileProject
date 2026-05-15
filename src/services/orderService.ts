import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/src/api/firebaseConfig';
import { cacheOrders } from '@/src/storage/ordersCache';
import { getRandomArrivalDelayMs, notifyOrderArrival } from '@/src/utils/orderArrival';
import type { Driver } from '@/src/services/driverService';

export type MoveItem = {
  id: string;
  name: string;
  quantity: string;
  weight: string;
  length: string;
  width: string;
  height: string;
};

export type CreateOrderPayload = {
  items: MoveItem[];
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoords: any;
  dropoffCoords: any;
  scheduledTime: Date;
  selectedDriverId: string | null;
  selectedDriver?: Driver;
};

export const createOrder = async ({
  items,
  pickupLocation,
  dropoffLocation,
  pickupCoords,
  dropoffCoords,
  scheduledTime,
  selectedDriverId,
  selectedDriver,
}: CreateOrderPayload) => {
  const arrivalDelayMs = getRandomArrivalDelayMs();
  const arrivalAt = new Date(Date.now() + arrivalDelayMs).toISOString();
  const arrivalDelaySeconds = Math.round(arrivalDelayMs / 1000);
  const userId = auth.currentUser?.uid || 'guest';
  const scheduledTimeIso = scheduledTime.toISOString();
  const itemsSummary = items.map((item) => `${item.quantity || '1'} x ${item.name || 'قطعة'}`).join('، ');

  const orderData = {
    userId,
    items,
    pickup: { address: pickupLocation, coords: pickupCoords },
    dropoff: { address: dropoffLocation, coords: dropoffCoords },
    scheduledTime: scheduledTimeIso,
    arrivalAt,
    arrivalDelayMs,
    arrivalDelaySeconds,
    arrivalNotified: false,
    driverId: selectedDriverId,
    status: 'active',
  };

  const orderRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
  });

  await cacheOrders(
    [
      {
        id: orderRef.id,
        ...orderData,
        createdAt: new Date().toISOString(),
      },
    ],
    userId
  );

  await addDoc(collection(db, 'notifications'), {
    userId,
    orderId: orderRef.id,
    title: 'تم رفع طلب النقل',
    message: `تم استلام طلبك وتفعيله بنجاح. الوصول المتوقع خلال ${arrivalDelaySeconds} ثانية.`,
    itemsSummary,
    pickupAddress: pickupLocation,
    dropoffAddress: dropoffLocation,
    scheduledTime: scheduledTimeIso,
    arrivalAt,
    arrivalDelaySeconds,
    driverName: selectedDriver?.name || null,
    status: 'active',
    read: false,
    createdAt: serverTimestamp(),
  });

  setTimeout(() => {
    notifyOrderArrival({
      userId,
      orderId: orderRef.id,
      itemsSummary,
      pickupAddress: pickupLocation,
      dropoffAddress: dropoffLocation,
      scheduledTime: scheduledTimeIso,
      driverName: selectedDriver?.name || null,
    }).catch((error) => console.error('Error sending arrival notification:', error));
  }, arrivalDelayMs);

  return { orderId: orderRef.id };
};
