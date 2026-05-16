import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

type RouteCardProps = {
  pickupAddress?: string;
  dropoffAddress?: string;
};

export default function RouteCard({ pickupAddress, dropoffAddress }: RouteCardProps) {
  return (
    <View style={styles.routeCard}>
      <View style={styles.routeLine}>
        <View style={styles.pickupDot} />
        <View style={styles.line} />
        <View style={styles.dropoffDot} />
      </View>
      <View style={styles.routeContent}>
        <View>
          <Text style={styles.routeLabel}>موقع الاستلام</Text>
          <Text style={styles.routeValue}>{pickupAddress || 'حي الصحافة، شارع العليا، الرياض'}</Text>
        </View>
        <View>
          <Text style={styles.routeLabel}>وجهة الوصول</Text>
          <Text style={styles.routeValue}>{dropoffAddress || 'حي الياسمين، طريق الثمامة، الرياض'}</Text>
        </View>
      </View>
    </View>
  );
}
