import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserTicket } from '../../api/model/userTicket';
import {
  selectUserTicketList,
  TicketState,
} from '../../state/ticket/ticket.selectors';
import {
  cancelExchangeTicketAction,
  loadUserTicketListAction,
} from '../../state/ticket/ticket.actions';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RatioPipe } from '../../utils/pipes/ratio-pipe/ratio.pipe';
import { AmountPipe } from '../../utils/pipes/amount-pipe/amount.pipe';

@Component({
  selector: 'app-ticket-list',
  imports: [AsyncPipe, TranslatePipe, RatioPipe, AmountPipe],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
  standalone: true,
})
export class TicketListComponent implements OnInit {
  protected _tickets$: UserTicket[] = [];
  protected _storeTicket$: Store<TicketState> = inject(Store);

  ngOnInit(): void {
    this._storeTicket$.select(selectUserTicketList).subscribe((data) => {
      this._tickets$ = data;
    });
    this._storeTicket$.dispatch(loadUserTicketListAction());
  }

  cancelExchangeTicket(userTicket: UserTicket) {
    this._storeTicket$.dispatch(cancelExchangeTicketAction({ userTicket }));
  }
}
