import React from 'react';
import { View, Text } from 'react-native';
import { ImageComponent } from '../../molecules';
import { CARD_BRANDS } from '../../../constants';
import { detectCardType } from '../../../utils/validation/cardUtils';
import { images } from '../../../assets';
import { styles } from './styles';

interface Props {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
}

const CARD_BRAND_IMAGES: Record<string, any> = {
  visa: images.visa_logo,
  mastercard: images.mastercard_logo,
};

export default function CardPreview({ cardNumber, cardHolder, expiry }: Props) {
  const cardType = detectCardType(cardNumber);

  return (
    <View style={styles.cardPreview}>
      <View style={styles.cardPreviewInner}>
        <View style={styles.cardBrandRow}>
          <Text style={styles.cardTypeLabel}>
            {cardType !== 'unknown' ? CARD_BRANDS[cardType]?.label : 'TARJETA'}
          </Text>
          {CARD_BRAND_IMAGES[cardType] && (
            <ImageComponent
              source={CARD_BRAND_IMAGES[cardType]}
              resizeMode="contain"
              style={{ width: 40, height: 26 }}
            />
          )}
        </View>
        <Text style={styles.cardPreviewNumber}>
          {cardNumber || '**** **** **** ****'}
        </Text>
        <View style={styles.cardPreviewFooter}>
          <Text style={styles.cardPreviewLabel}>
            {cardHolder || 'TITULAR'}
          </Text>
          <Text style={styles.cardPreviewLabel}>
            {expiry || 'MM/AA'}
          </Text>
        </View>
      </View>
    </View>
  );
}
