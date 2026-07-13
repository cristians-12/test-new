import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartTemplate } from '../../templates';

export default function CartScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CartTemplate />
        </SafeAreaView>
    );
}