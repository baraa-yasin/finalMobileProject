import React from 'react';
import { Text, View } from 'react-native';
import { ArrowRightLeft, Package, ShieldCheck, Truck } from 'lucide-react-native';
import styles from './styles';

export default function FleetServicesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الأسطول والخدمات</Text>

      <View style={styles.fleetCard}>
        <View style={styles.fleetInfo}>
          <Text style={styles.fleetTitle}>أنواع المركبات</Text>
          <Text style={styles.fleetSubtitle}>شاحنات نقل ثقيل، فان نقل خفيف</Text>
        </View>
        <View style={styles.fleetIcons}>
          <View style={styles.iconCircle}>
            <Truck color="#15803d" size={20} />
          </View>
          <View style={styles.iconCircle}>
            <ArrowRightLeft color="#15803d" size={20} />
          </View>
        </View>
      </View>

      <View style={styles.serviceRow}>
        <View style={styles.serviceCard}>
          <Package color="#16a34a" size={24} style={{ marginBottom: 12 }} />
          <Text style={styles.serviceTitle}>تغليف احترافي</Text>
          <Text style={styles.serviceSubtitle}>حماية تامة لممتلكاتك</Text>
        </View>
        <View style={styles.serviceCard}>
          <ShieldCheck color="#16a34a" size={24} style={{ marginBottom: 12 }} />
          <Text style={styles.serviceTitle}>تأمين شامل</Text>
          <Text style={styles.serviceSubtitle}>ضمان التعويض الفوري</Text>
        </View>
      </View>
    </View>
  );
}
