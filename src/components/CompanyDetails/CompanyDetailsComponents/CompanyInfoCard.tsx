import React from 'react';
import { Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import styles from './styles';

export default function CompanyInfoCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SS</Text>
      </View>

      <Text style={styles.companyName}>سويفت شيفت للخدمات اللوجستية</Text>
      <Text style={styles.companyStatus}>ناقل معتمد ومرخص</Text>

      <Text style={styles.companyDescription}>
        شركة رائدة في حلول النقل الذكي، نلتزم بتقديم تجربة نقل آمنة وسلسة لعملائنا في جميع أنحاء العالم مع ضمان أعلى معايير الجودة والسرعة.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>15k+</Text>
          <Text style={styles.statLabel}>عملية ناجحة</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <View style={styles.ratingRow}>
            <Text style={styles.statValue}>4.9</Text>
            <Star color="#eab308" size={14} fill="#eab308" />
          </View>
          <Text style={styles.statLabel}>تقييم العملاء</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>200+</Text>
          <Text style={styles.statLabel}>سائق محترف</Text>
        </View>
      </View>
    </View>
  );
}
