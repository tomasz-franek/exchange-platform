import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TicketState } from '../state/tickets/ticket.selectors';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import { sendExchangeTicket } from '../state/tickets/ticket.action';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-order',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './ticket-order.component.html',
  styleUrl: './ticket-order.component.css',
})
export class TicketOrderComponent implements OnInit {
  protected _formGroup: FormGroup;
  private _storeTicket$: Store<TicketState> = inject(Store);

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    this._formGroup = this.formBuilder.group({
      idUser: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.formGroup.setValue({ idUser: 1 });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  sendTicket() {
    let userTicket: UserTicket;
    let idUser = 1;
    userTicket = {
      id: 1,
      direction: 'BUY',
      idUser,
      pair: 'EUR_USD',
      ratio: 10,
      value: 10,
      epochUTC: 1,
    };
    this._storeTicket$.dispatch(sendExchangeTicket({ idUser: 1, userTicket }));
  }
}
