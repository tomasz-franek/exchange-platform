import {Component, inject, OnInit} from '@angular/core';
import {UsersStatisticRequest} from '../../api/model/usersStatisticRequest';
import {MenuComponent} from '../../menu/menu.component';
import {StatisticMenu} from '../statistic-menu/statistic-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {statisticStore} from '../statistics.signal-store';

@Component({
  selector: 'app-statistic-user',
  templateUrl: './statistic-user.html',
  styleUrl: './statistic-user.scss',
  imports: [MenuComponent, StatisticMenu, TranslatePipe],
})
export class StatisticUser implements OnInit {
  protected readonly store = inject(statisticStore);

  ngOnInit() {
    const usersStatisticRequest: UsersStatisticRequest = {
      userId: '921467e9-6fde-46e7-a329-06288db72f5d',
      currency: 'EUR',
    };
    this.store.loadUserStatistic(usersStatisticRequest);
  }
}
