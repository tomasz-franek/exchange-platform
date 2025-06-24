import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (
      value === null ||
      value === undefined ||
      value === Infinity ||
      value === -Infinity
    ) {
      return '';
    }
    const numValue = Math.abs(value);
    if (isNaN(numValue)) {
      return '';
    }
    const negativeString: string = value < 0 ? '-' : '';
    const valueString = numValue.toString().padStart(4, '0');

    const integerPart = valueString.slice(0, -4) || '0';
    const decimalPart = valueString.slice(-4, -2);

    return `${negativeString}${integerPart}.${decimalPart}`;
  }
}
