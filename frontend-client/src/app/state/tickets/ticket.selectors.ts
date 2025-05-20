import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { UserTicket } from '../../api/model/userTicket';

export interface TicketState {
  userTicket: UserTicket;
  ticketId: number;
}

export const selectTicketStateFutureState = createFeatureSelector<TicketState>(
  Features.tickets,
);

export const getUserTicket = createSelector(
  selectTicketStateFutureState,
  (state) => state.userTicket,
);

export const getTicketId = createSelector(
  selectTicketStateFutureState,
  (state) => state.ticketId,
);
