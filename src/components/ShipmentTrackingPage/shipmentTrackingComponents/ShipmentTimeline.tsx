import React from 'react';
import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import TimelineStep from './TimelineStep';
import styles from './styles';

type ShipmentTimelineProps = {
  elapsedSeconds: number;
  completed: boolean;
};

export default function ShipmentTimeline({ elapsedSeconds, completed }: ShipmentTimelineProps) {
  const orderReceivedStatus = completed || elapsedSeconds >= 10 ? 'completed' : 'active';
  const driverOnWayStatus = completed || elapsedSeconds >= 50 ? 'completed' : elapsedSeconds >= 20 ? 'active' : 'upcoming';
  const pickupArrivalStatus = completed ? 'completed' : elapsedSeconds >= 50 ? 'active' : 'upcoming';

  return (
    <View style={styles.timelineCard}>
      <View style={styles.timelineHeader}>
        <Clock color="#064e3b" size={16} />
        <Text style={styles.timelineTitle}>حالة الشحنة</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View style={styles.verticalLine} />

        <TimelineStep
          title="تم استلام الطلب"
          subtitle="يتم تأكيد طلبك وجدولة الموعد بعد 10 ثواني"
          status={orderReceivedStatus}
        />
        <TimelineStep
          title="السائق في الطريق"
          subtitle="السائق يتوجه إلى نقطة التحميل بعد 20 ثانية"
          status={driverOnWayStatus}
        />
        <TimelineStep
          title="الوصول لموقع التحميل"
          subtitle="يتم تحديث هذه المرحلة بعد 50 ثانية"
          status={pickupArrivalStatus}
        />
        <TimelineStep
          title="اكتملت عملية النقل"
          subtitle="تكتمل العملية عند انتهاء عداد الوصول"
          status={completed ? 'completed' : 'upcoming'}
        />
      </View>
    </View>
  );
}
