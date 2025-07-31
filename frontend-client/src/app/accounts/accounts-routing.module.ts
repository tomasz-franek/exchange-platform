import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/account.effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountsComponent } from './accounts.component';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(AccountEffects)],
    component: AccountsComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'account-list',
    providers: [provideEffects(AccountEffects)],
    component: AccountListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'account-edit',
    providers: [provideEffects(AccountEffects)],
    component: AccountEditComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
