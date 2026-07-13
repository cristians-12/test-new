import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../utils/colors';
import { useAppDispatch } from '../../../hooks';
import { fetchProducts } from '../../../store/sagas/products/reducer';

interface Props {
    search: string;
    setSearch: (value: string) => void;
}

export default function CustomSearchHeader({ search, setSearch }: Props) {
    const dispatch = useAppDispatch();

    const handleSearch = () => {
        dispatch(fetchProducts({ search: search.trim() || undefined }));
    };

    const handleClear = () => {
        setSearch('');
        dispatch(fetchProducts());
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontSize: 20 }]}>Bienvenido</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder='Buscar productos...'
                    placeholderTextColor={colors.darkGray}
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={handleClear}>
                        <Icon name="close-circle" size={18} color={colors.darkGray} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSearch}>
                    <Icon name="search" size={18} color={colors.darkGray} style={styles.inputIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}