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
import { hot } from 'jasmine-marbles';
import { sendExchangeTicket } from './ticket.action';
import { UserTicket } from '../../api/model/userTicket';
import { Pair } from '../../api/model/pair';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
    it('should dispatch sendExchangeTicketActionSuccess when sent Ticket', () => {
      // given
      const request = {
        idUser: 1,
        userTicket: {
          id: 0,
          idUser: 4,
          direction: 'SELL',
          epochUTC: 0,
          value: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        } as UserTicket,
      };
      spyOn(apiService, 'saveTicket').and.returnValue(of(request) as any);
      spyOn(toastrService, 'info').and.returnValue(of({}) as any);

      actions$ = hot('-a', {
        a: sendExchangeTicket(request),
      });

      // when
      expect(effects.save$).toBeObservable(
        // then
        hot('-(b)', {
          b: {
            type: '[Ticket] SendExchangeTicketActionSuccess',
          },
        }),
      );
      expect(toastrService.info).toHaveBeenCalled();
    });

    it('should dispatch saveCategoryActionError when save backend returns error', () => {
      // given
      const request = {
        idUser: 1,
        userTicket: {
          id: 0,
          idUser: 4,
          direction: 'SELL',
          epochUTC: 0,
          order: '',
          value: 0,
          ratio: 0,
          pair: Pair.GbpUsd,
        } as UserTicket,
      };
      const error = new HttpErrorResponse({});
      spyOn(apiService, 'saveTicket').and.returnValue(throwError(() => error));
      spyOn(toastrService, 'error').and.returnValue(of({}) as any);
      actions$ = of(sendExchangeTicket(request));

      // when
      effects.save$.subscribe((action) => {
        // then
        expect(action).toEqual({
          type: '[Ticket] SendExchangeTicketActionError',
          error,
        });
        expect(toastrService.error).toHaveBeenCalled();
      });
    });
  });
});
