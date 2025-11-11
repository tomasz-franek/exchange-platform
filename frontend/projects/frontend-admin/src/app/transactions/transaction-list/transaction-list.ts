import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  imports: [TranslatePipe, TableModule],
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  protected rows: any[] = [];
}
