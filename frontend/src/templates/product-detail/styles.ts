import { StyleSheet } from "react-native";
import { fontFamilies } from "../../utils/fonts";

export const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    title: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.medium
    },
    container: {
        padding: 10
    }
});