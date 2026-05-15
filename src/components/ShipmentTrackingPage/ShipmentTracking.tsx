import React, { useState, useEffect } from 'react';
import {StyleSheet, View,Text,Image,ScrollView,TouchableOpacity,StatusBar, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Star, MessageCircle, Check, Clock } from 'lucide-react-native';
import MovesBottomNavigation from '../MovesBottomNavigation';
import { db } from '../../api/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AppHeader from '@/src/components/AppHeader';
import { formatRemainingTime } from '@/src/utils/timeRemaining';

const TrackingScreen = ({ onBack, orderId }: any) => {
  const [driver, setDriver] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        if (!orderId) {
          setLoading(false);
          return;
        }
        
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder(orderData);
          const dId = orderData.driverId;
          
          if (dId) {
            const driverRef = doc(db, "drivers", dId);
            const driverSnap = await getDoc(driverRef);
            if (driverSnap.exists()) {
              setDriver({ id: driverSnap.id, ...driverSnap.data() });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching tracking data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverData();
  }, [orderId]);

  const remainingMs = order?.arrivalAt ? Math.max(new Date(order.arrivalAt).getTime() - now, 0) : 0;
  const remainingLabel = order?.arrivalAt ? formatRemainingTime(remainingMs) : 'غير محدد';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>الوقت المتبقي للوصول</Text>
          <Text style={[styles.timerValue, remainingMs <= 0 && styles.timerArrived]}>{remainingLabel}</Text>
        </View>
        
        {/* Map Placeholder Section */}
        <View style={styles.mapContainer}>
          {/* هنا نضع صورة ثابتة لتمثيل الخريطة كما في الكود الأصلي */}
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB32kXk_8_WUGYbUwqv7kk2-09VRuX7drWhj6hA44LnLFQKleYTNbfPAYKq57-gCVgJVy1geJrBx_xC3HTBFNUjHwc-UTa4FFc0MUpJztYJbGXP-vrY29dkW4usLuvVqEOtymnRcOiSBs-mUNKKKJGzkbmlcg9dMmDt6EOEQ1dtV1GfhdlODOaixqt7vsBtw7iDMeFtuOFB0jIR3U2YAqOOdO5sPLi9H5osFxISzbN82MFcL-mB5rYt8Cb4_GMORpsCuMx5fno47tJL' }} 
            style={styles.mapImage}
          />
          
          <View style={styles.locationBadge}>
            <MapPin color="#064e3b" size={14} />
            <Text style={styles.locationText}>الموقع الحالي: حي النخيل، الرياض</Text>
          </View>

          <TouchableOpacity style={styles.focusButton}>
            <Navigation color="#064e3b" size={20} fill="#064e3b" />
          </TouchableOpacity>
        </View>

        {/* Driver Info Card */}
        <View style={styles.driverCard}>
          {loading ? (
             <ActivityIndicator size="small" color="#064e3b" style={{ marginVertical: 20 }} />
          ) : driver ? (
          <View style={styles.driverHeader}>
            <View style={styles.driverAvatarContainer}>
              <Image 
                source={{ uri: driver.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRtjcDEQY624Pg2bAilLdz_EbCNdYQ-h_qDA_hyB6M3p6jhxp8UIYpSS61mY-McOztjhlDJqUsq_5wrzMa0BDW33P34GGpx7N9T3nLv7SkVUw2KD6m1tZLHjlstPvXCEOmccqvImQqVpHJFHvOcdaXlGowBvGF4TW-LifzjXAgWA_kTSR5G09iaJ7zx3cwAA_G3PE2UC_p6W7keToBV9fvFW5wBeFJj5H4BHdMMrPrHcyQD1vmgXKzcC7HoiaJNkXfWpyt4DDXGEhO' }} 
                style={styles.driverImage}
              />
              <View style={styles.verifiedBadge}>
                <Check color="#fff" size={10} />
              </View>
            </View>

            <View style={styles.driverInfoText}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{driver.rate || "4.9"}</Text>
                  <Star color="#064e3b" size={12} fill="#064e3b" />
                </View>
              </View>
              <Text style={styles.truckDetails}>{driver.type} • رقم اللوحة ح ل و ٢٢١</Text>
            </View>
          </View>
          ) : (
            <Text style={{ textAlign: 'center', color: '#666', marginVertical: 20 }}>جاري تحديد السائق...</Text>
          )}

          <TouchableOpacity style={styles.whatsappButton}>
            <MessageCircle color="#fff" size={20} />
            <Text style={styles.whatsappText}>تواصل عبر واتساب</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Clock color="#064e3b" size={16} />
            <Text style={styles.timelineTitle}>حالة الشحنة</Text>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.verticalLine} />

            <TimelineStep 
              title="تم استلام الطلب" 
              subtitle="تم تأكيد طلبك وجدولة الموعد بنجاح" 
              status="completed" 
            />
            <TimelineStep 
              title="السائق في الطريق" 
              subtitle="السائق الآن يتوجه إلى نقطة التحميل الخاصة بك" 
              status="active" 
            />
            <TimelineStep 
              title="الوصول لموقع التحميل" 
              subtitle="سيتم التحديث عند وصول الشاحنة للموقع" 
              status="upcoming" 
            />
            <TimelineStep 
              title="اكتملت عملية النقل" 
              subtitle="سيتم التحديث فور انتهاء المهمة" 
              status="upcoming" 
            />
          </View>
        </View>

      </ScrollView>

      <MovesBottomNavigation />

    </SafeAreaView>
  );
};

