import { StyleSheet } from 'react-native';
import { fontFamilies } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    info: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 14,
        fontFamily: fontFamilies.satoshi.medium,
        color: 'black',
    },
    price: {
        fontSize: 16,
        fontFamily: fontFamilies.satoshi.bold,
        color: colors.primary,
        marginTop: 4,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 10,
    },
    quantityButton: {
        backgroundColor: colors.primary,
        borderRadius: 50,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        fontSize: 16,
        fontFamily: fontFamilies.satoshi.medium,
        color: 'black',
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 6,
    },
});
