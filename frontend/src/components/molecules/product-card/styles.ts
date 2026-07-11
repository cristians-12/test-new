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
        margin: 5
    },
    price: {
        color: 'black',
        fontSize: 18,
        fontFamily: fontFamilies.satoshi.bold
    }
});