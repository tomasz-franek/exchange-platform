import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectTicketId, TicketState } from '../state/ticket/ticket.selectors';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import {
  incrementTicketId,
  saveExchangeTicketAction,
} from '../state/ticket/ticket.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { Pair } from '../api/model/pair';
import { Direction } from '../api/model/direction';
import { pairValidator } from '../utils/pair-validator';
import { directionValidator } from '../utils/direction.validator';
import { PairUtils } from '../utils/pair-utils';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs/internal/Observable';
import {
  AccountState,
  selectAccountBalanceList,
} from '../state/account/account.selectors';
import { loadAccountBalanceListAction } from '../state/account/account.actions';
import { AccountBalance } from '../api/model/accountBalance';
import { first, map, Subject, takeUntil } from 'rxjs';
import { OrderBookTableComponent } from '../order-book-table/order-book-table.component';

@Component({
  selector: 'app-ticket-order',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    NgForOf,
    OrderBookTableComponent,
  ],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.css',
})
export class TicketOrderComponent implements OnInit, OnDestroy {
  readonly formGroup: FormGroup;
  protected _pairs = Pair;
  protected _directions = Direction;
  protected _accounts$!: Observable<AccountBalance[]>;
  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private _storeTicket$: Store<TicketState>,
    private _storeAccounts$: Store<AccountState>,
  ) {
    this.formGroup = this.formBuilder.group({
      ratio: new FormControl(2, [Validators.required, Validators.min(0.0001)]),
      amount: new FormControl(20, [Validators.required, Validators.min(0.01)]),
      pair: new FormControl(undefined, [Validators.required, pairValidator()]),
      direction: new FormControl('BUY', [
        Validators.required,
        directionValidator(),
      ]),
      userAccountId: new FormControl(undefined, [Validators.required]),
      currencyLabel: new FormControl(undefined, []),
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngOnInit(): void {
    this._accounts$ = this._storeAccounts$.select(selectAccountBalanceList);
    this._storeAccounts$.dispatch(loadAccountBalanceListAction());
    this._storeTicket$
      .select(selectTicketId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((id) => {
        if (this.formGroup.invalid) {
          return;
        }
        let longAmount = Math.round(
          this.formGroup.get('amount')?.value * 10000,
        );
        let longRatio = Math.round(this.formGroup.get('ratio')?.value * 10000);
        const userTicket = {
          id,
          direction: this.formGroup.get('direction')?.value,
          userAccountId: this.formGroup.get('userAccountId')?.value,
          userId: uuid(),
          pair: this.formGroup.get('pair')?.value,
          ratio: longRatio,
          amount: longAmount,
          epochUTC: 1,
          eventType: 'EXCHANGE',
          version: 0,
        } as UserTicket;
        this._storeTicket$.dispatch(saveExchangeTicketAction({ userTicket }));
      });
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
    if (direction != null) {
      let currency: string | undefined = undefined;
      if (direction === 'SELL') {
        currency = PairUtils.getBaseCurrency(pair);
      } else {
        currency = PairUtils.getQuoteCurrency(pair);
      }
      this.formGroup.patchValue({
        currencyLabel: currency,
        userAccountId: this.getUserAccountId(currency),
      });
    } else {
      this.formGroup.patchValue({ currencyLabel: '', userAccountId: null });
    }
  }

  showCurrencyLabel() {
    return this.formGroup.get('currencyLabel')?.value;
  }

  getUserAccountId(currency: string): string | undefined {
    let accountId: string | undefined = undefined;

    // Subscribe to the observable to get the account balances
    this._accounts$
      .pipe(
        first(), // Take the first emitted value and complete
        map((accounts: AccountBalance[]) => {
          // Find the account that matches the specified currency
          const account = accounts.find((acc) => acc.currency === currency);
          return account ? account.userAccountId : undefined; // Return the account ID or null if not found
        }),
      )
      .subscribe((id) => {
        accountId = id; // Store the result in the accountId variable
      });

    return accountId; // Return the account ID (may be null if not found)
  }
}
