import { TicketState } from './ticket.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  incrementTicketId,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
} from './ticket.actions';
import { Pair } from '../../api/model/pair';

export const initialTicketState: TicketState = {
  userTicket: {
    id: 0,
    userId: '',
    amount: 0,
    ratio: 0,
    pair: Pair.EurPln,
    epochUTC: 0,
    direction: 'BUY',
    ticketStatus: 'NEW',
    version: 0,
  },
  userTicketList: [
    {
      userId: '1',
      ticketStatus: 'NEW',
      version: 1,
      amount: 2,
      direction: 'BUY',
      epochUTC: 11,
      id: 3,
      pair: 'EUR_CHF',
      ratio: 12,
      userAccountId: '33',
      eventType: 'FEE',
      updatedDateUTC: 12,
    },
  ],
  ticketId: 1,
};

export const ticketReducers = createReducer(
  initialTicketState,
  on(saveExchangeTicketAction, (state, action): TicketState => {
    return { ...state, userTicket: action.userTicket };
  }),
  on(incrementTicketId, (state): TicketState => {
    return { ...state, ticketId: state.ticketId + 1 };
  }),
  on(loadUserTicketListActionSuccess, (state, action) => {
    return { ...state, userTicketList: action.userTicketList };
  }),
);
