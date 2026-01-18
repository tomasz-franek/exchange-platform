import {
  Component,
  computed,
  OnChanges,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
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
  public pair: WritableSignal<string> = signal('');
  public currency: WritableSignal<string> = signal('');
  public buy: WritableSignal<number> = signal(0);
  public sell: WritableSignal<number> = signal(0);
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
  labelBuy = computed(
    () => `BUY ${this.valueArray[0].value} ${this.currency()}`,
  );
  labelSell = computed(
    () => `SELL ${this.valueArray[1].value} ${this.currency()}`,
  );
  totalValue: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    this.valueArray[0].value = changes['buy']?.currentValue | 0;
    this.valueArray[1].value = changes['sell']?.currentValue | 0;
    this.totalValue = this.valueArray.reduce(
      (sum, currentValue) => sum + currentValue.value,
      0,
    );
    if (changes['pair']?.currentValue != undefined) {
      this.pair.set(changes['pair'].currentValue);
    } else {
      this.pair.set('');
    }
    if (changes['currency']?.currentValue != undefined) {
      this.currency.set(changes['currency'].currentValue);
    } else {
      this.currency.set('');
    }
  }
}
