import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { WebsocketOrderBookService } from '../../services/websocket.orderbook.service';
import { AmountPipe } from '../../utils/pipes/amount-pipe/amount.pipe';
import { RatioPipe } from '../../utils/pipes/ratio-pipe/ratio.pipe';
import { OrderBookList } from '../../utils/order-book-list';
import { Pair } from '../../api/model/pair';
import { OrderBookData } from '../../api/model/orderBookData';

@Component({
  selector: 'app-order-book-table',
  imports: [ReactiveFormsModule, TranslatePipe, RatioPipe, AmountPipe],
  providers: [WebsocketOrderBookService],
  templateUrl: './order-book-table.component.html',
  styleUrl: './order-book-table.component.css',
})
export class OrderBookTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pair: Pair | undefined;
  protected readonly orderBookMap: Map<Pair, OrderBookData> = new Map();
  protected readonly formGroup: FormGroup;
  protected orderBookData: OrderBookList;
  private readonly _destroy$: Subject<void> = new Subject<void>();
  protected readonly websocketService: WebsocketOrderBookService = inject(
    WebsocketOrderBookService,
  );
  protected bidTableData: any[] = [];
  protected askTableData: any[] = [];
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.orderBookData = new OrderBookList({} as OrderBookData);
    this.formGroup = this.formBuilder.group({
      normalView: new FormControl('normal', [Validators.required]),
    });
  }

  ngOnChanges() {
    if (this.pair == undefined) {
      this.orderBookData.updateData({
        p: this.pair,
        f: false,
        b: [],
        s: [],
      });
    } else {
      this.orderBookData.updateData(
        this.orderBookMap.get(this.pair) || {
          p: this.pair,
          f: false,
          b: [],
          s: [],
        },
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
      ? this.orderBookData.normalAsk
      : this.orderBookData.cumulativeAsk;
    this.bidTableData = normalData
      ? this.orderBookData.normalBid
      : this.orderBookData.cumulativeBid;
  }

  changeView(newViewFormat: string) {
    const normalView = newViewFormat == 'normal';
    this.formGroup.patchValue({ normalView });
    this.setChartData(normalView);
  }

  protected readonly OrderBookData = OrderBookList;
}
