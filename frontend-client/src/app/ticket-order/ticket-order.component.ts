import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getTicketId, TicketState } from '../state/tickets/ticket.selectors';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import {
  incrementTicketId,
  sendExchangeTicket,
} from '../state/tickets/ticket.actions';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { Pair } from '../api/model/pair';
import { Direction } from '../api/model/direction';
import { pairValidator } from '../utils/pair-validator';
import { directionValidator } from '../utils/direction.validator';
import { PairUtils } from '../utils/pair-utils';

@Component({
  selector: 'app-ticket-order',
  imports: [ReactiveFormsModule, TranslatePipe, NgForOf],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.css',
})
export class TicketOrderComponent {
  protected _formGroup: FormGroup;
  protected _pairs = Pair;
  protected _directions = Direction;
  private _storeTicket$: Store<TicketState> = inject(Store);

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    this._formGroup = this.formBuilder.group({
      ratio: [0, [Validators.required, Validators.min(0.0001)]],
      value: [0, [Validators.required, Validators.min(0.01)]],
      pair: [null, [Validators.required, pairValidator()]],
      direction: [null, [Validators.required, directionValidator()]],
      currencyLabel: ['', []],
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  sendTicket() {
    let longValue = Math.round(this._formGroup.get('value')?.value * 10000);
    let longRatio = Math.round(this._formGroup.get('ratio')?.value * 10000);
    let userTicket = {
      id: 1,
      direction: this._formGroup.get('direction')?.value,
      idUserAccount: '774243f8-9ad1-4d47-b4ef-8efb1bdb3287',
      idUser: 1,
      pair: this._formGroup.get('pair')?.value,
      ratio: longRatio,
      value: longValue,
      epochUTC: 1,
    } as UserTicket;
    this._storeTicket$.dispatch(incrementTicketId());
    this._storeTicket$.select(getTicketId).subscribe((state) => {
      userTicket.id = state;
      this._storeTicket$.dispatch(sendExchangeTicket({ userTicket }));
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
          this._formGroup.patchValue({ value: parsedValue });
          break;
        case 'ratio':
          this._formGroup.patchValue({ ratio: parsedValue });
          break;
      }
    }
  }

  setValueCurrencyLabel() {
    const pair = this._formGroup.get('pair')?.value;
    const direction = this._formGroup.get('direction')?.value;
    if (direction != null) {
      if (direction === 'SELL') {
        this._formGroup.patchValue({
          currencyLabel: PairUtils.getBaseCurrency(pair),
        });
      } else {
        this._formGroup.patchValue({
          currencyLabel: PairUtils.getQuoteCurrency(pair),
        });
      }
    } else {
      this._formGroup.patchValue({ currencyLabel: '' });
    }
    console.log(this._formGroup.get('currencyLabel')?.value);
  }

  showCurrencyLabel() {
    return this._formGroup.get('currencyLabel')?.value;
  }
}
