import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { COLORS } from '@/src/constants/Theme';
import styles from './styles';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationPickerModalProps = {
  visible: boolean;
  mapRef: React.RefObject<MapView | null>;
  region: Region;
  pickupCoords: Coordinates | null;
  dropoffCoords: Coordinates | null;
  routeLine: Coordinates[];
  onRegionChangeComplete: (region: Region) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LocationPickerModal({
  visible,
  mapRef,
  region,
  pickupCoords,
  dropoffCoords,
  routeLine,
  onRegionChangeComplete,
  onConfirm,
  onCancel,
}: LocationPickerModalProps) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          {pickupCoords && <Marker coordinate={pickupCoords} pinColor="green" />}
          {dropoffCoords && <Marker coordinate={dropoffCoords} pinColor="red" />}
          {routeLine.length === 2 && (
            <Polyline coordinates={routeLine} strokeColor={COLORS.primary} strokeWidth={3} lineDashPattern={[5, 5]} />
          )}
        </MapView>
        <View style={styles.crosshair}>
          <MapPin color="#FF5252" size={45} />
        </View>
        <View style={styles.mapFooter}>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>تأكيد هذا الموقع</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
