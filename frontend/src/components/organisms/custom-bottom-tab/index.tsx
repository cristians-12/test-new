import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, Text, ImageStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../utils/colors';
import { styles } from './styles';



export default function CustomBottomTab({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const label = (typeof options.tabBarLabel === 'string' ? options.tabBarLabel : null) ?? options.title ?? route.name;

        const onPress = () => {
          navigation.navigate(route.name as never);
        };

        let iconName: string = isFocused ? 'time' : 'time-outline';

        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}>
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? 'white' : colors.primary}
            />

            <Text
              style={[
                styles.tabName,
                { color: isFocused ? 'white' : colors.primary },
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}