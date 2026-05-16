import React from 'react';
import { Text } from 'react-native';
import styles from './styles';

export default function RegisterHeader() {
  return (
    <>
      <Text style={styles.title}>إنشاء حساب</Text>
      <Text style={styles.subtitle}>انضم إلى SwiftShift اليوم</Text>
    </>
  );
}
