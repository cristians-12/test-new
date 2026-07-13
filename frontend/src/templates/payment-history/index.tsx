import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { PaymentResponse } from '../../store/sagas/payment/reducer';
import { fetchPaymentHistory } from '../../store/sagas/payment/reducer';
import { PAYMENT_STATUS } from '../../constants';
import { formatCurrencyPrice } from '../../utils';

export default function PaymentHistoryTemplate() {
  const dispatch = useAppDispatch();
  const payments = useAppSelector((state) => state.payment.payments);
  const loading = useAppSelector((state) => state.payment.loading);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColors = (status: string) => {
    const map: Record<string, { badge: object; text: object }> = {
      APPROVED: { badge: styles.statusBadgeApproved, text: styles.statusTextApproved },
      PENDING: { badge: styles.statusBadgePending, text: styles.statusTextPending },
      DECLINED: { badge: styles.statusBadgeDeclined, text: styles.statusTextDeclined },
      ERROR: { badge: styles.statusBadgeError, text: styles.statusTextError },
      VOIDED: { badge: styles.statusBadgeVoided, text: styles.statusTextVoided },
    };
    return map[status] || map.ERROR;
  };

  const renderItem = ({ item }: { item: PaymentResponse }) => {
    const statusInfo = PAYMENT_STATUS[item.status] || PAYMENT_STATUS.ERROR;
    const colors = getStatusColors(item.status);
    const amount = (Number(item.amount_in_cents) / 100).toString();

    const productNames = item.product_name?.split(', ') || [];
    const productQuantities = item.product_quantity || [];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            {productNames.map((name, index) => (
              <Text key={index} style={styles.productName} numberOfLines={1}>
                {name}{productQuantities[index] ? ` x${productQuantities[index]}` : ''}
              </Text>
            ))}
            {productNames.length === 0 && (
              <Text style={styles.productName}>Producto</Text>
            )}
          </View>
          <View style={[styles.statusBadge, colors.badge]}>
            <Text style={[styles.statusText, colors.text]}>
              {statusInfo.display}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Referencia</Text>
          <Text style={styles.cardValue}>{item.reference}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Fecha</Text>
          <Text style={styles.cardValue}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{item.customer_email}</Text>
        </View>

        <Text style={styles.cardAmount}>
          ${formatCurrencyPrice(amount)} {item.currency}
        </Text>
      </View>
    );
  };

  if (payments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de pagos</Text>
          <Text style={styles.headerSubtitle}>0 pagos registrados</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sin pagos registrados</Text>
          <Text style={styles.emptySubtitle}>
            Cuando realices un pago, aparecerá aquí.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="small" color="#6C63FF" style={{ marginVertical: 10 }} />
      )}
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
