import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { StatisticMenu } from '../statistic-menu/statistic-menu';

@Component({
  selector: 'app-statistic-transaction',
  templateUrl: './statistic-transaction.html',
  styleUrl: './statistic-transaction.css',
  imports: [MenuComponent, StatisticMenu],
})
export class StatisticTransaction {}
