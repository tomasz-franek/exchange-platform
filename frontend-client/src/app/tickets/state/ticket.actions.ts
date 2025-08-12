import { createAction, props } from '@ngrx/store';
import { UserTicket } from '../../api/model/userTicket';
import { HttpErrorResponse } from '@angular/common/http';

export const saveExchangeTicketAction = createAction(
  '[Ticket] SaveExchangeTicket',
  props<{ userTicket: UserTicket }>()
);
export const saveExchangeTicketActionSuccess = createAction(
  '[Ticket] SaveExchangeTicketActionSuccess'
);
export const saveExchangeTicketActionFailure = createAction(
  '[Ticket] SaveExchangeTicketActionFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const incrementTicketId = createAction('[Ticket] IncrementTicketId');

export const loadUserTicketListAction = createAction(
  '[Ticket] Load UserTicketList'
);

export const loadUserTicketListActionSuccess = createAction(
  '[Ticket] Load UserTicketList Success',
  props<{ userTicketList: UserTicket[] }>()
);

export const loadUserTicketListActionFailure = createAction(
  '[Ticket] Load UserTicketList Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const cancelExchangeTicketAction = createAction(
  '[Ticket] Cancel Exchange Ticket',
  props<{ userTicket: UserTicket }>()
);

export const cancelExchangeTicketSuccess = createAction(
  '[Ticket] Cancel Exchange Ticket Success'
);

export const cancelExchangeTicketFailure = createAction(
  '[Ticket] Cancel Exchange Ticket Failure',
  props<{ errorResponse: HttpErrorResponse }>()
);

export const loadRealizedTicketListAction = createAction(
  '[Ticket] Load Realized Ticket List'
);

export const loadRealizedTicketListSuccess = createAction(
  '[Ticket] Load Realized Ticket List Success',
  props<{ realizedTicketList: UserTicket[] }>()
);

export const loadRealizedTicketListFailure = createAction(
  '[Ticket] Load Realized Ticket List Failure',
  props<{ errorResponse: HttpErrorResponse }>()
);

export const loadExchangePdfDocumentAction = createAction(
  '[Ticket] Load Exchange PDF Document',
  props<{ id: number }>()
);

export const loadExchangePdfDocumentSuccess = createAction(
  '[Ticket] Load Exchange PDF Document Success'
);

export const loadExchangePdfDocumentFailure = createAction(
  '[Ticket] Load Exchange PDF Document Failure',
  props<{ errorResponse: HttpErrorResponse }>()
);
