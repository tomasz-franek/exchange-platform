import {
  selectTicketFutureState,
  selectTicketId,
  selectUserTicket,
  TicketState,
} from './ticket.selector';

describe('Ticket Selectors', () => {
  let mockState: TicketState;

  beforeEach(() => {
    mockState = {
      userTicket: {
        id: 0,
        idUser: '77777777-0000-0000-0000-77777777',
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
      const result = selectTicketFutureState.projector(mockState);
      expect(result).toEqual(mockState);
    });
  });

  it('should select the userTicket from the state', () => {
    const result = selectUserTicket.projector(mockState);
    expect(result).toEqual(mockState.userTicket);
  });

  it('should select the ticketId from the state', () => {
    const result = selectTicketId.projector(mockState);
    expect(result).toEqual(mockState.ticketId);
  });
});
