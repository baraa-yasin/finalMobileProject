import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import MovesMenuDrawer from '@/src/components/MovesMenuDrawer';

export default function AppHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setMenuOpen(true)}>
          <Menu color="#0b3a00" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/home' as any)} activeOpacity={0.85}>
          <Text style={styles.logo}>SwiftShift</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications' as any)}>
          <Bell color="#0b3a00" size={24} />
        </TouchableOpacity>
      </View>

      <MovesMenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0b3a00',
    fontStyle: 'italic',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
  },
});
