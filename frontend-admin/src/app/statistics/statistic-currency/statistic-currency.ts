import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { StatisticMenu } from '../statistic-menu/statistic-menu';

@Component({
  selector: 'app-statistic-currency',
  templateUrl: './statistic-currency.html',
  styleUrl: './statistic-currency.css',
  imports: [MenuComponent, StatisticMenu],
})
export class StatisticCurrency {}
