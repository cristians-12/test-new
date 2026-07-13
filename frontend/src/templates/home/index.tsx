import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProducts } from '../../store/sagas/products/reducer';
import { fetchCategories } from '../../store/sagas/categories/reducer';
import { styles } from './styles';
import { CategoryPill, CustomSearchHeader, ProductCard, TransparentLoading } from '../../components';
import { fontFamilies } from '../../utils/fonts';
import { colors } from '../../utils/colors';

export default function HomeTemplate() {

    const dispatch = useAppDispatch();
    const { loading, items } = useAppSelector((state) => state.products);
    const { items: categories } = useAppSelector((state) => state.categories);
    const [search, setSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchProducts({ category_id: selectedCategoryId ?? undefined, search: search.trim() || undefined }));
        dispatch(fetchCategories());
        setTimeout(() => setRefreshing(false), 1000);
    }, [dispatch, selectedCategoryId, search]);

    const productItems = useMemo(() => {
        return items.filter((item) => item.is_active && item.stock > 0);
    }, [items]);

    const handleCategoryPress = (id: number) => {
        const next = selectedCategoryId === id ? null : id;
        setSelectedCategoryId(next);
        dispatch(fetchProducts({ category_id: next ?? undefined, search: search.trim() || undefined }));
    };

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
                <>
                    <CustomSearchHeader search={search} setSearch={setSearch} categoryId={selectedCategoryId} />
                    {categories.length > 0 && (
                        <View style={styles.categoriesContainer}>
                            <FlatList
                                data={categories}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => (
                                    <CategoryPill
                                        category={item}
                                        isSelected={selectedCategoryId === item.id}
                                        onPress={handleCategoryPress}
                                    />
                                )}
                            />
                        </View>
                    )}
                </>
            }
            ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: 40, fontFamily: fontFamilies.satoshi.medium, color: '#666' }}>
                    No se encontraron productos
                </Text>
            }
            style={styles.productContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                />
            }
        />
    );
}
