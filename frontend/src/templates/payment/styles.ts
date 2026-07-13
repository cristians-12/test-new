import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../utils/fonts';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.medium,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamilies.satoshi.bold,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  cardPreview: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardPreviewInner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.bold,
    letterSpacing: 2,
  },
  cardBrandBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBrandBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fontFamilies.satoshi.bold,
    letterSpacing: 1,
  },
  cardBrandImage: {
    width: 50,
    height: 30,
  },
  cardPreviewNumber: {
    color: '#fff',
    fontSize: 20,
    fontFamily: fontFamilies.satoshi.medium,
    letterSpacing: 3,
    marginVertical: 16,
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: fontFamilies.satoshi.regular,
    letterSpacing: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: fontFamilies.satoshi.medium,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#000',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    fontFamily: fontFamilies.satoshi.regular,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamilies.satoshi.bold,
  },
  summaryContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  summaryScroll: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#000',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.medium,
    color: '#333',
  },
  summaryItemQty: {
    fontSize: 12,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
    marginTop: 2,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#000',
  },
  summaryTotalPrice: {
    fontSize: 20,
    fontFamily: fontFamilies.satoshi.bold,
    color: colors.primary,
  },
  cardInfoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  cardInfoLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
    marginTop: 8,
  },
  cardInfoValue: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.medium,
    color: '#333',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusSuccess: {
    backgroundColor: '#d4edda',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  statusError: {
    backgroundColor: '#f8d7da',
  },
  statusIcon: {
    fontSize: 36,
  },
  statusTitle: {
    fontSize: 22,
    fontFamily: fontFamilies.satoshi.bold,
    color: '#000',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  statusDetails: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusDetailLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.satoshi.regular,
    color: '#999',
    marginTop: 8,
  },
  statusDetailValue: {
    fontSize: 14,
    fontFamily: fontFamilies.satoshi.medium,
    color: '#333',
  },
});
