import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import RootStack from '../../navigation/RootStack';
import { navigationRef } from '../../navigation/navigationRef';

export default function AppContent() {
    return (
        <NavigationContainer ref={navigationRef} theme={DefaultTheme}>
            <RootStack />
        </NavigationContainer>
    );
}