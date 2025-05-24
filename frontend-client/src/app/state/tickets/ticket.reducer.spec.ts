import { Pair } from '../../api/model/pair';
import { incrementTicketId, saveExchangeTicket } from './ticket.action';
import { TicketState } from './ticket.selector';
import { initialTicketState, ticketReducer } from './ticket.reducer';
import { UserTicket } from '../../api/model/userTicket';

describe('TicketReducer', () => {
  it('should return the initial state', () => {
    const result = ticketReducer(undefined, { type: '' });
    expect(result).toEqual(initialTicketState);
  });

  const mockInitialState = (): TicketState => {
    return {
      userTicket: {
        id: 0,
        idUser: '77777777-0000-0000-4444-77777777',
        direction: 'SELL',
        value: 0,
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
      value: 100,
      ratio: 1.5,
      pair: Pair.EurPln,
      epochUTC: 1620000000,
      direction: 'SELL',
    } as UserTicket;

    const action = saveExchangeTicket({ userTicket });
    const result = ticketReducer(initialTicketState, action);

    expect(result).toEqual({
      ...initialTicketState,
      userTicket,
    });
  });

  it('should handle incrementTicketId', () => {
    const action = incrementTicketId();
    const result = ticketReducer(initialTicketState, action);

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

      const state = ticketReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});
