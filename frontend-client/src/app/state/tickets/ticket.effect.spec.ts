import { Action } from '@ngrx/store';
import { TicketEffects } from './ticket.effect';
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
import { saveExchangeTicket } from './ticket.action';
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
    it('should dispatch saveExchangeTicketActionSuccess when sent Ticket', () => {
      const request = {
        userTicket: {
          id: 0,
          idUser: '77777777-1111-0000-0000-77777777',
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
        a: saveExchangeTicket(request),
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
        idUser: 1,
        userTicket: {
          id: 0,
          idUser: '77777777-0000-3333-0000-77777777',
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
      actions$ = of(saveExchangeTicket(request));

      effects.save$.subscribe((action) => {
        expect(action).toEqual({
          type: '[Ticket] SaveExchangeTicketActionError',
          error,
        });
        expect(toastrService.error).toHaveBeenCalled();
      });
    });
  });
});
