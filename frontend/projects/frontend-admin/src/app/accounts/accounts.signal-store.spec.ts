import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsStore } from './accounts.signal-store';
import { UserAccountRequest } from '../api/model/userAccountRequest';
import { UserAccount } from '../api/model/userAccount';
import { LoadUserRequest } from '../api/model/loadUserRequest';
import { UserData } from '../api/model/userData';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';
import { AccountOperation } from '../api/model/accountOperation';
import { AccountAmountRequest } from '../api/model/accountAmountRequest';
import { AccountAmountResponse } from '../api/model/accountAmountResponse';
import { UserBankAccount } from '../api/model/userBankAccount';
import { UserBankAccountRequest } from '../api/model/userBankAccountRequest';
import { UserAccountOperation } from '../api/model/userAccountOperation';
import { CorrectionRequest } from '../api/model/correctionRequest';
import { CorrectionId } from '../api/model/correctionId';

describe('AccountsStore', () => {
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      validateBankAccount: vi.fn().mockName('ApiService.validateBankAccount'),
      saveCorrectionRequest: vi
        .fn()
        .mockName('ApiService.saveCorrectionRequest'),
      loadBankAccountList: vi.fn().mockName('ApiService.loadBankAccountList'),
      saveWithdrawRequest: vi.fn().mockName('ApiService.saveWithdrawRequest'),
      loadExchangeAccountList: vi
        .fn()
        .mockName('ApiService.loadExchangeAccountList'),
      loadOperationPdfDocument: vi
        .fn()
        .mockName('ApiService.loadOperationPdfDocument'),
      loadSystemAccountList: vi
        .fn()
        .mockName('ApiService.loadSystemAccountList'),
      saveAccountDeposit: vi.fn().mockName('ApiService.saveAccountDeposit'),
      loadAccountOperationList: vi
        .fn()
        .mockName('ApiService.loadAccountOperationList'),
      loadUserList: vi.fn().mockName('ApiService.loadUserList'),
      loadAccountAmount: vi.fn().mockName('ApiService.loadAccountAmount'),
      loadAccounts: vi.fn().mockName('ApiService.loadAccounts'),
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
  describe('loadAccounts', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccounts.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as UserAccountRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccounts(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set userAccounts when backend return data', () => {
      // given
      const accounts: UserAccount[] = [
        {
          currency: 'EUR',
          version: 1,
          id: 'id',
        },
        {
          currency: 'USD',
          version: 1,
          id: 'id',
        },
      ];
      apiService.loadAccounts.mockReturnValue(of(accounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as UserAccountRequest;
      patchState(unprotected(accountStore), {
        userAccounts: [],
        isLoading: false,
      });

      // when
      accountStore.loadAccounts(request);

      // then
      expect(accountStore.userAccounts()).toEqual(accounts);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadAccounts.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as UserAccountRequest;
      patchState(unprotected(accountStore), {
        userAccounts: [
          {
            currency: 'USD',
            version: 1,
            id: 'id',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadAccounts(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userAccounts()).toEqual([]);
    });
  });

  describe('loadUserList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUserList.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as LoadUserRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadUserList(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set users when backend return data', () => {
      // given
      const userData: UserData[] = [
        {
          userId: 'userId',
          email: 'email',
          name: 'email',
        },
        {
          userId: 'userId2',
          email: 'email2',
          name: 'email2',
        },
      ];
      apiService.loadUserList.mockReturnValue(of(userData) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as LoadUserRequest;
      patchState(unprotected(accountStore), {
        users: [],
        isLoading: false,
      });

      // when
      accountStore.loadUserList(request);

      // then
      expect(accountStore.users()).toEqual(userData);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadUserList.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as LoadUserRequest;
      patchState(unprotected(accountStore), {
        users: [
          {
            userId: 'userId',
            email: 'email',
            name: 'email',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadUserList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userAccounts()).toEqual([]);
    });
  });

  describe('loadAccountOperationList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccountOperationList.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccountOperationList(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set accountOperations when backend return data', () => {
      // given
      const userData: AccountOperation[] = [
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'DEPOSIT',
        },
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE',
        },
      ];
      apiService.loadAccountOperationList.mockReturnValue(of(userData) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [],
        isLoading: false,
      });

      // when
      accountStore.loadAccountOperationList(request);

      // then
      expect(accountStore.accountOperations()).toEqual(userData);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadAccountOperationList.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [
          {
            currency: 'EUR',
            amount: 3,
            dateUtc: 'dateUtc',
            eventType: 'FEE',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadAccountOperationList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountOperations()).toEqual([]);
    });
  });

  describe('loadOperationPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadOperationPdfDocument.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadOperationPdfDocument(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set accountOperations when backend return data', () => {
      // given
      const userData: AccountOperation[] = [
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'DEPOSIT',
        },
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE',
        },
      ];
      apiService.loadOperationPdfDocument.mockReturnValue(of(userData) as any);
      const spy = vi.spyOn(window, 'open').mockReturnValue(null);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [],
        isLoading: false,
      });

      // when
      accountStore.loadOperationPdfDocument(request);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadOperationPdfDocument.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId',
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [
          {
            currency: 'EUR',
            amount: 3,
            dateUtc: 'dateUtc',
            eventType: 'FEE',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadOperationPdfDocument(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountOperations()).toEqual([
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE',
        },
      ]);
    });
  });

  describe('loadSystemAccountList', () => {
    [{ accountType: 'system' }, { accountType: 'exchange' }].forEach(
      ({ accountType }) => {
        it(`should set isLoading true for ${accountType}`, () => {
          // given
          apiService.loadSystemAccountList.mockReturnValue(new Subject<any>());
          apiService.loadExchangeAccountList.mockReturnValue(
            new Subject<any>(),
          );
          const accountStore = TestBed.inject(AccountsStore);
          patchState(unprotected(accountStore), {
            isLoading: false,
          });

          // when
          accountStore.loadSystemAccountList(accountType);

          // then
          expect(accountStore.isLoading()).toBe(true);
        });

        it(`should set accountOperations when backend return data ${accountType}`, () => {
          // given
          const userAccounts: UserAccount[] = [
            {
              currency: 'USD',
              version: 1,
              id: '3',
            },
            {
              currency: 'USD',
              version: 1,
              id: '1',
            },
          ];
          apiService.loadSystemAccountList.mockReturnValue(
            of(userAccounts) as any,
          );
          apiService.loadExchangeAccountList.mockReturnValue(
            of(userAccounts) as any,
          );
          const accountStore = TestBed.inject(AccountsStore);
          patchState(unprotected(accountStore), {
            systemAccounts: [],
            isLoading: false,
          });

          // when
          accountStore.loadSystemAccountList(accountType);

          // then
          expect(accountStore.systemAccounts()).toEqual(userAccounts);
        });

        it(`should call messageService.add with error message when backend returns error ${accountType}`, () => {
          // given
          translateService.instant.mockReturnValue('error');
          apiService.loadSystemAccountList.mockReturnValue(
            throwError(() => new HttpErrorResponse({})),
          );
          apiService.loadExchangeAccountList.mockReturnValue(
            throwError(() => new HttpErrorResponse({})),
          );
          const accountStore = TestBed.inject(AccountsStore);
          patchState(unprotected(accountStore), {
            systemAccounts: [
              {
                currency: 'USD',
                version: 1,
                id: '3',
              },
            ],
            isLoading: false,
          });

          // when
          accountStore.loadSystemAccountList(accountType);

          // then
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            detail:
              'errorHttp failure response for (unknown url): undefined undefined',
          });
          expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
          expect(accountStore.systemAccounts()).toEqual([]);
        });
      },
    );
  });

  describe('loadAccountAmount', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccountAmount.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { accountId: 'accountId' } as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set accountAmountResponse when backend return data', () => {
      // given
      const accountAmountResponse: AccountAmountResponse = {
        amount: 2,
      };
      apiService.loadAccountAmount.mockReturnValue(
        of(accountAmountResponse) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = { accountId: 'accountId' } as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        accountAmountResponse: {} as AccountAmountResponse,
        isLoading: false,
      });

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(accountStore.accountAmountResponse()).toEqual(
        accountAmountResponse,
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadAccountAmount.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = { accountId: 'accountId' } as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        accountAmountResponse: { amount: 9 },
      });

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountAmountResponse()).toEqual({});
    });
  });

  describe('loadBankAccountList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadBankAccountList.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
      } as UserBankAccountRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadBankAccountList(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should set users when backend return data', () => {
      // given
      const userBankAccounts: UserBankAccount[] = [
        {
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date',
        },
        {
          id: 'id2',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date',
        },
      ];
      apiService.loadBankAccountList.mockReturnValue(
        of(userBankAccounts) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
      } as UserBankAccountRequest;
      patchState(unprotected(accountStore), {
        userBankAccounts: [],
        isLoading: false,
      });

      // when
      accountStore.loadBankAccountList(request);

      // then
      expect(accountStore.userBankAccounts()).toEqual(userBankAccounts);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadBankAccountList.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
      } as UserBankAccountRequest;
      patchState(unprotected(accountStore), {
        userBankAccounts: [
          {
            id: 'id',
            countryCode: 'countryCode',
            userAccountId: 'userAccountId',
            version: 1,
            verifiedDateUtc: 'date',
            accountNumber: 'number',
            createdDateUtc: 'date',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.loadBankAccountList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });

  describe('validateBankAccount', () => {
    it('should set isLoading true', () => {
      // given
      apiService.validateBankAccount.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.validateBankAccount(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.mockReturnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.validateBankAccount.mockReturnValue(
        of(userBankAccounts) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userBankAccounts: [],
        isLoading: false,
      });

      // when
      accountStore.validateBankAccount(request);

      // then
      expect(accountStore.userBankAccounts()).toEqual([]);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith(
        'MESSAGES.VALIDATED',
      );
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.validateBankAccount.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userBankAccounts: [
          {
            id: 'id',
            countryCode: 'countryCode',
            userAccountId: 'userAccountId',
            version: 1,
            verifiedDateUtc: 'date',
            accountNumber: 'number',
            createdDateUtc: 'date',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.validateBankAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });

  describe('saveAccountDeposit', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveAccountDeposit.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveAccountDeposit(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.mockReturnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.saveAccountDeposit.mockReturnValue(
        of(userBankAccounts) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [],
        isLoading: false,
      });

      // when
      accountStore.saveAccountDeposit(request);

      // then
      expect(accountStore.userBankAccounts()).toEqual([]);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveAccountDeposit.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [
          {
            id: 'id',
            countryCode: 'countryCode',
            userAccountId: 'userAccountId',
            version: 1,
            verifiedDateUtc: 'date',
            accountNumber: 'number',
            createdDateUtc: 'date',
          },
        ],
        isLoading: false,
      });

      // when
      accountStore.saveAccountDeposit(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });

  describe('saveWithdrawRequest', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveWithdrawRequest.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.mockReturnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.saveWithdrawRequest.mockReturnValue(
        of(userBankAccounts) as any,
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [],
        isLoading: false,
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(accountStore.userBankAccounts()).toEqual([]);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveWithdrawRequest.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: 'EUR',
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [
          {
            id: 'id',
            countryCode: 'countryCode',
            userAccountId: 'userAccountId',
            version: 1,
            verifiedDateUtc: 'date',
            accountNumber: 'number',
            createdDateUtc: 'date',
          },
        ],
        isLoading: false,
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
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });

  describe('clearBankAccounts', () => {
    it('should set isLoading true', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        userBankAccounts: [
          {
            id: 'id',
            countryCode: 'countryCode',
            userAccountId: 'userAccountId',
            version: 1,
            verifiedDateUtc: 'date',
            accountNumber: 'number',
            createdDateUtc: 'date',
          },
        ],
      });

      // when
      accountStore.clearBankAccounts();

      // then
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });

  describe('saveCorrectionRequest', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveCorrectionRequest.mockReturnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
        amount: 3,
      } as CorrectionRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveCorrectionRequest(request);

      // then
      expect(accountStore.isLoading()).toBe(true);
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.mockReturnValue('ok');
      const correctionId: CorrectionId = {
        id: 1,
      };
      apiService.saveCorrectionRequest.mockReturnValue(of(correctionId) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
        amount: 3,
      } as CorrectionRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveCorrectionRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: 'ok',
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.SAVED');
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveCorrectionRequest.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        userAccountId: 'userAccountId',
        amount: 3,
      } as CorrectionRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.saveCorrectionRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
    });
  });

  describe('setSelectedUser', () => {
    it('should set selected user id', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      const userId = '123';
      patchState(unprotected(accountStore), {
        selectedUserId: 'abc',
        selectedUserAccountId: 'def',
      });

      // when
      accountStore.setSelectedUserId(userId);

      // then
      expect(accountStore.selectedUserId()).toEqual(userId);
    });
    it('should set selected user id to null', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      const userId = null;
      patchState(unprotected(accountStore), {
        selectedUserId: 'abc',
        selectedUserAccountId: 'def',
      });

      // when
      accountStore.setSelectedUserId(userId);

      // then
      expect(accountStore.selectedUserId()).toEqual(userId);
    });
    it('should clean user account id', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      const userId = '123';
      patchState(unprotected(accountStore), {
        selectedUserId: 'abc',
        selectedUserAccountId: 'def',
      });

      // when
      accountStore.setSelectedUserId(userId);

      // then
      expect(accountStore.selectedUserAccountId()).toEqual(null);
    });
  });

  describe('setSelectedUserAccountId', () => {
    it('should set selected user account id', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      const userAccountId = '123';
      patchState(unprotected(accountStore), {
        selectedUserAccountId: 'def',
      });

      // when
      accountStore.setSelectedUserAccountId(userAccountId);

      // then
      expect(accountStore.selectedUserAccountId()).toEqual(userAccountId);
    });
    it('should set selected user account id to null', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      const userId = null;
      patchState(unprotected(accountStore), {
        selectedUserAccountId: 'def',
      });

      // when
      accountStore.setSelectedUserAccountId(userId);

      // then
      expect(accountStore.selectedUserAccountId()).toEqual(userId);
    });
  });

  describe('clearAccountOperations', () => {
    it('should clear AccountOperations', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        accountOperations: [
          {
            currency: 'EUR',
            amount: 2,
            dateUtc: 'date',
            eventType: 'FEE',
          },
        ],
      });

      // when
      accountStore.clearAccountOperations();

      // then
      expect(accountStore.accountOperations()).toEqual([]);
    });
  });
});
