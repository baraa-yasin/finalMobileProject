import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import styles from './styles';

type ScheduleSectionProps = {
  date: Date;
  onOpenPicker: () => void;
};

export default function ScheduleSection({ date, onOpenPicker }: ScheduleSectionProps) {
  return (
    <>
      <View style={styles.sectionTitleGroupSpace}>
        <Text style={styles.sectionTitle}>توقيت النقل</Text>
        <Calendar color="#333" size={20} />
      </View>

      <TouchableOpacity style={styles.card} onPress={onOpenPicker}>
        <Text style={styles.locationText}>
          {date.toLocaleString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    </>
  );
}
