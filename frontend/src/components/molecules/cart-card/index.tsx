import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CartItem } from '../../../store/sagas/cart/reducer';
import { useAppDispatch } from '../../../hooks';
import { removeItem, updateQuantity } from '../../../store/sagas/cart/reducer';
import { formatCurrencyPrice } from '../../../utils';
import { styles } from './styles';
import ImageComponent from '../image-component';
import { images } from '../../../assets';

interface Props {
    item: CartItem;
}

export default function CartCard({ item }: Props) {
    const dispatch = useAppDispatch();

    const handleIncrease = () => {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
    };

    const handleDecrease = () => {
        if (item.quantity <= 1) {
            dispatch(removeItem(item.id));
        } else {
            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
        }
    };

    const handleRemove = () => {
        dispatch(removeItem(item.id));
    };

    return (
        <View style={styles.container}>
            <ImageComponent
                source={item.image ?? images.product_placeholder}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>${formatCurrencyPrice(item.price.toString())}</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                        <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                        <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            </TouchableOpacity>
        </View>
    );
}
