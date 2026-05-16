import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Package } from 'lucide-react-native';
import styles from './styles';

type PastMoveItemProps = {
  title: string;
  details: string;
  status?: string;
  onPress?: () => void;
};

export default function PastMoveItem({ title, details, status, onPress }: PastMoveItemProps) {
  return (
    <TouchableOpacity style={styles.pastCard} onPress={onPress} activeOpacity={0.85}>
      <ChevronLeft color="#bdc7db" size={20} />
      <View style={styles.pastCardContent}>
        <View style={styles.pastCardHeader}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>{status === 'cancelled' ? 'ملغاة' : 'مكتملة'}</Text>
          </View>
          <Text style={styles.pastCardTitle}>{title}</Text>
        </View>
        <Text style={styles.pastCardDetails}>{details}</Text>
      </View>
      <View style={styles.pastIconContainer}>
        <Package color="#9ca3af" size={22} />
      </View>
    </TouchableOpacity>
  );
}
