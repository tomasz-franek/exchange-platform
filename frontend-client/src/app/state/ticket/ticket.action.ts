import { createAction, props } from '@ngrx/store';
import { UserTicket } from '../../api/model/userTicket';
import { HttpErrorResponse } from '@angular/common/http';

export const saveExchangeTicket = createAction(
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
