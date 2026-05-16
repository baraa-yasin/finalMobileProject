import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

type RegisterFooterProps = {
  onLoginPress: () => void;
};

export default function RegisterFooter({ onLoginPress }: RegisterFooterProps) {
  return (
    <TouchableOpacity onPress={onLoginPress}>
      <Text style={styles.footerText}>
        لديك حساب بالفعل؟ <Text style={styles.link}>سجل دخولك</Text>
      </Text>
    </TouchableOpacity>
  );
}
