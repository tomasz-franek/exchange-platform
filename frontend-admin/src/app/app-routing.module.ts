import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthAdminRole} from './services/auth-guard';
import {NotFoundComponent} from './not-found/not-found.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';

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
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
