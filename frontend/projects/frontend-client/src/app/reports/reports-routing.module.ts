import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinancialReportComponent} from './financial-report/financial-report.component';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {ReportsComponent} from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'financial-report',
    component: FinancialReportComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
