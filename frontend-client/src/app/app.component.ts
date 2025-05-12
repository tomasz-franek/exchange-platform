import { Component } from '@angular/core';
import { OrderBookChartComponent } from './order-book-chart/order-book-chart.component';

@Component({
  selector: 'app-root',
  imports: [OrderBookChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-client';
}
