import { Pair } from '../../api/model/pair';
import { incrementTicketId, saveExchangeTicket } from './ticket.actions';
import { TicketState } from './ticket.selectors';
import { initialTicketState, ticketReducers } from './ticket.reducers';
import { UserTicket } from '../../api/model/userTicket';

describe('TicketReducers', () => {
  it('should return the initial state', () => {
    const result = ticketReducers(undefined, { type: '' });
    expect(result).toEqual(initialTicketState);
  });

  const mockInitialState = (): TicketState => {
    return {
      userTicket: {
        id: 0,
        idUser: '77777777-0000-0000-4444-77777777',
        direction: 'SELL',
        amount: 0,
        ratio: 0,
        pair: Pair.GbpUsd,
      },
      ticketId: 1,
    } as TicketState;
  };

  it('should handle saveExchangeTicket', () => {
    const userTicket = {
      id: 1,
      idUser: '77777777-0000-0000-5555-77777777',
      idUserAccount: '77777777-0000-0000-0000-77777777',
      amount: 100,
      ratio: 1.5,
      pair: Pair.EurPln,
      epochUTC: 1620000000,
      direction: 'SELL',
    } as UserTicket;

    const action = saveExchangeTicket({ userTicket });
    const result = ticketReducers(initialTicketState, action);

    expect(result).toEqual({
      ...initialTicketState,
      userTicket,
    });
  });

  it('should handle incrementTicketId', () => {
    const action = incrementTicketId();
    const result = ticketReducers(initialTicketState, action);

    expect(result).toEqual({
      ...initialTicketState,
      ticketId: initialTicketState.ticketId + 1,
    });
  });

  describe('unknown action', () => {
    it('should return the default state', () => {
      const initialState = mockInitialState();
      const action = {
        type: 'Unknown',
      };

      const state = ticketReducers(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});
