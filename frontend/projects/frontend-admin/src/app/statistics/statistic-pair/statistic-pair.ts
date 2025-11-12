import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {StatisticMenu} from '../statistic-menu/statistic-menu';
import {Pair} from '../../api/model/pair';
import {TranslatePipe} from '@ngx-translate/core';
import {statisticStore} from '../statistics.signal-store';

@Component({
  selector: 'app-statistic-pair',
  templateUrl: './statistic-pair.html',
  styleUrl: './statistic-pair.scss',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticPair implements OnInit {
  protected readonly store = inject(statisticStore);

  ngOnInit() {
    const pair: Pair = Pair.EurPln;
    this.store.loadPairStatistics(pair);
  }
}
