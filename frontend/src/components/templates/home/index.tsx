import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import CustomSearchHeader from '../../organisms/custom-search-header';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchProducts } from '../../../store/sagas/products/reducer';
import TransparentLoading from '../../molecules/transparent-loading';

export default function HomeTemplate() {

    const dispatch = useAppDispatch();
    const { loading, items } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, []);

    if (loading) {
        return <TransparentLoading />
    }

    console.log(items);

    return (
        <View>
            <CustomSearchHeader />
        </View>
    );
}