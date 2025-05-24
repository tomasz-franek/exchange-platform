import { HttpErrorResponse } from '@angular/common/http';
import {
  incrementTicketId,
  saveExchangeTicket,
  saveExchangeTicketActionError,
  saveExchangeTicketActionSuccess,
} from './ticket.action';
import { UserTicket } from '../../api/model/userTicket';

describe('Ticket Actions', () => {
  describe('saveExchangeTicket', () => {
    it('should create an action to save an exchange ticket', () => {
      const userTicket: UserTicket = {
        id: 0,
        value: 0,
        ratio: 0,
        idUser: '',
        pair: 'EUR_PLN',
        epochUTC: 0,
        direction: 'SELL',
      };
      const action = saveExchangeTicket({ userTicket });
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
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveExchangeTicketActionError({ error });
      expect(action.type).toBe('[Ticket] SaveExchangeTicketActionError');
      expect(action.error).toEqual(error);
    });
  });

  describe('incrementTicketId', () => {
    it('should create an action to increment ticket ID', () => {
      const action = incrementTicketId();
      expect(action.type).toBe('[Ticket] IncrementTicketId');
    });
  });
});
