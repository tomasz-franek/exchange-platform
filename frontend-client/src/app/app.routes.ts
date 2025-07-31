import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './accounts/state/account.effects';
import { canActivateAuthRole } from '../services/auth-guard/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { AccountsModule } from './accounts/accounts.module';
import { ForbiddenComponent } from './utils/forbidden/forbidden.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { TicketEffects } from './tickets/state/ticket.effects';
import { PropertiesEffects } from './properties/state/properties.effects';
import { RateEffects } from './rates/state/rate.effects';
import { MessageEffects } from './messages/state/message.effects';

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    component: HomeComponent,
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
    path: 'messages',
    canActivate: [canActivateAuthRole],
    providers: [provideEffects(MessageEffects)],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./messages/messages-module').then((m) => m.MessagesModule),
  },
  {
    path: 'rates',
    canActivate: [canActivateAuthRole],
    providers: [provideEffects(RateEffects)],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./rates/rates-module').then((m) => m.RatesModule),
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
    providers: [provideEffects(PropertiesEffects)],
    loadChildren: () =>
      import('./properties/properties-module').then((m) => m.PropertiesModule),
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
