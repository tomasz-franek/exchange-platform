import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
import {AccountDepositComponent} from './account-deposit/account-deposit.component';
import {canActivateAuthAdminRole} from '../../services/auth-guard';
import {AccountListForm} from './account-list-form/account-list-form';
import {AccountSystemComponent} from './account-system/account-system-component';
import {
  AccountSystemOperationListComponent
} from './account-system-operation/account-system-operation-list-component';
import {AccountBankComponent} from './account-bank/account-bank';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-deposit',
    component: AccountDepositComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-list',
    component: AccountListForm,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-system',
    component: AccountSystemComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-operations/:id',
    component: AccountSystemOperationListComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-operations',
    component: AccountSystemOperationListComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'bank-accounts',
    component: AccountBankComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class AccountsRoutingModule {
}
