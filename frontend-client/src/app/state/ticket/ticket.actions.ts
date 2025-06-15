import { createAction, props } from '@ngrx/store';
import { UserTicket } from '../../api/model/userTicket';
import { HttpErrorResponse } from '@angular/common/http';

export const saveExchangeTicketAction = createAction(
  '[Ticket] SaveExchangeTicket',
  props<{ userTicket: UserTicket }>(),
);
export const saveExchangeTicketActionSuccess = createAction(
  '[Ticket] SaveExchangeTicketActionSuccess',
);
export const saveExchangeTicketActionError = createAction(
  '[Ticket] SaveExchangeTicketActionError',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const incrementTicketId = createAction('[Ticket] IncrementTicketId');

export const loadUserTicketListAction = createAction(
  '[Ticket] Load UserTicketList',
);

export const loadUserTicketListActionSuccess = createAction(
  '[Ticket] Load UserTicketList Success',
  props<{ userTicketList: UserTicket[] }>(),
);

export const loadUserTicketListActionError = createAction(
  '[Ticket] Load UserTicketList Error',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const cancelExchangeTicketAction = createAction(
  '[Ticket] Cancel Exchange Ticket',
  props<{ id: number }>(),
);

export const cancelExchangeTicketSuccess = createAction(
  '[Ticket] Cancel Exchange Ticket Success',
);

export const cancelExchangeTicketError = createAction(
  '[Ticket] Cancel Exchange Ticket Error',
  props<{ error: HttpErrorResponse }>(),
);
