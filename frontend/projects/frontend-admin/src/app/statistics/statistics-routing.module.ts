import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { statisticReducers } from './state/statistic.reducers';
import { Features} from '../../../../shared-modules/src/lib/features';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { StatisticEffects } from './state/statistic.effects';
import { StatisticPair } from './statistic-pair/statistic-pair';
import { StatisticCurrency } from './statistic-currency/statistic-currency';
import { canActivateAuthAdminRole } from '../../services/auth-guard';
import { StatisticTransaction } from './statistic-transaction/statistic-transaction';
import { StatisticUser } from './statistic-user/statistic-user';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    providers: [provideEffects(StatisticEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'statistic-pair',
    component: StatisticPair,
    providers: [provideEffects(StatisticEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'statistic-transaction',
    component: StatisticTransaction,
    providers: [provideEffects(StatisticEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'statistic-currency',
    component: StatisticCurrency,
    providers: [provideEffects(StatisticEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'statistic-user',
    component: StatisticUser,
    providers: [provideEffects(StatisticEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.statistics, statisticReducers),
    EffectsModule.forFeature([StatisticEffects]),
  ],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
