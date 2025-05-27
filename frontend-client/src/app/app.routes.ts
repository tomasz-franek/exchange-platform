import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { TicketEffects } from './state/ticket/ticket.effect';
import { AccountEffects } from './state/account/account.effect';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountEditComponent } from './account-edit/account-edit.component';

export const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: AccountListComponent,
  },
  {
    path: '**',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: AccountListComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
