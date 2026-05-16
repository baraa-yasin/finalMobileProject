import React from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import styles from './styles';

export type TimelineStepStatus = 'active' | 'completed' | 'upcoming';

type TimelineStepProps = {
  title: string;
  subtitle: string;
  status: TimelineStepStatus;
};

export default function TimelineStep({ title, subtitle, status }: TimelineStepProps) {
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <View style={[styles.stepRow, !isCompleted && !isActive && styles.stepUpcoming]}>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.dot, isCompleted && styles.dotCompleted, isActive && styles.dotActive]}>
        {isCompleted && <Check color="#fff" size={12} />}
        {isActive && <View style={styles.innerDot} />}
      </View>
    </View>
  );
}
