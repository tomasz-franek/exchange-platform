import { Pair } from '../../api/model/pair';
import {
  incrementTicketId,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
} from './ticket.actions';
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
        userId: '77777777-0000-0000-4444-77777777',
        direction: 'SELL',
        amount: 0,
        ratio: 0,
        pair: Pair.GbpUsd,
      },
      ticketId: 1,
      userTicketList: [
        {
          userId: '1',
          version: 1,
          eventType: 'CORRECTION',
          direction: 'SELL',
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        },
      ],
    } as TicketState;
  };

  it('should handle saveExchangeTicketAction', () => {
    const userTicket = {
      id: 1,
      userId: '77777777-0000-0000-5555-77777777',
      userAccountId: '77777777-0000-0000-0000-77777777',
      amount: 100,
      ratio: 1.5,
      pair: Pair.EurPln,
      epochUTC: 1620000000,
      direction: 'SELL',
    } as UserTicket;

    const action = saveExchangeTicketAction({ userTicket });
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

  it('should handle loadUserTicketListActionSuccess', () => {
    const expectedState = {
      ...initialTicketState,
      userTicketList: [
        {
          id: 2,
          userId: '4',
          version: 5,
          eventType: 'DEPOSIT',
          direction: 'BUY',
          amount: 12,
          ratio: 4,
          pair: Pair.GbpUsd,
          epochUTC: 15,
          userAccountId: 'fff',
        },
      ],
    } as TicketState;
    const action = loadUserTicketListActionSuccess({
      userTicketList: expectedState.userTicketList,
    });
    const result = ticketReducers(initialTicketState, action);

    expect(result).toEqual(expectedState);
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
