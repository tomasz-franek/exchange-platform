import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import {
  selectUserTicketList,
  TicketState,
} from '../state/ticket/ticket.selectors';
import { loadUserTicketListAction } from '../state/ticket/ticket.actions';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-list',
  imports: [AsyncPipe, NgForOf, TranslatePipe],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
})
export class TicketListComponent implements OnInit {
  protected _tickets$!: Observable<UserTicket[]>;
  protected _storeTicket$: Store<TicketState> = inject(Store);

  ngOnInit(): void {
    this._tickets$ = this._storeTicket$.select(selectUserTicketList);
    this._storeTicket$.dispatch(
      loadUserTicketListAction({
        userId: '72aa8932-8798-4d1b-aaf0-590a3e6ffaa5',
      }),
    );
  }
}
