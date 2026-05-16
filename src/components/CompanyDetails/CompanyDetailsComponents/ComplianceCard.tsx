import React from 'react';
import { Text, View } from 'react-native';
import { Award, ShieldCheck } from 'lucide-react-native';
import styles from './styles';

export default function ComplianceCard() {
  return (
    <View style={styles.complianceCard}>
      <Text style={styles.complianceTitle}>الاعتمادات والموثوقية</Text>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Award color="#fff" size={14} />
          <Text style={styles.badgeText}>ISO Certified</Text>
        </View>
        <View style={styles.badge}>
          <ShieldCheck color="#fff" size={14} />
          <Text style={styles.badgeText}>Licensed by MOT</Text>
        </View>
        <View style={styles.badge}>
          <Award color="#fff" size={14} />
          <Text style={styles.badgeText}>Insurance Guaranteed</Text>
        </View>
      </View>
    </View>
  );
}
