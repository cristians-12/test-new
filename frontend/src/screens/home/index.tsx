import { Text, View } from "react-native";
import HomeTemplate from "../../components/templates/home";
import { styles } from "./styles";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <HomeTemplate />
        </View>
    );
}