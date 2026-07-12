import { formatCurrency, formatCurrencyPrice } from '../formatPrice';

describe('formatCurrency', () => {
  it('should format a number with thousand separators', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000');
  });

  it('should format a small number without separators', () => {
    expect(formatCurrency(100)).toBe('100');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('0');
  });

  it('should format a number exactly at 1000 boundary', () => {
    expect(formatCurrency(1000)).toBe('1.000');
  });

  it('should format a number with 6 digits', () => {
    expect(formatCurrency(123456)).toBe('123.456');
  });

  it('should format a large number', () => {
    expect(formatCurrency(1234567890)).toBe('1.234.567.890');
  });

  it('should format a string number', () => {
    expect(formatCurrency('10000')).toBe('10.000');
  });

  it('should strip non-digit characters from string', () => {
    expect(formatCurrency('abc123def456')).toBe('123.456');
  });

  it('should handle string with only non-digit characters', () => {
    expect(formatCurrency('abc')).toBe('');
  });

  it('should handle string with dots already', () => {
    expect(formatCurrency('1.000')).toBe('1.000');
  });

  it('should handle negative number as string input', () => {
    expect(formatCurrency('-123')).toBe('123');
  });

  it('should handle string with spaces and letters', () => {
    expect(formatCurrency('  hello 12345  ')).toBe('12.345');
  });
});

describe('formatCurrencyPrice', () => {
  it('should format a number to Colombian locale string', () => {
    expect(formatCurrencyPrice('10000')).toBe('10.000');
  });

  it('should format zero', () => {
    expect(formatCurrencyPrice('0')).toBe('0');
  });

  it('should format a large number', () => {
    expect(formatCurrencyPrice('1000000')).toBe('1.000.000');
  });

  it('should format a small number', () => {
    expect(formatCurrencyPrice('100')).toBe('100');
  });

  it('should format number at 1000 boundary', () => {
    expect(formatCurrencyPrice('1000')).toBe('1.000');
  });

  it('should handle decimal values', () => {
    const result = formatCurrencyPrice('1234.56');
    expect(result).toMatch(/1[.,]234/);
  });

  it('should handle negative string', () => {
    const result = formatCurrencyPrice('-5000');
    expect(result).toContain('5.000');
  });
});
