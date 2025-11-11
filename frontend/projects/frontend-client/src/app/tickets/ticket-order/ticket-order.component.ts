import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {incrementTicketId, saveExchangeTicketAction} from '../state/ticket.actions';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Pair} from '../../api/model/pair';
import {Direction} from '../../api/model/direction';
import {PairUtils} from '../../utils/pair-utils';
import {Observable} from 'rxjs/internal/Observable';
import {AccountState, selectAccountBalanceList} from '../../accounts/state/account.selectors';
import {loadAccountBalanceListAction} from '../../accounts/state/account.actions';
import {AccountBalance} from '../../api/model/accountBalance';
import {first, map, Subject, takeUntil} from 'rxjs';
import {selectTicketId, TicketState} from '../state/ticket.selectors';
import {pairValidator} from '../../../validators/pair/pair-validator';
import {directionValidator} from '../../../validators/direction/direction.validator';
import {UserTicket} from '../../api/model/userTicket';
import {OrderBookTableComponent} from '../order-book-table/order-book-table.component';
import {TicketMenu} from '../ticket-menu/ticket-menu';
import {MenuComponent} from '../../menu/menu.component';
import {OrderBookChartComponent} from '../order-book-chart/order-book-chart.component';
import {OrderBookData} from '../../api/model/orderBookData';
import {WebsocketService} from '../../../services/websocket/websocket.service';
import {OrderBookList} from '../../utils/order-book-list';
import {PropertyState, selectSystemCurrencyList} from '../../properties/state/properties.selectors';
import {SystemCurrency} from '../../api/model/systemCurrency';
import {loadSystemCurrencyListAction} from '../../properties/state/properties.actions';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {SelectButton} from 'primeng/selectbutton';
import {Select} from 'primeng/select';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-ticket-order',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    OrderBookTableComponent,
    TicketMenu,
    MenuComponent,
    OrderBookChartComponent,
    Button,
    InputText,
    SelectButton,
    Select,
    Card
  ],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.scss'
})
export class TicketOrderComponent implements OnInit, OnDestroy {
  readonly formGroup: FormGroup;
  protected _pairs = Object.entries(Pair).map(([_, value]) => ({value}))
  protected _directions = Object.entries(Direction).map(([_, value]) => ({value}))
  protected _accounts$!: Observable<AccountBalance[]>;
  protected systemCurrencies: SystemCurrency[] = [];
  protected viewMode = 'normal';
  protected readonly websocketService: WebsocketService = inject(WebsocketService);
  protected readonly orderBookMap = new Map<Pair, OrderBookData>();
  protected orderBookData: OrderBookList = new OrderBookList({s: [], b: []} as OrderBookData);
  protected translateService: TranslateService = inject(TranslateService);
  protected readonly PairUtils = PairUtils;
  protected stateOptions: any[] = [];
  private readonly _destroy$: Subject<void> = new Subject<void>();
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _storeTicket$: Store<TicketState> = inject(Store);
  private _storeAccounts$: Store<AccountState> = inject(Store);
  private _storeProperties$: Store<PropertyState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      ratio: new FormControl(2, [Validators.required, Validators.min(0.0001)]),
      amount: new FormControl(20, [Validators.required, Validators.min(0.01)]),
      pair: new FormControl(undefined, [Validators.required, pairValidator()]),
      direction: new FormControl(undefined, [Validators.required, directionValidator()]),
      userAccountId: new FormControl(undefined, [Validators.required]),
      currencyLabel: new FormControl(undefined, []),
      normalView: new FormControl('normal', []),
      minimumAmount: new FormControl(undefined, [])
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngOnInit(): void {
    this.stateOptions = [
      {
        label: this.translateService.instant('NORMAL'),
        value: 'normal',
      },
      {
        label: this.translateService.instant('CUMULATIVE'),
        value: 'cumulative',
      }
    ]
    this.websocketService
    .getMessages()
    .pipe(takeUntil(this._destroy$))
    .subscribe((rows: OrderBookData[]) => {
      rows.forEach((row) => {
        if (row.p == this.formGroup.get('pair')?.value) {
          this.orderBookData.updateData(row);
        }
        if (row.p != undefined) {
          this.orderBookMap.set(row.p, row);
        }
      });
    });

    this._accounts$ = this._storeAccounts$.select(selectAccountBalanceList);
    this._storeAccounts$.dispatch(loadAccountBalanceListAction());
    this._storeTicket$
    .select(selectTicketId)
    .pipe(takeUntil(this._destroy$))
    .subscribe((id) => {
      if (this.formGroup.invalid) {
        return;
      }
      const longAmount = Math.round(
        this.formGroup.get('amount')?.value * 10000
      );
      const longRatio = Math.round(this.formGroup.get('ratio')?.value * 10000);
      const userTicket = {
        id,
        direction: this.formGroup.get('direction')?.value,
        userAccountId: this.formGroup.get('userAccountId')?.value,
        pair: this.formGroup.get('pair')?.value,
        ratio: longRatio,
        amount: longAmount,
        epochUtc: 10000,
        eventType: 'ORDER',
        ticketStatus: 'NEW',
        currency: this.formGroup.get('currencyLabel')?.value,
        version: 0
      } as UserTicket;
      this._storeTicket$.dispatch(saveExchangeTicketAction({userTicket}));
    });
    this._storeProperties$.select(selectSystemCurrencyList).subscribe((data) => this.systemCurrencies = data);
    this._storeProperties$.dispatch(loadSystemCurrencyListAction());
  }

