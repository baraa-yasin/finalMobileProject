import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '@/src/constants/Theme';
import MovesMenuDrawer from '@/src/components/MovesMenuDrawer';

const HomeScreen = ({ onNavigate }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header العلوي */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Menu color="#333" size={28} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الشاشة الرئيسية</Text>

        <Text style={styles.brandName}>سويفت شيفت</Text>
      </View>

      <MovesMenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. البطاقة الخضراء العلوية */}
        <View style={styles.promoCard}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6' }} // صورة أثاث تعبيرية
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 25, opacity: 0.3 }}
          >
            <View style={styles.promoOverlay}>
              <Text style={styles.promoTitle}>انتقال سلس، لمنزل جديد</Text>
              <Text style={styles.promoDesc}>
                نحن نهتم بكل تفاصيل انتقالك، من التعبئة إلى النقل بكل احترافية وأمان.
              </Text>
              <View style={styles.badge}>
                <CheckCircle2 color="#fff" size={16} />
                <Text style={styles.badgeText}>خدمة موثوقة بنسبة 100%</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 3. بطاقة "احجز نقلة الآن" الوسطى */}
        <View style={styles.bookingCard}>
          <View style={styles.iconCircle}>
            <Truck color={COLORS.primary} size={40} />
          </View>
          <Text style={styles.bookingTitle}>احجز نقلة الآن</Text>
          <Text style={styles.bookingDesc}>
            هل أنت مستعد للانتقال؟ ابدأ الآن واحصل على عرض سعر فوري لخدمات النقل الاحترافية لدينا.
          </Text>
          
          <TouchableOpacity 
             style={styles.mainButton}
             onPress={() => onNavigate('/booking')} // <--- غيرنا المسار هنا ليفتح شاشة الحجز الجديدة
          >
              <ArrowLeft color="#fff" size={22} />
              <Text style={styles.buttonText}>ابدأ عملية الحجز</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  brandName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  headerTitle: { color: '#002D62', fontSize: 22, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  
  // تصميم البطاقة الخضراء
  promoCard: {
    height: 220,
    backgroundColor: COLORS.cardGreen,
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
  },
  backgroundImage: { flex: 1, padding: 20, justifyContent: 'center' },
  promoOverlay: { alignItems: 'flex-end' },
  promoTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'right' },
  promoDesc: { color: '#fff', fontSize: 13, textAlign: 'right', marginTop: 10, lineHeight: 20, opacity: 0.9 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 15, gap: 5 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // تصميم بطاقة الحجز
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // الظل
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookingTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  bookingDesc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  mainButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    gap: 15,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
export default HomeScreen;