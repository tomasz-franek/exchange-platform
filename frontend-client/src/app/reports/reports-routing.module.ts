import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { TicketEffects } from '../tickets/state/ticket.effects';
import { AccountEffects } from '../accounts/state/account.effects';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { ReportsComponent } from './reports.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { reportsReducers } from './state/report.reducers';
import { ReportEffects } from './state/report.effects';
import { accountReducers } from '../accounts/state/account.reducers';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: ReportsComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'financial-report',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: FinancialReportComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.reports, reportsReducers),
    StoreModule.forFeature(Features.accounts, accountReducers),
    EffectsModule.forFeature([ReportEffects])
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
