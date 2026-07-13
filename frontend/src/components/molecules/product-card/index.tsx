import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Product } from '../../../types';
import { styles } from './styles';
import ImageComponent from '../image-component';
import { images } from '../../../assets';
import { formatCurrencyPrice } from '../../../utils';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { addItem } from '../../../store/sagas/cart/reducer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';

interface Props {
    product: Product;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProductCard({ product }: Props) {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<Nav>();

    const { id, name, price, image_url, stock } = product;

    const isInCart = useAppSelector((s) =>
        s.cart.items.some((item) => item.id === String(id)),
    );

    const handleAddToCart = () => {
        if (isInCart) return;
        dispatch(addItem({
            id: String(id),
            name,
            price,
            image: image_url ?? undefined
        }));
    };

    const navigateToProductDetail = () => {
        navigation.navigate('ProductDetail', { id });
    };

    return (
        <TouchableOpacity onPress={navigateToProductDetail} style={styles.container}>
            <ImageComponent
                source={image_url ?? images.product_placeholder}
                style={styles.image}
            />
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.price}>${formatCurrencyPrice(price.toString())}</Text>
            {stock > 0 && (
                <TouchableOpacity
                    style={[styles.addButton, isInCart && styles.addButtonAdded]}
                    onPress={handleAddToCart}
                    disabled={isInCart}
                >
                    <Ionicons
                        name={isInCart ? 'checkmark-circle-outline' : 'cart-outline'}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}