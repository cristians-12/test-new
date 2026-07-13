import {
  detectCardType,
  luhnCheck,
  formatCardNumber,
  isValidEmail,
  isValidCVV,
  isValidExpiry,
  formatExpiry,
} from '../cardUtils';

describe('detectCardType', () => {
  it('should detect VISA card (starts with 4)', () => {
    expect(detectCardType('4111111111111')).toBe('visa');
    expect(detectCardType('4012888888888')).toBe('visa');
  });

  it('should detect MasterCard (starts with 51-55)', () => {
    expect(detectCardType('5111111111111')).toBe('mastercard');
    expect(detectCardType('5212345678901234')).toBe('mastercard');
    expect(detectCardType('5512345678901234')).toBe('mastercard');
  });

  it('should return unknown for other card numbers', () => {
    expect(detectCardType('6011111111111117')).toBe('unknown');
    expect(detectCardType('30000000000004')).toBe('unknown');
  });

  it('should handle empty string', () => {
    expect(detectCardType('')).toBe('unknown');
  });

  it('should handle card numbers with spaces', () => {
    expect(detectCardType('4111 1111 1111 1111')).toBe('visa');
    expect(detectCardType('5555 5555 5555 4444')).toBe('mastercard');
  });

  it('should handle 16-digit VISA', () => {
    expect(detectCardType('4111111111111111')).toBe('visa');
  });
});

describe('luhnCheck', () => {
  it('should return true for valid VISA test number', () => {
    expect(luhnCheck('4111111111111111')).toBe(true);
  });

  it('should return true for valid MasterCard test number', () => {
    expect(luhnCheck('5555555555554444')).toBe(true);
  });

  it('should return true for another valid MasterCard', () => {
    expect(luhnCheck('5105105105105100')).toBe(true);
  });

  it('should return false for invalid card number', () => {
    expect(luhnCheck('4111111111111112')).toBe(false);
  });

  it('should return true for all zeros (passes Luhn check)', () => {
    expect(luhnCheck('0000000000000000')).toBe(true);
  });

  it('should return true for valid number with hyphens', () => {
    expect(luhnCheck('4111-1111-1111-1111')).toBe(true);
  });

  it('should return true when number is given with spaces', () => {
    expect(luhnCheck('5555 5555 5555 4444')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(luhnCheck('')).toBe(false);
  });

  it('should return false for string with only letters', () => {
    expect(luhnCheck('abcd')).toBe(false);
  });

  it('should handle short numbers (13 digits)', () => {
    expect(luhnCheck('4222222222222')).toBe(true);
  });
});

describe('formatCardNumber', () => {
  it('should format 16 digits into 4 groups', () => {
    expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456');
  });

  it('should format 13 digits', () => {
    expect(formatCardNumber('1234567890123')).toBe('1234 5678 9012 3');
  });

  it('should format 19 digits', () => {
    expect(formatCardNumber('1234567890123456789')).toBe('1234 5678 9012 3456 789');
  });

  it('should strip non-digit characters', () => {
    expect(formatCardNumber('12-34-56-78')).toBe('1234 5678');
  });

  it('should return empty string for empty input', () => {
    expect(formatCardNumber('')).toBe('');
  });

  it('should handle input with only spaces', () => {
    expect(formatCardNumber('   ')).toBe('');
  });

  it('should handle input with special chars', () => {
    expect(formatCardNumber('12AB34CD56')).toBe('1234 56');
  });
});

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('demo@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
    expect(isValidEmail('test@sub.domain.com')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('missing@dotcom')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('spaces in@email.com')).toBe(false);
  });
});

describe('isValidCVV', () => {
  it('should return true for 3-digit CVV', () => {
    expect(isValidCVV('123')).toBe(true);
  });

  it('should return true for 4-digit CVV', () => {
    expect(isValidCVV('1234')).toBe(true);
  });

  it('should return false for 2-digit CVV', () => {
    expect(isValidCVV('12')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidCVV('')).toBe(false);
  });

  it('should return false for non-digit characters', () => {
    expect(isValidCVV('12a')).toBe(false);
  });
});

describe('isValidExpiry', () => {
  it('should return valid true for a future date', () => {
    const futureYear = String(new Date().getFullYear() + 1).slice(-2);
    const result = isValidExpiry('12' + futureYear);
    expect(result.valid).toBe(true);
    expect(result.month).toBe('12');
    expect(result.year).toBe(futureYear);
  });

  it('should return valid false for less than 4 digits', () => {
    const result = isValidExpiry('12');
    expect(result.valid).toBe(false);
    expect(result.month).toBe('');
    expect(result.year).toBe('');
  });

  it('should return valid false for invalid month 13', () => {
    const result = isValidExpiry('1330');
    expect(result.valid).toBe(false);
  });

  it('should return valid false for invalid month 00', () => {
    const result = isValidExpiry('0025');
    expect(result.valid).toBe(false);
  });

  it('should ignore non-numeric characters', () => {
    const futureYear = String(new Date().getFullYear() + 1).slice(-2);
    const result = isValidExpiry('12ab' + futureYear);
    expect(result.valid).toBe(true);
    expect(result.month).toBe('12');
  });
});

describe('formatExpiry', () => {
  it('should format MMYY into MM/YY', () => {
    const result = formatExpiry('1225');
    expect(result).toBe('12/25');
  });

  it('should not add slash for 1 digit', () => {
    expect(formatExpiry('1')).toBe('1');
  });

  it('should not add slash for 2 digits', () => {
    expect(formatExpiry('12')).toBe('12');
  });

  it('should strip non-digit characters', () => {
    const result = formatExpiry('1a2b3c');
    expect(result).toBe('12/3');
  });

  it('should only take first 4 digits', () => {
    const result = formatExpiry('121234');
    expect(result).toBe('12/12');
  });

  it('should return empty string for empty input', () => {
    expect(formatExpiry('')).toBe('');
  });
});
