import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/src/components/AppHeader';
import { useCreateOrder } from '@/src/hooks/useCreateOrder';
import { useDrivers } from '@/src/hooks/useDrivers';
import { getErrorMessage } from '@/src/lib/errorHandler';
import {BookingFormValues, BookingIntro, createEmptyItem, DriversSection, ItemsSection, LocationPickerModal, LocationSection, LocationTarget, ScheduleSection, styles, SubmitOrderButton} from './BookingScreenComponents';
import { useFieldArray, useForm } from 'react-hook-form';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const BookingScreen = ({ onBack }: { onBack?: () => void }) => {
  const mapRef = useRef<MapView | null>(null);
  const createOrderMutation = useCreateOrder();
  const { data: drivers = [], isLoading: driversLoading } = useDrivers();

  const { control, handleSubmit } = useForm<BookingFormValues>({
    defaultValues: { items: [createEmptyItem()] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Coordinates | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coordinates | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [targetField, setTargetField] = useState<LocationTarget>('pickup');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    setSelectedDriverId((currentDriverId) => {
      if (!drivers.length) return null;
      if (!currentDriverId) return drivers[0].id;
      return drivers.some((driver) => driver.id === currentDriverId) ? currentDriverId : drivers[0].id;
    });
  }, [drivers]);

  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver.id === selectedDriverId),
    [drivers, selectedDriverId]
  );

  const routeLine = useMemo(
    () => (pickupCoords && dropoffCoords ? [pickupCoords, dropoffCoords] : []),
    [dropoffCoords, pickupCoords]
  );

  const openMap = useCallback(async (field: LocationTarget) => {
    setTargetField(field);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('تنبيه', 'نحتاج إذن الموقع لتحديد العنوان');
      return;
    }

    setMapVisible(true);
  }, []);

  const handleMapConfirm = useCallback(async () => {
    const coords = { latitude: region.latitude, longitude: region.longitude };
    const setCoords = targetField === 'pickup' ? setPickupCoords : setDropoffCoords;
    const setLocation = targetField === 'pickup' ? setPickupLocation : setDropoffLocation;

    setMapVisible(false);
    setCoords(coords);
    setLocation('جاري تحديد العنوان...');

    try {
      const address = await Location.reverseGeocodeAsync(coords);
      const firstAddress = address[0];
      setLocation(firstAddress ? `${firstAddress.district || ''} ${firstAddress.street || 'موقع محدد'}`.trim() : 'موقع مخصص');
    } catch {
      setLocation(`إحداثيات: ${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`);
    }
  }, [region.latitude, region.longitude, targetField]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      if (fields.length <= 1) {
        Alert.alert('تنبيه', 'يجب إضافة قطعة واحدة على الأقل');
        return;
      }

      remove(index);
    },
    [fields.length, remove]
  );

  const openDateTimePicker = useCallback(() => {
    if (Platform.OS !== 'android') {
      setShowPicker(true);
      return;
    }

    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      display: 'default',
      onChange: (event, selectedDate) => {
        if (event.type !== 'set' || !selectedDate) return;

        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          is24Hour: false,
          display: 'default',
          onChange: (timeEvent, selectedTime) => {
            if (timeEvent.type !== 'set' || !selectedTime) return;

            const nextDate = new Date(selectedDate);
            nextDate.setHours(selectedTime.getHours());
            nextDate.setMinutes(selectedTime.getMinutes());
            setDate(nextDate);
          },
        });
      },
    });
  }, [date]);

  const handleCreateOrder = useCallback(
    async ({ items }: BookingFormValues) => {
      if (!pickupCoords || !dropoffCoords) {
        Alert.alert('بيانات ناقصة', 'يرجى تحديد مواقع الاستلام والتسليم من الخريطة');
        return;
      }

      if (!items.some((item) => item.name.trim())) {
        Alert.alert('بيانات ناقصة', 'يرجى إضافة تفاصيل المنقولات');
        return;
      }

      try {
        await createOrderMutation.mutateAsync({
          items,
          pickupLocation,
          dropoffLocation,
          pickupCoords,
          dropoffCoords,
          scheduledTime: date,
          selectedDriverId,
          selectedDriver,
        });

        Alert.alert('تم الإرسال', 'تم تسجيل طلبك بنجاح، يمكنك تتبعه الآن.', [{ text: 'حسنا', onPress: onBack }]);
      } catch (error) {
        Alert.alert('خطأ', getErrorMessage(error));
      }
    },
    [
      createOrderMutation,
      date,
      dropoffCoords,
      dropoffLocation,
      onBack,
      pickupCoords,
      pickupLocation,
      selectedDriver,
      selectedDriverId,
    ]
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BookingIntro />
        <ItemsSection
          control={control}
          fields={fields}
          onAddItem={() => append(createEmptyItem())}
          onRemoveItem={handleRemoveItem}
        />
        <LocationSection pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} onOpenMap={openMap} />
        <ScheduleSection date={date} onOpenPicker={openDateTimePicker} />

        {showPicker && Platform.OS !== 'android' && (
          <DateTimePicker
            value={date}
            mode="datetime"
            is24Hour={false}
            display="default"
            onChange={(_, nextDate) => {
              setShowPicker(false);
              if (nextDate) setDate(nextDate);
            }}
          />
        )}

        <DriversSection
          drivers={drivers}
          driversLoading={driversLoading}
          selectedDriverId={selectedDriverId}
          onSelectDriver={setSelectedDriverId}
        />
        <SubmitOrderButton
          isPending={createOrderMutation.isPending}
          onPress={handleSubmit(handleCreateOrder)}
        />
      </ScrollView>

      <LocationPickerModal
        visible={mapVisible}
        mapRef={mapRef}
        region={region}
        pickupCoords={pickupCoords}
        dropoffCoords={dropoffCoords}
        routeLine={routeLine}
        onRegionChangeComplete={setRegion}
        onConfirm={handleMapConfirm}
        onCancel={() => setMapVisible(false)}
      />
    </SafeAreaView>
  );
};
