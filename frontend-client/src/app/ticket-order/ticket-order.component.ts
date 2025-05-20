import { Component, inject, OnInit } from '@angular/core';
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
} from '../state/tickets/ticket.action';
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
    let userTicket = {
      id: 1,
      direction: 'BUY',
      idUserAccount: '774243f8-9ad1-4d47-b4ef-8efb1bdb3287',
      idUser: 1,
      pair: 'EUR_USD',
      ratio: 10,
      value: 10,
      epochUTC: 1,
    } as UserTicket;
    this._storeTicket$.dispatch(incrementTicketId());
    this._storeTicket$.select(getTicketId).subscribe((state) => {
      userTicket.id = state;
      this._storeTicket$.dispatch(sendExchangeTicket({ userTicket }));
    });
  }
}
