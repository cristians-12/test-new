import { StyleSheet } from "react-native";
import { fontFamilies } from "../../../utils/fonts";

export const styles = StyleSheet.create({
    title: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.medium,
        textAlign: 'center'
    },
    image: {
        width: '100%',
        height: 200,
    },
    container: {
        flex: 1,
        margin: 5
    }
});