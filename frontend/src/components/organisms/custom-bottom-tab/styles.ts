import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-around',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -20,
  },
  tabName: {
    color: 'white',
    fontSize: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});