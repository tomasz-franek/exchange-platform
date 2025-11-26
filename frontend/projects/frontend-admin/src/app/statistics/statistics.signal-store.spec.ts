import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {StatisticStore} from './statistics.signal-store';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {UsersStatisticResponse} from '../api/model/usersStatisticResponse';
import {UsersStatisticRequest} from '../api/model/usersStatisticRequest';
import {CurrencyStatisticResponse} from '../api/model/currencyStatisticResponse';
import {PairStatisticResponse} from '../api/model/pairStatisticResponse';
import {Pair} from '../api/model/pair';

describe('StatisticStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('loadUserStatistic', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadUsersStatistic').and.returnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(statisticStore.isLoading()).toBeTrue();
    });

    it('should set usersStatisticResponse when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const usersStatisticResponse = {
        amountInTickets: 1,
        amountTotal: 2,
        allTickets: 3,
        activeTickets: 4,
      } as UsersStatisticResponse;
      spyOn(apiService, 'loadUsersStatistic').and.returnValue(of(usersStatisticResponse) as any);
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        usersStatisticResponse: {} as UsersStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(statisticStore.usersStatisticResponse()).toEqual(usersStatisticResponse);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadUsersStatistic').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        usersStatisticResponse: {
          activeTickets: 1,
          allTickets: 2,
          amountInTickets: 3,
          amountTotal: 4
        } as UsersStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.usersStatisticResponse()).toEqual({} as UsersStatisticResponse);
    }));
  })

  describe('loadCurrencyStatistic', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadCurrencyStatistics').and.returnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = "EUR";
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(statisticStore.isLoading()).toBeTrue();
    });

    it('should set currencyStatisticResponse when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const currencyStatisticResponse = {
        amountInTickets: 2,
        amountTotal: 2,
        currency: "CHF",
      } as CurrencyStatisticResponse;
      spyOn(apiService, 'loadCurrencyStatistics').and.returnValue(of(currencyStatisticResponse) as any);
      const statisticStore = TestBed.inject(StatisticStore);
      const request = "USD";
      patchState(unprotected(statisticStore), {
        currencyStatisticResponse: {} as CurrencyStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(statisticStore.currencyStatisticResponse()).toEqual(currencyStatisticResponse);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadCurrencyStatistics').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = "PLN";
      patchState(unprotected(statisticStore), {
        currencyStatisticResponse: {
          amountInTickets: 2,
          amountTotal: 2,
          currency: "CHF",
        } as CurrencyStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.currencyStatisticResponse()).toEqual({} as CurrencyStatisticResponse);
    }));
  })

  describe('loadPairStatistics', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadPairStatistics').and.returnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(statisticStore.isLoading()).toBeTrue();
    });

    it('should set currencyStatisticResponse when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const pairStatisticResponse = {
        amountTicketsBuy: 4,
        amountTotal: 3,
        amountTicketsSell: 5,
        countTicketsBuy: 5,
        countTicketsSell: 13
      } as PairStatisticResponse;
      spyOn(apiService, 'loadPairStatistics').and.returnValue(of(pairStatisticResponse) as any);
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        pairStatisticResponse: {} as PairStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(statisticStore.pairStatisticResponse()).toEqual(pairStatisticResponse);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadPairStatistics').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        pairStatisticResponse: {
          amountTicketsBuy: 2,
          amountTotal: 2,
          amountTicketsSell: 3,
          countTicketsBuy: 3,
          countTicketsSell: 3
        } as PairStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.pairStatisticResponse()).toEqual({} as PairStatisticResponse);
    }));
  })
})
