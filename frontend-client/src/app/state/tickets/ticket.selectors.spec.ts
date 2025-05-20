import {
  getTicketId,
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
        idUserAccount: '77777777-0000-0000-0000-77777777',
        direction: 'BUY',
        epochUTC: 0,
        value: 0,
        ratio: 0,
        pair: 'EUR_PLN',
      },
      ticketId: 1,
    } as TicketState;
  });

  describe('selectTicketStateFutureState', () => {
    it('should return the ticket feature state', () => {
      const result = selectTicketStateFutureState.projector(mockState);
      expect(result).toEqual(mockState);
    });
  });

  it('should select the userTicket from the state', () => {
    const result = getUserTicket.projector(mockState);
    expect(result).toEqual(mockState.userTicket);
  });

  it('should select the ticketId from the state', () => {
    const result = getTicketId.projector(mockState);
    expect(result).toEqual(mockState.ticketId);
  });
});
