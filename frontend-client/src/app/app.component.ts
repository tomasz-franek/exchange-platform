import { Component } from '@angular/core';
import { OrderBookComponent } from './order-book/order-book.component';

@Component({
  selector: 'app-root',
  imports: [OrderBookComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
