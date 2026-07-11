import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../../../types';
import { styles } from './styles';
import ImageComponent from '../image-component';
import { images } from '../../../assets';
import { formatCurrencyPrice } from '../../../utils/functions/formatters/formatPrice';

interface Props {
    product: Product;
}


export default function ProductCard({ product }: Props) {

    const { name, price, image_url, stock } = product;

    return (
        <TouchableOpacity style={styles.container}>
            <ImageComponent
                source={image_url ?? images.product_placeholder}
                style={styles.image}
            />
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.price}>${formatCurrencyPrice(price.toString())}</Text>
        </TouchableOpacity>
    );
}