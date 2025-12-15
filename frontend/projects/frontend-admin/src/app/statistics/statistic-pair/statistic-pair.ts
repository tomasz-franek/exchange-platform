import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {StatisticMenu} from '../statistic-menu/statistic-menu';
import {Pair} from '../../api/model/pair';
import {TranslatePipe} from '@ngx-translate/core';
import {StatisticStore} from '../statistics.signal-store';
import {PairUtils} from '../../../../../shared-modules/src/lib/utils/pair-utils';

@Component({
  selector: 'app-statistic-pair',
  templateUrl: './statistic-pair.html',
  styleUrl: './statistic-pair.scss',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticPair implements OnInit {
  protected readonly store = inject(StatisticStore);
  protected currency: string = '';

  ngOnInit() {
    const pair: Pair = Pair.EurPln;
    this.currency = PairUtils.getBaseCurrency(pair);
    this.store.loadPairStatistics(pair);
  }
}
