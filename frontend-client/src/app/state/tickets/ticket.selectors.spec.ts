import {
  getIdUser,
  getUserTicket,
  selectTicketStateFutureState,
  TicketState,
} from './ticket.selectors';

describe('Ticket Selectors', () => {
  let mockState: TicketState;

  beforeEach(() => {
    mockState = {
      userTicket: {
        idUser: '',
        order: '',
        value: 0,
        ratio: 0,
        pair: 'EUR_PLN',
      },
      idUser: 123,
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

  describe('getIdUser', () => {
    it('should return the idUser from state', () => {
      const result = getIdUser.projector(mockState);
      expect(result).toBe(123);
    });
  });
});
