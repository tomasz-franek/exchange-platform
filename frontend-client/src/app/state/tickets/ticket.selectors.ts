import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { UserTicket } from '../../api/model/userTicket';

export interface TicketState {
  userTicket: UserTicket
}

export const selectTicketStateFutureState = createFeatureSelector<TicketState>(
  Features.tickets,
);

export const getUserTicket = createSelector(
  selectTicketStateFutureState,
  (state) => state.userTicket,
);
