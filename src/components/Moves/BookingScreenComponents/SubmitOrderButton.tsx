import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Send } from 'lucide-react-native';
import styles from './styles';

type SubmitOrderButtonProps = {
  isPending: boolean;
  onPress: () => void;
};

export default function SubmitOrderButton({ isPending, onPress }: SubmitOrderButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
      onPress={onPress}
      disabled={isPending}
    >
      {isPending ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Send color="#fff" size={20} />
          <Text style={styles.submitButtonText}>إرسال طلب النقل</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
