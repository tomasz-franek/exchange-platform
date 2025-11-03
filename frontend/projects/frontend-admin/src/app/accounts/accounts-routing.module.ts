import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountDepositComponent } from './account-deposit/account-deposit.component';
import { canActivateAuthAdminRole } from '../../services/auth-guard';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/account.effects';
import { StoreModule } from '@ngrx/store';
import { Features } from '../../../../shared-modules/src/lib/features';
import { accountReducers } from './state/account.reducers';
import { AccountListForm } from './account-list-form/account-list-form';
import { AccountSystemComponent } from './account-system/account-system-component';
import { AccountSystemOperationListComponent } from './account-system-operation/account-system-operation-list-component';
import { AccountBankComponent } from './account-bank/account-bank';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'account-deposit',
    providers: [provideEffects(AccountEffects)],
    component: AccountDepositComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'account-list',
    providers: [provideEffects(AccountEffects)],
    component: AccountListForm,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'account-system',
    providers: [provideEffects(AccountEffects)],
    component: AccountSystemComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'account-operations/:id',
    providers: [provideEffects(AccountEffects)],
    component: AccountSystemOperationListComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'account-operations',
    providers: [provideEffects(AccountEffects)],
    component: AccountSystemOperationListComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'bank-accounts',
    providers: [provideEffects(AccountEffects)],
    component: AccountBankComponent,
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.accounts, accountReducers),
    EffectsModule.forFeature([AccountEffects]),
  ],

  exports: [RouterModule],
})
export class AccountsRoutingModule {}
