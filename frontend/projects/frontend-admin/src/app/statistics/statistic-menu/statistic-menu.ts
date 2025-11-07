import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-statistic-menu',
  templateUrl: './statistic-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './statistic-menu.css',
})
export class StatisticMenu extends CheckedMenu implements OnInit {
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.STATISTICS.TRANSACTIONS'),
        routerLink: '/statistics/statistic-transaction',
        id: 'statisticsTransaction'
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.CURRENCY'),
        routerLink: '/statistics/statistic-currency',
        id: 'statisticCurrency'
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.PAIR'),
        routerLink: '/statistics/statistic-pair',
        id: 'statisticsPair'
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.USER'),
        routerLink: '/statistics/statistic-user',
        id: 'statisticsUser'
      },
    ];
  }
}
