import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { styles } from './styles';

interface Props {
    color?: string;
    size?: number;
}

export default function CustomBackButton({
    color = 'white',
    size = 28,
}: Props) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.icon}
        >
            <Entypo
                name="chevron-left"
                size={size}
                color={color}
            />
        </TouchableOpacity>
    );
}