import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function ProfileHeader() {
  return (
    <View style={styles.titleBand}>
      <View style={styles.headerText}>
        <Text style={styles.title}>الحساب الشخصي</Text>
        <Text style={styles.subtitle}>بيانات الحساب والصورة</Text>
      </View>
    </View>
  );
}
