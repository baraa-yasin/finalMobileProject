import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { Archive, Calendar, CheckCircle2, MapPin, Navigation, Plus, Send, Trash2, Truck, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/src/components/AppHeader';
import { COLORS } from '@/src/constants/Theme';
import { useCreateOrder } from '@/src/hooks/useCreateOrder';
import { useDrivers } from '@/src/hooks/useDrivers';
import { getErrorMessage } from '@/src/lib/errorHandler';
import type { MoveItem } from '@/src/services/orderService';

type BookingFormValues = {
  items: MoveItem[];
};

const createEmptyItem = (): MoveItem => ({
  id: `${Date.now()}-${Math.random()}`,
  name: '',
  quantity: '1',
  weight: '',
  length: '',
  width: '',
  height: '',
});

const getDriverAvatarUrl = (driver: any): string | null => {
  const raw = driver?.avatar || driver?.avatarUrl || driver?.photoURL || driver?.photoUrl || driver?.image || driver?.imageUrl || '';
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? encodeURI(trimmed) : null;
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
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropoffCoords, setDropoffCoords] = useState<any>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [targetField, setTargetField] = useState<'pickup' | 'dropoff'>('pickup');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [region, setRegion] = useState({
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

  const openMap = useCallback(async (field: 'pickup' | 'dropoff') => {
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
        <View style={styles.topInfo}>
          <Text style={styles.mainQuestion}>ماذا ستنقل اليوم؟</Text>
          <Text style={styles.subQuestion}>يرجى إكمال البيانات بدقة لضمان أفضل خدمة</Text>
        </View>

        <View style={styles.sectionHeader}>
          <TouchableOpacity style={styles.addButton} onPress={() => append(createEmptyItem())}>
            <Plus color="#fff" size={20} />
          </TouchableOpacity>
          <View style={styles.rowReverse}>
            <Text style={styles.sectionTitle}>تفاصيل المنقولات</Text>
            <Archive color="#333" size={20} />
          </View>
        </View>

        {fields.map((field, index) => (
          <View key={field.id} style={styles.card}>
            <Text style={styles.inputLabel}>اسم القطعة #{index + 1}</Text>
            <Controller
              control={control}
              name={`items.${index}.name`}
              render={({ field: inputField }) => (
                <TextInput
                  style={styles.input}
                  placeholder="مثلا: كنب، ثلاجة..."
                  textAlign="right"
                  value={inputField.value}
                  onChangeText={inputField.onChange}
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>الكمية</Text>
                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field: inputField }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="1"
                      textAlign="center"
                      keyboardType="numeric"
                      value={inputField.value}
                      onChangeText={inputField.onChange}
                    />
                  )}
                />
              </View>
              <View style={{ width: 15 }} />
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>الوزن (كجم)</Text>
                <Controller
                  control={control}
                  name={`items.${index}.weight`}
                  render={({ field: inputField }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="50"
                      textAlign="center"
                      keyboardType="numeric"
                      value={inputField.value}
                      onChangeText={inputField.onChange}
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.row}>
              {(['length', 'width', 'height'] as const).map((name) => (
                <Controller
                  key={name}
                  control={control}
                  name={`items.${index}.${name}`}
                  render={({ field: inputField }) => (
                    <TextInput
                      style={[styles.input, styles.flex1, name === 'width' && { marginHorizontal: 8 }]}
                      placeholder={name === 'length' ? 'طول' : name === 'width' ? 'عرض' : 'ارتفاع'}
                      textAlign="center"
                      keyboardType="numeric"
                      value={inputField.value}
                      onChangeText={inputField.onChange}
                    />
                  )}
                />
              ))}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemoveItem(index)}>
                <Trash2 color="#FF5252" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>الموقع والوجهة</Text>
          <MapPin color="#333" size={20} />
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.locationField} onPress={() => openMap('pickup')}>
            <Navigation color={COLORS.primary} size={20} />
            <Text style={styles.locationText}>{pickupLocation || 'حدد نقطة الاستلام من الخريطة'}</Text>
          </TouchableOpacity>
          <View style={styles.lineDivider} />
          <TouchableOpacity style={styles.locationField} onPress={() => openMap('dropoff')}>
            <MapPin color="#FF5252" size={20} />
            <Text style={styles.locationText}>{dropoffLocation || 'حدد نقطة التسليم من الخريطة'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>توقيت النقل</Text>
          <Calendar color="#333" size={20} />
        </View>

        <TouchableOpacity style={styles.card} onPress={() => setShowPicker(true)}>
          <Text style={styles.locationText}>
            {date.toLocaleString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
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

        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>السائقين المتاحين</Text>
          <Truck color="#333" size={20} />
        </View>

        {driversLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : drivers.length === 0 ? (
          <Text style={styles.emptyText}>لا يوجد سائقون متاحون حاليا</Text>
        ) : (
          drivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={[styles.driverCard, selectedDriverId === driver.id && styles.selectedDriverCard]}
              onPress={() => setSelectedDriverId(driver.id)}
            >
              <Text style={styles.rateText}>★ {driver.rate}</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverType}>{driver.type}</Text>
              </View>
              {getDriverAvatarUrl(driver) ? (
                <Image source={{ uri: getDriverAvatarUrl(driver)! }} style={styles.driverAvatar} />
              ) : (
                <View style={styles.driverAvatarFallback}>
                  <User color="#333" size={24} />
                </View>
              )}
              {selectedDriverId === driver.id && (
                <View style={styles.checkBadge}>
                  <CheckCircle2 color={COLORS.primary} size={16} />
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[styles.submitButton, createOrderMutation.isPending && { opacity: 0.7 }]}
          onPress={handleSubmit(handleCreateOrder)}
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Send color="#fff" size={20} />
              <Text style={styles.submitButtonText}>إرسال طلب النقل</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={mapVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView ref={mapRef} style={{ flex: 1 }} provider={PROVIDER_GOOGLE} region={region} onRegionChangeComplete={setRegion}>
            {pickupCoords && <Marker coordinate={pickupCoords} pinColor="green" />}
            {dropoffCoords && <Marker coordinate={dropoffCoords} pinColor="red" />}
            {routeLine.length === 2 && <Polyline coordinates={routeLine} strokeColor={COLORS.primary} strokeWidth={3} lineDashPattern={[5, 5]} />}
          </MapView>
          <View style={styles.crosshair}>
            <MapPin color="#FF5252" size={45} />
          </View>
          <View style={styles.mapFooter}>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleMapConfirm}>
              <Text style={styles.confirmBtnText}>تأكيد هذا الموقع</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setMapVisible(false)}>
              <Text style={{ color: 'red' }}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  topInfo: { alignItems: 'flex-end', marginBottom: 20 },
  mainQuestion: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  subQuestion: { fontSize: 13, color: '#888', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitleGroupSpace: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 25, marginBottom: 15, justifyContent: 'flex-end' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  rowReverse: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  addButton: { backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  inputLabel: { fontSize: 12, color: '#777', textAlign: 'right', marginBottom: 6 },
  input: { backgroundColor: '#F5F7F5', borderRadius: 12, padding: 12, color: '#333', textAlign: 'right', marginBottom: 10 },
  row: { flexDirection: 'row-reverse', alignItems: 'center' },
  flex1: { flex: 1 },
  deleteBtn: { padding: 10 },
  locationField: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 12, gap: 12 },
  locationText: { fontSize: 14, color: '#444', flex: 1, textAlign: 'right' },
  lineDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  emptyText: { color: '#777', textAlign: 'right' },
  driverCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  selectedDriverCard: { borderColor: COLORS.primary, backgroundColor: '#F1F8F1' },
  driverInfo: { flex: 1, alignItems: 'flex-end', marginRight: 15 },
  driverName: { fontWeight: 'bold', fontSize: 15 },
  driverType: { color: '#888', fontSize: 11 },
  rateText: { fontWeight: 'bold', fontSize: 14 },
  driverAvatar: { width: 40, height: 40, borderRadius: 20 },
  driverAvatarFallback: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  checkBadge: { position: 'absolute', top: 8, left: 8 },
  submitButton: { backgroundColor: '#0A2900', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 18, marginTop: 25, gap: 10 },
  submitButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  crosshair: { position: 'absolute', top: '50%', left: '50%', marginLeft: -22, marginTop: -45 },
  mapFooter: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  confirmBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', elevation: 5 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 15 },
});
