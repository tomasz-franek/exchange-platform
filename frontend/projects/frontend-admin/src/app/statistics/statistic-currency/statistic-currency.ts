import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {StatisticMenu} from '../statistic-menu/statistic-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {statisticStore} from '../statistics.signal-store';

@Component({
  selector: 'app-statistic-currency',
  templateUrl: './statistic-currency.html',
  styleUrl: './statistic-currency.scss',
  imports: [MenuComponent, StatisticMenu, TranslatePipe, AmountPipe, MenuComponent],
})
export class StatisticCurrency implements OnInit {
  protected currency: string = 'EUR';
  protected readonly store = inject(statisticStore);

  ngOnInit() {
    this.store.loadCurrencyStatistics(this.currency);
  }
}
