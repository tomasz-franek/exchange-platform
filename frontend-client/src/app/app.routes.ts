import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/account/account.effects';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketEffects } from './state/ticket/ticket.effects';

export const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(AccountEffects, TicketEffects)],
    component: DashboardComponent,
  },
  {
    path: 'account-list',
    providers: [provideEffects(AccountEffects)],
    component: AccountListComponent,
  },
  {
    path: 'account-edit',
    providers: [provideEffects(AccountEffects)],
    component: AccountEditComponent,
  },
  {
    path: '**',
    providers: [provideEffects(AccountEffects)],
    component: AccountListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
