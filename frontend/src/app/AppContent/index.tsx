import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-notifications';
import RootStack from '../../navigation/RootStack';
import { navigationRef } from '../../navigation/navigationRef';
import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fonts';
import { usePayment } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../types/navigation';

function PaymentListener() {
    const navigation = useNavigation<StackNavigation>();
    usePayment({
        onApproved: () => {
            setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            }, 1500);
        },
    });
    return null;
}

export default function AppContent() {
    return (
        <NavigationContainer ref={navigationRef} theme={DefaultTheme}>
            <PaymentListener />
            <RootStack />
            <Toast
                ref={(ref) => {
                    globalThis.toastRef = ref;
                }}
                placement="top"
                duration={3000}
                animationType="slide-in"
                textStyle={{
                    fontFamily: fontFamilies.satoshi.medium,
                    fontSize: 14,
                }}
                successColor={colors.primary}
                dangerColor="#e74c3c"
            />
        </NavigationContainer>
    );
}
