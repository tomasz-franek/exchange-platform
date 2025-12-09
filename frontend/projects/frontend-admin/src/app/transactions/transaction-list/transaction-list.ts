import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  imports: [TranslatePipe, TableModule, AmountPipe],
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  @Input() rows: any[] = [];
}
