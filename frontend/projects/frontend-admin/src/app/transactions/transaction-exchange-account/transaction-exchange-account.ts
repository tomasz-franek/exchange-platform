import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionMenu} from '../transaction-menu/transaction-menu';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';
import {TransactionsStore} from '../transactions.signal-store';

@Component({
  selector: 'app-transaction-exchange-account',
  templateUrl: './transaction-exchange-account.html',
  styleUrl: './transaction-exchange-account.scss',
  imports: [MenuComponent, TransactionMenu, AmountPipe, TranslatePipe, TableModule],
})
export class TransactionExchangeAccount implements OnInit {
  protected readonly store = inject(TransactionsStore);

  ngOnInit() {
    const selectTransactionRequest = {
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
    } as SelectTransactionRequest;
    this.store.loadExchangeAccountTransactionList(selectTransactionRequest);
  }
}
