import { Action } from '@ngrx/store';
import { TicketEffects } from './ticket.effects';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../../../services/api/api.service';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, throwError } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketSuccess,
  loadUserTicketListAction,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction
} from './ticket.actions';
import { UserTicket } from '../../api/model/userTicket';
import { Pair } from '../../api/model/pair';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserTicketStatus } from '../../api/model/userTicketStatus';
import { TranslateService } from '@ngx-translate/core';
import { mockRoute } from '../../../mocks/mock-activated-route';
import { testTranslations } from '../../../mocks/test-functions';

describe('TicketEffects', () => {
  let apiService: ApiService;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let actions$: Observable<Action>;
  let effects: TicketEffects;

  beforeEach(() => {
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error'
    ]);
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        testTranslations()
      ],
      providers: [
        TicketEffects,
        provideMockStore({
          selectors: []
        }),
        HttpClient,
        HttpHandler,
        provideMockActions(() => actions$),
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    });

    effects = TestBed.inject(TicketEffects);
    apiService = TestBed.inject(ApiService);
    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
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
          pair: Pair.GbpUsd
        } as UserTicket
      };
      spyOn(apiService, 'saveTicket').and.returnValue(of(request) as never);

      actions$ = hot('-a', {
        a: saveExchangeTicketAction(request)
      });

      expect(effects.save$).toBeObservable(
        hot('-(b)', {
          b: {
            type: '[Ticket] SaveExchangeTicketActionSuccess'
          }
        })
      );
      expect(toastrService.info).toHaveBeenCalledWith(
        'Ticket order sent with id=0'
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
          version: 0
        } as UserTicket
      };
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => errorResponse)
      );
      actions$ = of(saveExchangeTicketAction(request));

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionFailure',
          errorResponse
        });
        expect(toastrService.error).toHaveBeenCalledWith(
          'Error occurred while saving ticket'
        );
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
          version: 0
        } as UserTicket
      };
      const action = saveExchangeTicketAction(request);
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: { errorCode: 'INSUFFICIENT_FUNDS' }
      });
      actions$ = of(action);
      spyOn(apiService, 'saveTicket').and.returnValue(
        throwError(() => errorResponse)
      );

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionFailure',
          errorResponse
        });
        expect(toastrService.error).toHaveBeenCalledWith(
          'Insufficient funds in the account to perform this operation'
        );
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
          pair: Pair.GbpUsd
        }
      ] as UserTicket[];
      const action = loadUserTicketListAction();
      const outcome = loadUserTicketListActionSuccess({ userTicketList });

      actions$ = hot('-a', { a: action });
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        of(userTicketList) as never
      );
      const expected = cold('-c', { c: outcome });
      expect(effects.loadUserTicketList$).toBeObservable(expected);
    });

    it('should dispatch loadUserTicketListActionFailure when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        throwError(() => errorResponse)
      );
      actions$ = of(loadUserTicketListAction());

      effects.loadUserTicketList$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Load UserTicketList Failure',
          errorResponse
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
      version: 0
    } as UserTicket;
    it('should dispatch cancelExchangeTicketSuccess and loadUserTicketListAction when sent Ticket', () => {
      const action = cancelExchangeTicketAction({ userTicket });
      const outcome1 = cancelExchangeTicketSuccess();
      const outcome2 = loadUserTicketListAction();

      actions$ = hot('-a', { a: action });
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(of({}) as never);

      const expected = cold('-(bc)', { b: outcome1, c: outcome2 });

      expect(effects.cancelUserTicket$).toBeObservable(expected);
    });

    it('should call toasterService.info when ticket is cancelled', () => {
      const action = cancelExchangeTicketAction({ userTicket });

      actions$ = hot('-a', { a: action });
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(of({}) as never);
      effects.cancelUserTicket$.subscribe(() => {
        expect(toastrService.info).toHaveBeenCalledWith('Ticket cancelled');
      });
    });

    it('should dispatch cancelExchangeTicketError when save backend returns error', () => {
      const errorResponse = new HttpErrorResponse({});
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        throwError(() => errorResponse)
      );
      actions$ = of(cancelExchangeTicketAction({ userTicket }));

      effects.cancelUserTicket$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Cancel Exchange Ticket Failure',
          errorResponse
        });
        expect(apiService.cancelExchangeTicket).toHaveBeenCalled();
      });
    });
  });
});
