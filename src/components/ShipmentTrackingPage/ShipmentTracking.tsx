import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import AppHeader from '@/src/components/AppHeader';
import MovesBottomNavigation from '../MovesBottomNavigation';
import { db } from '../../api/firebaseConfig';
import { formatRemainingTime } from '@/src/utils/timeRemaining';
import {
  ArrivalTimerCard,
  DriverTrackingCard,
  ShipmentTimeline,
  styles,
  TrackingMapCard,
} from './shipmentTrackingComponents';

type TrackingScreenProps = {
  orderId?: string;
  onBack?: () => void;
};

const getDateTime = (value: any) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : null;
};

const TrackingScreen = ({ orderId }: TrackingScreenProps) => {
  const [driver, setDriver] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingStartedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        if (!orderId) {
          setLoading(false);
          return;
        }

        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder(orderData);
          const driverId = orderData.driverId;

          if (driverId) {
            const driverRef = doc(db, 'drivers', driverId);
            const driverSnap = await getDoc(driverRef);
            if (driverSnap.exists()) {
              setDriver({ id: driverSnap.id, ...driverSnap.data() });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tracking data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [orderId]);

  const startTime = getDateTime(order?.createdAt) ?? getDateTime(order?.scheduledTime) ?? trackingStartedAt;
  const remainingMs = order?.arrivalAt ? Math.max(new Date(order.arrivalAt).getTime() - now, 0) : 0;
  const remainingLabel = order?.arrivalAt ? formatRemainingTime(remainingMs) : 'غير محدد';
  const elapsedSeconds = Math.max(Math.floor((now - startTime) / 1000), 0);
  const shipmentCompleted = order?.status === 'completed' || Boolean(order?.arrivalAt && remainingMs <= 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ArrivalTimerCard remainingMs={remainingMs} remainingLabel={remainingLabel} />
        <TrackingMapCard />
        <DriverTrackingCard driver={driver} loading={loading} />
        <ShipmentTimeline elapsedSeconds={elapsedSeconds} completed={shipmentCompleted} />
      </ScrollView>

      <MovesBottomNavigation />
    </SafeAreaView>
  );
};

export default TrackingScreen;
