import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { TicketEffects } from '../state/ticket/ticket.effects';
import { AccountEffects } from '../state/account/account.effects';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { canActivateAuthRole } from '../services/auth-guard';

const routes: Routes = [
  {
    path: 'financial-report',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: FinancialReportComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
