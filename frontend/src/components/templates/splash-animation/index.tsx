import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './styles';


type SplashAnimationProps = {
    finishedAnimation: () => void
}

export default function SplashAnimation({
    finishedAnimation,
}: SplashAnimationProps) {
    return (
        <View style={styles.container}>
        </View>
    );
}