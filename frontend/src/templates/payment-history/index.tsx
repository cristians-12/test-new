import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPaymentHistory, PaymentResponse } from '../../store/sagas/payment/reducer';
import { PAYMENT_STATUS } from '../../constants';
import { formatCurrencyPrice } from '../../utils';

export default function PaymentHistoryTemplate() {
  const dispatch = useAppDispatch();
  const { payments, historyLoading, error } = useAppSelector(
    (state) => state.payment,
  );

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

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.product_name || 'Producto'}
          </Text>
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

  if (historyLoading && payments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de pagos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando pagos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de pagos</Text>
        <Text style={styles.headerSubtitle}>
          {payments.length} {payments.length === 1 ? 'pago registrado' : 'pagos registrados'}
        </Text>
      </View>

      {error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>!</Text>
          <Text style={styles.emptyTitle}>Error al cargar pagos</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      ) : payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>No payments</Text>
          <Text style={styles.emptyTitle}>Sin pagos registrados</Text>
          <Text style={styles.emptySubtitle}>
            Cuando realices un pago, aparecerá aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
