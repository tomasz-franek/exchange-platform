import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionMenu } from '../../transactions/transaction-menu/transaction-menu';
import { StatisticMenu } from '../statistic-menu/statistic-menu';

@Component({
  selector: 'app-statistic-transaction',
  templateUrl: './statistic-transaction.html',
  styleUrl: './statistic-transaction.css',
  imports: [MenuComponent, TransactionMenu, StatisticMenu],
})
export class StatisticTransaction {}
