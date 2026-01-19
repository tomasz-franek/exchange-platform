import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-statistic-menu',
  templateUrl: './statistic-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './statistic-menu.scss',
})
export class StatisticMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.STATISTICS.TRANSACTIONS'),
        routerLink: '/statistics/statistic-transaction',
        id: 'statisticsTransaction',
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.CURRENCY'),
        routerLink: '/statistics/statistic-currency',
        id: 'statisticCurrency',
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.PAIR'),
        routerLink: '/statistics/statistic-pair',
        id: 'statisticsPair',
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.USER'),
        routerLink: '/statistics/statistic-user',
        id: 'statisticsUser',
      },
    ];
  }
}
