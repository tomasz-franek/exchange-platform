import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { TicketEffects } from './state/ticket.effects';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { AccountEffects } from '../accounts/state/account.effects';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';
import { TicketsComponent } from './tickets.component';
import { TicketRealizedComponent } from './ticket-realized/ticket-realized.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { ticketReducers } from './state/ticket.reducers';
import { WebsocketService } from '../../services/websocket/websocket.service';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(TicketEffects)],
    component: TicketsComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'ticket-list',
    providers: [provideEffects(TicketEffects)],
    component: TicketListComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'ticket-order',
    providers: [provideEffects(TicketEffects, AccountEffects)],
    component: TicketOrderComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'ticket-realized',
    providers: [provideEffects(TicketEffects)],
    component: TicketRealizedComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.tickets, ticketReducers),
    EffectsModule.forFeature([TicketEffects])
  ],
  exports: [RouterModule],
  providers: [WebsocketService]
})
export class TicketsRoutingModule {
}
