import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, Modal, Platform 
} from 'react-native';

/** المكتبات **/
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { 
  ArrowRight, Plus, Archive, MapPin, Calendar, Truck, 
  Send, Trash2, Navigation, Clock, User, CheckCircle2 
} from 'lucide-react-native';

/** الإعدادات المحلية **/
import { COLORS } from '../../constants/Theme';
import { db, auth } from '../../api/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export const BookingScreen = ({ onBack }: any) => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  // 1. تفاصيل المنقولات
  const [items, setItems] = useState([
    { id: Date.now().toString(), name: '', quantity: '1', weight: '', length: '', width: '', height: '' }
  ]);

  // 2. إدارة الموقع والخرائط
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropoffCoords, setDropoffCoords] = useState<any>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [targetField, setTargetField] = useState<'pickup' | 'dropoff'>('pickup');
  const [region, setRegion] = useState({
    latitude: 24.7136, longitude: 46.6753,
    latitudeDelta: 0.01, longitudeDelta: 0.01,
  });

  // 3. إدارة الوقت
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  // جلب السائقين من Firestore عند تحميل الصفحة
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const q = query(collection(db, "drivers"), where("active", "==", true));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDrivers(list);
        if (list.length > 0) setSelectedDriverId(list[0].id);
      } catch (e) { console.error("Error fetching drivers:", e); }
    };
    fetchDrivers();
  }, []);

  /** وظائف الخريطة **/
  const openMap = async (field: 'pickup' | 'dropoff') => {
    setTargetField(field);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert("تنبيه", "نحتاج إذن الموقع لتحديد العنوان");
    setMapVisible(true);
  };

  const handleMapConfirm = async () => {
    const coords = { latitude: region.latitude, longitude: region.longitude };
    setMapVisible(false);

    if (targetField === 'pickup') {
      setPickupCoords(coords);
      setPickupLocation("جاري تحديد العنوان...");
    } else {
      setDropoffCoords(coords);
      setDropoffLocation("جاري تحديد العنوان...");
    }

    try {
      const addr = await Location.reverseGeocodeAsync(coords);
      const label = addr.length > 0 ? `${addr[0].district || ''} ${addr[0].street || 'موقع محدد'}` : "موقع مخصص";
      targetField === 'pickup' ? setPickupLocation(label) : setDropoffLocation(label);
    } catch (e) {
      const fallback = `إحداثيات: ${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;
      targetField === 'pickup' ? setPickupLocation(fallback) : setDropoffLocation(fallback);
    }
  };

  /** وظائف المنقولات **/
  const addItem = () => setItems([...items, { id: Date.now().toString(), name: '', quantity: '1', weight: '', length: '', width: '', height: '' }]);
  const removeItem = (id: string) => items.length > 1 ? setItems(items.filter(i => i.id !== id)) : Alert.alert("تنبيه", "يجب إضافة قطعة واحدة على الأقل");
  const updateItem = (id: string, f: string, v: string) => setItems(items.map(i => i.id === id ? { ...i, [f]: v } : i));

  /** إرسال الطلب **/
  const handleSendOrder = async () => {
    if (!pickupCoords || !dropoffCoords) return Alert.alert("بيانات ناقصة", "يرجى تحديد مواقع الاستلام والتسليم من الخريطة");
    if (!items[0].name) return Alert.alert("بيانات ناقصة", "يرجى إضافة تفاصيل المنقولات");

    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser?.uid || 'guest',
        items,
        pickup: { address: pickupLocation, coords: pickupCoords },
        dropoff: { address: dropoffLocation, coords: dropoffCoords },
        scheduledTime: date.toISOString(),
        driverId: selectedDriverId,
        status: 'pending', // الحالة الابتدائية للتتبع
        createdAt: serverTimestamp(),
      });
      Alert.alert("تم الإرسال", "تم تسجيل طلبك بنجاح، يمكنك تتبعه الآن.", [{ text: "حسناً", onPress: onBack }]);
    } catch (e: any) { Alert.alert("خطأ", e.message); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>لوجستي</Text>
        <Text style={styles.headerTitle}>حجز نقلة جديدة</Text>
        <TouchableOpacity onPress={onBack}><ArrowRight color="#333" size={24} /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <Text style={styles.mainQuestion}>ماذا ستنقل اليوم؟</Text>
          <Text style={styles.subQuestion}>يرجى إكمال البيانات بدقة لضمان أفضل خدمة</Text>
        </View>

        {/* 1. تفاصيل المنقولات */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity style={styles.addButton} onPress={addItem}><Plus color="#fff" size={20} /></TouchableOpacity>
          <View style={styles.rowReverse}>
            <Text style={styles.sectionTitle}>تفاصيل المنقولات</Text>
            <Archive color="#333" size={20} />
          </View>
        </View>

        {items.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.inputLabel}>اسم القطعة #{index + 1}</Text>
            <TextInput style={styles.input} placeholder="مثلاً: كنب، ثلاجة..." textAlign="right" value={item.name} onChangeText={(v) => updateItem(item.id, 'name', v)} />
            
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>الكمية</Text>
                <TextInput style={styles.input} placeholder="1" textAlign="center" keyboardType="numeric" value={item.quantity} onChangeText={(v) => updateItem(item.id, 'quantity', v)} />
              </View>
              <View style={{ width: 15 }} />
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>الوزن (كجم)</Text>
                <TextInput style={styles.input} placeholder="50" textAlign="center" keyboardType="numeric" value={item.weight} onChangeText={(v) => updateItem(item.id, 'weight', v)} />
              </View>
            </View>

            <View style={styles.row}>
              <TextInput style={[styles.input, styles.flex1]} placeholder="طول" textAlign="center" value={item.length} onChangeText={(v) => updateItem(item.id, 'length', v)} />
              <TextInput style={[styles.input, styles.flex1, {marginHorizontal: 8}]} placeholder="عرض" textAlign="center" value={item.width} onChangeText={(v) => updateItem(item.id, 'width', v)} />
              <TextInput style={[styles.input, styles.flex1]} placeholder="ارتفاع" textAlign="center" value={item.height} onChangeText={(v) => updateItem(item.id, 'height', v)} />
              <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
                <Trash2 color="#FF5252" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* 2. الموقع والوجهة */}
        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>الموقع والوجهة</Text>
          <MapPin color="#333" size={20} />
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.locationField} onPress={() => openMap('pickup')}>
            <Navigation color={COLORS.primary} size={20} />
            <Text style={styles.locationText}>{pickupLocation || "حدد نقطة الاستلام من الخريطة"}</Text>
          </TouchableOpacity>
          <View style={styles.lineDivider} />
          <TouchableOpacity style={styles.locationField} onPress={() => openMap('dropoff')}>
            <MapPin color="#FF5252" size={20} />
            <Text style={styles.locationText}>{dropoffLocation || "حدد نقطة التسليم من الخريطة"}</Text>
          </TouchableOpacity>
        </View>

        {/* 3. توقيت النقل */}
        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>توقيت النقل</Text>
          <Calendar color="#333" size={20} />
        </View>

        <TouchableOpacity style={styles.card} onPress={() => { setMode('date'); setShowPicker(true); }}>
          <View style={styles.rowReverse}>
            <Clock color="#333" size={20} />
            <Text style={styles.locationText}>{date.toLocaleString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker value={date} mode={mode} is24Hour={false} display="default" onChange={(e, d) => {
            setShowPicker(false);
            if (d) { setDate(d); if (mode === 'date') { setMode('time'); setShowPicker(true); } }
          }} />
        )}

        {/* 4. السائقين */}
        <View style={styles.sectionTitleGroupSpace}>
          <Text style={styles.sectionTitle}>السائقين المتاحين</Text>
          <Truck color="#333" size={20} />
        </View>

        {drivers.length === 0 ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          drivers.map((driver) => (
            <TouchableOpacity key={driver.id} style={[styles.driverCard, selectedDriverId === driver.id && styles.selectedDriverCard]} onPress={() => setSelectedDriverId(driver.id)}>
              <Text style={styles.rateText}>⭐ {driver.rate}</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverType}>{driver.type}</Text>
              </View>
              <User color="#333" size={24} />
              {selectedDriverId === driver.id && <View style={styles.checkBadge}><CheckCircle2 color={COLORS.primary} size={16} /></View>}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSendOrder} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Send color="#fff" size={20} /><Text style={styles.submitButtonText}>إرسال طلب النقل</Text></>}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal الخريطة */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} region={region} onRegionChangeComplete={setRegion}>
            {pickupCoords && <Marker coordinate={pickupCoords} pinColor="green" />}
            {dropoffCoords && <Marker coordinate={dropoffCoords} pinColor="red" />}
            {pickupCoords && dropoffCoords && <Polyline coordinates={[pickupCoords, dropoffCoords]} strokeColor={COLORS.primary} strokeWidth={3} lineDashPattern={[5, 5]} />}
          </MapView>
          <View style={styles.crosshair}><MapPin color="#FF5252" size={45} /></View>
          <View style={styles.mapFooter}>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleMapConfirm}><Text style={styles.confirmBtnText}>تأكيد هذا الموقع</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setMapVisible(false)}><Text style={{ color: 'red' }}>إلغاء</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', backgroundColor: '#fff', elevation: 2 },
  brandTitle: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  topInfo: { alignItems: 'flex-end', marginBottom: 20 },
  mainQuestion: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  subQuestion: { fontSize: 13, color: '#888', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitleGroupSpace: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 25, marginBottom: 15, justifyContent: 'flex-end' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  rowReverse: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  addButton: { backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  inputLabel: { fontSize: 12, color: '#777', textAlign: 'right', marginBottom: 6 },
  input: { backgroundColor: '#F5F7F5', borderRadius: 12, padding: 12, color: '#333', textAlign: 'right', marginBottom: 10 },
  row: { flexDirection: 'row-reverse', alignItems: 'center' },
  flex1: { flex: 1 },
  deleteBtn: { padding: 10 },
  locationField: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 12, gap: 12 },
  locationText: { fontSize: 14, color: '#444', flex: 1, textAlign: 'right' },
  lineDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  driverCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, padding: 15, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  selectedDriverCard: { borderColor: COLORS.primary, backgroundColor: '#F1F8F1' },
  driverInfo: { flex: 1, alignItems: 'flex-end', marginRight: 15 },
  driverName: { fontWeight: 'bold', fontSize: 15 },
  driverType: { color: '#888', fontSize: 11 },
  rateText: { fontWeight: 'bold', fontSize: 14 },
  checkBadge: { position: 'absolute', top: 8, left: 8 },
  submitButton: { backgroundColor: '#0A2900', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 25, gap: 10 },
  submitButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  crosshair: { position: 'absolute', top: '50%', left: '50%', marginLeft: -22, marginTop: -45 },
  mapFooter: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  confirmBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', elevation: 5 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 15 }
});