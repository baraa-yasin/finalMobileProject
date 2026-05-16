import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

type ArrivalTimerCardProps = {
  remainingMs: number;
  remainingLabel: string;
};

export default function ArrivalTimerCard({ remainingMs, remainingLabel }: ArrivalTimerCardProps) {
  return (
    <View style={styles.timerCard}>
      <Text style={styles.timerLabel}>الوقت المتبقي للوصول</Text>
      <Text style={[styles.timerValue, remainingMs <= 0 && styles.timerArrived]}>{remainingLabel}</Text>
    </View>
  );
}
