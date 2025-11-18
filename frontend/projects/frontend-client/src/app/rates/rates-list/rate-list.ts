import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {RateMenuComponent} from '../rate-menu/rate-menu.component';
import {TranslatePipe} from '@ngx-translate/core';
import {RatioPipe} from '../../../pipes/ratio-pipe/ratio.pipe';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {PairUtils} from '../../utils/pair-utils';
import {Pair} from '../../api/model/pair';
import {TableModule} from 'primeng/table';
import {ratesStore} from '../rates.signal-store';

@Component({
  selector: 'app-rates-list',
  imports: [MenuComponent, RateMenuComponent, TranslatePipe, RatioPipe, AmountPipe, TableModule],
  templateUrl: './rate-list.html',
  styleUrl: './rate-list.scss'
})
export class RateList implements OnInit {
  protected readonly store = inject(ratesStore);

  ngOnInit() {
    this.store.loadCurrencyRates();
  }

  buyCurrency(pair: Pair) {
    return PairUtils.getQuoteCurrency(pair);
  }

  sellCurrency(pair: Pair) {
    return PairUtils.getBaseCurrency(pair);
  }
}
