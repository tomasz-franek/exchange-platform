import { fakeAsync, TestBed } from '@angular/core/testing';
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
import { Withdraw } from '../api/model/withdraw';

describe('AccountsStore', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'validateBankAccount',
      'saveCorrectionRequest',
      'loadBankAccountList',
      'saveWithdrawRequest',
      'loadExchangeAccountList',
      'loadOperationPdfDocument',
      'loadSystemAccountList',
      'saveAccountDeposit',
      'loadAccountOperationList',
      'loadUserList',
      'loadAccountAmount',
      'loadAccounts',
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
  describe('loadAccounts', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccounts.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as UserAccountRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccounts(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
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
      apiService.loadAccounts.and.returnValue(of(accounts) as any);
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadAccounts.and.returnValue(
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
    }));
  });

  describe('loadUserList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUserList.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { userId: 'userId' } as LoadUserRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadUserList(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
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
      apiService.loadUserList.and.returnValue(of(userData) as any);
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadUserList.and.returnValue(
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
    }));
  });

  describe('loadAccountOperationList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccountOperationList.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
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
      apiService.loadAccountOperationList.and.returnValue(of(userData) as any);
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadAccountOperationList.and.returnValue(
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
    }));
  });

  describe('loadOperationPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadOperationPdfDocument.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
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
      apiService.loadOperationPdfDocument.and.returnValue(of(userData) as any);
      spyOn(window, 'open');
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
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadOperationPdfDocument.and.returnValue(
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
    }));
  });

  describe('loadSystemAccountList', () => {
    [{ accountType: 'system' }, { accountType: 'exchange' }].forEach(
      ({ accountType }) => {
        it(`should set isLoading true for ${accountType}`, () => {
          // given
          apiService.loadSystemAccountList.and.returnValue(new Subject<any>());
          apiService.loadExchangeAccountList.and.returnValue(
            new Subject<any>(),
          );
          const accountStore = TestBed.inject(AccountsStore);
          patchState(unprotected(accountStore), {
            isLoading: false,
          });

          // when
          accountStore.loadSystemAccountList(accountType);

          // then
          expect(accountStore.isLoading()).toBeTrue();
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
          apiService.loadSystemAccountList.and.returnValue(
            of(userAccounts) as any,
          );
          apiService.loadExchangeAccountList.and.returnValue(
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

        it(`should call messageService.add with error message when backend returns error ${accountType}`, fakeAsync(() => {
          // given
          translateService.instant.and.returnValue('error');
          apiService.loadSystemAccountList.and.returnValue(
            throwError(() => new HttpErrorResponse({})),
          );
          apiService.loadExchangeAccountList.and.returnValue(
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
        }));
      },
    );
  });

  describe('loadAccountAmount', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadAccountAmount.and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = { accountId: 'accountId' } as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        isLoading: false,
      });

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should set accountAmountResponse when backend return data', () => {
      // given
      const accountAmountResponse: AccountAmountResponse = {
        amount: 2,
      };
      apiService.loadAccountAmount.and.returnValue(
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadAccountAmount.and.returnValue(
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
    }));
  });

  describe('loadBankAccountList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadBankAccountList.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
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
      apiService.loadBankAccountList.and.returnValue(
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadBankAccountList.and.returnValue(
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
    }));
  });

  describe('validateBankAccount', () => {
    it('should set isLoading true', () => {
      // given
      apiService.validateBankAccount.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.and.returnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.validateBankAccount.and.returnValue(
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.validateBankAccount.and.returnValue(
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
    }));
  });

  describe('saveAccountDeposit', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveAccountDeposit.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.and.returnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.saveAccountDeposit.and.returnValue(
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveAccountDeposit.and.returnValue(
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
    }));
  });

  describe('saveWithdrawRequest', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveWithdrawRequest.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.and.returnValue('ok');
      const userBankAccounts: UserBankAccount = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date',
      };
      apiService.saveWithdrawRequest.and.returnValue(
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveWithdrawRequest.and.returnValue(
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
    }));
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
      apiService.saveCorrectionRequest.and.returnValue(new Subject<any>());
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
      expect(accountStore.isLoading()).toBeTrue();
    });

    it('should show message when backend return data', () => {
      // given
      translateService.instant.and.returnValue('ok');
      const correctionId: CorrectionId = {
        id: 1,
      };
      apiService.saveCorrectionRequest.and.returnValue(of(correctionId) as any);
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveCorrectionRequest.and.returnValue(
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
    }));
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
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
    }));
  });
});
