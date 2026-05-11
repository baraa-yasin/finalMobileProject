import React, { useMemo, useState } from 'react';
import {ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, UserPlus } from 'lucide-react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

export default function AddDriverScreen({ onBack }: { onBack?: () => void }) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('4.9');
  const [avatar, setAvatar] = useState('');
  const [active, setActive] = useState(true);

  const rateNumber = useMemo(() => {
    const n = Number(rate);
    return Number.isFinite(n) ? n : NaN;
  }, [rate]);

  const onSave = async () => {
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    const trimmedAvatar = avatar.trim();

    if (!trimmedName) return Alert.alert('بيانات ناقصة', 'يرجى إدخال اسم السائق.');
    if (!trimmedType) return Alert.alert('بيانات ناقصة', 'يرجى إدخال نوع المركبة/الشاحنة.');
    if (!Number.isFinite(rateNumber) || rateNumber < 0 || rateNumber > 5) {
      return Alert.alert('قيمة غير صحيحة', 'التقييم لازم يكون رقم بين 0 و 5.');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'drivers'), {
        name: trimmedName,
        type: trimmedType,
        rate: rateNumber,
        avatar: trimmedAvatar || null,
        avatarUrl: trimmedAvatar || null,
        active,
        createdAt: serverTimestamp(),
      });

      Alert.alert('تمت الإضافة', 'تم إضافة السائق بنجاح.', [
        { text: 'إضافة سائق آخر', onPress: () => {
          setName('');
          setType('');
          setRate('4.9');
          setAvatar('');
          setActive(true);
        }},
        { text: 'رجوع', onPress: () => onBack && onBack() },
      ]);
    } catch (e: any) {
      Alert.alert('خطأ', e?.message || 'حدث خطأ أثناء إضافة السائق.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowRight color="#064e3b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إضافة سائق</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>بيانات السائق</Text>
            <UserPlus color="#064e3b" size={18} />
          </View>

          <Text style={styles.label}>اسم السائق</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="مثلاً: أحمد محمد"
            textAlign="right"
          />

          <Text style={styles.label}>نوع المركبة</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="مثلاً: دينا / شاحنة صغيرة / تريلا"
            textAlign="right"
          />

          <Text style={styles.label}>التقييم (0 - 5)</Text>
          <TextInput
            style={styles.input}
            value={rate}
            onChangeText={setRate}
            placeholder="4.9"
            keyboardType="decimal-pad"
            textAlign="right"
          />

          <Text style={styles.label}>رابط صورة (اختياري)</Text>
          <TextInput
            style={styles.input}
            value={avatar}
            onChangeText={setAvatar}
            placeholder="https://..."
            autoCapitalize="none"
            textAlign="right"
          />

          <View style={styles.switchRow}>
            <Switch value={active} onValueChange={setActive} />
            <Text style={styles.switchLabel}>السائق متاح (Active)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={onSave}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>حفظ السائق</Text>}
        </TouchableOpacity>

        <Text style={styles.hint}>
          ملاحظة: شاشة الحجز تعرض السائقين الذين `active = true` فقط.
        </Text>
      </ScrollView>
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
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
  },
  cardTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#064e3b' },
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
  switchLabel: { fontWeight: '900', color: '#111827' },
  saveBtn: {
    marginTop: 14,
    backgroundColor: '#064e3b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  hint: { marginTop: 12, color: '#6B7280', textAlign: 'right', fontWeight: '700' },
});

