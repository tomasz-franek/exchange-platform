import {Component} from '@angular/core';
import {TransactionMenu} from "./transaction-menu/transaction-menu";
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  imports: [TransactionMenu, MenuComponent]
})
export class TransactionsComponent {

}