// مكون الخطوات الزمنية
interface TimelineStepProps {
  title: string;
  subtitle: string;
  status: 'active' | 'completed' | 'upcoming';
}

const TimelineStep = ({ title, subtitle, status }: TimelineStepProps) => {
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <View style={[styles.stepRow, !isCompleted && !isActive && { opacity: 0.4 }]}>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      <View style={[
        styles.dot, 
        isCompleted && styles.dotCompleted,
        isActive && styles.dotActive
      ]}>
        {isCompleted && <Check color="#fff" size={12} />}
        {isActive && <View style={styles.innerDot} />}
      </View>
    </View>
  );
};

// مكون عنصر التنقل السفلي
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#064e3b' },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  timerCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  timerLabel: { color: '#064e3b', fontSize: 14, fontWeight: '900' },
  timerValue: { color: '#064e3b', fontSize: 22, fontWeight: '900' },
  timerArrived: { color: '#15803d' },
  
  // Map Styles
  mapContainer: {
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%' },
  locationBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row-reverse',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    gap: 8,
  },
  locationText: { fontSize: 12, fontWeight: '700', color: '#064e3b' },
  focusButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
  },

  // Driver Card
  driverCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  driverHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 20 },
  driverAvatarContainer: { position: 'relative' },
  driverImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#ecfdf5' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#064e3b',
    padding: 2,
    borderRadius: 10,
  },
  driverInfoText: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  driverName: { fontSize: 18, fontWeight: '700', color: '#191c1d' },
  ratingBadge: { flexDirection: 'row-reverse', backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#064e3b' },
  truckDetails: { fontSize: 13, color: '#666', marginTop: 4 },
  whatsappButton: {
    backgroundColor: '#064e3b',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 50,
    gap: 10,
  },
  whatsappText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Timeline
  timelineCard: { backgroundColor: '#f3f4f5', borderRadius: 24, padding: 20 },
  timelineHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 25 },
  timelineTitle: { fontSize: 14, fontWeight: '700', color: '#064e3b' },
  timelineContainer: { position: 'relative', paddingRight: 30 },
  verticalLine: {
    position: 'absolute',
    right: 9,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#d1d5db',
    borderRadius: 1,
  },
  stepRow: { flexDirection: 'row-reverse', marginBottom: 35, alignItems: 'flex-start' },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    position: 'absolute',
    right: -30,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: { backgroundColor: '#064e3b' },
  dotActive: { backgroundColor: '#064e3b', borderWidth: 4, borderColor: '#ecfdf5' },
  innerDot: { width: 6, height: 6, backgroundColor: '#fff', borderRadius: 3 },
  stepContent: { flex: 1, alignItems: 'flex-end' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#064e3b' },
  stepSubtitle: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'right' },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30,
    paddingTop: 12,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  navItemActive: { backgroundColor: '#064e3b', borderRadius: 30, paddingVertical: 10, marginTop: -10, height: 65, elevation: 5 },
  navLabel: { fontSize: 11, marginTop: 4, color: '#9ca3af' },
  navLabelActive: { color: '#fff', fontWeight: '700' },
});

export default TrackingScreen;
