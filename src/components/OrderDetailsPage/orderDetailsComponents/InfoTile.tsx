import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

type InfoTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <View style={styles.infoTile}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}
