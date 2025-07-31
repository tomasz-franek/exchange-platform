import { HttpErrorResponse } from '@angular/common/http';
import {
  incrementTicketId,
  saveExchangeTicketAction,
  saveExchangeTicketActionError,
  saveExchangeTicketActionSuccess,
} from './ticket.actions';
import { UserTicket } from '../../api/model/userTicket';

describe('Ticket Actions', () => {
  describe('saveExchangeTicket', () => {
    it('should create an action to save an exchange ticket', () => {
      const userTicket: UserTicket = {
        id: 0,
        amount: 0,
        ratio: 0,
        userId: '',
        pair: 'EUR_PLN',
        epochUTC: 0,
        direction: 'SELL',
        ticketStatus: 'NEW',
        version: 0,
      };
      const action = saveExchangeTicketAction({ userTicket });
      expect(action.type).toBe('[Ticket] SaveExchangeTicket');
      expect(action.userTicket).toEqual(userTicket);
    });
  });

  describe('saveExchangeTicketActionSuccess', () => {
    it('should create an action for successful ticket exchange', () => {
      const action = saveExchangeTicketActionSuccess();
      expect(action.type).toBe('[Ticket] SaveExchangeTicketActionSuccess');
    });
  });

  describe('saveExchangeTicketActionError', () => {
    it('should create an action for ticket exchange error', () => {
      const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveExchangeTicketActionError({ errorResponse });
      expect(action.type).toBe('[Ticket] SaveExchangeTicketActionError');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('incrementTicketId', () => {
    it('should create an action to increment ticket ID', () => {
      const action = incrementTicketId();
      expect(action.type).toBe('[Ticket] IncrementTicketId');
    });
  });
});
