import { StyleSheet } from "react-native";
import { fontFamilies } from "../../utils/fonts";
import { colors } from "../../utils/colors";

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
    },
    stockText: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.bold
    },
    lightText: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.light
    },
    mediumText: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.medium
    },
    boldText: {
        color: 'black',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.bold
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    titlebtn:{
        color: 'white',
        fontSize: 15,
        fontFamily: fontFamilies.satoshi.medium
    }
});