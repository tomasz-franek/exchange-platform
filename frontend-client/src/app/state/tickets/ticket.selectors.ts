import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { UserTicket } from '../../api/model/userTicket';

export interface TicketState {
  userTicket: UserTicket;
  ticketId: number;
}

export const selectTicketFutureState = createFeatureSelector<TicketState>(
  Features.tickets,
);

export const getUserTicket = createSelector(
  selectTicketFutureState,
  (state) => state.userTicket,
);

export const getTicketId = createSelector(
  selectTicketFutureState,
  (state) => state.ticketId,
);
