import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Card} from 'primeng/card';
import {MeterGroup, MeterItem} from 'primeng/metergroup';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'lib-ratio-range',
  imports: [
    Card,
    MeterGroup,
    TranslatePipe
  ],
  templateUrl: './ratio-range.html',
  styleUrl: './ratio-range.css',
})
export class RatioRange implements OnChanges {
  @Input() lowRatio: number = 0;
  @Input() highRatio: number = 0;
  @Input() currentRatio: number = 0;
  @Input() pair: string = '';
  public ranges: MeterItem[] = [
    {value: this.currentRatio, label: '', color: '#60d712'},
    {value: this.highRatio, label: '', color: '#ec0137'}
  ] as MeterItem[];

  ngOnChanges(changes: SimpleChanges) {
    this.ranges = [
      {value: changes['currentRatio'].currentValue, label: '', color: '#60d712'},
      {value: changes['highRatio'].currentValue, label: '', color: '#ec0137'}
    ] as MeterItem[];
    this.lowRatio = changes['lowRatio'].currentValue;
    this.currentRatio = changes['currentRatio'].currentValue;
    this.highRatio = changes['highRatio'].currentValue;
    this.pair = changes['pair'].currentValue;
  }
}
