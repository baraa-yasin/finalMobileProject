import React from 'react';
import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import TimelineStep from './TimelineStep';
import styles from './styles';

export default function ShipmentTimeline() {
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
          subtitle="تم تأكيد طلبك وجدولة الموعد بنجاح"
          status="completed"
        />
        <TimelineStep
          title="السائق في الطريق"
          subtitle="السائق الآن يتوجه إلى نقطة التحميل الخاصة بك"
          status="active"
        />
        <TimelineStep
          title="الوصول لموقع التحميل"
          subtitle="سيتم التحديث عند وصول الشاحنة للموقع"
          status="upcoming"
        />
        <TimelineStep
          title="اكتملت عملية النقل"
          subtitle="سيتم التحديث فور انتهاء المهمة"
          status="upcoming"
        />
      </View>
    </View>
  );
}
