import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Truck, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react-native';
import { COLORS } from '@/src/constants/Theme';
import AppHeader from '@/src/components/AppHeader';

const HomeScreen = ({ onNavigate }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header العلوي */}
      <AppHeader />

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

        <TouchableOpacity
          style={styles.companyDetailsButton}
          onPress={() => onNavigate('/company-details')}
          activeOpacity={0.9}
        >
          <ArrowLeft color="#1f3f1a" size={20} />
          <View style={styles.companyDetailsTextWrap}>
            <Text style={styles.companyDetailsButtonText}>تفاصيل الشركة</Text>
            <Text style={styles.companyDetailsSubText}>تعرف اكثر عن سويفت شيفت لخدمات اللوجستية</Text>
          </View>
          <View style={styles.companyDetailsIconBox}>
            <Building2 color="#1f3f1a" size={20} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  brandName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 130 },
  
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
  companyDetailsButton: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyDetailsTextWrap: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  companyDetailsButtonText: {
    color: '#1f2a1f',
    fontSize: 24,
    fontWeight: '900',
  },
  companyDetailsSubText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  companyDetailsIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#9be76f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default HomeScreen;
