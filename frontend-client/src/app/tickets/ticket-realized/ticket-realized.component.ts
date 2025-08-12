import { Component, inject, OnInit } from '@angular/core';
import { TicketMenu } from '../ticket-menu/ticket-menu';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { RatioPipe } from '../../../pipes/ratio-pipe/ratio.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { UserTicket } from '../../api/model/userTicket';
import { selectRealizedTicketList, TicketState } from '../state/ticket.selectors';
import { Store } from '@ngrx/store';
import {
  loadExchangePdfDocumentAction,
  loadRealizedTicketListAction
} from '../state/ticket.actions';

@Component({
  selector: 'app-ticket-realized',
  imports: [
    TicketMenu,
    AmountPipe,
    RatioPipe,
    TranslatePipe
  ],
  templateUrl: './ticket-realized.component.html',
  styleUrl: './ticket-realized.component.css'
})
export class TicketRealizedComponent implements OnInit {
  protected _tickets$: UserTicket[] = [];
  protected _storeTicket$: Store<TicketState> = inject(Store);

  ngOnInit() {
    this._storeTicket$.select(selectRealizedTicketList).subscribe((data) => {
      this._tickets$ = data;
    });
    this._storeTicket$.dispatch(loadRealizedTicketListAction());
  }

  getExchangePdfDocument(id: number) {
    this._storeTicket$.dispatch(loadExchangePdfDocumentAction({ id }));
  }
}
