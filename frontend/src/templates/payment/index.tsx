import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

import { PAYMENT_STATUS, CARD_BRANDS } from '../../constants';
import { detectCardType, formatCardNumber, formatExpiry, isValidCVV, isValidEmail, isValidExpiry, luhnCheck } from '../../utils/validation/cardUtils';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { StackNavigation } from '../../types/navigation';
import { processPayment, clearPayment } from '../../store/sagas/payment/reducer';
import { clearCart } from '../../store/sagas/cart/reducer';
import ButtonComponent from '../../components/molecules/button-component';
import { formatCurrencyPrice } from '../../utils';


export default function PaymentTemplate() {

    const navigation = useNavigation<StackNavigation>();
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);
    const { loading, error, currentPayment } = useAppSelector(
        (state) => state.payment,
    );

    const handleGoHome = () => {
        dispatch(clearPayment());
        dispatch(clearCart());
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const [step, setStep] = useState<'form' | 'summary' | 'status'>('form');

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [email, setEmail] = useState('');

    const [cardNumberError, setCardNumberError] = useState('');
    const [cardHolderError, setCardHolderError] = useState('');
    const [expiryError, setExpiryError] = useState('');
    const [cvvError, setCvvError] = useState('');
    const [emailError, setEmailError] = useState('');

    const cardType = detectCardType(cardNumber);

    const validateStep1 = useCallback((): boolean => {
        let valid = true;

        const cleaned = cardNumber.replace(/\s/g, '');
        if (!cleaned) {
            setCardNumberError('Número de tarjeta requerido');
            valid = false;
        } else if (cleaned.length < 13 || cleaned.length > 19) {
            setCardNumberError('Longitud inválida');
            valid = false;
        } else if (!luhnCheck(cleaned)) {
            setCardNumberError('Número de tarjeta inválido');
            valid = false;
        } else {
            setCardNumberError('');
        }

        if (!cardHolder.trim()) {
            setCardHolderError('Titular requerido');
            valid = false;
        } else if (cardHolder.trim().length < 5) {
            setCardHolderError('El titular debe tener al menos 5 caracteres');
            valid = false;
        } else {
            setCardHolderError('');
        }

        if (!expiry) {
            setExpiryError('Fecha de expiración requerida');
            valid = false;
        } else {
            const result = isValidExpiry(expiry);
            if (!result.valid) {
                setExpiryError('Fecha inválida o vencida');
                valid = false;
            } else {
                setExpiryError('');
            }
        }

        if (!cvv) {
            setCvvError('CVV requerido');
            valid = false;
        } else if (!isValidCVV(cvv)) {
            setCvvError('CVV debe tener 3 o 4 dígitos');
            valid = false;
        } else {
            setCvvError('');
        }

        if (!email.trim()) {
            setEmailError('Email requerido');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Email inválido');
            valid = false;
        } else {
            setEmailError('');
        }

        return valid;
    }, [cardNumber, cardHolder, expiry, cvv, email]);

    const handleContinue = () => {
        if (validateStep1()) {
            setStep('summary');
        }
    };

    const maskedCardNumber = cardNumber
        ? `**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}`
        : '';

    const expResult = isValidExpiry(expiry);

    const handlePay = () => {
        const cleaned = cardNumber.replace(/\s/g, '');
        dispatch(
            processPayment({
                items: items.map((item) => ({ product_id: Number(item.id), quantity: item.quantity })),
                customer_email: email,
                card_number: cleaned,
                cvv,
                exp_month: expResult.month,
                exp_year: '20' + expResult.year,
                card_holder: cardHolder,
            }),
        );
    };

    React.useEffect(() => {
        if (currentPayment) {
            setStep('status');
            globalThis.toastRef?.show('Pago procesado exitosamente', {
                type: 'success',
            });
        }
    }, [currentPayment]);

    React.useEffect(() => {
        if (error) {
            setStep('form');
            globalThis.toastRef?.show(error, { type: 'danger' });
        }
    }, [error]);

    const handleBack = () => {
        if (step === 'summary') {
            setStep('form');
        } else if (step === 'status') {
            dispatch(clearPayment());
            setStep('form');
        }
    };

    const cardBrandImage =
        cardType !== 'unknown' ? CARD_BRANDS[cardType]?.label : null;
    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backText}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {step === 'form'
                        ? 'Información de pago'
                        : step === 'summary'
                            ? 'Resumen de pago'
                            : 'Estado de transacción'}
                </Text>
                <View style={styles.backButton} />
            </View>

            {step === 'form' && (
                <ScrollView
                    style={styles.scrollContent}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.cardPreview}>
                        <View style={styles.cardPreviewInner}>
                            <View style={styles.cardBrandRow}>
                                <Text style={styles.cardTypeLabel}>
                                    {cardType !== 'unknown'
                                        ? CARD_BRANDS[cardType]?.label
                                        : 'TARJETA'}
                                </Text>
                                {cardBrandImage && (
                                    <View style={styles.cardBrandBadge}>
                                        <Text style={styles.cardBrandBadgeText}>
                                            {cardBrandImage}
                                        </Text>
                                    </View>
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

                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={[styles.input, emailError ? styles.inputError : null]}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}

                    <Text style={styles.label}>Número de tarjeta</Text>
                    <TextInput
                        style={[styles.input, cardNumberError ? styles.inputError : null]}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#999"
                        value={cardNumber}
                        onChangeText={(text) => {
                            setCardNumber(formatCardNumber(text));
                            setCardNumberError('');
                        }}
                        keyboardType="number-pad"
                        maxLength={19}
                    />
                    {cardNumberError ? (
                        <Text style={styles.errorText}>{cardNumberError}</Text>
                    ) : null}

                    <Text style={styles.label}>Titular de la tarjeta</Text>
                    <TextInput
                        style={[styles.input, cardHolderError ? styles.inputError : null]}
                        placeholder="Nombre del titular"
                        placeholderTextColor="#999"
                        value={cardHolder}
                        onChangeText={(text) => {
                            setCardHolder(text);
                            setCardHolderError('');
                        }}
                        autoCapitalize="words"
                    />
                    {cardHolderError ? (
                        <Text style={styles.errorText}>{cardHolderError}</Text>
                    ) : null}

                    <View style={styles.row}>
                        <View style={styles.halfField}>
                            <Text style={styles.label}>Vencimiento</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    expiryError ? styles.inputError : null,
                                ]}
                                placeholder="MM/AA"
                                placeholderTextColor="#999"
                                value={expiry}
                                onChangeText={(text) => {
                                    setExpiry(formatExpiry(text));
                                    setExpiryError('');
                                }}
                                keyboardType="number-pad"
                                maxLength={5}
                            />
                            {expiryError ? (
                                <Text style={styles.errorText}>{expiryError}</Text>
                            ) : null}
                        </View>
                        <View style={styles.halfField}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={[styles.input, cvvError ? styles.inputError : null]}
                                placeholder="123"
                                placeholderTextColor="#999"
                                value={cvv}
                                onChangeText={(text) => {
                                    setCvv(text.replace(/\D/g, ''));
                                    setCvvError('');
                                }}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                            {cvvError ? (
                                <Text style={styles.errorText}>{cvvError}</Text>
                            ) : null}
                        </View>
                    </View>

                    <ButtonComponent
                        title="Continuar"
                        onPress={handleContinue}
                        style={styles.primaryButton}
                        titleStyle={styles.primaryButtonText}
                    />
                </ScrollView>
            )}

            {step === 'summary' && (
                <View style={styles.summaryContainer}>
                    <ScrollView style={styles.summaryScroll}>
                        <Text style={styles.summaryTitle}>Resumen de compra</Text>

                        {items.map((item) => (
                            <View key={item.id} style={styles.summaryItem}>
                                <View style={styles.summaryItemInfo}>
                                    <Text style={styles.summaryItemName}>{item.name}</Text>
                                    <Text style={styles.summaryItemQty}>
                                        x{item.quantity}
                                    </Text>
                                </View>
                                <Text style={styles.summaryItemPrice}>
                                    ${formatCurrencyPrice(
                                        (item.price * item.quantity).toString(),
                                    )}
                                </Text>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={styles.summaryTotalRow}>
                            <Text style={styles.summaryTotalLabel}>Total</Text>
                            <Text style={styles.summaryTotalPrice}>
                                ${formatCurrencyPrice(total.toString())}
                            </Text>
                        </View>

                        <View style={styles.cardInfoBox}>
                            <Text style={styles.cardInfoLabel}>Tarjeta</Text>
                            <Text style={styles.cardInfoValue}>
                                {cardType !== 'unknown'
                                    ? CARD_BRANDS[cardType]?.label
                                    : 'Tarjeta'}{' '}
                                {maskedCardNumber}
                            </Text>
                            <Text style={styles.cardInfoLabel}>Titular</Text>
                            <Text style={styles.cardInfoValue}>{cardHolder}</Text>
                            <Text style={styles.cardInfoLabel}>Email</Text>
                            <Text style={styles.cardInfoValue}>{email}</Text>
                        </View>
                    </ScrollView>

                    <ButtonComponent
                        title={loading ? 'Procesando...' : 'Pagar ahora'}
                        onPress={handlePay}
                        style={styles.primaryButton}
                        titleStyle={styles.primaryButtonText}
                        loading={loading}
                        disabled={loading}
                    />
                </View>
            )}

            {step === 'status' && currentPayment && (() => {
                const info = PAYMENT_STATUS[currentPayment.status] || PAYMENT_STATUS.ERROR;
                const isSuccess = currentPayment.status === 'APPROVED';
                const isPending = currentPayment.status === 'PENDING';
                return (
                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusIconContainer,
                                isSuccess ? styles.statusSuccess : isPending ? styles.statusPending : styles.statusError,
                            ]}>
                            <Text style={styles.statusIcon}>{info.icon}</Text>
                        </View>
                        <Text style={styles.statusTitle}>{info.title}</Text>
                        <Text style={styles.statusSubtitle}>{info.subtitle}</Text>

                        <View style={styles.statusDetails}>
                            <Text style={styles.statusDetailLabel}>Referencia</Text>
                            <Text style={styles.statusDetailValue}>{currentPayment.reference}</Text>
                            <Text style={styles.statusDetailLabel}>Monto</Text>
                            <Text style={styles.statusDetailValue}>
                                ${formatCurrencyPrice(String(currentPayment.amount_in_cents / 100))} {currentPayment.currency}
                            </Text>
                            <Text style={styles.statusDetailLabel}>Estado</Text>
                            <Text style={styles.statusDetailValue}>{info.display}</Text>
                        </View>

                        <ButtonComponent
                            title="Volver al inicio"
                            onPress={handleGoHome}
                            style={styles.primaryButton}
                            titleStyle={styles.primaryButtonText}
                        />
                    </View>
                );
            })()}
        </>
    );
}