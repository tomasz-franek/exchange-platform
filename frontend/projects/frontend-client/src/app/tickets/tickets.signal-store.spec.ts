import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {UserTicket} from '../api/model/userTicket';
import {TicketStore} from './tickets.signal-store';

describe('tickets signal store', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('saveTicket', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveTicket').and.returnValue(new Subject<any>());
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        updatedDateUtc: 3,
        version: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        eventType: 'ORDER',
        userAccountId: "userAccountId",
        epochUtc: 3,
        id: 1,
        direction: "BUY",
        amount: 3,
        userId: 'userId',
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.saveTicket(request);

      // then
      expect(ticketStore.isLoading()).toBeTrue();
    });

    it('should set userTicketList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      spyOn(apiService, 'saveTicket').and.returnValue(of({}) as any);
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        updatedDateUtc: 3,
        version: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        eventType: 'ORDER',
        userAccountId: "userAccountId",
        epochUtc: 3,
        id: 1,
        direction: "BUY",
        amount: 3,
        userId: 'userId',
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        userTicketList: [],
        isLoading: false,
      });

      // when
      ticketStore.saveTicket(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        detail: 'ok'
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.TICKET_SAVED', Object({id: 1}));
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        updatedDateUtc: 3,
        version: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        eventType: 'ORDER',
        userAccountId: "userAccountId",
        epochUtc: 3,
        id: 1,
        direction: "BUY",
        amount: 3,
        userId: 'userId',
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        userTicketList: [],
        isLoading: false,
      });

      // when
      ticketStore.saveTicket(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(ticketStore.userTicketList()).toEqual([]);
    }));

    it('should call messageService.add with error message INSUFFICIENT_FUNDS when backend returns 400 error code', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('INSUFFICIENT_FUNDS');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => new HttpErrorResponse({
          status: 400,
          error: {errorCode: 'INSUFFICIENT_FUNDS'},
        }))
      );
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        updatedDateUtc: 3,
        version: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        eventType: 'ORDER',
        userAccountId: "userAccountId",
        epochUtc: 3,
        id: 1,
        direction: "BUY",
        amount: 3,
        userId: 'userId',
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        userTicketList: [],
        isLoading: false,
      });

      // when
      ticketStore.saveTicket(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        detail: 'INSUFFICIENT_FUNDS'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.INSUFFICIENT_FUNDS');
      expect(ticketStore.userTicketList()).toEqual([]);
    }));
  })

  describe('loadUserTicketList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadUserTicketList').and.returnValue(new Subject<any>());
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.loadUserTicketList();

      // then
      expect(ticketStore.isLoading()).toBeTrue();
    });

    it('should set userTicketList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const userTicketList: UserTicket[] = [
        {
          userId: 'userId',
          amount: 3,
          id: 3,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        },
        {
          userId: 'userId',
          amount: 3,
          id: 34,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        }
      ];
      spyOn(apiService, 'loadUserTicketList').and.returnValue(of(userTicketList) as any);
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        userTicketList: [],
        isLoading: false,
      });

      // when
      ticketStore.loadUserTicketList();

      // then
      expect(ticketStore.userTicketList()).toEqual(userTicketList);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        userTicketList: [{
          userId: 'userId',
          amount: 3,
          id: 34,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        }],
        isLoading: false,
      });

      // when
      ticketStore.loadUserTicketList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(ticketStore.userTicketList()).toEqual([]);
    }));
  })

  describe('cancelExchangeTicket', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'cancelExchangeTicket').and.returnValue(new Subject<any>());
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        userId: 'userId',
        amount: 3,
        id: 3,
        direction: "BUY",
        epochUtc: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        version: 2,
        userAccountId: "userAccountId",
        eventType: "FEE",
        updatedDateUtc: 2
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.cancelExchangeTicket(request);

      // then
      expect(ticketStore.isLoading()).toBeTrue();
    });

    it('should set message when backend return data', () => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(of({}) as any);
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        userId: 'userId',
        amount: 3,
        id: 3,
        direction: "BUY",
        epochUtc: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        version: 2,
        userAccountId: "userAccountId",
        eventType: "FEE",
        updatedDateUtc: 2
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.cancelExchangeTicket(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        detail: 'ok'
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.TICKET_CANCELLED', Object({id: 3}));
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const ticketStore = TestBed.inject(TicketStore);
      const request = {
        userId: 'userId',
        amount: 3,
        id: 3,
        direction: "BUY",
        epochUtc: 2,
        pair: "EUR_USD",
        ticketStatus: "ACTIVE",
        ratio: 3,
        version: 2,
        userAccountId: "userAccountId",
        eventType: "FEE",
        updatedDateUtc: 2
      } as UserTicket;
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.cancelExchangeTicket(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(ticketStore.realizedTicketList()).toEqual([]);
    }));
  })

  describe('loadRealizedTicketList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadRealizedTicketList').and.returnValue(new Subject<any>());
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        isLoading: false,
      });

      // when
      ticketStore.loadRealizedTicketList();

      // then
      expect(ticketStore.isLoading()).toBeTrue();
    });

    it('should set userTicketList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const realizedTicketList: UserTicket[] = [
        {
          userId: 'userId',
          amount: 3,
          id: 3,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        },
        {
          userId: 'userId',
          amount: 3,
          id: 34,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        }
      ];
      spyOn(apiService, 'loadRealizedTicketList').and.returnValue(of(realizedTicketList) as any);
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        realizedTicketList: [],
        isLoading: false,
      });

      // when
      ticketStore.loadRealizedTicketList();

      // then
      expect(ticketStore.realizedTicketList()).toEqual(realizedTicketList);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadRealizedTicketList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const ticketStore = TestBed.inject(TicketStore);
      patchState(unprotected(ticketStore), {
        realizedTicketList: [{
          userId: 'userId',
          amount: 3,
          id: 34,
          direction: "BUY",
          epochUtc: 2,
          pair: "EUR_USD",
          ticketStatus: "ACTIVE",
          ratio: 3,
          version: 2,
          userAccountId: "userAccountId",
          eventType: "FEE",
          updatedDateUtc: 2
        }],
        isLoading: false,
      });

      // when
      ticketStore.loadRealizedTicketList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(ticketStore.realizedTicketList()).toEqual([]);
    }));
  })

  describe('loadExchangePdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadExchangePdfDocument').and.returnValue(new Subject<any>());
      const reportStore = TestBed.inject(TicketStore);
      const request = 8;

      // when
      reportStore.loadExchangePdfDocument(request);

      // then
      expect(reportStore.isLoading()).toBeTrue();
    });

    it('should show when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const request = 4;
      const blobResponse = new Blob([], {type: 'text/plain'});
      spyOn(apiService, 'loadExchangePdfDocument').and.returnValue(of(blobResponse) as any);
      spyOn(window, 'open')
      const reportStore = TestBed.inject(TicketStore);
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadExchangePdfDocument(request);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadExchangePdfDocument').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const reportStore = TestBed.inject(TicketStore);
      const request = 1;

      // when
      reportStore.loadExchangePdfDocument(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  })
})
