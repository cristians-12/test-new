import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";
import { fontFamilies } from "../../utils/fonts";

export const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.primary,
    },
    titleStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17
    },
    titleStyle2: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fontFamilies.satoshi.medium
    }
});