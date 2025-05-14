import { Component } from '@angular/core';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';

@Component({
  selector: 'app-root',
  imports: [OrderBookTableComponent, TicketOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
