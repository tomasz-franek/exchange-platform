import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderBookData } from '../utils/order-book-data';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { WebsocketOrderBookService } from '../services/websocket.orderbook.service';
import { Subject, takeUntil } from 'rxjs';
import { RatioPipe } from '../pipes/ratio.pipe';
import { AmountPipe } from '../pipes/amount.pipe';

@Component({
  selector: 'app-order-book-table',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    TranslatePipe,
    RatioPipe,
    AmountPipe,
  ],
  providers: [WebsocketOrderBookService],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css',
})
export class OrderBookTableComponent implements OnInit, OnDestroy {
  protected readonly formGroup: FormGroup;
  protected orderBookData: OrderBookData;
  private readonly _destroy$: Subject<void> = new Subject<void>();
  protected readonly websocketService: WebsocketOrderBookService = inject(
    WebsocketOrderBookService,
  );
  protected bidTableData: any[] = [];
  protected askTableData: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.orderBookData = new OrderBookData({ ask: [], bid: [] });
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [Validators.required]),
    });
  }

  ngOnInit() {
    this.websocketService
      .getMessages()
      .pipe(takeUntil(this._destroy$))
      .subscribe((message) => {
        this.orderBookData.updateData(message);
        console.log(message);
        this.setChartData(this.formGroup.get('normalView')?.value);
      });
    this.setChartData(true);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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
