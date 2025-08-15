import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  imports: [TranslatePipe],
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  protected rows: any[] = [];
}
