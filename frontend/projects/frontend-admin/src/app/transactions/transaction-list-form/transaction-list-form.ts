import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionMenu } from '../transaction-menu/transaction-menu';
import { TransactionFilter } from '../transaction-filter/transaction-filter';
import { TransactionList } from '../transaction-list/transaction-list';

@Component({
  selector: 'app-transaction-list-form',
  templateUrl: './transaction-list-form.html',
  styleUrl: './transaction-list-form.css',
  imports: [MenuComponent, TransactionMenu, TransactionFilter, TransactionList],
})
export class TransactionListForm {}
