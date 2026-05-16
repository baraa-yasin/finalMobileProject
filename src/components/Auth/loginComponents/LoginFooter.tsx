import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

type LoginFooterProps = {
  onRegisterPress: () => void;
};

export default function LoginFooter({ onRegisterPress }: LoginFooterProps) {
  return (
    <TouchableOpacity onPress={onRegisterPress}>
      <Text style={styles.footerText}>
        ليس لديك حساب؟ <Text style={styles.link}>سجل الآن</Text>
      </Text>
    </TouchableOpacity>
  );
}
