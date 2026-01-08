import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';

import { MeterGroup } from 'primeng/metergroup';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-currency-status',
  imports: [CardModule, MeterGroup, Button],
  standalone: true,
  templateUrl: './currency-status.html',
  styleUrl: './currency-status.scss',
})
export class CurrencyStatus implements OnChanges {
  @Input() pair: string = '';
  @Input() currency: string = '';
  @Input() buy: number | undefined = 0;
  @Input() sell: number | undefined = 0;
  valueArray = [
    {
      label: 'BUY',
      color: '#34d399',
      value: 0,
    },
    {
      label: 'SELL',
      color: '#fb2444',
      value: 0,
    },
  ];
  totalValue: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    this.valueArray[0].value = changes['buy']?.currentValue | 0;
    this.valueArray[1].value = changes['sell']?.currentValue | 0;
    this.totalValue = this.valueArray.reduce(
      (sum, currentValue) => sum + currentValue.value,
      0,
    );
    if (changes['pair']?.currentValue != undefined) {
      this.pair = changes['pair'].currentValue;
    } else {
      this.pair = '';
    }
    if (changes['currency']?.currentValue != undefined) {
      this.currency = changes['currency'].currentValue;
    } else {
      this.currency = '';
    }
  }
}
