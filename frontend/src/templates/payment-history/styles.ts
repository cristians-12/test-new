import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../utils/fonts';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fontFamilies.satoshi.regular,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 15,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeApproved: {
    backgroundColor: '#d4edda',
  },
  statusBadgePending: {
    backgroundColor: '#fff3cd',
  },
  statusBadgeDeclined: {
    backgroundColor: '#f8d7da',
  },
  statusBadgeError: {
    backgroundColor: '#f8d7da',
  },
  statusBadgeVoided: {
    backgroundColor: '#e2e3e5',
  },
  statusText: {
    fontSize: 11,
    fontFamily: fontFamilies.satoshi.bold,
  },
  statusTextApproved: {
    color: '#155724',
  },
  statusTextPending: {
    color: '#856404',
  },
  statusTextDeclined: {
    color: '#721c24',
  },
  statusTextError: {
    color: '#721c24',
  },
  statusTextVoided: {
    color: '#383d41',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
  },
  cardValue: {
    fontSize: 13,
    fontFamily: fontFamilies.satoshi.medium,
    color: '#555',
  },
  cardAmount: {
    fontSize: 18,
    fontFamily: fontFamilies.satoshi.bold,
    color: colors.primary,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
    marginTop: 12,
  },
});
