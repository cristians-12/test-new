import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  source: string | ImageSourcePropType;
  style?: ImageStyle | ImageStyle[];
  resizeMode?: 'contain' | 'cover';
}

export default function ImageComponent({
  source,
  style,
  resizeMode = 'cover',
}: Props) {
  const imageSource = typeof source === 'string' ? {uri: source} : source;

  const stylesArray = Array.isArray(style) ? style : [style];
  const {imageStyles, containerStyles} = stylesArray.reduce(
    (acc, s) => {
      if (!s) return acc;
      const {
        elevation,
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        ...rest
      } = s as any;
      if (
        elevation ||
        shadowColor ||
        shadowOffset ||
        shadowOpacity ||
        shadowRadius
      ) {
        acc.containerStyles.push({
          elevation,
          shadowColor,
          shadowOffset,
          shadowOpacity,
          shadowRadius,
        });
      }
      acc.imageStyles.push(rest);
      return acc;
    },
    {imageStyles: [] as ImageStyle[], containerStyles: [] as ViewStyle[]},
  );

  return containerStyles.length > 0 ? (
    <View style={containerStyles}>
      <Image resizeMode={resizeMode} source={imageSource} style={imageStyles} />
    </View>
  ) : (
    <Image resizeMode={resizeMode} source={imageSource} style={imageStyles} />
  );
}