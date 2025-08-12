import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UserTicket } from '../../api/model/userTicket';

export interface TicketState {
  userTicket: UserTicket;
  userTicketList: UserTicket[];
  realizedTicketList: UserTicket[];
  ticketId: number;
}

export const selectTicketFutureState = createFeatureSelector<TicketState>(
  Features.tickets
);

export const selectUserTicket = createSelector(
  selectTicketFutureState,
  (state) => state.userTicket
);

export const selectTicketId = createSelector(
  selectTicketFutureState,
  (state) => state.ticketId
);

export const selectUserTicketList = createSelector(
  selectTicketFutureState,
  (state) => state.userTicketList
);
export const selectRealizedTicketList = createSelector(
  selectTicketFutureState,
  (state) => state.realizedTicketList
);
