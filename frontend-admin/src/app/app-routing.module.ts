import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then(m => m.TransactionsModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
