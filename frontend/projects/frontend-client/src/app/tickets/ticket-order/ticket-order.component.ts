import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Pair} from '../../api/model/pair';
import {Direction} from '../../api/model/direction';
import {PairUtils} from 'shared-modules';
import {pairValidator} from '../../../validators/pair/pair-validator';
import {directionValidator} from '../../../validators/direction/direction.validator';
import {UserTicket} from '../../api/model/userTicket';
import {OrderBookTableComponent} from '../order-book-table/order-book-table.component';
import {TicketMenu} from '../ticket-menu/ticket-menu';
import {MenuComponent} from '../../menu/menu.component';
import {OrderBookChartComponent} from '../order-book-chart/order-book-chart.component';
import {OrderBookData} from '../../api/model/orderBookData';
import {WebsocketService} from '../../../services/websocket/websocket.service';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Card} from 'primeng/card';
import {TicketStore} from '../tickets.signal-store';
import {PropertyStore} from '../../properties/properties.signal-store';
import {Toast} from 'primeng/toast';
import {AccountsStore} from '../../accounts/accounts.signal-store';
import {OrderBookStore} from '../../utils/order-book-store';

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
    Select,
    Card,
    Toast,
  ],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.scss',
})
export class TicketOrderComponent implements OnInit {
  readonly formGroup: FormGroup;
  protected _pairs = Object.entries(Pair).map(([_, value]) => ({ value }));
  protected _directions = Object.entries(Direction).map(([_, value]) => ({
    value,
  }));
  protected readonly websocketService: WebsocketService =
    inject(WebsocketService);
  protected readonly orderBookMap = new Map<Pair, OrderBookData>();
  protected readonly orderBookStore = inject(OrderBookStore);
  protected translateService: TranslateService = inject(TranslateService);
  protected readonly PairUtils = PairUtils;
  protected readonly store = inject(TicketStore);
  protected readonly storeProperties = inject(PropertyStore);
  protected readonly storeAccounts = inject(AccountsStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      ratio: new FormControl(undefined, [
        Validators.required,
        Validators.min(0.0001),
      ]),
      amount: new FormControl(undefined, [
        Validators.required,
        Validators.min(0.01),
      ]),
      pair: new FormControl(undefined, [Validators.required, pairValidator()]),
      direction: new FormControl(undefined, [
        Validators.required,
        directionValidator(),
      ]),
      userAccountId: new FormControl(undefined, [Validators.required]),
      currencyLabel: new FormControl(undefined, []),
      normalView: new FormControl('normal', []),
      minimumAmount: new FormControl(undefined, []),
    });
    effect(() => {
      let messages = this.websocketService.getMessages();
      if (messages) {
        messages.forEach((orderBookDataArray) => {
          const pair = this.formGroup.get('pair')?.value;
          orderBookDataArray.forEach((orderBookData: OrderBookData) => {
            if (orderBookData.f) {
              this.fullUpdate(orderBookData, pair);
            } else {
              this.orderBookStore.updateData({ orderBookData, pair });
            }
          });
        });
      }
    });
  }

  fullUpdate(orderBookData: OrderBookData, pair: Pair) {
    if (orderBookData.p == pair) {
      this.orderBookStore.updateData({ orderBookData, pair });
    }
    if (orderBookData.p != undefined) {
      this.orderBookMap.set(orderBookData.p, orderBookData);
    }
  }

  ngOnInit(): void {
    this.storeAccounts.loadAccountBalanceList();
    this.storeProperties.loadSystemCurrencyList();
  }

  saveTicket() {
    this.store.incrementTicketId();
    const longAmount = Math.round(this.formGroup.get('amount')?.value * 10000);
    const longRatio = Math.round(this.formGroup.get('ratio')?.value * 10000);
    const userTicket = {
      id: this.store.ticketId(),
      direction: this.formGroup.get('direction')?.value,
      userAccountId: this.formGroup.get('userAccountId')?.value,
      pair: this.formGroup.get('pair')?.value,
      ratio: longRatio,
      amount: longAmount,
      epochUtc: 10000,
      eventType: 'ORDER',
      ticketStatus: 'NEW',
      currency: this.formGroup.get('currencyLabel')?.value,
      version: 0,
    } as UserTicket;
    this.store.saveTicket(userTicket);
  }

  onDecimalChange($event: any, formControlName: string) {
    const parsedValue = Number.parseFloat($event.target.value);
    if (!Number.isNaN(parsedValue)) {
      switch (formControlName) {
        case 'amount':
          this.formGroup.patchValue({ value: parsedValue });
          break;
        case 'ratio':
          this.formGroup.patchValue({ ratio: parsedValue });
          break;
      }
    }
  }

  setValueCurrencyLabel() {
    const pair = this.formGroup.get('pair')?.value;
    const direction = this.formGroup.get('direction')?.value;
    if (pair != this.orderBookStore.pair()) {
      this.orderBookStore.clearData();
    }
    if (direction == null) {
      this.formGroup.patchValue({
        currencyLabel: '',
        userAccountId: null,
        minimumAmount: 0.01,
      });
      this.formGroup
        .get('amount')
        ?.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      let currency: string | undefined;
      if (direction === 'SELL') {
        currency = PairUtils.getBaseCurrency(pair);
      } else {
        currency = PairUtils.getQuoteCurrency(pair);
      }
      let newMinimumAmount: number | undefined = this.storeProperties
        .systemCurrencyList()
        .find((e) => e.currency == currency)?.minimumExchange;
      newMinimumAmount = newMinimumAmount ?? 0.01;

      this.formGroup.patchValue({
        currencyLabel: currency,
        userAccountId: this.getUserAccountId(currency),
        minimumAmount: newMinimumAmount,
      });
      this.formGroup
        .get('amount')
        ?.setValidators([
          Validators.required,
          Validators.min(newMinimumAmount),
        ]);
    }
    this.formGroup.updateValueAndValidity();
  }

  showCurrencyLabel() {
    return this.formGroup.get('currencyLabel')?.value;
  }

  getUserAccountId(currency: string): string | undefined {
    let accountId: string | undefined = undefined;
    const accounts = this.storeAccounts.accountBalanceList();
    if (accounts && accounts.length > 0) {
      accountId = accounts.find(
        (acc) => acc.currency === currency,
      )?.userAccountId;
    }
    return accountId;
  }
}
