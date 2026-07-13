import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Category } from '../../../types';
import { styles } from './styles';

interface Props {
    category: Category;
    isSelected: boolean;
    onPress: (id: number) => void;
}

export default function CategoryPill({ category, isSelected, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onPress(category.id)}
        >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
}
