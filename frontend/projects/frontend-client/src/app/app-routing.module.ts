import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EffectsModule, provideEffects} from '@ngrx/effects';
import {AccountEffects} from './accounts/state/account.effects';
import {canActivateAuthRole} from '../services/auth-guard/auth-guard.service';
import {ForbiddenComponent} from '../../../shared-modules/src/lib/forbidden/forbidden.component';
import {NotFoundComponent} from '../../../shared-modules/src/lib/not-found/not-found.component';
import {TicketEffects} from './tickets/state/ticket.effects';
import {StoreModule} from '@ngrx/store';
import {accountReducers} from './accounts/state/account.reducers';
import {DashboardComponent} from './utils/dashboard/dashboard.component';
import {LandingPageComponent} from './utils/landing-page/landing-page.component';
import {ticketReducers} from './tickets/state/ticket.reducers';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
  {
    path: 'tickets',
    providers: [provideEffects(TicketEffects)],
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./tickets/tickets.module').then((m) => m.TicketsModule),
  },
  {
    path: 'accounts',
    providers: [provideEffects(AccountEffects)],
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./messages/messages-module').then((m) => m.MessagesModule),
  },
  {
    path: 'rates',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./rates/rates-module').then((m) => m.RatesModule),
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./properties/properties.module').then((m) => m.PropertiesModule),
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
  imports: [
    RouterModule.forRoot(routes),
    StoreModule.forRoot({
      accounts: accountReducers,
      tickets: ticketReducers,
    }),
    EffectsModule.forRoot([]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
