import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { reportReducers } from './state/report.reducers';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { ReportEffects } from './state/report.effects';
import { ReportTransactions } from './report-transactions/report-transactions';
import { canActivateAuthAdminRole } from '../../services/auth-guard';
import { ReportErrors } from './report-errors/report-errors';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'report-transactions',
    component: ReportTransactions,
    providers: [provideEffects(ReportEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'report-errors',
    component: ReportErrors,
    providers: [provideEffects(ReportEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.reports, reportReducers),
    EffectsModule.forFeature([ReportEffects]),
  ],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
