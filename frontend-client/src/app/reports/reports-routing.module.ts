import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { TicketEffects } from '../tickets/state/ticket.effects';
import { AccountEffects } from '../accounts/state/account.effects';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { ReportsComponent } from './reports.component';

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
    RouterModule.forChild(routes)
    //StoreModule.forFeature(Features.reports, reportsReducers),
    //EffectsModule.forFeature([ReportEffects])
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
