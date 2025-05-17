import { createAction, props } from '@ngrx/store';
import { UserTicket } from '../../api/model/userTicket';
import { HttpErrorResponse } from '@angular/common/http';

export const sendExchangeTicket = createAction(
  '[Ticket] SendExchangeTicket',
  props<{ userTicket: UserTicket }>(),
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
