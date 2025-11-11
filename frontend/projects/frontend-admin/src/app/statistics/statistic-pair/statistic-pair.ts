import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {StatisticMenu} from '../statistic-menu/statistic-menu';
import {Store} from '@ngrx/store';
import {selectPairStatisticResponse, StatisticState,} from '../state/statistic.selectors';
import {loadPairStatisticAction} from '../state/statistic.actions';
import {Pair} from '../../api/model/pair';
import {PairStatisticResponse} from '../../api/model/pairStatisticResponse';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-statistic-pair',
  templateUrl: './statistic-pair.html',
  styleUrl: './statistic-pair.scss',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticPair implements OnInit {
  protected pairStatisticResponse: PairStatisticResponse | null = null;
  private _storeProperty$: Store<StatisticState> = inject(Store);

  ngOnInit() {
    this._storeProperty$
    .select(selectPairStatisticResponse)
    .subscribe((pairStatisticResponse) => {
      this.pairStatisticResponse = pairStatisticResponse;
    });
    const pair: Pair = Pair.EurPln;
    this._storeProperty$.dispatch(loadPairStatisticAction({pair}));
  }
}
