import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './styles';
import ImageComponent from '../../molecules/image-component';
import { images } from '../../../assets';




export default function SplashAnimation() {
    return (
        <View style={styles.container}>
            <ImageComponent
                source={images.logo}
                style={styles.image}
                resizeMode='contain'
            />
        </View>
    );
}