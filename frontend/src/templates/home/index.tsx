import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProducts } from '../../store/sagas/products/reducer';
import { styles } from './styles';
import { CustomSearchHeader, ProductCard, TransparentLoading } from '../../components';
import { fontFamilies } from '../../utils/fonts';

export default function HomeTemplate() {

    const dispatch = useAppDispatch();
    const { loading, items } = useAppSelector((state) => state.products);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, []);

    const productItems = useMemo(() => {
        return items.filter((item) => item.is_active && item.stock > 0);
    }, [items]);

    if (loading) {
        return <TransparentLoading />
    }

    return (
        <FlatList
            data={productItems}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ProductCard product={item} />}
            ListHeaderComponent={
                <CustomSearchHeader search={search} setSearch={setSearch} />
            }
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 40, fontFamily: fontFamilies.satoshi.medium, color: '#666' }}>
                    No se encontraron productos
                </Text>
            }
            style={styles.productContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}