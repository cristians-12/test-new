export const PAYMENT_STATUS: Record<string, { icon: string; title: string; subtitle: string; display: string }> = {
  APPROVED: {
    icon: '✓',
    title: 'Pago aprobado',
    subtitle: 'Tu transacción se ha completado exitosamente.',
    display: 'Aprobado',
  },
  PENDING: {
    icon: '⏳',
    title: 'Pago pendiente',
    subtitle: 'Tu transacción está siendo procesada.',
    display: 'Pendiente',
  },
  DECLINED: {
    icon: '✕',
    title: 'Pago rechazado',
    subtitle: 'No se pudo completar la transacción.',
    display: 'Rechazado',
  },
  ERROR: {
    icon: '✕',
    title: 'Pago rechazado',
    subtitle: 'No se pudo completar la transacción.',
    display: 'Error',
  },
};

export const CARD_BRANDS: Record<string, { label: string }> = {
  visa: { label: 'VISA' },
  mastercard: { label: 'MasterCard' },
};
