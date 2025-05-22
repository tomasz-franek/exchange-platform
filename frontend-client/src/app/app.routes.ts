import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';
import { TicketEffects } from './state/tickets/ticket.effects';
import { provideEffects } from '@ngrx/effects';
import { AccountEffects } from './state/accounts/account.effects';

export const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: TicketOrderComponent,
  },
  {
    path: '**',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: TicketOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
