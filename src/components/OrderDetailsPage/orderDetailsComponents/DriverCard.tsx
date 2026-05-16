import React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import { MessageCircle, Phone } from 'lucide-react-native';
import { DRIVER_IMAGE } from './helpers';
import styles from './styles';

type DriverCardProps = {
  driver: any;
};

export default function DriverCard({ driver }: DriverCardProps) {
  return (
    <View style={styles.driverCard}>
      <View style={styles.driverInfo}>
        <Image source={{ uri: driver?.avatar || DRIVER_IMAGE }} style={styles.driverImage} />
        <View style={styles.driverText}>
          <Text style={styles.driverEyebrow}>السائق</Text>
          <Text style={styles.driverName}>{driver?.name || 'أحمد منصور'}</Text>
          <Text style={styles.driverVehicle}>{driver?.type || 'شاحنة متوسطة'} - طراز 2023</Text>
        </View>
      </View>
      <View style={styles.driverActions}>
        <TouchableOpacity style={styles.driverActionButton}>
          <Phone color="#fff" size={19} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.driverActionButton}>
          <MessageCircle color="#fff" size={19} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
