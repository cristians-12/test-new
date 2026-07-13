import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearCart } from '../../store/sagas/cart/reducer';
import CartCard from '../../components/molecules/cart-card';
import { styles } from './styles';
import { fontFamilies } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { formatCurrencyPrice } from '../../utils';

export default function CartTemplate() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleClear = () => {
        dispatch(clearCart());
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CartCard item={item} />}
                contentContainerStyle={styles.list}
            />
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>${formatCurrencyPrice(total.toString())}</Text>
                </View>
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                    <Ionicons name="trash-outline" size={18} color={colors.secondary} />
                    <Text style={styles.clearText}>Vaciar carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyText}>Comprar ahora</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
