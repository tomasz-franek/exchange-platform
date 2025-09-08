import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { transactionReducers } from './state/transaction.reducers';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { TransactionEffects } from './state/transaction.effects';
import { TransactionListForm } from './transaction-list-form/transaction-list-form';
import { canActivateAuthAdminRole } from '../../services/auth-guard';
import { AccountEffects } from '../accounts/state/account.effects';
import { TransactionSystemAccount } from './transaction-system-account/transaction-system-account';
import { TransactionExchangeAccount } from './transaction-exchange-account/transaction-exchange-account';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    providers: [provideEffects(TransactionEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'transaction-list',
    component: TransactionListForm,
    providers: [provideEffects(TransactionEffects, AccountEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'transaction-system-account',
    component: TransactionSystemAccount,
    providers: [provideEffects(TransactionEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
  {
    path: 'transaction-exchange-account',
    component: TransactionExchangeAccount,
    providers: [provideEffects(TransactionEffects)],
    canActivate: [canActivateAuthAdminRole],
    data: { role: 'EXCHANGE_ADMIN' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.transactions, transactionReducers),
    EffectsModule.forFeature([TransactionEffects]),
  ],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
