import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Truck } from 'lucide-react-native';
import { COLORS } from '@/src/constants/Theme';
import styles from './styles';

type BookingCardProps = {
  onNavigate: (path: string) => void;
};

export default function BookingCard({ onNavigate }: BookingCardProps) {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.iconCircle}>
        <Truck color={COLORS.primary} size={40} />
      </View>
      <Text style={styles.bookingTitle}>احجز نقلة الآن</Text>
      <Text style={styles.bookingDesc}>
        هل أنت مستعد للانتقال؟ ابدأ الآن واحصل على عرض سعر فوري لخدمات النقل الاحترافية لدينا.
      </Text>

      <TouchableOpacity style={styles.mainButton} onPress={() => onNavigate('/booking')}>
        <ArrowLeft color="#fff" size={22} />
        <Text style={styles.buttonText}>ابدأ عملية الحجز</Text>
      </TouchableOpacity>
    </View>
  );
}
