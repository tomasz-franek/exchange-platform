import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/account/account.effects';
import { canActivateAuthRole } from './services/auth-guard';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPropertyComponent } from './user-properties/user-property/user-property.component';
import { TicketEffects } from './state/ticket/ticket.effects';
import { DictionaryEffects } from '../../../../../apps/new-client/frontend-client/src/app/reports/state/dictionary.effects';
import { AccountsModule } from './accounts/accounts.module';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountEditComponent } from './accounts/account-edit/account-edit.component';
import { DepositComponent } from './accounts/deposit/deposit.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketOrderComponent } from './tickets/ticket-order/ticket-order.component';
import { FinancialReportComponent } from './reports/financial-report/financial-report.component';
import { ForbiddenComponent } from './utils/forbidden/forbidden.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'account-list',
    providers: [provideEffects(AccountEffects)],
    component: AccountListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'account-edit',
    providers: [provideEffects(AccountEffects)],
    component: AccountEditComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'user-property',
    providers: [provideEffects(AccountEffects, DictionaryEffects)],
    component: UserPropertyComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'account-deposit',
    providers: [provideEffects(AccountEffects)],
    component: DepositComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'ticket-list',
    providers: [provideEffects(TicketEffects)],
    component: TicketListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'ticket-order',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: TicketOrderComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'financial-report',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: FinancialReportComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AccountsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
