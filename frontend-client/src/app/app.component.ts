import { Component, inject } from '@angular/core';
import { AccountListComponent } from './account-list/account-list.component';
import { Store } from '@ngrx/store';
import { TicketOrderComponent } from './ticket-order/ticket-order.component';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';
import { DepositComponent } from './deposit/deposit.component';
import { NgIf } from '@angular/common';
import { AccountEditComponent } from './account-edit/account-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    AccountListComponent,
    TicketOrderComponent,
    OrderBookChartComponent,
    OrderBookTableComponent,
    DepositComponent,
    NgIf,
    AccountEditComponent,
  ],
})
export class AppComponent {
  title = 'frontend-client';
  private _store$: Store = inject(Store);
}
