import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { TransactionsStore } from '../transactions.signal-store';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  imports: [TranslatePipe, TableModule, AmountPipe],
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  protected readonly store = inject(TransactionsStore);
}
