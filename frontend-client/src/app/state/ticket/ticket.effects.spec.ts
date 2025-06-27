import { Action } from '@ngrx/store';
import { TicketEffects } from './ticket.effects';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../../services/api.service';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, throwError } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketSuccess,
  loadUserTicketListAction,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
} from './ticket.actions';
import { UserTicket } from '../../api/model/userTicket';
import { Pair } from '../../api/model/pair';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserTicketStatus } from '../../api/model/userTicketStatus';

describe('TicketEffects', () => {
  let apiService: ApiService;
  let toastrService: ToastrService;
  let actions$: Observable<Action>;
  let effects: TicketEffects;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ToastrModule.forRoot()],
      providers: [
        TicketEffects,
        provideMockStore({
          selectors: [],
        }),
        HttpClient,
        HttpHandler,
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
      ],
    });

    effects = TestBed.inject(TicketEffects);
    apiService = TestBed.inject(ApiService);
    toastrService = TestBed.inject(ToastrService);
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
          epochUTC: 0,
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        } as UserTicket,
      };
      spyOn(apiService, 'saveTicket').and.returnValue(of(request) as any);
      spyOn(toastrService, 'info').and.returnValue(of({}) as any);

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
      expect(toastrService.info).toHaveBeenCalled();
    });

    it('should dispatch saveCategoryActionError when save backend returns error', () => {
      const request = {
        userId: 1,
        userTicket: {
          id: 0,
          userId: '77777777-0000-3333-0000-77777777',
          direction: 'SELL',
          epochUTC: 0,
          order: '',
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
          userTicketStatus: UserTicketStatus.New,
          version: 0,
        } as UserTicket,
      };
      const error = new HttpErrorResponse({});
      spyOn(apiService, 'saveTicket').and.returnValue(throwError(() => error));
      spyOn(toastrService, 'error').and.returnValue(of({}) as any);
      actions$ = of(saveExchangeTicketAction(request));

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionError',
          error,
        });
        expect(toastrService.error).toHaveBeenCalled();
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
          epochUTC: 0,
          amount: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        },
      ] as UserTicket[];
      const action = loadUserTicketListAction();
      const outcome = loadUserTicketListActionSuccess({ userTicketList });

      actions$ = hot('-a', { a: action });
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        of(userTicketList) as any,
      );
      const expected = cold('-c', { c: outcome });
      expect(effects.loadUserTicketList$).toBeObservable(expected);
    });

    it('should dispatch loadUserTicketListActionError when save backend returns error', () => {
      const error = new HttpErrorResponse({});
      spyOn(apiService, 'loadUserTicketList').and.returnValue(
        throwError(() => error),
      );
      actions$ = of(loadUserTicketListAction());

      effects.loadUserTicketList$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Load UserTicketList Error',
          error,
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
      epochUTC: 0,
      order: '',
      amount: 0,
      ratio: 0,
      pair: Pair.GbpUsd,
      userTicketStatus: UserTicketStatus.New,
      version: 0,
    } as UserTicket;
    it('should dispatch cancelExchangeTicketSuccess when sent Ticket', () => {
      const action = cancelExchangeTicketAction({ userTicket });
      const outcome = cancelExchangeTicketSuccess();

      actions$ = hot('-a', { a: action });
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(of({}) as any);
      const expected = cold('-c', { c: outcome });
      expect(effects.cancelUserTicket$).toBeObservable(expected);
    });

    it('should dispatch cancelExchangeTicketError when save backend returns error', () => {
      const error = new HttpErrorResponse({});
      spyOn(apiService, 'cancelExchangeTicket').and.returnValue(
        throwError(() => error),
      );
      actions$ = of(cancelExchangeTicketAction({ userTicket }));

      effects.cancelUserTicket$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] Cancel Exchange Ticket Error',
          error,
        });
        expect(apiService.cancelExchangeTicket).toHaveBeenCalled();
      });
    });
  });
});
