import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api/api.service';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsStore } from './accounts.signal-store';
import { AccountBalance } from '../api/model/accountBalance';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';
import { UserOperation } from '../api/model/userOperation';
import { UserAccount } from '../api/model/userAccount';
import { UserAccountOperation } from '../api/model/userAccountOperation';
import { UserBankAccount } from '../api/model/userBankAccount';
import { Withdraw } from '../api/model/withdraw';

describe('Accounts Signal Store Component', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'saveWithdrawRequest',
      'saveBankAccount',
      'loadAccountBalanceList',
      'createUserAccount',
      'updateUserAccount',
      'loadUserOperationList',
      'loadWithdrawLimitList',
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
  describe('loadAccountBalanceList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccountBalanceList.and.returnValue(new Subject<any>());
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
      const accounts: AccountBalance[] = [
        {
          userAccountId: 'userAccountId',
          amount: 2,
          currency: 'EUR',
        },
        {
          userAccountId: 'userAccountId',
          amount: 4,
          currency: 'GBP',
        },
      ];
      apiService.loadAccountBalanceList.and.returnValue(of(accounts) as any);
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

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadAccountBalanceList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        accountBalanceList: [
          {
            userAccountId: 'userAccountId',
            amount: 2,
            currency: 'EUR',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadAccountBalanceList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountBalanceList()).toEqual([]);
    });
  });

  describe('loadUserOperationList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUserOperationList.and.returnValue(new Subject<any>());
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
      const userOperations: UserOperation[] = [
        {
          currency: 'EUR',
          amount: 2,
          dateUtc: 'dateUtc',
          eventType: 'FEE',
          userId: 'userId',
        },
        {
          currency: 'EUR',
          amount: 4,
          dateUtc: 'dateUtc',
          eventType: 'FEE',
          userId: 'userId',
        },
      ];
      apiService.loadUserOperationList.and.returnValue(
        of(userOperations) as any,
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
        userOperationList: [],
        isLoading: false,
      });

      // when
      accountStore.loadUserOperationList(request);

      // then
      expect(accountStore.userOperationList()).toEqual(userOperations);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadUserOperationList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
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
        userOperationList: [
          {
            currency: 'EUR',
            amount: 4,
            dateUtc: 'dateUtc',
            eventType: 'FEE',
            userId: 'userId',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadUserOperationList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountBalanceList()).toEqual([]);
    });
  });

  describe('saveAccount - createUserAccount ', () => {
    it(`should set isLoading true`, () => {
      // given
      apiService.createUserAccount.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
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
      const userAccount: UserAccount = {
        currency: 'USD',
        version: 1,
        id: '1',
      };
      apiService.createUserAccount.and.returnValue(of(userAccount) as any);
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

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.createUserAccount.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
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
          currency: 'PLN',
        },
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userAccount()).toEqual({} as UserAccount);
    });
  });

  describe('saveAccount - updateUserAccount ', () => {
    it(`should set isLoading true`, () => {
      // given
      apiService.updateUserAccount.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1',
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
      const userAccount: UserAccount = {
        currency: 'USD',
        version: 1,
        id: '1',
      };
      apiService.updateUserAccount.and.returnValue(of(userAccount) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1',
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

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.updateUserAccount.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'USD',
        version: 1,
        id: '1',
      } as UserAccount;
      patchState(unprotected(accountStore), {
        userAccount: {
          id: '1',
          version: 2,
          currency: 'PLN',
        },
        isLoading: false,
      });

      // when
      accountStore.saveAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userAccount()).toEqual({} as UserAccount);
    });
  });

  describe('saveWithdrawRequest', () => {
    it(`should set isLoading true`, () => {
      // given
      apiService.saveWithdrawRequest.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId',
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
      translateService.instant.and.returnValue('ok');
      apiService.saveWithdrawRequest.and.returnValue(of({}) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId',
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
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveWithdrawRequest.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        currency: 'EUR',
        version: 1,
        userAccountId: 'userAccountId',
        amount: 4,
        userId: 'userId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userOperationList: [
          {
            currency: 'EUR',
          },
        ],
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userOperationList()).toEqual([]);
    });
  });

  describe('saveBankAccount', () => {
    it(`should set isLoading true`, () => {
      // given
      apiService.saveBankAccount.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        version: 1,
        id: 'id',
        currency: 'EUR',
        createdDateUtc: 'createdDateUtc',
        accountNumber: 'accountNumber',
        userAccountId: 'userAccountId',
        verifiedDateUtc: 'verifiedDateUtc',
        countryCode: 'de',
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
      translateService.instant.and.returnValue('ok');
      apiService.saveBankAccount.and.returnValue(of({}) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        version: 1,
        id: 'id',
        currency: 'EUR',
        createdDateUtc: 'createdDateUtc',
        accountNumber: 'accountNumber',
        userAccountId: 'userAccountId',
        verifiedDateUtc: 'verifiedDateUtc',
        countryCode: 'de',
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
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveBankAccount.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
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
        countryCode: 'de',
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userOperationList: [
          {
            currency: 'EUR',
          },
        ],
      });

      // when
      accountStore.saveBankAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userOperationList()).toEqual([]);
    });
  });

  describe('loadWithdrawLimitList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadWithdrawLimitList.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadWithdrawLimitList();

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set users when backend return data', () => {
      // given
      const withdrawLimits: Withdraw[] = [
        {
          id: 1,
          currency: 'CHF',
          amount: 1,
          version: 1,
        },
        {
          id: 2,
          currency: 'GBP',
          amount: 2,
          version: 2,
        },
      ];
      apiService.loadWithdrawLimitList.and.returnValue(
        of(withdrawLimits) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        withdrawLimits: [],
        isLoading: false,
      });

      // when
      accountStore.loadWithdrawLimitList();

      // then
      expect(accountStore.withdrawLimits()).toEqual(withdrawLimits);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadWithdrawLimitList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        withdrawLimits: [
          {
            id: 2,
            currency: 'EUR',
            amount: 2,
            version: 3,
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadWithdrawLimitList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.withdrawLimits()).toEqual([]);
    });
  });
});
