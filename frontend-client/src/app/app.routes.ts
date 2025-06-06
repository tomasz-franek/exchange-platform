import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/account/account.effects';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { canActivateAuthRole } from './services/auth-guard';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
  {
    path: '**',
    component: ForbiddenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
