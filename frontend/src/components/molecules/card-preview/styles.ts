import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
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
});
