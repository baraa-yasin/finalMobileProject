import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'lucide-react-native';
import styles from './styles';

type TrackBottomActionProps = {
  onTrack?: () => void;
};

export default function TrackBottomAction({ onTrack }: TrackBottomActionProps) {
  return (
    <View style={styles.bottomAction}>
      <TouchableOpacity style={styles.trackButton} onPress={onTrack} activeOpacity={0.88}>
        <Navigation color="#fff" fill="#fff" size={22} />
        <Text style={styles.trackButtonText}>تتبع النقلة</Text>
      </TouchableOpacity>
    </View>
  );
}
