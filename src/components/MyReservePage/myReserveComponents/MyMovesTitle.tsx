import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function MyMovesTitle() {
  return (
    <View style={styles.titleSection}>
      <Text style={styles.mainTitle}>نقلاتي</Text>
      <Text style={styles.subTitle}>إدارة ومتابعة طلبات النقل الخاصة بك</Text>
    </View>
  );
}
