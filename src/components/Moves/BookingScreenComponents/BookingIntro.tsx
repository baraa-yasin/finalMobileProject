import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function BookingIntro() {
  return (
    <View style={styles.topInfo}>
      <Text style={styles.mainQuestion}>ماذا ستنقل اليوم؟</Text>
      <Text style={styles.subQuestion}>يرجى إكمال البيانات بدقة لضمان أفضل خدمة</Text>
    </View>
  );
}
