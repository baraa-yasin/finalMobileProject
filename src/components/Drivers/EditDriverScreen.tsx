import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Save } from 'lucide-react-native';
import { db } from '../../api/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditDriverScreen({
  driverId,
  onBack,
}: {
  driverId: string;
  onBack?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('4.9');
  const [avatar, setAvatar] = useState('');
  const [active, setActive] = useState(true);

  const rateNumber = useMemo(() => {
    const n = Number(rate);
    return Number.isFinite(n) ? n : NaN;
  }, [rate]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!driverId) {
          Alert.alert('خطأ', 'معرف السائق غير موجود.');
          onBack && onBack();
          return;
        }
        const snap = await getDoc(doc(db, 'drivers', driverId));
        if (!snap.exists()) {
          Alert.alert('خطأ', 'السائق غير موجود.');
          onBack && onBack();
          return;
        }

        const data: any = snap.data();
        setName(data.name || '');
        setType(data.type || '');
        setRate(String(data.rate ?? '4.9'));
        setAvatar(data.avatar || data.avatarUrl || '');
        setActive(!!data.active);
      } catch (e) {
        Alert.alert('خطأ', 'تعذر تحميل بيانات السائق.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [driverId, onBack]);

  const onSave = async () => {
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    const trimmedAvatar = avatar.trim();

    if (!trimmedName) return Alert.alert('بيانات ناقصة', 'يرجى إدخال اسم السائق.');
    if (!trimmedType) return Alert.alert('بيانات ناقصة', 'يرجى إدخال نوع المركبة.');
    if (!Number.isFinite(rateNumber) || rateNumber < 0 || rateNumber > 5) {
      return Alert.alert('قيمة غير صحيحة', 'التقييم لازم يكون رقم بين 0 و 5.');
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'drivers', driverId), {
        name: trimmedName,
        type: trimmedType,
        rate: rateNumber,
        avatar: trimmedAvatar || null,
        avatarUrl: trimmedAvatar || null,
        active,
      });
      Alert.alert('تم الحفظ', 'تم تحديث بيانات السائق بنجاح.', [{ text: 'حسناً', onPress: () => onBack && onBack() }]);
    } catch (e: any) {
      Alert.alert('خطأ', e?.message || 'تعذر تحديث بيانات السائق.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#064e3b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowRight color="#064e3b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تعديل بيانات السائق</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>اسم السائق</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} textAlign="right" />

          <Text style={styles.label}>نوع المركبة</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} textAlign="right" />

          <Text style={styles.label}>التقييم (0 - 5)</Text>
          <TextInput
            style={styles.input}
            value={rate}
            onChangeText={setRate}
            keyboardType="decimal-pad"
            textAlign="right"
          />

          <Text style={styles.label}>رابط الصورة</Text>
          <TextInput
            style={styles.input}
            value={avatar}
            onChangeText={setAvatar}
            autoCapitalize="none"
            textAlign="right"
            placeholder="https://..."
          />

          <View style={styles.switchRow}>
            <Switch value={active} onValueChange={setActive} />
            <Text style={styles.switchText}>{active ? 'متاح' : 'غير متاح'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <><Save color="#fff" size={18} /><Text style={styles.saveText}>حفظ التعديلات</Text></>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
  },
  label: { marginTop: 10, marginBottom: 6, color: '#6B7280', fontWeight: '800', textAlign: 'right' },
  input: {
    backgroundColor: '#F5F7F5',
    borderRadius: 12,
    padding: 12,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  switchRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchText: { fontWeight: '900', color: '#111827' },
  saveBtn: {
    marginTop: 14,
    backgroundColor: '#064e3b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
  },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});

