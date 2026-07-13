import React, { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import CustomSearchHeader from '../../components/organisms/custom-search-header';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProducts } from '../../store/sagas/products/reducer';
import TransparentLoading from '../../components/molecules/transparent-loading';
import ProductCard from '../../components/molecules/product-card';
import type { Product } from '../../types';
import { styles } from './styles';

export default function HomeTemplate() {

    const dispatch = useAppDispatch();
    const { loading, items } = useAppSelector((state) => state.products);

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
            ListHeaderComponent={<CustomSearchHeader />}
            style={styles.productContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}