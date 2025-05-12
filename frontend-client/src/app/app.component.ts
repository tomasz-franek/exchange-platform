import { Component } from '@angular/core';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';

@Component({
  selector: 'app-root',
  imports: [OrderBookTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
