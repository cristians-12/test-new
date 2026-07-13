import { StyleSheet } from "react-native";
import { fontFamilies } from "../../../utils/fonts";
import { colors } from "../../../utils/colors";

export const styles = StyleSheet.create({
    title: {
        color: colors.primary,
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.medium,
        padding: 2
    },
    image: {
        width: '100%',
        height: 200,
    },
    container: {
        flex: 1,
        margin: 5,
        position: 'relative',
    },
    price: {
        color: 'black',
        fontSize: 18,
        fontFamily: fontFamilies.satoshi.bold
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginTop: 8,
        gap: 6,
        position: 'absolute',
        bottom: 50,
        right: 5

    },
    addButtonAdded: {
        backgroundColor: '#2ecc71',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: fontFamilies.satoshi.medium,
    },
});