import {Component} from '@angular/core';
import {StatisticMenu} from "./statistic-menu/statistic-menu";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  imports: [
    StatisticMenu
  ],
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

}
