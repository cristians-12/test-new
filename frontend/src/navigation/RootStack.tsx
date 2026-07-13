import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { colors } from '../utils/colors';
import BottomTabs from './bottom-tabs';
import { CartScreen, ProductDetailScreen, SplashScreen } from '../screens';
import { styles } from './bottom-tabs/style';
import CustomBackButton from '../components/atoms/custom-back-button';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false, header: () => null }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabs}
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Detalle del producto',
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.titleStyle2,
          headerLeft: () => <CustomBackButton color="white" />,
        }} />

    </Stack.Navigator>
  );
}
