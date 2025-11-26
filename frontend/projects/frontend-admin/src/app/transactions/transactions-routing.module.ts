import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransactionsComponent} from './transactions.component';
import {TransactionListForm} from './transaction-list-form/transaction-list-form';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {TransactionSystemAccount} from './transaction-system-account/transaction-system-account';
import {
  TransactionExchangeAccount
} from './transaction-exchange-account/transaction-exchange-account';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'transaction-list',
    component: TransactionListForm,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'transaction-system-account',
    component: TransactionSystemAccount,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'transaction-exchange-account',
    component: TransactionExchangeAccount,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {
}
