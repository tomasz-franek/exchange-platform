import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {TransactionsStore} from './transactions.signal-store';
import {SelectTransactionRequest} from '../api/model/selectTransactionRequest';
import {Transaction} from '../api/model/transaction';

describe('TransactionsSignalStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });
  describe('loadTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadTransactionList').and.returnValue(new Subject<any>());
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
      const apiService = TestBed.inject(ApiService);
      const transactions: Transaction[] = [
        {dateUtc: '1', amount: 1},
        {dateUtc: '2', amount: 2},
      ];
      spyOn(apiService, 'loadTransactionList').and.returnValue(of(transactions) as any);
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        transactions: [],
        isLoading: false,
      });

      // when
      transactionsStore.loadTransactionList(request);

      // then
      expect(transactionsStore.transactions()).toEqual(transactions);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadTransactionList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        transactions: [{dateUtc: '1', amount: 1}],
        isLoading: false,
      });

      // when
      transactionsStore.loadTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.transactions()).toEqual([]);
    }));
  })

  describe('loadSystemAccountTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadSystemAccountTransactionList').and.returnValue(new Subject<any>());
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
      const apiService = TestBed.inject(ApiService);
      const transactions: Transaction[] = [
        {dateUtc: '1', amount: 1},
        {dateUtc: '2', amount: 2},
      ];
      spyOn(apiService, 'loadSystemAccountTransactionList').and.returnValue(of(transactions) as any);
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        systemTransactions: [],
        isLoading: false,
      });

      // when
      transactionsStore.loadSystemAccountTransactionList(request);

      // then
      expect(transactionsStore.systemTransactions()).toEqual(transactions);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadSystemAccountTransactionList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        systemTransactions: [{dateUtc: '1', amount: 1}],
        isLoading: false,
      });

      // when
      transactionsStore.loadSystemAccountTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.systemTransactions()).toEqual([]);
    }));
  })

  describe('loadExchangeAccountTransactionList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadExchangeAccountTransactionList').and.returnValue(new Subject<any>());
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
      const apiService = TestBed.inject(ApiService);
      const transactions: Transaction[] = [
        {dateUtc: '1', amount: 1},
        {dateUtc: '2', amount: 2},
      ];
      spyOn(apiService, 'loadExchangeAccountTransactionList').and.returnValue(of(transactions) as any);
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        exchangeTransactions: [],
        isLoading: false,
      });

      // when
      transactionsStore.loadExchangeAccountTransactionList(request);

      // then
      expect(transactionsStore.exchangeTransactions()).toEqual(transactions);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadExchangeAccountTransactionList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const transactionsStore = TestBed.inject(TransactionsStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(transactionsStore), {
        exchangeTransactions: [{dateUtc: '1', amount: 1}],
        isLoading: false,
      });

      // when
      transactionsStore.loadExchangeAccountTransactionList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(transactionsStore.exchangeTransactions()).toEqual([]);
    }));
  })
})
