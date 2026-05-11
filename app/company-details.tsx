import React from 'react';
import { StyleSheet,View,Text,Image,ScrollView,TouchableOpacity,StatusBar} from 'react-native';
import { ArrowRight,Bell,Star,Truck,Package,ShieldCheck,Award, MapPin,Mail,ArrowRightLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompanyDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Glassmorphism style */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowRight color="#0b3a00" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل الشركة</Text>
        </View>
        <TouchableOpacity>
          <Bell color="#a1a1aa" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1z0uO3W9XEsetSJVkibwSIz7lOeeotTljFRb5imAcpv7kYlShRR8xJO5nscPuyeLyquFQbdijBgHCVX4g91S8Pu1Nugr230pDdCgxvpTPRoagojitX7OvG1_VFHiolDJU7RLTxoXfVHAbqH-qB8NbnY00Eu5Oj_v50B8f-ZIy2p3mHVqPmPPvMSEcZttf2gikrhxb84u7Aypq_y4Xim-CmzXKOpAG6bRi_xR1RJ41Eo9V33Esl_b15HKXhA8KZ4sgq6mk43pJKUZw' }}
            style={styles.heroImage}
          />
          <View style={styles.heroGradient} />
        </View>

        {/* Company Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SS</Text>
          </View>

          <Text style={styles.companyName}>سويفت شيفت للخدمات اللوجستية</Text>
          <Text style={styles.companyStatus}>ناقل معتمد ومرخص</Text>

          <Text style={styles.companyDescription}>
            شركة رائدة في حلول النقل الذكي، نلتزم بتقديم تجربة نقل آمنة وسلسة لعملائنا في جميع أنحاء المملكة العربية السعودية مع ضمان أعلى معايير الجودة والسرعة.
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15k+</Text>
              <Text style={styles.statLabel}>عملية ناجحة</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <View style={styles.ratingRow}>
                <Text style={styles.statValue}>4.9</Text>
                <Star color="#eab308" size={14} fill="#eab308" />
              </View>
              <Text style={styles.statLabel}>تقييم العملاء</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>200+</Text>
              <Text style={styles.statLabel}>سائق محترف</Text>
            </View>
          </View>
        </View>

        {/* Fleet & Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأسطول والخدمات</Text>

          <View style={styles.fleetCard}>
            <View style={styles.fleetInfo}>
              <Text style={styles.fleetTitle}>أنواع المركبات</Text>
              <Text style={styles.fleetSubtitle}>شاحنات نقل ثقيل، فان نقل خفيف</Text>
            </View>
            <View style={styles.fleetIcons}>
              <View style={styles.iconCircle}><Truck color="#15803d" size={20} /></View>
              <View style={styles.iconCircle}><ArrowRightLeft color="#15803d" size={20} /></View>
            </View>
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceCard}>
              <Package color="#16a34a" size={24} style={{ marginBottom: 12 }} />
              <Text style={styles.serviceTitle}>تغليف احترافي</Text>
              <Text style={styles.serviceSubtitle}>حماية تامة لممتلكاتك</Text>
            </View>
            <View style={styles.serviceCard}>
              <ShieldCheck color="#16a34a" size={24} style={{ marginBottom: 12 }} />
              <Text style={styles.serviceTitle}>تأمين شامل</Text>
              <Text style={styles.serviceSubtitle}>ضمان التعويض الفوري</Text>
            </View>
          </View>
        </View>

        {/* Compliance Section */}
        <View style={styles.complianceCard}>
          <Text style={styles.complianceTitle}>الاعتمادات والموثوقية</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Award color="#fff" size={14} />
              <Text style={styles.badgeText}>ISO Certified</Text>
            </View>
            <View style={styles.badge}>
              <ShieldCheck color="#fff" size={14} />
              <Text style={styles.badgeText}>Licensed by MOT</Text>
            </View>
            <View style={styles.badge}>
              <Award color="#fff" size={14} />
              <Text style={styles.badgeText}>Insurance Guaranteed</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>تواصل معنا</Text>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}><MapPin color="#15803d" size={20} /></View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.contactLabel}>العنوان الرئيسي</Text>
              <Text style={styles.contactValue}>نابلس ، جامعة النجاح الوطنية</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}><Mail color="#15803d" size={20} /></View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.contactLabel}>الدعم الفني</Text>
              <Text style={styles.contactValue}>support@swiftshift.sa</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>تواصل مع الدعم</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#064e3b' },
  backButton: { padding: 4 },
  scrollContent: { paddingBottom: 100 },

  // Hero
  heroContainer: { height: 300, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // لنظام iOS يمكن استخدام LinearGradient من مكتبة expo-linear-gradient
  },

  // Info Card
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginTop: -64,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 50,
    elevation: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#aff592',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { fontSize: 30, fontWeight: '900', fontStyle: 'italic', color: '#0b3a00' },
  companyName: { fontSize: 24, fontWeight: '800', color: '#0b3a00', textAlign: 'center' },
  companyStatus: { color: '#41493c', fontWeight: '500', marginBottom: 24 },
  companyDescription: { color: '#41493c', textAlign: 'center', lineHeight: 22, fontSize: 14 },

  statsRow: {
    flexDirection: 'row',
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f5',
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f3f4f5' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#0b3a00' },
  statLabel: { fontSize: 10, color: '#71717a', fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  // Bento Sections
  section: { paddingHorizontal: 24, marginTop: 48 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0b3a00', marginBottom: 24, textAlign: 'right' },
  fleetCard: {
    backgroundColor: '#f3f4f5',
    padding: 24,
    borderRadius: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fleetInfo: { alignItems: 'flex-end' },
  fleetTitle: { fontWeight: 'bold', color: '#0b3a00', fontSize: 16 },
  fleetSubtitle: { fontSize: 12, color: '#41493c', marginTop: 4 },
  fleetIcons: { flexDirection: 'row', gap: 8 },
  iconCircle: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center' },

  serviceRow: { flexDirection: 'row', gap: 16 },
  serviceCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'flex-end', elevation: 2 },
  serviceTitle: { fontWeight: 'bold', fontSize: 14, color: '#0b3a00' },
  serviceSubtitle: { fontSize: 11, color: '#71717a', marginTop: 4 },

  // Compliance
  complianceCard: { backgroundColor: '#0b3a00', marginHorizontal: 24, marginTop: 48, borderRadius: 24, padding: 24 },
  complianceTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 24, textAlign: 'right' },
  badgeRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 12 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, gap: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Contact
  contactCard: { backgroundColor: '#e7e8e9', marginHorizontal: 24, marginTop: 48, borderRadius: 24, padding: 32 },
  contactItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16, marginBottom: 16 },
  contactIcon: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 12, color: '#71717a' },
  contactValue: { fontWeight: 'bold', fontSize: 14 },
  contactButton: {
    marginTop: 32,
    backgroundColor: '#0b3a00',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#0b3a00',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  contactButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, fontWeight: '600', color: '#a1a1aa', marginTop: 4 },
  navTextActive: { color: '#0b3a00' },
  navIndicator: { position: 'absolute', bottom: -5, width: 4, height: 4, backgroundColor: '#0b3a00', borderRadius: 2 },
});

export default CompanyDetailsScreen;