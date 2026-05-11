import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Edit3, Plus, Trash2, User } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

const getDriverAvatarUrl = (driver: any): string | null => {
  const raw =
    driver?.avatar ||
    driver?.avatarUrl ||
    driver?.photoURL ||
    driver?.photoUrl ||
    driver?.image ||
    driver?.imageUrl ||
    '';

  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return encodeURI(trimmed);
};

export default function DriversListScreen({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'drivers'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setDrivers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error fetching drivers:', e);
      Alert.alert('خطأ', 'تعذر جلب السائقين.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDrivers();
    }, [fetchDrivers])
  );

  const onDelete = (driverId: string, driverName?: string) => {
    Alert.alert(
      'حذف سائق',
      `هل أنت متأكد من حذف السائق${driverName ? `: ${driverName}` : ''}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'drivers', driverId));
              setDrivers((prev) => prev.filter((d) => d.id !== driverId));
            } catch (e) {
              console.error('Error deleting driver:', e);
              Alert.alert('خطأ', 'تعذر حذف السائق.');
            }
          },
        },
      ]
    );
  };

  const onToggleAvailability = async (driverId: string, nextValue: boolean) => {
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, active: nextValue } : d)));
    try {
      await updateDoc(doc(db, 'drivers', driverId), { active: nextValue });
    } catch (e) {
      console.error('Error updating driver availability:', e);
      Alert.alert('خطأ', 'تعذر تحديث حالة السائق.');
      setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, active: !nextValue } : d)));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowRight color="#064e3b" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>إدارة السائقين</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-driver' as any)}
          activeOpacity={0.9}
        >
          <Plus color="#064e3b" size={20} />
          <Text style={styles.addButtonText}>إضافة سائق</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#064e3b" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {drivers.length === 0 ? (
            <Text style={styles.empty}>لا يوجد سائقين.</Text>
          ) : (
            drivers.map((d) => (
              <View key={d.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => router.push(`/edit-driver?driverId=${d.id}` as any)}
                    >
                      <Edit3 color="#1d4ed8" size={16} />
                      <Text style={styles.editText}>تعديل</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(d.id, d.name)}>
                      <Trash2 color="#dc2626" size={18} />
                      <Text style={styles.deleteText}>حذف</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.name}>{d.name || 'بدون اسم'}</Text>
                    <Text style={styles.meta}>
                      {d.type || 'بدون نوع'} • ⭐ {typeof d.rate === 'number' ? d.rate.toFixed(1) : d.rate || '—'}
                    </Text>
                    <Text style={styles.meta}>الحالة: {d.active ? 'متاح' : 'غير متاح'}</Text>
                  </View>

                  <View style={styles.leftColumn}>
                    <View style={styles.icon}>
                      {getDriverAvatarUrl(d) ? (
                        <Image source={{ uri: getDriverAvatarUrl(d)! }} style={styles.avatarImage} />
                      ) : (
                        <User color="#064e3b" size={22} />
                      )}
                    </View>
                    <View style={styles.switchWrap}>
                      <Text style={[styles.switchStatus, { color: d.active ? '#15803d' : '#dc2626' }]}>
                        {d.active ? 'متاح' : 'غير متاح'}
                      </Text>
                      <Switch
                        value={!!d.active}
                        onValueChange={(val) => onToggleAvailability(d.id, val)}
                        trackColor={{ false: '#fecaca', true: '#86efac' }}
                        thumbColor={d.active ? '#15803d' : '#dc2626'}
                        ios_backgroundColor="#fecaca"
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#064e3b' },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  addButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(175, 245, 146, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.08)',
  },
  addButtonText: { fontWeight: '900', color: '#064e3b' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  empty: { textAlign: 'center', color: '#6B7280', fontWeight: '800', marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
  },
  cardTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  actions: { alignItems: 'flex-start', gap: 8 },
  leftColumn: { alignItems: 'center', gap: 8 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(175, 245, 146, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  info: { flex: 1, alignItems: 'flex-end', paddingHorizontal: 12 },
  name: { fontSize: 15, fontWeight: '900', color: '#111827' },
  meta: { marginTop: 4, color: '#6B7280', fontWeight: '800', textAlign: 'right' },
  deleteBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteText: { color: '#dc2626', fontWeight: '900' },
  editBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editText: { color: '#1d4ed8', fontWeight: '900' },
  switchWrap: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  switchStatus: { fontWeight: '900', fontSize: 12 },
});

