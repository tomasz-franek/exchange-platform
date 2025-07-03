import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserTicket } from '../api/model/userTicket';
import {
  selectUserTicketList,
  TicketState,
} from '../state/ticket/ticket.selectors';
import {
  cancelExchangeTicketAction,
  loadUserTicketListAction,
} from '../state/ticket/ticket.actions';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RatioPipe } from '../pipes/ratio.pipe';
import { AmountPipe } from '../pipes/amount.pipe';

@Component({
  selector: 'app-ticket-list',
  imports: [AsyncPipe, TranslatePipe, RatioPipe, AmountPipe],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
})
export class TicketListComponent implements OnInit, OnDestroy {
  protected _tickets$!: Observable<UserTicket[]>;
  protected _storeTicket$: Store<TicketState> = inject(Store);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this._tickets$ = this._storeTicket$
      .select(selectUserTicketList)
      .pipe(takeUntil(this._destroy$));
    this._storeTicket$.dispatch(loadUserTicketListAction());
  }

  cancelExchangeTicket(userTicket: UserTicket) {
    this._storeTicket$.dispatch(cancelExchangeTicketAction({ userTicket }));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
