import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: colors.primary
    },
    title: {
        color: 'white',
        fontSize: 15
    },
    image:{
        width: '50%',
        height: '50%',
    }
});