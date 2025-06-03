import { TicketState } from './ticket.selector';
import { createReducer, on } from '@ngrx/store';
import {
  incrementTicketId,
  loadUserTicketListActionSuccess,
  saveExchangeTicket,
} from './ticket.action';
import { Pair } from '../../api/model/pair';

export const initialTicketState: TicketState = {
  userTicket: {
    id: 0,
    idUser: '',
    amount: 0,
    ratio: 0,
    pair: Pair.EurPln,
    epochUTC: 0,
    direction: 'BUY',
  },
  userTicketList: [],
  ticketId: 1,
};

export const ticketReducer = createReducer(
  initialTicketState,
  on(saveExchangeTicket, (state, action): TicketState => {
    return { ...state, userTicket: action.userTicket };
  }),
  on(incrementTicketId, (state): TicketState => {
    return { ...state, ticketId: state.ticketId + 1 };
  }),
  on(loadUserTicketListActionSuccess, (state, action) => {
    return { ...state, userTicketList: action.userTicketList };
  }),
);
