import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports.component';
import {ReportTransactions} from './report-transactions/report-transactions';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {ReportErrors} from './report-errors/report-errors';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'report-transactions',
    component: ReportTransactions,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'report-errors',
    component: ReportErrors,
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
export class ReportsRoutingModule {
}
