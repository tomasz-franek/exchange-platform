import { TicketState } from './ticket.selectors';
import { createReducer, on } from '@ngrx/store';
import { sendExchangeTicket } from './ticket.action';

export const initialTicketState: TicketState = {
  userTicket: {
    idUser: '',
    order: '',
    value: 0,
    ratio: 0,
    pair: undefined,
  },
  idUser: 0,
};

export const ticketReducer = createReducer(
  initialTicketState,
  on(sendExchangeTicket, (state, action): TicketState => {
    return { ...state, userTicket: action.userTicket, idUser: action.idUser };
  }),
);
