import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionMenu} from '../transaction-menu/transaction-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';
import {TransactionsStore} from '../transactions.signal-store';

@Component({
  selector: 'app-transaction-system-account',
  templateUrl: './transaction-system-account.html',
  styleUrl: './transaction-system-account.scss',
  imports: [MenuComponent, TransactionMenu, TranslatePipe, AmountPipe, TableModule],
})
export class TransactionSystemAccount implements OnInit {
  protected readonly store = inject(TransactionsStore);

  ngOnInit() {
    const selectTransactionRequest = {
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
    } as SelectTransactionRequest;
    this.store.loadSystemAccountTransactionList(selectTransactionRequest);
  }
}
