import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectTicketId, TicketState } from '../state/ticket/ticket.selectors';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import {
  incrementTicketId,
  saveExchangeTicket,
} from '../state/ticket/ticket.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { Pair } from '../api/model/pair';
import { Direction } from '../api/model/direction';
import { pairValidator } from '../utils/pair-validator';
import { directionValidator } from '../utils/direction.validator';
import { PairUtils } from '../utils/pair-utils';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-ticket-order',
  imports: [ReactiveFormsModule, TranslatePipe, NgForOf],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.css',
})
export class TicketOrderComponent {
  readonly formGroup: FormGroup;
  protected _pairs = Pair;
  protected _directions = Direction;

  constructor(
    private formBuilder: FormBuilder,
    private _storeTicket$: Store<TicketState>,
  ) {
    this.formGroup = this.formBuilder.group({
      ratio: [2, [Validators.required, Validators.min(0.0001)]],
      amount: [20, [Validators.required, Validators.min(0.01)]],
      pair: ['EUR_PLN', [Validators.required, pairValidator()]],
      direction: ['BUY', [Validators.required, directionValidator()]],
      currencyLabel: ['', []],
    });
  }

  saveTicket() {
    let longAmount = Math.round(this.formGroup.get('amount')?.value * 10000);
    let longRatio = Math.round(this.formGroup.get('ratio')?.value * 10000);
    let userTicket = {
      direction: this.formGroup.get('direction')?.value,
      userAccountId: '774243f8-9ad1-4d47-b4ef-8efb1bdb3287',
      userId: uuid(),
      pair: this.formGroup.get('pair')?.value,
      ratio: longRatio,
      amount: longAmount,
      epochUTC: 1,
    } as UserTicket;
    this._storeTicket$.dispatch(incrementTicketId());
    this._storeTicket$.select(selectTicketId).subscribe((state) => {
      userTicket.id = state;
      this._storeTicket$.dispatch(saveExchangeTicket({ userTicket }));
    });
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
      if (direction === 'SELL') {
        this.formGroup.patchValue({
          currencyLabel: PairUtils.getBaseCurrency(pair),
        });
      } else {
        this.formGroup.patchValue({
          currencyLabel: PairUtils.getQuoteCurrency(pair),
        });
      }
    } else {
      this.formGroup.patchValue({ currencyLabel: '' });
    }
  }

  showCurrencyLabel() {
    return this.formGroup.get('currencyLabel')?.value;
  }
}
