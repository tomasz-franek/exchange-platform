import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';

export const routes: Routes = [
  {
    path: '',
    providers: [],
    component: TicketOrderComponent,
  },
  {
    path: '**',
    providers: [],
    component: TicketOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
