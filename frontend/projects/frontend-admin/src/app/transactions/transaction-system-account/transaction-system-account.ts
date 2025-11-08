import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionMenu} from '../transaction-menu/transaction-menu';
import {Store} from '@ngrx/store';
import {TranslatePipe, TranslateStore} from '@ngx-translate/core';
import {selectSystemTransactions} from '../state/transaction.selectors';
import {loadSystemAccountTransactionListAction} from '../state/transaction.actions';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';
import {Transaction} from '../../api/model/transaction';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-transaction-system-account',
  templateUrl: './transaction-system-account.html',
  styleUrl: './transaction-system-account.css',
  imports: [MenuComponent, TransactionMenu, TranslatePipe, AmountPipe, TableModule],
})
export class TransactionSystemAccount implements OnInit {
  protected transactions: Transaction[] = [];
  private readonly _storeTransaction$: Store<TranslateStore> = inject(Store);

  ngOnInit() {
    this._storeTransaction$
      .select(selectSystemTransactions)
      .subscribe((transactions) => {
        this.transactions = transactions;
      });
    const selectTransactionRequest = {
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
    } as SelectTransactionRequest;
    this._storeTransaction$.dispatch(
      loadSystemAccountTransactionListAction({selectTransactionRequest}),
    );
  }
}
