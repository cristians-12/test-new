import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    pillSelected: {
        backgroundColor: colors.primary,
    },
    label: {
        fontFamily: fontFamilies.satoshi.medium,
        fontSize: 13,
        color: colors.darkGray,
    },
    labelSelected: {
        color: '#fff',
    },
});
