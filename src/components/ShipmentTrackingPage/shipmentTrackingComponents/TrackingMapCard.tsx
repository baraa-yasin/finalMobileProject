import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { MAP_IMAGE_URI } from './constants';
import styles from './styles';

export default function TrackingMapCard() {
  return (
    <View style={styles.mapContainer}>
      <Image source={{ uri: MAP_IMAGE_URI }} style={styles.mapImage} />

      <View style={styles.locationBadge}>
        <MapPin color="#064e3b" size={14} />
        <Text style={styles.locationText}>الموقع الحالي: حي النخيل، الرياض</Text>
      </View>

      <TouchableOpacity style={styles.focusButton}>
        <Navigation color="#064e3b" size={20} fill="#064e3b" />
      </TouchableOpacity>
    </View>
  );
}
