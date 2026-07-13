import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductDetailTemplate } from '../../templates';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {

    const route = useRoute<ProductDetailRouteProp>();
    const { id } = route.params;

    return (
        <SafeAreaView>
            <ProductDetailTemplate id={id} />
        </SafeAreaView>
    );
}