import { StyleSheet } from "react-native";
import { fontFamilies } from "../../../utils/fonts";

export const styles = StyleSheet.create({
    text: {
        fontFamily: fontFamilies.satoshi.regular,
        color: 'black',
        fontSize: 15
    },
    productContainer:{
        flex: 1,
        marginBottom: 20
    }
});