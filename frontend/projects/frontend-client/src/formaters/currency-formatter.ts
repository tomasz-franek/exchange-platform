export class CurrencyFormatter {
  public static readonly formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  });

  public static formatCurrency(value: number): string {
    return this.formatter.format(value);
  }

  public static formatCurrencyNoSign(value: number): string {
    return this.formatCurrency(value < 0 ? -value : value);
  }
}
