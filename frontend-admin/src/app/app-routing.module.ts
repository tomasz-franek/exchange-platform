import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAuthAdminRole } from '../services/auth-guard';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { ForbiddenComponent } from './utils/forbidden/forbidden.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { propertyReducers } from './properties/state/properties.reducers';
import { accountReducers } from './accounts/state/account.reducers';
import { LandingPageComponent } from './utils/landing-page/landing-page.component';
import { DashboardComponent } from './utils/dashboard/dashboard.component';
import { PropertiesEffects } from './properties/state/properties.effects';
import { UtilEffects } from './utils/state/util.effects';
import { TransactionEffects } from './transactions/state/transaction.effects';
import { AccountEffects } from './accounts/state/account.effects';
import { ReportEffects } from './reports/state/report.effects';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    providers: [provideEffects(PropertiesEffects, UtilEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'accounts',
    canActivate: [canActivateAuthAdminRole],
    providers: [provideEffects(AccountEffects)],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'transactions',
    canActivate: [canActivateAuthAdminRole],
    providers: [provideEffects(TransactionEffects)],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule,
      ),
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthAdminRole],
    providers: [provideEffects(ReportEffects)],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./properties/properties.module').then((m) => m.PropertiesModule),
  },
  {
    path: 'statistics',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./statistics/statistics.module').then((m) => m.StatisticsModule),
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
  },
  {
    path: 'monitoring',
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
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
    StoreModule.forRoot({
      properties: propertyReducers,
      accounts: accountReducers,
    }),
    EffectsModule.forRoot([]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
