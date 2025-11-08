import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionMenu} from '../transaction-menu/transaction-menu';
import {selectExchangeTransactions} from '../state/transaction.selectors';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';
import {loadExchangeAccountTransactionListAction} from '../state/transaction.actions';
import {Transaction} from '../../api/model/transaction';
import {Store} from '@ngrx/store';
import {TranslatePipe, TranslateStore} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-transaction-exchange-account',
  templateUrl: './transaction-exchange-account.html',
  styleUrl: './transaction-exchange-account.css',
  imports: [MenuComponent, TransactionMenu, AmountPipe, TranslatePipe, TableModule],
})
export class TransactionExchangeAccount implements OnInit {
  protected transactions: Transaction[] = [];
  private readonly _storeTransaction$: Store<TranslateStore> = inject(Store);

  ngOnInit() {
    this._storeTransaction$
      .select(selectExchangeTransactions)
      .subscribe((transactions) => {
        this.transactions = transactions;
      });
    const selectTransactionRequest = {
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
    } as SelectTransactionRequest;
    this._storeTransaction$.dispatch(
      loadExchangeAccountTransactionListAction({selectTransactionRequest}),
    );
  }
}
