import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionMenu } from '../../transactions/transaction-menu/transaction-menu';
import { StatisticMenu } from '../statistic-menu/statistic-menu';

@Component({
  selector: 'app-statistic-pair',
  templateUrl: './statistic-pair.html',
  styleUrl: './statistic-pair.css',
  imports: [MenuComponent, TransactionMenu, StatisticMenu],
})
export class StatisticPair {}
