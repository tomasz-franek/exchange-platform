import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {canActivateAuthRole} from '../services/auth-guard/auth-guard.service';
import {ForbiddenComponent} from '../../../shared-modules/src/lib/forbidden/forbidden.component';
import {NotFoundComponent} from '../../../shared-modules/src/lib/not-found/not-found.component';
import {DashboardComponent} from './utils/dashboard/dashboard.component';
import {LandingPageComponent} from './utils/landing-page/landing-page.component';

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
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
    loadChildren: () =>
      import('./tickets/tickets.module').then((m) => m.TicketsModule),
  },
  {
    path: 'accounts',
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
    EffectsModule.forRoot([]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
