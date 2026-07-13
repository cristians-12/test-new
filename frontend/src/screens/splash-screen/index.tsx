import React, { useEffect } from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { SplashAnimation } from '../../templates';
import { useAppDispatch } from '../../hooks';
import { fetchProducts } from '../../store/sagas/products/reducer';
import { fetchCategories } from '../../store/sagas/categories/reducer';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: SplashProps) {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    
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