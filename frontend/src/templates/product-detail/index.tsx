import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductById } from '../../store/sagas/products/reducer';
import { ImageComponent, TransparentLoading } from '../../components';
import { images } from '../../assets';
import { styles } from './styles';
import { Text, View } from 'react-native';
import { formatCurrencyPrice } from '../../utils';
import ButtonComponent from '../../components/molecules/button-component';
import { colors } from '../../utils/colors';

interface Props {
  id: string | number;
}

export default function ProductDetailTemplate({ id }: Props) {

  const dispatch = useAppDispatch();
  const { loading, selected } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(Number(id)));
  }, [id]);


  if (loading) {
    return <TransparentLoading />
  }

  const {
    name,
    image_url,
    category,
    description,
    stock,
    price,
    is_active,
    id: productId
  } = selected!;

  return (
    <>
      <ImageComponent
        source={image_url ?? images.product_placeholder}
        style={styles.image}
      />
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={[styles.boldText, { color: colors.secondary }]}>{category.name}</Text>
        <Text style={[styles.boldText, { fontSize: 20, marginTop: 10 }]}>${formatCurrencyPrice(price.toString())}</Text>
        <Text style={styles.stockText}>Stock disponible</Text>
        <Text style={styles.lightText}>Cantidad:
          <Text style={styles.mediumText}>{stock}</Text>
        </Text>

        <ButtonComponent
          title='Comprar ahora'
          onPress={() => console.log('Comprar ahora')}
          style={styles.button}
          titleStyle={styles.titlebtn}
        />
        <ButtonComponent
          title='Agregar al carrito'
          onPress={() => console.log('Agregar al carrito')}
          style={styles.buttonSecondary}
          titleStyle={styles.titlebtn}
          icon="cart-outline"
          iconColor="white"
        />
      </View>
    </>
  );
}