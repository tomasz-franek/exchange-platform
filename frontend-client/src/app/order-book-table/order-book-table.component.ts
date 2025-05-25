import { Component, OnInit } from '@angular/core';
import { OrderBookData } from '../utils/order-book-data';
import { OrderBookChartComponent } from '../order-book-chart/order-book-chart.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConnectWebSocket } from '@ngxs/websocket-plugin';
import { Select, Store } from '@ngxs/store';
import { KafkaState } from '../state/websockets/kafka.state';

@Component({
  selector: 'app-order-book-table',
  imports: [ReactiveFormsModule, NgForOf, NgIf, TranslatePipe, AsyncPipe],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css',
})
export class OrderBookTableComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  @Select(KafkaState.messages)
  protected kafkaMessages$!: Observable<string[]>;
  protected orderBookData: OrderBookData;
  protected bidTableData: any[] = [];
  protected askTableData: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.orderBookData = new OrderBookData(OrderBookChartComponent.data);
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [Validators.required]),
    });
    this.store.dispatch(new ConnectWebSocket());
  }

  ngOnInit() {
    this.setChartData(true);
  }

  private setChartData(normalData: boolean) {
    this.askTableData = normalData
      ? this.orderBookData.normalAskData
      : this.orderBookData.cumulativeAskData;
    this.bidTableData = normalData
      ? this.orderBookData.normalBidData
      : this.orderBookData.cumulativeBidData;
  }

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this.formGroup.patchValue({ normalView });
    this.setChartData(normalView);
  }

  protected readonly OrderBookData = OrderBookData;
}
