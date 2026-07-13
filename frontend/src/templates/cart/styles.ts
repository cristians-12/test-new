import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../utils/fonts';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        paddingVertical: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: fontFamilies.satoshi.medium,
        color: '#999',
        marginTop: 15,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        paddingBottom: 30
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: fontFamilies.satoshi.medium,
        color: 'black',
    },
    totalPrice: {
        fontSize: 20,
        fontFamily: fontFamilies.satoshi.bold,
        color: colors.primary,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        marginBottom: 10,
    },
    clearText: {
        fontSize: 14,
        fontFamily: fontFamilies.satoshi.medium,
        color: colors.secondary,
    },
    buyButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buyText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: fontFamilies.satoshi.bold,
    },
});
