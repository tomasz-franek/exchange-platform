import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { AccountEffects } from './accounts/state/account.effects';
import { canActivateAuthRole } from '../services/auth-guard/auth-guard.service';
import { ForbiddenComponent } from './utils/forbidden/forbidden.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { TicketEffects } from './tickets/state/ticket.effects';
import { RateEffects } from './rates/state/rate.effects';
import { MessageEffects } from './messages/state/message.effects';
import { StoreModule } from '@ngrx/store';
import { utilReducers } from './utils/state/util.reducers';
import { propertyReducers } from './properties/state/properties.reducers';
import { accountReducers } from './accounts/state/account.reducers';
import { messageReducers } from './messages/state/message.reducers';
import { rateReducers } from './rates/state/rate.reducers';
import { DashboardComponent } from './utils/dashboard/dashboard.component';
import { LandingPageComponent } from './utils/landing-page/landing-page.component';
import { UtilEffects } from './utils/state/util.effects';
import { ticketReducers } from './tickets/state/ticket.reducers';
import { PropertiesEffects } from './properties/state/properties.effects';
import { ReportEffects } from './reports/state/report.effects';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    providers: [provideEffects(UtilEffects, PropertiesEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'tickets',
    providers: [provideEffects(TicketEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./tickets/tickets.module').then((m) => m.TicketsModule)
  },
  {
    path: 'accounts',
    providers: [provideEffects(AccountEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule)
  },
  {
    path: 'messages',
    providers: [provideEffects(MessageEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./messages/messages-module').then((m) => m.MessagesModule)
  },
  {
    path: 'rates',
    providers: [provideEffects(RateEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./rates/rates-module').then((m) => m.RatesModule)
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthRole],
    providers: [provideEffects(ReportEffects, PropertiesEffects)],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule)
  },
  {
    path: 'properties',
    providers: [provideEffects(PropertiesEffects)],
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./properties/properties.module').then((m) => m.PropertiesModule)
  },

  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    StoreModule.forRoot({
      properties: propertyReducers,
      accounts: accountReducers,
      messages: messageReducers,
      rates: rateReducers,
      utils: utilReducers,
      tickets: ticketReducers
    }),
    EffectsModule.forRoot([])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
