import { createAction, props } from '@ngrx/store';
import { UserTicket } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';

export const sendExchangeTicket = createAction(
  '[Ticket] SendExchangeTicket',
  props<{ idUser: number; userTicket: UserTicket }>(),
);
export const sendExchangeTicketActionSuccess = createAction(
  '[Ticket] SendExchangeTicketActionSuccess',
);
export const sendExchangeTicketActionError = createAction(
  '[Ticket] SendExchangeTicketActionError',
  props<{
    error: HttpErrorResponse;
  }>(),
);
