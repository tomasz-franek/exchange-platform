import {Action} from '@ngrx/store';
import {TicketEffects} from './ticket.effects';
import {Observable} from 'rxjs/internal/Observable';
import {ApiService} from '../../../services/api/api.service';
import {TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpErrorResponse, HttpHandler,} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {provideMockActions} from '@ngrx/effects/testing';
import {of, throwError} from 'rxjs';
import {cold, hot} from 'jasmine-marbles';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketSuccess,
  loadExchangePdfDocumentAction,
  loadExchangePdfDocumentSuccess,
  loadRealizedTicketListAction,
  loadRealizedTicketListSuccess,
  loadUserTicketListAction,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
} from './ticket.actions';
import {UserTicket} from '../../api/model/userTicket';
import {Pair} from '../../api/model/pair';
import {UserTicketStatus} from '../../api/model/userTicketStatus';
import {TranslateService} from '@ngx-translate/core';
import {mockRoute} from '../../../mocks/mock-activated-route';
import {testTranslations} from '../../../mocks/test-functions';

describe('TicketEffects', () => {
  let apiService: ApiService;
  let actions$: Observable<Action>;
  let effects: TicketEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        testTranslations(),
      ],
      providers: [
        TicketEffects,
        HttpClient,
        HttpHandler,
        provideMockActions(() => actions$),
        {provide: ActivatedRoute, useValue: mockRoute},
      ],
    });

    effects = TestBed.inject(TicketEffects);
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('save$', () => {
    it('should dispatch saveExchangeTicketActionSuccess when sent Ticket', () => {
      const request = {
        userTicket: {
          id: 0,
          userId: '77777777-1111-0000-0000-77777777',
          direction: 'SELL',
          epochUtc: 0,
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        } as UserTicket,
      };
      spyOn(apiService, 'saveTicket').and.returnValue(of(request) as never);

      actions$ = hot('-a', {
        a: saveExchangeTicketAction(request),
      });

      expect(effects.save$).toBeObservable(
        hot('-(b)', {
          b: {
            type: '[Ticket] SaveExchangeTicketActionSuccess',
          },
        }),
      );
    });

    it('should dispatch saveCategoryActionFailure when save backend returns error', () => {
      const request = {
        userId: 1,
        userTicket: {
          id: 0,
          userId: '77777777-0000-3333-0000-77777777',
          direction: 'SELL',
          epochUtc: 0,
          order: '',
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
          ticketStatus: UserTicketStatus.New,
          version: 0,
        } as UserTicket,
      };
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => errorResponse),
      );
      actions$ = of(saveExchangeTicketAction(request));

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionFailure',
          errorResponse,
        });
      });
    });
    it('should handle insufficient funds error', () => {
      const translateService = TestBed.inject(TranslateService);
      translateService.setDefaultLang('en');
      const request = {
        userId: 1,
        userTicket: {
          id: 0,
          userId: '77777777-0000-3333-0000-77777777',
          direction: 'SELL',
          epochUtc: 0,
          order: '',
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
          ticketStatus: UserTicketStatus.New,
          version: 0,
        } as UserTicket,
      };
      const action = saveExchangeTicketAction(request);
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: {errorCode: 'INSUFFICIENT_FUNDS'},
      });
      actions$ = of(action);
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => errorResponse),
      );

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionFailure',
          errorResponse,
        });
      });
    });
  });

  describe('loadUserTicketList$', () => {
    it('should dispatch loadUserTicketListActionSuccess when sent Ticket', () => {
      const userTicketList = [
        {
          id: 0,
          userId: '77777777-1111-0000-0000-77777777',
          direction: 'SELL',
          epochUtc: 0,
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        },
      ] as UserTicket[];
      const action = loadUserTicketListAction();
      const outcome = loadUserTicketListActionSuccess({userTicketList});

      actions$ = hot('-a', {a: action});
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        of(userTicketList) as never,
      );
      const expected = cold('-c', {c: outcome});
      expect(effects.loadUserTicketList$).toBeObservable(expected);
    });

    it('should dispatch loadUserTicketListActionFailure when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        throwError(() => errorResponse),
      );
      actions$ = of(loadUserTicketListAction());

      effects.loadUserTicketList$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Load UserTicketList Failure',
          errorResponse,
        });
        expect(apiService.loadUserTicketList).toHaveBeenCalled();
      });
    });
  });

  describe('cancelUserTicket$', () => {
    const userTicket = {
      id: 0,
      userId: '77777777-0000-3333-0000-77777777',
      direction: 'SELL',
      epochUtc: 0,
      order: '',
      amount: 0,
      ratio: 0,
      pair: Pair.GbpUsd,
      ticketStatus: UserTicketStatus.New,
      version: 0,
    } as UserTicket;
    it('should dispatch cancelExchangeTicketSuccess and loadUserTicketListAction when sent Ticket', () => {
      const action = cancelExchangeTicketAction({userTicket});
      const outcome1 = cancelExchangeTicketSuccess();
      const outcome2 = loadUserTicketListAction();

      actions$ = hot('-a', {a: action});
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        of({}) as never,
      );

      const expected = cold('-(bc)', {b: outcome1, c: outcome2});

      expect(effects.cancelUserTicket$).toBeObservable(expected);
    });

    it('should call toasterService.info when ticket is cancelled', () => {
      const action = cancelExchangeTicketAction({userTicket});

      actions$ = hot('-a', {a: action});
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        of({}) as never,
      );
    });

    it('should dispatch cancelExchangeTicketError when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        throwError(() => errorResponse),
      );
      actions$ = of(cancelExchangeTicketAction({userTicket}));

      effects.cancelUserTicket$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Cancel Exchange Ticket Failure',
          errorResponse,
        });
        expect(apiService.cancelExchangeTicket).toHaveBeenCalled();
      });
    });
  });

  describe('loadRealizedTicketList$', () => {
    it('should dispatch loadRealizedTicketListSuccess when receive list', () => {
      const realizedTicketList = [
        {
          id: 0,
          userId: '77777777-1111-0000-0000-77777777',
          direction: 'SELL',
          epochUtc: 0,
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        },
      ] as UserTicket[];
      const action = loadRealizedTicketListAction();
      const outcome = loadRealizedTicketListSuccess({realizedTicketList});

      actions$ = hot('-a', {a: action});
      spyOn(apiService, 'loadRealizedTicketList').and.returnValue(
        of(realizedTicketList) as never,
      );
      const expected = cold('-c', {c: outcome});
      expect(effects.loadRealizedTicketList$).toBeObservable(expected);
      expect(apiService.loadRealizedTicketList).toHaveBeenCalled();
    });

    it('should dispatch loadUserTicketListActionFailure when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'loadRealizedTicketList').and.returnValue(
        throwError(() => errorResponse),
      );
      actions$ = of(loadRealizedTicketListAction());

      effects.loadRealizedTicketList$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Load Realized Ticket List Failure',
          errorResponse,
        });
        expect(apiService.loadRealizedTicketList).toHaveBeenCalled();
      });
    });
  });

  describe('loadExchangePdfDocument$', () => {
    it('should dispatch loadRealizedTicketListSuccess when receive list', () => {
      const action = loadExchangePdfDocumentAction({id: 1});
      const outcome = loadExchangePdfDocumentSuccess();
      const pdfContent: any[] = [1];
      actions$ = hot('-a', {a: action});
      spyOn(apiService, 'loadExchangePdfDocument').and.returnValue(
        of(pdfContent) as never,
      );
      const expected = cold('-c', {c: outcome});
      expect(effects.loadExchangePdfDocument$).toBeObservable(expected);
      expect(apiService.loadExchangePdfDocument).toHaveBeenCalled();
    });

    it('should dispatch loadUserTicketListActionFailure when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'loadExchangePdfDocument').and.returnValue(
        throwError(() => errorResponse),
      );
      actions$ = of(loadExchangePdfDocumentAction({id: 1}));

      effects.loadExchangePdfDocument$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Load Exchange PDF Document Failure',
          errorResponse,
        });
        expect(apiService.loadExchangePdfDocument).toHaveBeenCalled();
      });
    });
  });
});
