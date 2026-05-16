import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  sectionHeaderTight: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#145300',
    textAlign: 'right',
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
  loadingIndicator: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  emptyTextWithMargin: {
    marginTop: 20,
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
    marginBottom: 15,
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
  orderTextGroup: {
    alignItems: 'flex-end',
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dropoffInfo: {
    alignItems: 'flex-start',
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
  timerBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  timerLabel: {
    color: '#145300',
    fontSize: 13,
    fontWeight: '900',
  },
  timerValue: {
    color: '#064e3b',
    fontSize: 18,
    fontWeight: '900',
  },
  timerArrived: {
    color: '#15803d',
  },
  cardFooter: {
    gap: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f5',
  },
  primaryActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#145300',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  detailsButton: {
    flex: 1,
    backgroundColor: '#e8f7e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#aff592',
  },
  detailsButtonText: {
    color: '#145300',
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
  disabledButton: {
    opacity: 0.6,
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
});

export default styles;
