import { Pair } from '../../api/model/pair';
import { sendExchangeTicket } from './ticket.action';
import { TicketState } from './ticket.selectors';
import { ticketReducer } from './ticket.reducer';

describe('TicketReducer', () => {
  const mockInitialState = (): TicketState => {
    return {
      userTicket: {
        idUser: '4',
        order: '',
        value: 0,
        ratio: 0,
        pair: Pair.GbpUsd,
      },
      idUser: 123,
    } as TicketState;
  };
  it('should handle sendExchangeTicket action', () => {
    const action = {
      type: '[Ticket] Send Exchange Ticket',
      userTicket: {
        idUser: '4',
        order: '',
        value: 0,
        ratio: 0,
        pair: Pair.GbpUsd,
      },
      idUser: 123,
    } as TicketState;

    const state = sendExchangeTicket(action);

    expect(state.userTicket.pair).toEqual(action.userTicket.pair);
    expect(state.idUser).toEqual(action.idUser);
  });

  describe('unknown action', () => {
    it('should return the default state', () => {
      // given
      const initialState = mockInitialState();
      const action = {
        type: 'Unknown',
      };

      // when
      const state = ticketReducer(initialState, action);

      // then
      expect(state).toEqual(initialState);
    });
  });
});
