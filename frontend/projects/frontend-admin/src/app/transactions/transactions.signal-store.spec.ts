import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { TransactionsStore } from './transactions.signal-store';
import { SelectTransactionRequest } from '../api/model/selectTransactionRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectUserTransactionRequest } from '../api/model/selectUserTransactionRequest';
import { TransactionsResponse } from '../api/model/transactionsResponse';

describe('TransactionsSignalStore', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTransactionList',
      'loadUserTransactionList',
      'loadSystemAccountTransactionList',
      'loadExchangeAccountTransactionList',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;
  });
  describe('loadTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadTransactionList.and.returnValue(new Subject<any>());
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        isLoading: false,
      });

      // when
      transactionsStore.loadTransactionList(request);

      // then
      expect(transactionsStore.isLoading()).toBeTrue();
    });

    it('should set transactions when backend return data', () => {
      // given
      const transactionsResponse: TransactionsResponse = {
        items: [
          { dateUtc: '1', amount: 1 },
          { dateUtc: '2', amount: 2 },
        ],
        totalRecords: 2,
      };
      apiService.loadTransactionList.and.returnValue(
        of(transactionsResponse) as any,
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        transactions: [],
        transactionsTotal: 0,
        isLoading: false,
      });

      // when
      transactionsStore.loadTransactionList(request);

      // then
      expect(transactionsStore.transactions()).toEqual(
        transactionsResponse.items || [],
      );
      expect(transactionsStore.transactionsTotal()).toEqual(
        transactionsResponse.totalRecords || 0,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadTransactionList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        transactions: [{ dateUtc: '1', amount: 1, currency: 'CHF' }],
        transactionsTotal: 1,
        isLoading: false,
      });

      // when
      transactionsStore.loadTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.transactions()).toEqual([]);
      expect(transactionsStore.transactionsTotal()).toEqual(0);
    });
  });

  describe('loadSystemAccountTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadSystemAccountTransactionList.and.returnValue(
        new Subject<any>(),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        isLoading: false,
      });

      // when
      transactionsStore.loadSystemAccountTransactionList(request);

      // then
      expect(transactionsStore.isLoading()).toBeTrue();
    });

    it('should set systemTransactions when backend return data', () => {
      // given
      const transactionsResponse: TransactionsResponse = {
        items: [
          { dateUtc: '1', amount: 1 },
          { dateUtc: '2', amount: 2 },
        ],
        totalRecords: 2,
      };
      apiService.loadSystemAccountTransactionList.and.returnValue(
        of(transactionsResponse) as any,
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        systemTransactions: [],
        systemTransactionsTotal: 0,
        isLoading: false,
      });

      // when
      transactionsStore.loadSystemAccountTransactionList(request);

      // then
      expect(transactionsStore.systemTransactions()).toEqual(
        transactionsResponse.items || [],
      );
      expect(transactionsStore.systemTransactionsTotal()).toEqual(
        transactionsResponse.totalRecords || 0,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadSystemAccountTransactionList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        systemTransactions: [{ dateUtc: '1', amount: 1 }],
        systemTransactionsTotal: 1,
        isLoading: false,
      });

      // when
      transactionsStore.loadSystemAccountTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.systemTransactions()).toEqual([]);
      expect(transactionsStore.systemTransactionsTotal()).toEqual(0);
    });
  });

  describe('loadExchangeAccountTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadExchangeAccountTransactionList.and.returnValue(
        new Subject<any>(),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        isLoading: false,
      });

      // when
      transactionsStore.loadExchangeAccountTransactionList(request);

      // then
      expect(transactionsStore.isLoading()).toBeTrue();
    });

    it('should set systemTransactions when backend return data', () => {
      // given
      const transactionsResponse: TransactionsResponse = {
        items: [
          { dateUtc: '1', amount: 1 },
          { dateUtc: '2', amount: 2 },
        ],
        totalRecords: 2,
      };
      apiService.loadExchangeAccountTransactionList.and.returnValue(
        of(transactionsResponse) as any,
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        exchangeTransactions: [],
        exchangeTransactionsTotal: 0,
        isLoading: false,
      });

      // when
      transactionsStore.loadExchangeAccountTransactionList(request);

      // then
      expect(transactionsStore.exchangeTransactions()).toEqual(
        transactionsResponse.items || [],
      );
      expect(transactionsStore.exchangeTransactionsTotal()).toEqual(
        transactionsResponse.totalRecords || 0,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadExchangeAccountTransactionList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        exchangeTransactions: [{ dateUtc: '1', amount: 1 }],
        exchangeTransactionsTotal: 1,
        isLoading: false,
      });

      // when
      transactionsStore.loadExchangeAccountTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.exchangeTransactions()).toEqual([]);
      expect(transactionsStore.exchangeTransactionsTotal()).toEqual(0);
    });
  });

  describe('loadUserTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUserTransactionList.and.returnValue(new Subject<any>());
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectUserTransactionRequest;
      patchState(unprotected(transactionsStore), {
        isLoading: false,
      });

      // when
      transactionsStore.loadUserTransactionList(request);

      // then
      expect(transactionsStore.isLoading()).toBeTrue();
    });

    it('should set transactions when backend return data', () => {
      // given
      const transactionsResponse: TransactionsResponse = {
        items: [
          { dateUtc: '1', amount: 1 },
          { dateUtc: '2', amount: 2 },
        ],
        totalRecords: 2,
      };
      apiService.loadUserTransactionList.and.returnValue(
        of(transactionsResponse) as any,
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectUserTransactionRequest;
      patchState(unprotected(transactionsStore), {
        userTransactions: [],
        userTransactionsTotal: 0,
        isLoading: false,
      });

      // when
      transactionsStore.loadUserTransactionList(request);

      // then
      expect(transactionsStore.userTransactions()).toEqual(
        transactionsResponse.items || [],
      );
      expect(transactionsStore.userTransactionsTotal()).toEqual(
        transactionsResponse.totalRecords || 0,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadUserTransactionList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectUserTransactionRequest;
      patchState(unprotected(transactionsStore), {
        userTransactions: [{ dateUtc: '1', amount: 1 }],
        userTransactionsTotal: 1,
        isLoading: false,
      });

      // when
      transactionsStore.loadUserTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.userTransactions()).toEqual([]);
      expect(transactionsStore.userTransactionsTotal()).toEqual(0);
    });
  });
});
