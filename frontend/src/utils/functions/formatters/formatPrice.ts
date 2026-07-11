export const formatCurrency = (value: string | number) => {
    const numberString = value.toString().replace(/\D/g, '');
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseNumber = (text: string) => {
    return Number(text.replace(/\./g, '')) || 0;
};

export const formatCurrencyPrice = (value: string) => {
    return Number(value).toLocaleString('es-CO');
};