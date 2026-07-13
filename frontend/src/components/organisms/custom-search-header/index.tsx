import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../utils/colors';

export default function CustomSearchHeader() {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, { fontSize: 20 }]}>Bienvenido</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder='Buscar productos...'
                    placeholderTextColor={colors.darkGray}
                />
                <TouchableOpacity>
                    <Icon name="search" size={18} color={colors.darkGray} style={styles.inputIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}