import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { StatisticStore } from './statistics.signal-store';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersStatisticResponse } from '../api/model/usersStatisticResponse';
import { UsersStatisticRequest } from '../api/model/usersStatisticRequest';
import { CurrencyStatisticResponse } from '../api/model/currencyStatisticResponse';
import { PairStatisticResponse } from '../api/model/pairStatisticResponse';
import { Pair } from '../api/model/pair';

describe('StatisticStore', () => {
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadCurrencyStatistics: vi
        .fn()
        .mockName('ApiService.loadCurrencyStatistics'),
      loadPairStatistics: vi.fn().mockName('ApiService.loadPairStatistics'),
      loadUsersStatistic: vi.fn().mockName('ApiService.loadUsersStatistic'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
  });

  describe('loadUserStatistic', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUsersStatistic.mockReturnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(statisticStore.isLoading()).toBe(true);
    });

    it('should set usersStatisticResponse when backend return data', () => {
      // given
      const usersStatisticResponse = {
        amountInTickets: 1,
        amountTotal: 2,
        allTickets: 3,
        activeTickets: 4,
      } as UsersStatisticResponse;
      apiService.loadUsersStatistic.mockReturnValue(
        of(usersStatisticResponse) as any,
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        usersStatisticResponse: {} as UsersStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(statisticStore.usersStatisticResponse()).toEqual(
        usersStatisticResponse,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadUsersStatistic.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = {} as UsersStatisticRequest;
      patchState(unprotected(statisticStore), {
        usersStatisticResponse: {
          activeTickets: 1,
          allTickets: 2,
          amountInTickets: 3,
          amountTotal: 4,
        } as UsersStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadUserStatistic(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.usersStatisticResponse()).toEqual(
        {} as UsersStatisticResponse,
      );
    });
  });

  describe('loadCurrencyStatistic', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadCurrencyStatistics.mockReturnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = 'EUR';
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(statisticStore.isLoading()).toBe(true);
    });

    it('should set currencyStatisticResponse when backend return data', () => {
      // given
      const currencyStatisticResponse = {
        amountInTickets: 2,
        amountTotal: 2,
        currency: 'CHF',
      } as CurrencyStatisticResponse;
      apiService.loadCurrencyStatistics.mockReturnValue(
        of(currencyStatisticResponse) as any,
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = 'USD';
      patchState(unprotected(statisticStore), {
        currencyStatisticResponse: {} as CurrencyStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(statisticStore.currencyStatisticResponse()).toEqual(
        currencyStatisticResponse,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadCurrencyStatistics.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = 'PLN';
      patchState(unprotected(statisticStore), {
        currencyStatisticResponse: {
          amountInTickets: 2,
          amountTotal: 2,
          currency: 'CHF',
        } as CurrencyStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadCurrencyStatistics(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.currencyStatisticResponse()).toEqual(
        {} as CurrencyStatisticResponse,
      );
    });
  });

  describe('loadPairStatistics', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadPairStatistics.mockReturnValue(new Subject<any>());
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(statisticStore.isLoading()).toBe(true);
    });

    it('should set currencyStatisticResponse when backend return data', () => {
      // given
      const pairStatisticResponse = {
        amountTicketsBuy: 4,
        amountTotal: 3,
        amountTicketsSell: 5,
        countTicketsBuy: 5,
        countTicketsSell: 13,
      } as PairStatisticResponse;
      apiService.loadPairStatistics.mockReturnValue(
        of(pairStatisticResponse) as any,
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        pairStatisticResponse: {} as PairStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(statisticStore.pairStatisticResponse()).toEqual(
        pairStatisticResponse,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadPairStatistics.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const statisticStore = TestBed.inject(StatisticStore);
      const request = Pair.ChfPln;
      patchState(unprotected(statisticStore), {
        pairStatisticResponse: {
          amountTicketsBuy: 2,
          amountTotal: 2,
          amountTicketsSell: 3,
          countTicketsBuy: 3,
          countTicketsSell: 3,
        } as PairStatisticResponse,
        isLoading: false,
      });

      // when
      statisticStore.loadPairStatistics(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(statisticStore.pairStatisticResponse()).toEqual(
        {} as PairStatisticResponse,
      );
    });
  });
});
