import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {canActivateAuthAdminRole} from '../services/auth-guard';
import {EffectsModule} from '@ngrx/effects';
import {LandingPageComponent} from './utils/landing-page/landing-page.component';
import {DashboardComponent} from './utils/dashboard/dashboard.component';
import {NotFoundComponent} from '../../../shared-modules/src/lib/not-found/not-found.component';
import {ForbiddenComponent} from '../../../shared-modules/src/lib/forbidden/forbidden.component';

export const routes: Route[] = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'accounts',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'transactions',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule,
      ),
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./properties/properties.module').then((m) => m.PropertiesModule),
  },
  {
    path: 'statistics',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./statistics/statistics.module').then((m) => m.StatisticsModule),
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'monitoring',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./monitoring/monitoring-module').then((m) => m.MonitoringModule),
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
