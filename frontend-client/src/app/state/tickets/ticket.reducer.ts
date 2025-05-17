import { TicketState } from './ticket.selectors';
import { createReducer, on } from '@ngrx/store';
import { sendExchangeTicket } from './ticket.action';
import { Pair } from '../../api/model/pair';

export const initialTicketState: TicketState = {
  userTicket: {
    id: 0,
    idUser: 0,
    value: 0,
    ratio: 0,
    pair: Pair.EurPln,
    epochUTC: 0,
    direction: 'BUY',
  }
};

export const ticketReducer = createReducer(
  initialTicketState,
  on(sendExchangeTicket, (state, action): TicketState => {
    return { ...state, userTicket: action.userTicket };
  }),
);
