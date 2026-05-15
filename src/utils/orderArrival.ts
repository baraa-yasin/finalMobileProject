import { Alert, Vibration } from 'react-native';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/api/firebaseConfig';
import { updateCachedOrderStatus } from '@/src/storage/ordersCache';

export const getRandomArrivalDelayMs = () => {
  const min = 45 * 1000;
  const max = 75 * 1000;
  return Math.floor(min + Math.random() * (max - min));
};

type ArrivalNotificationData = {
  userId: string;
  orderId: string;
  itemsSummary: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledTime: string;
  driverName?: string | null;
};

export const notifyOrderArrival = async (data: ArrivalNotificationData) => {
  let shouldAlert = false;

  await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, 'orders', data.orderId);
    const orderSnap = await transaction.get(orderRef);

    if (!orderSnap.exists()) return;

    const order = orderSnap.data();
    if (order.arrivalNotified || order.status === 'cancelled') return;

    transaction.update(orderRef, {
      status: 'completed',
      arrivalNotified: true,
      arrivedAt: serverTimestamp(),
    });

    const notificationRef = doc(collection(db, 'notifications'));
    transaction.set(notificationRef, {
      userId: data.userId,
      orderId: data.orderId,
      title: 'تم الوصول',
      message: 'تم وصول السائق إلى الوجهة بنجاح.',
      itemsSummary: data.itemsSummary,
      pickupAddress: data.pickupAddress,
      dropoffAddress: data.dropoffAddress,
      scheduledTime: data.scheduledTime,
      driverName: data.driverName || null,
      status: 'completed',
      type: 'arrival',
      read: false,
      createdAt: serverTimestamp(),
    });

    shouldAlert = true;
  });

  if (shouldAlert) {
    await updateCachedOrderStatus(data.orderId, 'completed');
    Vibration.vibrate([0, 450, 150, 450]);
    Alert.alert('تم الوصول', 'تم وصول السائق إلى الوجهة بنجاح.');
  }

  return shouldAlert;
};
