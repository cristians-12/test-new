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

        const handlerCase = (routeName: string) => {
          switch (routeName) {
            case 'HomeTab':
              iconName = isFocused ? 'home' : 'home-outline';
              break;
            case 'CartTab':
              iconName = isFocused ? 'cart' : 'cart-outline';
              break;
            default:
              iconName = isFocused ? 'home' : 'home-outline';
              break;
          }
        };

        let iconName: string = isFocused ? 'home' : 'home-outline';

        handlerCase(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}>
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? colors.secondary : 'white'}
            />

            <Text
              style={[
                styles.tabName,
                { color: isFocused ? colors.secondary : 'white' },
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}