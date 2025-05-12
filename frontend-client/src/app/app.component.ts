import { Component } from '@angular/core';
import { OrderBookComponent } from './order-book/order-book.component';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';

@Component({
  selector: 'app-root',
  imports: [OrderBookComponent, TicketOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
