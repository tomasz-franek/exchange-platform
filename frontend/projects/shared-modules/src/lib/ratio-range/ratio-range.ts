import {
  Component,
  OnChanges,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Card } from 'primeng/card';
import { MeterGroup, MeterItem } from 'primeng/metergroup';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-ratio-range',
  imports: [Card, MeterGroup, TranslatePipe],
  templateUrl: './ratio-range.html',
  styleUrl: './ratio-range.css',
})
export class RatioRange implements OnChanges {
  lowRatio: WritableSignal<number> = signal(0);
  highRatio: WritableSignal<number> = signal(0);
  currentRatio: WritableSignal<number> = signal(0);
  pair: WritableSignal<string> = signal('');
  public ranges: MeterItem[] = [
    { value: 0, label: '', color: '#60d712' },
    { value: 0, label: '', color: '#ec0137' },
  ] as MeterItem[];

  ngOnChanges(changes: SimpleChanges) {
    this.ranges[0].value = changes['currentRatio']?.currentValue || 0;
    this.ranges[1].value = changes['highRatio']?.currentValue || 0;
    this.lowRatio.set(changes['lowRatio']?.currentValue || 0);
    this.currentRatio.set(changes['currentRatio']?.currentValue || 0);
    this.highRatio.set(changes['highRatio']?.currentValue || 0);
    this.pair.set(changes['pair']?.currentValue || '');
  }
}
