import React from 'react';
import { View } from 'react-native';
import { CalendarDays, Clock3 } from 'lucide-react-native';
import { formatDate, formatTime } from './helpers';
import InfoTile from './InfoTile';
import styles from './styles';

type ScheduleInfoProps = {
  scheduledTime?: any;
};

export default function ScheduleInfo({ scheduledTime }: ScheduleInfoProps) {
  return (
    <View style={styles.infoGrid}>
      <InfoTile icon={<CalendarDays color="#0b3a00" size={21} />} label="التاريخ" value={formatDate(scheduledTime)} />
      <InfoTile icon={<Clock3 color="#0b3a00" size={21} />} label="الوقت المقدر" value={formatTime(scheduledTime)} />
    </View>
  );
}
