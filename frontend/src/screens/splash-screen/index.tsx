import React, { useEffect } from 'react';
import { styles } from './styles';

import { SafeAreaView } from 'react-native-safe-area-context';
import SplashAnimation from '../../components/templates/splash-animation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export default function Splash({ navigation }: SplashProps) {

    return (
        <SafeAreaView edges={['left', 'right']} style={styles.container}>
            <SplashAnimation finishedAnimation={() => { }} />
        </SafeAreaView>
    );
}