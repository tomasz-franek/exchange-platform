import {Component} from '@angular/core';
import {StatisticMenu} from "./statistic-menu/statistic-menu";
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  imports: [
    StatisticMenu,
    MenuComponent
  ],
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

}
