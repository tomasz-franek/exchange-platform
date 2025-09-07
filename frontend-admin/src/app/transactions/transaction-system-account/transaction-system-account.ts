import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionFilter } from '../transaction-filter/transaction-filter';
import { TransactionList } from '../transaction-list/transaction-list';
import { TransactionMenu } from '../transaction-menu/transaction-menu';

@Component({
  selector: 'app-transaction-system-account',
  templateUrl: './transaction-system-account.html',
  styleUrl: './transaction-system-account.css',
  imports: [MenuComponent, TransactionFilter, TransactionList, TransactionMenu],
})
export class TransactionSystemAccount {}
