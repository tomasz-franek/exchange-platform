import {
  selectTicketFutureState,
  selectTicketId,
  selectUserTicket,
  selectUserTicketList,
  TicketState
} from './ticket.selectors';

describe('Ticket Selectors', () => {
  let mockState: TicketState;

  beforeEach(() => {
    mockState = {
      userTicket: {
        id: 0,
        userId: '77777777-0000-0000-0000-77777777',
        userAccountId: '77777777-0000-0000-0000-77777777',
        direction: 'BUY',
        epochUtc: 0,
        amount: 0,
        ratio: 0,
        pair: 'EUR_PLN'
      },
      ticketId: 1
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

  it('should select the user ticket list from the state', () => {
    const result = selectUserTicketList.projector(mockState);
    expect(result).toEqual(mockState.userTicketList);
  });
});
