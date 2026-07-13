import React, { useEffect } from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { SplashAnimation } from '../../templates';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: SplashProps) {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 2000);
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <SplashAnimation />
    </SafeAreaView>
  );
}