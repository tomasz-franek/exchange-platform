import { Component, inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { RatioPipe } from '../../../pipes/ratio-pipe/ratio.pipe';
import { OrderBookList } from '../../utils/order-book-list';
import { Pair } from '../../api/model/pair';
import { OrderBookData } from '../../api/model/orderBookData';
import { PairUtils } from '../../utils/pair-utils';

@Component({
  selector: 'app-order-book-table',
  imports: [ReactiveFormsModule, TranslatePipe, RatioPipe, AmountPipe],
  providers: [WebsocketService],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css'
})
export class OrderBookTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pair: Pair | undefined;
  protected readonly orderBookMap = new Map<Pair, OrderBookData>();
  protected readonly formGroup: FormGroup;
  protected orderBookData: OrderBookList;
  private readonly _destroy$: Subject<void> = new Subject<void>();
  protected readonly websocketService: WebsocketService = inject(WebsocketService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  @Input() buyCurrency = '';

  constructor() {
    this.orderBookData = new OrderBookList({} as OrderBookData);
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [])
    });
  }

  ngOnChanges() {
    if (this.pair == undefined) {
      this.orderBookData.updateData({
        p: this.pair,
        f: false,
        b: [],
        s: []
      });
    } else {
      this.orderBookData.updateData(
        this.orderBookMap.get(this.pair) || {
          p: this.pair,
          f: false,
          b: [],
          s: []
        }
      );
    }
  }

  ngOnInit() {
    this.websocketService
    .getMessages()
    .pipe(takeUntil(this._destroy$))
    .subscribe((rows: OrderBookData[]) => {
      rows.forEach((row) => {
        if (row.p == this.pair) {
          this.orderBookData.updateData(row);
        }
        if (row.p != undefined) {
          this.orderBookMap.set(row.p, row);
        }
      });
    });
    this.changeView(this.formGroup.get('normalView')?.value);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected setChartData(normalData: boolean) {
    this.orderBookData.cumulated = !normalData;
  }

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this.formGroup.patchValue({ normalView: newViewFormat });
    this.setChartData(normalView);
  }


  protected readonly PairUtils = PairUtils;
}
