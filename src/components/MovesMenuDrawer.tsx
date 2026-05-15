import React, { useMemo } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/api/firebaseConfig';
import { navItems } from './MovesBottomNavigation';

const drawerOnlyItems = [
  { icon: 'receipt-long' as keyof typeof MaterialIcons.glyphMap, label: 'تفاصيل الطلبات', route: '/order-history' },
];

export default function MovesMenuDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج من الحساب؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تسجيل الخروج',
        style: 'destructive',
        onPress: async () => {
          try {
            onClose();
            await signOut(auth);
            router.replace('/login' as any);
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('خطأ', 'تعذر تسجيل الخروج. حاول مرة أخرى.');
          }
        },
      },
    ]);
  };

  const items = useMemo(
    () => [
      // نرتب القائمة بحيث التنبيهات والحساب آخر شي
      ...navItems.filter((i) => i.route === '/'),
      ...navItems.filter((i) => i.route === '/moves'),
      ...drawerOnlyItems,
      ...navItems.filter((i) => i.route === '/notifications'),
      ...navItems.filter((i) => i.route === '/profile'),
    ],
    []
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>القائمة</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color="#0b3a00" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {items.map((item) => {
              const isActive = pathname === item.route;
              return (
                <TouchableOpacity
                  key={item.route}
                  style={[styles.row, isActive && styles.rowActive]}
                  onPress={() => {
                    onClose();
                    router.push(item.route as any);
                  }}
                  activeOpacity={0.85}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={isActive ? '#0b3a00' : '#6b7280'}
                  />
                  <Text style={[styles.label, isActive && styles.labelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={handleLogout} activeOpacity={0.85}>
              <MaterialIcons name="logout" size={22} color="#dc2626" />
              <Text style={[styles.label, styles.logoutLabel]}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row-reverse' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  drawer: {
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 14,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerTitle: { fontSize: 16, fontWeight: '900', color: '#0b3a00' },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  list: { paddingTop: 12 },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 6,
  },
  rowActive: { backgroundColor: 'rgba(175, 245, 146, 0.28)' },
  label: { fontSize: 14, fontWeight: '800', color: '#111827' },
  labelActive: { color: '#0b3a00' },
  logoutRow: {
    backgroundColor: '#fef2f2',
    marginTop: 8,
  },
  logoutLabel: { color: '#dc2626' },
});
