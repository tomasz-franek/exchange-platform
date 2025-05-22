import { Component } from '@angular/core';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';
import { NgIf } from '@angular/common';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { DepositComponent } from './deposit/deposit.component';

@Component({
  selector: 'app-root',
  imports: [
    OrderBookTableComponent,
    TicketOrderComponent,
    NgIf,
    OrderBookChartComponent,
    DepositComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
