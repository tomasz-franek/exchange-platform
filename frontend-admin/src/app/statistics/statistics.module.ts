import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { StatisticPair } from './statistic-pair/statistic-pair';
import { StatisticCurrency } from './statistic-currency/statistic-currency';
import { StatisticTransaction } from './statistic-transaction/statistic-transaction';

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    StatisticsComponent,
    StatisticTransaction,
    StatisticPair,
    StatisticCurrency,
  ],
})
export class StatisticsModule {}
