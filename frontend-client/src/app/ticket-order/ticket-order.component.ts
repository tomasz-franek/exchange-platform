import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TicketState} from '../state/tickets/ticket.selectors';
import {Store} from '@ngrx/store';
import {UserTicket} from '../api';
import {sendExchangeTicket} from '../state/tickets/ticket.action';
import * as uuid from "uuid";

@Component({
  selector: 'app-ticket-order',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.css',
})
export class TicketOrderComponent implements OnInit {
  protected _formGroup: FormGroup;
  private _storeTicket$: Store<TicketState> = inject(Store);

  constructor(private formBuilder: FormBuilder) {
    this._formGroup = this.formBuilder.group({
      idUser: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.formGroup.setValue({idUser: 1});
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  sendTicket() {
    let userTicket: UserTicket;
    let idUser = uuid.v4();
    userTicket = {
      direction: 'BUY',
      idUser,
      order: 'x',
      pair: 'EUR_USD',
      ratio: 10,
      value: 10,
    };
    this._storeTicket$.dispatch(sendExchangeTicket({idUser: 1, userTicket}));
  }
}
