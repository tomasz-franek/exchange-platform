import { HttpErrorResponse } from '@angular/common/http';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketFailure,
  cancelExchangeTicketSuccess,
  incrementTicketId,
  loadExchangePdfDocumentAction,
  loadExchangePdfDocumentFailure,
  loadExchangePdfDocumentSuccess,
  loadRealizedTicketListAction,
  loadRealizedTicketListFailure,
  loadRealizedTicketListSuccess,
  loadUserTicketListAction,
  loadUserTicketListActionFailure,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
  saveExchangeTicketActionFailure,
  saveExchangeTicketActionSuccess
} from './ticket.actions';
import { UserTicket } from '../../api/model/userTicket';
import { Pair } from '../../api/model/pair';

describe('Ticket Actions', () => {
  it('should create an action to save an exchange ticket', () => {
    const userTicket: UserTicket = {
      id: 0,
      amount: 0,
      ratio: 0,
      userId: '',
      pair: 'EUR_PLN',
      epochUtc: 0,
      direction: 'SELL',
      ticketStatus: 'NEW',
      version: 0
    };
    const action = saveExchangeTicketAction({ userTicket });
    expect(action.type).toBe('[Ticket] SaveExchangeTicket');
    expect(action.userTicket).toEqual(userTicket);
  });


  it('should create an action for successful ticket exchange', () => {
    const action = saveExchangeTicketActionSuccess();
    expect(action.type).toBe('[Ticket] SaveExchangeTicketActionSuccess');
  });

  it('should create an action for ticket exchange error', () => {
    const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
    const action = saveExchangeTicketActionFailure({ errorResponse });
    expect(action.type).toBe('[Ticket] SaveExchangeTicketActionFailure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  it('should create an action to increment ticket ID', () => {
    const action = incrementTicketId();
    expect(action.type).toBe('[Ticket] IncrementTicketId');
  });

  it('should create an action loadUserTicketListAction', () => {
    const action = loadUserTicketListAction();
    expect(action.type).toBe('[Ticket] Load UserTicketList');
  });

  it('should create an action loadUserTicketListActionSuccess', () => {
    const userTicketList = [
      {
        id: 0,
        userId: '77777777-1111-0000-0000-77777777',
        direction: 'SELL',
        epochUtc: 0,
        amount: 0,
        ratio: 0,
        pair: Pair.GbpUsd
      }
    ] as UserTicket[];
    const action = loadUserTicketListActionSuccess({ userTicketList });
    expect(action.type).toBe('[Ticket] Load UserTicketList Success');
    expect(action.userTicketList).toEqual(userTicketList);
  });

  it('should create an action loadUserTicketListActionFailure', () => {
    const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
    const action = loadUserTicketListActionFailure({ errorResponse });
    expect(action.type).toBe('[Ticket] Load UserTicketList Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  it('should create an action cancelExchangeTicketAction', () => {
    const userTicket = {
      userId: 'x',
      userAccountId: 'y',
      version: 1,
      amount: 100,
      direction: 'SELL',
      id: 1,
      epochUtc: 20,
      pair: 'EUR_USD'
    } as UserTicket;
    const action = cancelExchangeTicketAction({ userTicket });
    expect(action.type).toBe('[Ticket] Cancel Exchange Ticket');
    expect(action.userTicket).toEqual(userTicket);
  });
  it('should create an action cancelExchangeTicketSuccess', () => {
    const action = cancelExchangeTicketSuccess();
    expect(action.type).toBe('[Ticket] Cancel Exchange Ticket Success');
  });
  it('should create an action cancelExchangeTicketFailure', () => {
    const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
    const action = cancelExchangeTicketFailure({ errorResponse });
    expect(action.type).toBe('[Ticket] Cancel Exchange Ticket Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  it('should create an action loadRealizedTicketListAction', () => {
    const action = loadRealizedTicketListAction();
    expect(action.type).toBe('[Ticket] Load Realized Ticket List');
  });
  it('should create an action loadRealizedTicketListSuccess', () => {
    const realizedTicketList = [
      {
        id: 0,
        userId: '77777777-1111-0000-0000-77777777',
        direction: 'SELL',
        epochUtc: 0,
        amount: 0,
        ratio: 0,
        pair: Pair.GbpUsd
      }
    ] as UserTicket[];
    const action = loadRealizedTicketListSuccess({ realizedTicketList });
    expect(action.type).toBe('[Ticket] Load Realized Ticket List Success');
  });
  it('should create an action loadRealizedTicketListFailure', () => {
    const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
    const action = loadRealizedTicketListFailure({ errorResponse });
    expect(action.type).toBe('[Ticket] Load Realized Ticket List Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
  it('should create an action loadExchangePdfDocumentAction', () => {
    const action = loadExchangePdfDocumentAction({ id: 1 });
    expect(action.type).toBe('[Ticket] Load Exchange PDF Document');
  });
  it('should create an action loadExchangePdfDocumentSuccess', () => {
    const action = loadExchangePdfDocumentSuccess();
    expect(action.type).toBe('[Ticket] Load Exchange PDF Document Success');
  });
  it('should create an action loadExchangePdfDocumentFailure', () => {
    const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
    const action = loadExchangePdfDocumentFailure({ errorResponse });
    expect(action.type).toBe('[Ticket] Load Exchange PDF Document Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
});
