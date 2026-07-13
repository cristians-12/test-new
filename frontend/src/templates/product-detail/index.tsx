import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductById } from '../../store/sagas/products/reducer';
import { ImageComponent, TransparentLoading } from '../../components';
import { images } from '../../assets';
import { styles } from './styles';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatCurrencyPrice } from '../../utils';
import ButtonComponent from '../../components/molecules/button-component';
import { colors } from '../../utils/colors';
import { addItem } from '../../store/sagas/cart/reducer';

interface Props {
  id: string | number;
}

export default function ProductDetailTemplate({ id }: Props) {

  const dispatch = useAppDispatch();
  const { loading, selected } = useAppSelector((state) => state.products);
  const isInCart = useAppSelector((s) =>
    s.cart.items.some((item) => item.id === String(selected?.id)),
  );

  useEffect(() => {
    dispatch(fetchProductById(Number(id)));
  }, [id]);


  if (loading || !selected) {
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
  } = selected;

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
        <Text style={styles.lightText}>Cantidad: {' '}
          <Text style={styles.mediumText}>{stock}</Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 6 }}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} />
          <Text style={styles.regularText}>Tu compra está protegida</Text>
        </View>

        <ButtonComponent
          title='Comprar ahora'
          onPress={() => console.log('Comprar ahora')}
          style={styles.button}
          titleStyle={styles.titlebtn}
        />
        <ButtonComponent
          title={isInCart ? 'Agregado al carrito' : 'Agregar al carrito'}
          onPress={() => dispatch(addItem({
            id: String(productId),
            name,
            price,
            image: image_url ?? undefined,
          }))}
          style={isInCart ? styles.buttonAdded : styles.buttonSecondary}
          titleStyle={styles.titlebtn}
          icon={isInCart ? 'checkmark-outline' : 'cart-outline'}
          iconColor="white"
          disabled={isInCart}
        />
      </View>
    </>
  );
}