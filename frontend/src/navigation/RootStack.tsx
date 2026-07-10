import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home';
import SplashScreen from '../screens/splash-screen';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../utils/colors';

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
        component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: colors.primary }
        }} />
    </Stack.Navigator>
  );
}
