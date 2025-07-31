import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './accounts/state/account.effects';
import { canActivateAuthRole } from '../services/auth-guard';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPropertyComponent } from './user-properties/user-property/user-property.component';
import { AccountsModule } from './accounts/accounts.module';
import { ForbiddenComponent } from './utils/forbidden/forbidden.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { DictionaryEffects } from './state/dictionary/dictionary.effects';
import { SystemEffects } from './state/system/system.effects';
import { TicketEffects } from './tickets/state/ticket.effects';

export const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(SystemEffects)],
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    providers: [provideEffects(SystemEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'tickets',
    canActivate: [canActivateAuthRole],
    providers: [provideEffects(TicketEffects)],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./tickets/tickets.module').then((m) => m.TicketsModule),
  },
  {
    path: 'accounts',
    canActivate: [canActivateAuthRole],
    providers: [provideEffects(AccountEffects)],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'user-property',
    providers: [provideEffects(AccountEffects, DictionaryEffects)],
    component: UserPropertyComponent,
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
