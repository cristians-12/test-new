import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { colors } from '../../../utils/colors';

interface Props {
    color?: string;
}

export default function TransparentLoading({ color }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color={color ?? colors.primary} />
        </SafeAreaView>
    );
}