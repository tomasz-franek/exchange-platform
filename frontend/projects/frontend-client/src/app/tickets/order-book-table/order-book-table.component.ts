import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { RatioPipe } from '../../../pipes/ratio-pipe/ratio.pipe';
import { TableModule } from 'primeng/table';
import { Card } from 'primeng/card';
import { OrderBookStore } from 'shared-modules';

@Component({
  selector: 'app-order-book-table',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    RatioPipe,
    AmountPipe,
    TableModule,
    Card,
  ],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.scss',
})
export class OrderBookTableComponent {
  protected readonly orderBookStore = inject(OrderBookStore);
  constructor() {}
}
