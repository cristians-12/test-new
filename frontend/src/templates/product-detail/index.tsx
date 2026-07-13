import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProductById } from '../../store/sagas/products/reducer';
import { TransparentLoading } from '../../components';

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

  return (
    <>

    </>
  );
}