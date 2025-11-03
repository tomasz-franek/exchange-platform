import { CurrencyFormatter } from './currency-formatter';

describe('CurrencyFormatter', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(CurrencyFormatter.formatCurrency(1234.56)).toBe('€1,234.56');
    });

    it('should format zero correctly', () => {
      expect(CurrencyFormatter.formatCurrency(0)).toBe('€0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(CurrencyFormatter.formatCurrency(-1234.56)).toBe('-€1,234.56');
    });
  });

  describe('formatCurrencyNoSign', () => {
    it('should format positive numbers without a sign', () => {
      expect(CurrencyFormatter.formatCurrencyNoSign(1234.56)).toBe('€1,234.56');
    });

    it('should format zero correctly without a sign', () => {
      expect(CurrencyFormatter.formatCurrencyNoSign(0)).toBe('€0.00');
    });

    it('should format negative numbers as positive without a sign', () => {
      expect(CurrencyFormatter.formatCurrencyNoSign(-1234.56)).toBe(
        '€1,234.56',
      );
    });
  });
});
