import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './statistics.component';
import {StatisticPair} from './statistic-pair/statistic-pair';
import {StatisticCurrency} from './statistic-currency/statistic-currency';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {StatisticTransaction} from './statistic-transaction/statistic-transaction';
import {StatisticUser} from './statistic-user/statistic-user';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'statistic-pair',
    component: StatisticPair,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'statistic-transaction',
    component: StatisticTransaction,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'statistic-currency',
    component: StatisticCurrency,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'statistic-user',
    component: StatisticUser,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {
}
