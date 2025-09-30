import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { RateMenuComponent } from '../rate-menu/rate-menu.component';
import { Store } from '@ngrx/store';
import { RateState, selectCurrencyRates } from '../state/rate.selectors';
import { CurrencyRate } from '../../api/model/currencyRate';
import { loadCurrencyRateListAction } from '../state/rate.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { RatioPipe } from '../../../pipes/ratio-pipe/ratio.pipe';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { PairUtils } from '../../utils/pair-utils';
import { Pair } from '../../api/model/pair';

@Component({
  selector: 'app-rates-list',
  imports: [MenuComponent, RateMenuComponent, TranslatePipe, RatioPipe, AmountPipe],
  templateUrl: './rate-list.html',
  styleUrl: './rate-list.css'
})
export class RateList implements OnInit {
  protected _currencyRates: CurrencyRate[] = [];
  private _storeRate$: Store<RateState> = inject(Store);

  ngOnInit() {
    this._storeRate$.select(selectCurrencyRates).subscribe(rates => this._currencyRates = rates);
    this._storeRate$.dispatch(loadCurrencyRateListAction());


  }

  buyCurrency(pair: Pair) {
    return PairUtils.getQuoteCurrency(pair);
  }

  sellCurrency(pair: Pair) {
    return PairUtils.getBaseCurrency(pair);
  }
}
