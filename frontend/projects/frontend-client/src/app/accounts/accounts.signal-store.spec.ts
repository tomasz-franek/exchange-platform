import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api/api.service';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {AccountsStore} from './accounts.signal-store';
import {AccountBalance} from '../api/model/accountBalance';
import {AccountOperationsRequest} from '../api/model/accountOperationsRequest';
import {UserOperation} from '../api/model/userOperation';
import {UserAccount} from '../api/model/userAccount';
import {UserAccountOperation} from '../api/model/userAccountOperation';
import {UserBankAccount} from '../api/model/userBankAccount';

describe('Accounts Signal Store Component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });
  describe('loadAccountBalanceList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadAccountBalanceList').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccountBalanceList();

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccounts when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const accounts: AccountBalance[] = [
        {
          userAccountId: 'userAccountId',
          amount: 2,
          currency: 'EUR'
        },
        {
          userAccountId: 'userAccountId',
          amount: 4,
          currency: 'GBP'
        }
      ];
      spyOn(apiService, 'loadAccountBalanceList').and.returnValue(of(accounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        accountBalanceList: [],
        isLoading: false,
      });

      // when
      accountStore.loadAccountBalanceList();

      // then
      expect(accountStore.accountBalanceList()).toEqual(accounts);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadAccountBalanceList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        accountBalanceList: [{
          userAccountId: 'userAccountId',
          amount: 2,
          currency: 'EUR'
        },],
        isLoading: false,
      });

      // when
      accountStore.loadAccountBalanceList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountBalanceList()).toEqual([]);
    }));
  })

  describe('loadUserOperationList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadUserOperationList').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'GBP',
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
        page: 1,
        size: 10,
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadUserOperationList(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccounts when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const userOperations: UserOperation[] = [
        {
          currency: 'EUR',
          amount: 2,
          dateUtc: 'dateUtc',
          eventType: "FEE",
          userId: 'userId'
        },
        {
          currency: 'EUR',
          amount: 4,
          dateUtc: 'dateUtc',
          eventType: "FEE",
          userId: 'userId'
        }
      ];
      spyOn(apiService, 'loadUserOperationList').and.returnValue(of(userOperations) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'GBP',
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
        page: 1,
        size: 10,
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        userOperationList: [],
        isLoading: false,
      });

      // when
      accountStore.loadUserOperationList(request);

      // then
      expect(accountStore.userOperationList()).toEqual(userOperations);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadUserOperationList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'GBP',
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
        page: 1,
        size: 10,
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        userOperationList: [{
          currency: 'EUR',
          amount: 4,
          dateUtc: 'dateUtc',
          eventType: "FEE",
          userId: 'userId'
        }],
        isLoading: false,
      });

      // when
      accountStore.loadUserOperationList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountBalanceList()).toEqual([]);
    }));
  })

  describe('saveAccount - createUserAccount ', () => {
    it(`should set isLoading true`, () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'createUserAccount').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1
      } as UserAccount;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccount when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const userAccount: UserAccount = {
        currency: 'USD',
        version: 1,
        id: '1'
      };
      spyOn(apiService, 'createUserAccount').and.returnValue(of(userAccount) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
      } as UserAccount;
      patchState(unprotected(accountStore), {
        userAccount: {} as UserAccount,
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(accountStore.userAccount()).toEqual(userAccount);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'createUserAccount').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
      } as UserAccount;
      patchState(unprotected(accountStore), {
        userAccount: {
          id: '1',
          version: 2,
          currency: "PLN"
        },
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userAccount()).toEqual({} as UserAccount);
    }));
  })

  describe('saveAccount - updateUserAccount ', () => {
    it(`should set isLoading true`, () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'updateUserAccount').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1'
      } as UserAccount;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccount when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const userAccount: UserAccount = {
        currency: 'USD',
        version: 1,
        id: '1'
      };
      spyOn(apiService, 'updateUserAccount').and.returnValue(of(userAccount) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1'
      } as UserAccount;
      patchState(unprotected(accountStore), {
        userAccount: {} as UserAccount,
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(accountStore.userAccount()).toEqual(userAccount);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'updateUserAccount').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1'
      } as UserAccount;
      patchState(unprotected(accountStore), {
        userAccount: {
          id: '1',
          version: 2,
          currency: "PLN"
        },
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userAccount()).toEqual({} as UserAccount);
    }));
  })

  describe('saveWithdrawRequest', () => {
    it(`should set isLoading true`, () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveWithdrawRequest').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId'
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccount when backend return data', () => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveWithdrawRequest').and.returnValue(of({}) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId'
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userAccount: {} as UserAccount,
        isLoading: false,
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok'
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveWithdrawRequest').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId'
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userOperationList: [
          {
            currency: 'EUR'
          }
        ]
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userOperationList()).toEqual([]);
    }));
  })

  describe('saveBankAccount', () => {
    it(`should set isLoading true`, () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveBankAccount').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        version: 1,
        id: 'id',
        currency: 'EUR',
        createdDateUtc: 'createdDateUtc',
        accountNumber: 'accountNumber',
        userAccountId: 'userAccountId',
        verifiedDateUtc: 'verifiedDateUtc',
        countryCode: 'de'
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveBankAccount(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set userAccount when backend return data', () => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveBankAccount').and.returnValue(of({}) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        version: 1,
        id: 'id',
        currency: 'EUR',
        createdDateUtc: 'createdDateUtc',
        accountNumber: 'accountNumber',
        userAccountId: 'userAccountId',
        verifiedDateUtc: 'verifiedDateUtc',
        countryCode: 'de'
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userAccount: {} as UserAccount,
        isLoading: false,
      });

      // when
      accountStore.saveBankAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok'
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveBankAccount').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        version: 1,
        id: 'id',
        currency: 'EUR',
        createdDateUtc: 'createdDateUtc',
        accountNumber: 'accountNumber',
        userAccountId: 'userAccountId',
        verifiedDateUtc: 'verifiedDateUtc',
        countryCode: 'de'
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userOperationList: [
          {
            currency: 'EUR'
          }
        ]
      });

      // when
      accountStore.saveBankAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userOperationList()).toEqual([]);
    }));
  })
})
