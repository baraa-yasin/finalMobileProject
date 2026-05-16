import React from 'react';
import { Text } from 'react-native';
import styles from './styles';

export default function LoginHeader() {
  return (
    <>
      <Text style={styles.title}>تسجيل الدخول</Text>
      <Text style={styles.subtitle}>مرحبا بك في SwiftShift</Text>
    </>
  );
}
