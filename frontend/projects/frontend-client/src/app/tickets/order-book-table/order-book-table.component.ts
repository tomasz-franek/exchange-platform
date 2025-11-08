import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {RatioPipe} from '../../../pipes/ratio-pipe/ratio.pipe';
import {OrderBookList} from '../../utils/order-book-list';
import {Pair} from '../../api/model/pair';
import {OrderBookData} from '../../api/model/orderBookData';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-order-book-table',
  imports: [ReactiveFormsModule, TranslatePipe, RatioPipe, AmountPipe, TableModule],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css'
})
export class OrderBookTableComponent {
  @Input() pair: Pair | undefined;
  @Input() orderBookData: OrderBookList;
  @Input() buyCurrency = '';
  @Input() viewMode: string | undefined;

  constructor() {
    this.orderBookData = new OrderBookList({s: [], b: []} as OrderBookData);
  }
}
