import { Component } from '@angular/core';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';

@Component({
  selector: 'app-root',
  imports: [TicketOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