  saveTicket() {
    this._storeTicket$.dispatch(incrementTicketId());
  }

  getPairKeys(): (keyof typeof Pair)[] {
    return Object.keys(this._pairs) as (keyof typeof Pair)[];
  }

  getDirectionKeys(): (keyof typeof Direction)[] {
    return Object.keys(this._directions) as (keyof typeof Direction)[];
  }

  onDecimalChange($event: any, formControlName: string) {
    const parsedValue = parseFloat($event.target.value);
    if (!isNaN(parsedValue)) {
      switch (formControlName) {
        case 'amount':
          this.formGroup.patchValue({value: parsedValue});
          break;
        case 'ratio':
          this.formGroup.patchValue({ratio: parsedValue});
          break;
      }
    }
  }

  setValueCurrencyLabel() {
    const pair = this.formGroup.get('pair')?.value;
    const direction = this.formGroup.get('direction')?.value;

    console.log(pair, direction)
    if (direction != null) {
      let currency: string | undefined;
      if (direction === 'SELL') {
        currency = PairUtils.getBaseCurrency(pair);
      } else {
        currency = PairUtils.getQuoteCurrency(pair);
      }
      let newMinimumAmount: number | undefined = this.systemCurrencies.find(e => e.currency == currency)?.minimumExchange;
      if (newMinimumAmount == null) {
        newMinimumAmount = 0.01;
      }
      this.formGroup.patchValue({
        currencyLabel: currency,
        userAccountId: this.getUserAccountId(currency),
        minimumAmount: newMinimumAmount
      });
      this.formGroup.get('amount')?.setValidators([Validators.required, Validators.min(newMinimumAmount)]);
      this.formGroup.updateValueAndValidity();
    } else {
      this.formGroup.patchValue({
        currencyLabel: '',
        userAccountId: null,
        minimumAmount: 0.01
      });
      this.formGroup.get('amount')?.setValidators([Validators.required, Validators.min(0.01)]);
      this.formGroup.updateValueAndValidity();
    }
    console.log(this.formGroup)
  }

  showCurrencyLabel() {
    return this.formGroup.get('currencyLabel')?.value;
  }

  getUserAccountId(currency: string): string | undefined {
    let accountId: string | undefined = undefined;

    this._accounts$
    .pipe(
      first(),
      map((accounts: AccountBalance[]) => {
        const account = accounts.find((acc) => acc.currency === currency);
        return account ? account.userAccountId : undefined;
      })
    )
    .subscribe((id) => {
      accountId = id;
    });

    return accountId;
  }

  changeView(newViewFormat: string) {
    this.viewMode = newViewFormat;
    this.orderBookData.cumulative = newViewFormat == 'cumulative';
  }
}
