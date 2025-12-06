import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MeterGroup } from 'primeng/metergroup';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-currency-status',
  imports: [CardModule, CommonModule, MeterGroup, Button],
  standalone: true,
  templateUrl: './currency-status.html',
  styleUrl: './currency-status.scss',
})
export class CurrencyStatus implements OnChanges {
  @Input() pair: string = '';
  @Input() currency: string = '';
  @Input() buy: number = 0;
  @Input() sell: number = 0;
  protected valueArray = [
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
  protected totalValue: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    this.valueArray[0].value = changes['buy'].currentValue;
    this.valueArray[1].value = changes['sell'].currentValue;
    this.totalValue = this.valueArray.reduce(
      (sum, currentValue) => sum + currentValue.value,
      0,
    );
    this.pair = changes['pair'].currentValue;
    this.currency = changes['currency'].currentValue;
  }
}
