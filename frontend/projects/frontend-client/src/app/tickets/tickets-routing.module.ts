import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TicketListComponent} from './ticket-list/ticket-list.component';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {TicketOrderComponent} from './ticket-order/ticket-order.component';
import {TicketsComponent} from './tickets.component';
import {TicketRealizedComponent} from './ticket-realized/ticket-realized.component';
import {WebsocketService} from '../../services/websocket/websocket.service';

const routes: Routes = [
  {
    path: '',
    component: TicketsComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'ticket-list',
    component: TicketListComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'ticket-order',
    component: TicketOrderComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  },
  {
    path: 'ticket-realized',
    component: TicketRealizedComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [WebsocketService]
})
export class TicketsRoutingModule {
}
