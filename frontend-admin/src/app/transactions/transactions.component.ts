import {Component} from '@angular/core';
import {TransactionMenu} from "./transaction-menu/transaction-menu";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  imports: [TransactionMenu]
})
export class TransactionsComponent {

}
