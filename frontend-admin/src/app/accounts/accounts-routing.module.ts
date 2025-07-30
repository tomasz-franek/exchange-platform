import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
import {AccountDepositComponent} from "./account-deposit/account-deposit.component";
import {canActivateAuthAdminRole} from "../services/auth-guard";
import {provideEffects} from "@ngrx/effects";
import {AccountEffects} from './state/account.effects';
import {AccountListComponent} from './account-list/account-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-deposit',
    providers: [provideEffects(AccountEffects)],
    component: AccountDepositComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
  {
    path: 'account-list',
    providers: [provideEffects(AccountEffects)],
    component: AccountListComponent,
    canActivate: [canActivateAuthAdminRole],
    data: {role: 'EXCHANGE_ADMIN'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {
}
