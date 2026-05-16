import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styles from './styles';

export default function ProfileLoadingState() {
  return (
    <View style={styles.centerState}>
      <ActivityIndicator size="large" color="#145300" />
    </View>
  );
}
