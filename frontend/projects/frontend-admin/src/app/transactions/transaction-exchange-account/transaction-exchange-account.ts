import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {TransactionMenu} from '../transaction-menu/transaction-menu';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';
import {TransactionsStore} from '../transactions.signal-store';
import {Paginator, PaginatorState} from 'primeng/paginator';

@Component({
  selector: 'app-transaction-exchange-account',
  templateUrl: './transaction-exchange-account.html',
  styleUrl: './transaction-exchange-account.scss',
  imports: [
    MenuComponent,
    TransactionMenu,
    AmountPipe,
    TranslatePipe,
    TableModule,
    Paginator,
  ],
})
export class TransactionExchangeAccount implements OnInit {
  protected readonly store = inject(TransactionsStore);
  protected rows: number = 10;
  protected page: number = 0;

  ngOnInit() {
    const selectTransactionRequest = {
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
      page: { page: 0, rows: 10 },
    } as SelectTransactionRequest;
    this.store.loadExchangeAccountTransactionList(selectTransactionRequest);
  }

  onPageChange(event: PaginatorState) {
    this.store.loadExchangeAccountTransactionList({
      dateFromUtc: '2020-01-01T00:00:00.000Z',
      dateToUtc: '2050-01-01T00:00:00.000Z',
      page: { rows: event?.rows || 10, page: event?.page || 0 },
    });
  }
}
