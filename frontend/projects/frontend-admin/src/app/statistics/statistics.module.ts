import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { StatisticPair } from './statistic-pair/statistic-pair';
import { StatisticCurrency } from './statistic-currency/statistic-currency';
import { StatisticTransaction } from './statistic-transaction/statistic-transaction';
import { StatisticUser } from './statistic-user/statistic-user';
import { MenuComponent } from '../menu/menu.component';
import { StatisticMenu } from './statistic-menu/statistic-menu';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    StatisticsComponent,
    StatisticTransaction,
    StatisticPair,
    StatisticCurrency,
    MenuComponent,
    StatisticMenu,
    TranslatePipe,
    StatisticUser,
  ],
})
export class StatisticsModule {}
