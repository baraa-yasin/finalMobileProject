import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Bell, Truck, ChevronLeft, Package, Home, Inbox } from 'lucide-react-native';
import { db, auth } from '../../api/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import MovesMenuDrawer from '../MovesMenuDrawer';

const { width } = Dimensions.get('window');

const MyMovesScreen = ({ onNavigate }: any) => {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clearingPast, setClearingPast] = useState(false);

  const clearPastOrders = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    Alert.alert(
      'تفريغ النقلات السابقة',
      'هل أنت متأكد؟ سيتم حذف كل النقلات السابقة (المكتملة والملغاة) ولا يمكن التراجع.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تفريغ',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearingPast(true);
              const q = query(
                collection(db, 'orders'),
                where('userId', '==', userId),
                where('status', 'in', ['completed', 'cancelled'])
              );
              const snap = await getDocs(q);
              const batch = writeBatch(db);
              snap.docs.forEach((d) => batch.delete(d.ref));
              await batch.commit();
              setPastOrders([]);
            } catch (e) {
              console.error('Error clearing past orders:', e);
              Alert.alert('خطأ', 'تعذر تفريغ النقلات السابقة.');
            } finally {
              setClearingPast(false);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const userId = auth.currentUser?.uid;
          if (!userId) {
            setLoading(false);
            return;
          }
          
          const q = query(
            collection(db, "orders"), 
            where("userId", "==", userId)
          );
          const snap = await getDocs(q);
          const allOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          const active = allOrders.filter((o: any) => o.status === 'pending' || o.status === 'active');
          const past = allOrders.filter((o: any) => o.status === 'completed' || o.status === 'cancelled');
          
          // Sort by creation or scheduled time if available (descending)
          active.sort((a: any, b: any) => new Date(b.scheduledTime || 0).getTime() - new Date(a.scheduledTime || 0).getTime());
          past.sort((a: any, b: any) => new Date(b.scheduledTime || 0).getTime() - new Date(a.scheduledTime || 0).getTime());

          setActiveOrders(active);
          setPastOrders(past);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header / TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setMenuOpen(true)}>
          <Menu color="#0b3a00" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate && onNavigate('/')}>
          <Text style={styles.logo}>SwiftShift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell color="#0b3a00" size={24} />
        </TouchableOpacity>
      </View>

      <MovesMenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>نقلاتي</Text>
          <Text style={styles.subTitle}>إدارة ومتابعة طلبات النقل الخاصة بك</Text>
        </View>

        {/* Section: Current Moves */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeOrders.length} نشط</Text>
            </View>
            <Text style={styles.sectionTitle}>النقلات الحالية</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#145300" style={{ marginTop: 20 }} />
          ) : activeOrders.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>لا توجد نقلات حالية</Text>
          ) : (
            activeOrders.map((order) => {
              const orderDate = order.scheduledTime ? new Date(order.scheduledTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'غير محدد';
              
              return (
                <View key={order.id} style={[styles.activeCard, { marginBottom: 15 }]}>
                  <View style={styles.activeIndicator} />
                  
                  <View style={styles.cardHeader}>
                    <View style={styles.driverInfo}>
                      <View style={styles.iconContainer}>
                        <Truck color="#145300" size={24} fill="#aff592" />
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.orderId}>معرف الطلب #{order.id.slice(0,6).toUpperCase()}</Text>
                        <Text style={styles.statusText}>{order.status === 'pending' ? 'بانتظار الموافقة' : 'قيد التنفيذ'}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.dateLabel}>تاريخ النقل</Text>
                      <Text style={styles.dateValue}>{orderDate}</Text>
                    </View>
                  </View>

                  <View style={styles.pathContainer}>
                    <View style={styles.locationInfo}>
                      <Text style={styles.pathLabel}>من</Text>
                      <Text style={styles.locationName}>{order.pickup?.address || 'غير محدد'}</Text>
                    </View>
                    
                    <View style={styles.pathVisual}>
                      <View style={styles.dashLine} />
                      <ChevronLeft color="#145300" size={20} />
                      <View style={styles.dashLine} />
                    </View>

                    <View style={[styles.locationInfo, { alignItems: 'flex-start' }]}>
                      <Text style={styles.pathLabel}>إلى</Text>
                      <Text style={styles.locationName}>{order.dropoff?.address || 'غير محدد'}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.cancelOrderBtn} onPress={() => {
                      Alert.alert(
                        'إلغاء الطلب',
                        'هل أنت متأكد من إلغاء هذا الطلب؟',
                        [
                          { text: 'لا', style: 'cancel' },
                          {
                            text: 'نعم، إلغاء',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await updateDoc(doc(db, 'orders', order.id), { status: 'cancelled' });
                                setActiveOrders(prev => prev.filter(o => o.id !== order.id));
                                setPastOrders(prev => [{ ...order, status: 'cancelled' }, ...prev]);
                              } catch (err) {
                                Alert.alert('خطأ', 'حدث خطأ أثناء إلغاء الطلب.');
                              }
                            },
                          },
                        ]
                      );
                    }}>
                      <Text style={styles.cancelOrderBtnText}>إلغاء</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.trackButton} onPress={() => onNavigate && onNavigate(`/tracking?orderId=${order.id}`)}>
                      <Text style={styles.trackButtonText}>تتبع الشحنة</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Section: Past Moves */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
            <TouchableOpacity
              style={[styles.clearPastBtn, (pastOrders.length === 0 || clearingPast) && { opacity: 0.6 }]}
              onPress={clearPastOrders}
              disabled={pastOrders.length === 0 || clearingPast}
            >
              {clearingPast ? (
                <ActivityIndicator size="small" color="#dc2626" />
              ) : (
                <Text style={styles.clearPastBtnText}>تفريغ</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>النقلات السابقة</Text>
          </View>
          
          {!loading && pastOrders.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>لا توجد نقلات سابقة</Text>
          ) : (
            pastOrders.map((order) => {
              const orderDate = order.scheduledTime ? new Date(order.scheduledTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }) : 'غير محدد';
              const title = order.items && order.items.length > 0 ? order.items[0].name : 'نقل بضائع';
              
              // Extract city from address if possible
              const fromCity = order.pickup?.address ? order.pickup.address.split('،')[order.pickup.address.split('،').length - 1]?.trim() || order.pickup.address : 'موقع';
              const toCity = order.dropoff?.address ? order.dropoff.address.split('،')[order.dropoff.address.split('،').length - 1]?.trim() || order.dropoff.address : 'موقع';

              return (
                <PastMoveItem 
                  key={order.id}
                  title={`نقل ${title}`} 
                  details={`${orderDate} • من ${fromCity} إلى ${toCity}`} 
                  icon={<Package color="#9ca3af" size={22} />} 
                  status={order.status}
                  onPress={() => onNavigate && onNavigate(`/order-details?orderId=${order.id}`)}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// مكون فرعي للنقلات السابقة
interface PastMoveItemProps {
  title: string;
  details: string;
  icon: React.ReactNode;
  status?: string;
  onPress?: () => void;
}

const PastMoveItem = ({ title, details, icon, status, onPress }: PastMoveItemProps) => (
  <TouchableOpacity style={styles.pastCard} onPress={onPress} activeOpacity={0.85}>
    <ChevronLeft color="#bdc7db" size={20} />
    <View style={styles.pastCardContent}>
      <View style={styles.pastCardHeader}>
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>{status === 'cancelled' ? 'ملغاة' : 'مكتملة'}</Text>
        </View>
        <Text style={styles.pastCardTitle}>{title}</Text>
      </View>
      <Text style={styles.pastCardDetails}>{details}</Text>
    </View>
    <View style={styles.pastIconContainer}>
      {icon}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 64,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2, // لظل الأندرويد
    shadowColor: '#000', // لظل الآيفون
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'flex-end',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0b3a00',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#145300',
    textAlign: 'right'
  },
  badge: {
    backgroundColor: '#aff592',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#042100',
  },
  activeCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11, 58, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '100%',
    backgroundColor: '#145300',
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  driverInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    backgroundColor: 'rgba(175, 245, 146, 0.3)',
    borderRadius: 16,
    marginLeft: 12,
  },
  orderId: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
  },
  dateLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'left',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#191c1d',
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pathLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  pathVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dashLine: {
    width: 25,
    height: 1,
    backgroundColor: '#e1e3e4',
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f5',
  },
  avatarGroup: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#edeeef',
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#555',
  },
  trackButton: {
    backgroundColor: '#145300',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#145300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelOrderBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  cancelOrderBtnText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  clearPastBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearPastBtnText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 12,
  },
  pastCard: {
    backgroundColor: '#f3f4f5',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pastIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  pastCardContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pastCardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  pastCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191c1d',
  },
  completedBadge: {
    backgroundColor: '#e1e3e4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#555',
  },
  pastCardDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  iconButton: {
    width: 44,                  // مساحة كافية للمس (Touch Target)
    height: 44,                 // مساحة كافية للمس
    borderRadius: 12,           // حواف دائرية ناعمة لتناسب الـ Bento Style
    backgroundColor: '#ffffff', // خلفية بيضاء
    alignItems: 'center',       // ممركز الأيقونة أفقياً
    justifyContent: 'center',    // ممركز الأيقونة رأسياً
    
    // لإعطاء الزر عمق بسيط عند الضغط (اختياري)
    borderWidth: 1,
    borderColor: '#f0f0f0',

    // الظلال لنظام iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    // الظلال لنظام Android
    elevation: 2, 
  },
});

export default MyMovesScreen;