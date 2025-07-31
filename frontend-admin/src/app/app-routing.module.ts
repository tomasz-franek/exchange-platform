import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthAdminRole} from '../services/auth-guard';
import {NotFoundComponent} from './utils/not-found/not-found.component';
import {ForbiddenComponent} from './utils/forbidden/forbidden.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

const routes: Routes = [

  {
    path: 'accounts',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path: 'transactions',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./transactions/transactions.module').then(m => m.TransactionsModule)
  },
  {
    path: 'reports',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./messages/messages.module').then(m => m.MessagesModule)
  },
  {
    path: 'properties',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./properties/properties.module').then(m => m.PropertiesModule)
  },
  {
    path: 'statistics',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./statistics/statistics.module').then(m => m.StatisticsModule)
  },
  {
    path: 'messages',
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
    loadChildren: () =>
      import('./messages/messages.module').then(m => m.MessagesModule)
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
  imports: [RouterModule.forRoot(routes),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
