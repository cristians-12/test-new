import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";
import { fontFamilies } from "../../../utils/fonts";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        padding: 10,
    },
    text: {
        color: 'white',
        fontFamily: fontFamilies.satoshi.medium
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        padding: 5,
        fontFamily: fontFamilies.satoshi.light,
    }
});