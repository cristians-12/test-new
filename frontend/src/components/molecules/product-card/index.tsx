import React from 'react';
import { Text, View } from 'react-native';
import { Product } from '../../../types';
import { styles } from './styles';
import ImageComponent from '../image-component';
import { images } from '../../../assets';

interface Props {
    product: Product;
}


export default function ProductCard({ product }: Props) {

    const { name, price, image_url, stock } = product;

    return (
        <View style={styles.container}>
            <ImageComponent
                source={image_url ?? images.product_placeholder}
                style={styles.image}
            />
            <Text style={styles.title}>{name}</Text>
        </View>
    );
}