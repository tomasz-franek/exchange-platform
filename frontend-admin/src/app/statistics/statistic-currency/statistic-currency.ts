import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { StatisticMenu } from '../statistic-menu/statistic-menu';
import { Store } from '@ngrx/store';
import {
  selectCurrencyStatisticResponse,
  StatisticState,
} from '../state/statistic.selectors';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { loadCurrencyStatisticAction } from '../state/statistic.actions';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-statistic-currency',
  templateUrl: './statistic-currency.html',
  styleUrl: './statistic-currency.css',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticCurrency implements OnInit {
  protected currencyStatisticResponse: CurrencyStatisticResponse | null = null;
  private _storeProperty$: Store<StatisticState> = inject(Store);

  ngOnInit() {
    this._storeProperty$
      .select(selectCurrencyStatisticResponse)
      .subscribe((currencyStatisticResponse) => {
        this.currencyStatisticResponse = currencyStatisticResponse;
      });
    const currency: string = 'EUR';
    this._storeProperty$.dispatch(loadCurrencyStatisticAction({ currency }));
  }
}
