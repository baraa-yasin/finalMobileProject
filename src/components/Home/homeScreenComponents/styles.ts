import { StyleSheet } from 'react-native';
import { COLORS } from '@/src/constants/Theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 130 },

  promoCard: {
    height: 220,
    backgroundColor: COLORS.cardGreen,
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
  },
  backgroundImage: { flex: 1, padding: 20, justifyContent: 'center' },
  promoBackgroundImage: { borderRadius: 25, opacity: 0.3 },
  promoOverlay: { alignItems: 'flex-end' },
  promoTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'right' },
  promoDesc: { color: '#fff', fontSize: 13, textAlign: 'right', marginTop: 10, lineHeight: 20, opacity: 0.9 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 15, gap: 5 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
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

export default styles;
