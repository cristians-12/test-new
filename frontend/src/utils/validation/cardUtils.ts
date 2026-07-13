export type CardType = 'visa' | 'mastercard' | 'unknown';

export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  return 'unknown';
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits)) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function isValidExpiry(value: string): {
  valid: boolean;
  month: string;
  year: string;
} {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length < 4) return { valid: false, month: '', year: '' };
  let month = cleaned.substring(0, 2);
  let year = cleaned.substring(2, 4);

  if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
    return { valid: false, month, year };
  }

  const currentYear = new Date().getFullYear() % 100;
  const inputYear = parseInt(year, 10);
  if (inputYear < currentYear) return { valid: false, month, year };

  if (inputYear === currentYear) {
    const currentMonth = new Date().getMonth() + 1;
    if (parseInt(month, 10) < currentMonth) return { valid: false, month, year };
  }

  return { valid: true, month, year };
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length > 2) {
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  }
  return digits;
}
