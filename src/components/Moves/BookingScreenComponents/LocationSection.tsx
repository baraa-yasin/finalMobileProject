import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { COLORS } from '@/src/constants/Theme';
import styles from './styles';
import type { LocationTarget } from './types';

type LocationSectionProps = {
  pickupLocation: string;
  dropoffLocation: string;
  onOpenMap: (field: LocationTarget) => void;
};

export default function LocationSection({ pickupLocation, dropoffLocation, onOpenMap }: LocationSectionProps) {
  return (
    <>
      <View style={styles.sectionTitleGroupSpace}>
        <Text style={styles.sectionTitle}>الموقع والوجهة</Text>
        <MapPin color="#333" size={20} />
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.locationField} onPress={() => onOpenMap('pickup')}>
          <Navigation color={COLORS.primary} size={20} />
          <Text style={styles.locationText}>{pickupLocation || 'حدد نقطة الاستلام من الخريطة'}</Text>
        </TouchableOpacity>
        <View style={styles.lineDivider} />
        <TouchableOpacity style={styles.locationField} onPress={() => onOpenMap('dropoff')}>
          <MapPin color="#FF5252" size={20} />
          <Text style={styles.locationText}>{dropoffLocation || 'حدد نقطة التسليم من الخريطة'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
