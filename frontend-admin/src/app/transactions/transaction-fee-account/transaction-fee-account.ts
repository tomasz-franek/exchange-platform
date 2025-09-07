import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionMenu } from '../transaction-menu/transaction-menu';
import { TransactionFilter } from '../transaction-filter/transaction-filter';
import { TransactionList } from '../transaction-list/transaction-list';

@Component({
  selector: 'app-transaction-fee-account',
  templateUrl: './transaction-fee-account.html',
  styleUrl: './transaction-fee-account.css',
  imports: [MenuComponent, TransactionMenu, TransactionFilter, TransactionList],
})
export class TransactionFeeAccount {}
