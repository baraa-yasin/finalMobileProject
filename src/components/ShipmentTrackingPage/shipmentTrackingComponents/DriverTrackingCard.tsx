import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { Check, MessageCircle, Star } from 'lucide-react-native';
import { DRIVER_FALLBACK_IMAGE } from './constants';
import styles from './styles';

type DriverTrackingCardProps = {
  driver: any;
  loading: boolean;
};

export default function DriverTrackingCard({ driver, loading }: DriverTrackingCardProps) {
  return (
    <View style={styles.driverCard}>
      {loading ? (
        <ActivityIndicator size="small" color="#064e3b" style={styles.driverLoader} />
      ) : driver ? (
        <View style={styles.driverHeader}>
          <View style={styles.driverAvatarContainer}>
            <Image source={{ uri: driver.avatar || DRIVER_FALLBACK_IMAGE }} style={styles.driverImage} />
            <View style={styles.verifiedBadge}>
              <Check color="#fff" size={10} />
            </View>
          </View>

          <View style={styles.driverInfoText}>
            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{driver.rate || '4.9'}</Text>
                <Star color="#064e3b" size={12} fill="#064e3b" />
              </View>
            </View>
            <Text style={styles.truckDetails}>{driver.type} • رقم اللوحة ح ل و ٢٢١</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.driverEmptyText}>جاري تحديد السائق...</Text>
      )}

      <TouchableOpacity style={styles.whatsappButton}>
        <MessageCircle color="#fff" size={20} />
        <Text style={styles.whatsappText}>تواصل عبر واتساب</Text>
      </TouchableOpacity>
    </View>
  );
}
