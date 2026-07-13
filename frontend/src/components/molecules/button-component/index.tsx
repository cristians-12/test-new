import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  style: ViewStyle | ViewStyle[];
  onPress: () => void;
  children?: React.ReactNode;
  title: string;
  titleStyle?: TextStyle | TextStyle[];

  loading?: boolean;
  disabled?: boolean;
  activityIndicatorColor?: string;

  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
}

export default function ButtonComponent({
  children,
  onPress,
  style,
  title,
  titleStyle,
  loading,
  disabled,
  activityIndicatorColor = 'white',
  icon,
  iconSize = 20,
  iconColor,
  iconPosition = 'left',
}: Props) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        style,
        {
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      {!loading ? (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{marginRight: 8}}
            />
          )}
          <Text style={[titleStyle, {textAlign: 'center'}]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{marginLeft: 8}}
            />
          )}
          {children}
        </>
      ) : (
        <ActivityIndicator color={activityIndicatorColor} />
      )}
    </TouchableOpacity>
  );
}