import {
  getUserTicket,
  selectTicketStateFutureState,
  TicketState,
} from './ticket.selectors';

describe('Ticket Selectors', () => {
  let mockState: TicketState;

  beforeEach(() => {
    mockState = {
      userTicket: {
        id: 0,
        idUser: 0,
        direction: 'BUY',
        epochUTC: 0,
        value: 0,
        ratio: 0,
        pair: 'EUR_PLN',
      },
    };
  });

  describe('selectTicketStateFutureState', () => {
    it('should return the ticket feature state', () => {
      const result = selectTicketStateFutureState.projector(mockState);
      expect(result).toEqual(mockState);
    });
  });

  describe('getUserTicket', () => {
    it('should return the userTicket from state', () => {
      const result = getUserTicket.projector(mockState);
      expect(result.pair).toBe('EUR_PLN');
    });
  });
});
