import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {AccountEditComponent} from './account-edit/account-edit.component';
import {AccountListComponent} from './account-list/account-list.component';
import {AccountsComponent} from './accounts.component';
import {AccountWithdrawComponent} from './account-withdraw/account-withdraw.component';
import {AccountBankComponent} from './account-bank/account-bank';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'account-list',
    component: AccountListComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'account-edit',
    component: AccountEditComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'account-withdraw',
    component: AccountWithdrawComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'bank-accounts',
    component: AccountBankComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
