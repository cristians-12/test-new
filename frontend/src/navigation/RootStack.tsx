import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { colors } from '../utils/colors';
import BottomTabs from './bottom-tabs';
import { CartScreen, SplashScreen } from '../screens';


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
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }} />
    </Stack.Navigator>
  );
}
