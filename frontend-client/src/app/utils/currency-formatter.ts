export class CurrencyFormatter {
  public static formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  });

  public static formatCurrency(value: number) {
    return this.formatter.format(value);
  }

  public static formatCurrencyNoSign(value: number) {
    return this.formatCurrency(value < 0 ? -value : value);
  }
}
