import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { TicketEffects } from '../state/ticket/ticket.effects';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { canActivateAuthRole } from '../services/auth-guard';
import { AccountEffects } from '../state/account/account.effects';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';
import { TicketsComponent } from './tickets.component';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects)],
    component: TicketsComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'ticket-list',
    providers: [provideEffects(TicketEffects)],
    component: TicketListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'ticket-order',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: TicketOrderComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
