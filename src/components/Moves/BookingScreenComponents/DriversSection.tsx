import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle2, Truck, User } from 'lucide-react-native';
import { COLORS } from '@/src/constants/Theme';
import { getDriverAvatarUrl } from './helpers';
import styles from './styles';

type DriversSectionProps = {
  drivers: any[];
  driversLoading: boolean;
  selectedDriverId: string | null;
  onSelectDriver: (driverId: string) => void;
};

export default function DriversSection({ drivers, driversLoading, selectedDriverId, onSelectDriver }: DriversSectionProps) {
  return (
    <>
      <View style={styles.sectionTitleGroupSpace}>
        <Text style={styles.sectionTitle}>السائقين المتاحين</Text>
        <Truck color="#333" size={20} />
      </View>

      {driversLoading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : drivers.length === 0 ? (
        <Text style={styles.emptyText}>لا يوجد سائقون متاحون حاليا</Text>
      ) : (
        drivers.map((driver) => {
          const avatarUrl = getDriverAvatarUrl(driver);

          return (
            <TouchableOpacity
              key={driver.id}
              style={[styles.driverCard, selectedDriverId === driver.id && styles.selectedDriverCard]}
              onPress={() => onSelectDriver(driver.id)}
            >
              <Text style={styles.rateText}>★ {driver.rate}</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverType}>{driver.type}</Text>
              </View>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.driverAvatar} />
              ) : (
                <View style={styles.driverAvatarFallback}>
                  <User color="#333" size={24} />
                </View>
              )}
              {selectedDriverId === driver.id && (
                <View style={styles.checkBadge}>
                  <CheckCircle2 color={COLORS.primary} size={16} />
                </View>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </>
  );
}
