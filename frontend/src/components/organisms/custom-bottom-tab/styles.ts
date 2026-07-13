import { StyleSheet } from 'react-native';
import { colors } from '../../../utils/colors';
import { fontFamilies } from '../../../utils/fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-around',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    marginTop: -20,
    backgroundColor: colors.primary,
  },
  tabName: {
    color: 'white',
    fontSize: 12,
    fontFamily: fontFamilies.satoshi.light
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fontFamilies.satoshi.bold,
  },
  profileImageContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  profileImageFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});