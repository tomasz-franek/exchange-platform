import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderBookTableComponent } from './order-book-table/order-book-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [TranslatePipe, OrderBookTableComponent],
})
export class AppComponent {
  title = 'frontend-client';
}
