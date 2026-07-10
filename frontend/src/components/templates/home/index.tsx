import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import CustomSearchHeader from '../../organisms/custom-search-header';

export default function HomeTemplate() {
    return (
        <View>
            <CustomSearchHeader />
        </View>
    );
}