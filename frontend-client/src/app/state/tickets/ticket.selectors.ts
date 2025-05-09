import { UserTicket } from '../../api';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';

export interface TicketState {
  userTicket: UserTicket;
  idUser: number;
}

export const selectTicketStateFutureState = createFeatureSelector<TicketState>(
  Features.tickets,
);

export const getUserTicket = createSelector(
  selectTicketStateFutureState,
  (state) => state.userTicket,
);

export const getIdUser = createSelector(
  selectTicketStateFutureState,
  (state) => state.idUser,
);
