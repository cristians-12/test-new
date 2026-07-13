import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductById } from '../../store/sagas/products/reducer';
import { ImageComponent, TransparentLoading } from '../../components';
import { images } from '../../assets';
import { styles } from './styles';
import { Text, View } from 'react-native';

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

      </View>
    </>
  );
}