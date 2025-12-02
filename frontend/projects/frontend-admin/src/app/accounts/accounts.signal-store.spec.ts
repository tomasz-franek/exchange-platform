import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {AccountsStore} from './accounts.signal-store';
import {UserAccountRequest} from '../api/model/userAccountRequest';
import {UserAccount} from '../api/model/userAccount';
import {LoadUserRequest} from '../api/model/loadUserRequest';
import {UserData} from '../api/model/userData';
import {AccountOperationsRequest} from '../api/model/accountOperationsRequest';
import {AccountOperation} from '../api/model/accountOperation';
import {AccountAmountRequest} from '../api/model/accountAmountRequest';
import {AccountAmountResponse} from '../api/model/accountAmountResponse';
import {UserBankAccount} from '../api/model/userBankAccount';
import {UserBankAccountRequest} from '../api/model/userBankAccountRequest';
import {UserAccountOperation} from '../api/model/userAccountOperation';

describe('AccountsStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });
  describe('loadAccounts', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadAccounts').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as UserAccountRequest;
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
      const apiService = TestBed.inject(ApiService);
      const accounts: UserAccount[] = [
        {
          currency: "EUR",
          version: 1,
          id: 'id'
        },
        {
          currency: "USD",
          version: 1,
          id: 'id'
        }];
      spyOn(apiService, 'loadAccounts').and.returnValue(of(accounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as UserAccountRequest;
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadAccounts').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as UserAccountRequest;
      patchState(unprotected(accountStore), {
        userAccounts: [{
          currency: "USD",
          version: 1,
          id: 'id'
        }],
        isLoading: false,
      });

      // when
      accountStore.loadAccounts(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userAccounts()).toEqual([]);
    }));
  })

  describe('loadUserList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadUserList').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as LoadUserRequest;
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
      const apiService = TestBed.inject(ApiService);
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
        }
      ];
      spyOn(apiService, 'loadUserList').and.returnValue(of(userData) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as LoadUserRequest;
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadUserList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId'} as LoadUserRequest;
      patchState(unprotected(accountStore), {
        users: [{
          userId: 'userId',
          email: 'email',
          name: 'email',
        },],
        isLoading: false,
      });

      // when
      accountStore.loadUserList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userAccounts()).toEqual([]);
    }));
  })

  describe('loadAccountOperationList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadAccountOperationList').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
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
      const apiService = TestBed.inject(ApiService);
      const userData: AccountOperation[] = [
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'DEPOSIT'
        },
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE'
        }
      ];
      spyOn(apiService, 'loadAccountOperationList').and.returnValue(of(userData) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadAccountOperationList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [{
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE'
        }],
        isLoading: false,
      });

      // when
      accountStore.loadAccountOperationList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountOperations()).toEqual([]);
    }));
  })

  describe('loadOperationPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadOperationPdfDocument').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
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
      const apiService = TestBed.inject(ApiService);
      const userData: AccountOperation[] = [
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'DEPOSIT'
        },
        {
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE'
        }
      ];
      spyOn(apiService, 'loadOperationPdfDocument').and.returnValue(of(userData) as any);
      spyOn(window, 'open')
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadOperationPdfDocument').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        dateFromUtc: 'dateFrom',
        dateToUtc: 'dateTo',
        systemAccountId: 'systemAccountId'
      } as AccountOperationsRequest;
      patchState(unprotected(accountStore), {
        accountOperations: [{
          currency: 'EUR',
          amount: 3,
          dateUtc: 'dateUtc',
          eventType: 'FEE'
        }],
        isLoading: false,
      });

      // when
      accountStore.loadOperationPdfDocument(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountOperations()).toEqual([{
        currency: 'EUR',
        amount: 3,
        dateUtc: 'dateUtc',
        eventType: 'FEE'
      }]);
    }));
  })

  describe('loadSystemAccountList', () => {
    [{accountType: 'system'}, {accountType: 'exchange'}].forEach(
      ({accountType}) => {
        it(`should set isLoading true for ${accountType}`, () => {
          // given
          const service = TestBed.inject(ApiService);
          spyOn(service, 'loadSystemAccountList').and.returnValue(new Subject<any>());
          spyOn(service, 'loadExchangeAccountList').and.returnValue(new Subject<any>());
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
          const apiService = TestBed.inject(ApiService);
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
            }
          ];
          spyOn(apiService, 'loadSystemAccountList').and.returnValue(of(userAccounts) as any);
          spyOn(apiService, 'loadExchangeAccountList').and.returnValue(of(userAccounts) as any);
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
          const translateService = TestBed.inject(TranslateService);
          spyOn(translateService, 'instant').and.returnValue('error');
          const messageService = TestBed.inject(MessageService);
          spyOn(messageService, 'add');
          const apiService = TestBed.inject(ApiService);
          spyOn(apiService, 'loadSystemAccountList').and.returnValue(
            throwError(() => new HttpErrorResponse({}))
          );
          spyOn(apiService, 'loadExchangeAccountList').and.returnValue(
            throwError(() => new HttpErrorResponse({}))
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
            detail: 'errorHttp failure response for (unknown url): undefined undefined'
          });
          expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
          expect(accountStore.systemAccounts()).toEqual([]);
        }));
      })
  })

  describe('loadAccountAmount', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadAccountAmount').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {accountId: 'accountId'} as AccountAmountRequest;
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
      const apiService = TestBed.inject(ApiService);
      const accountAmountResponse: AccountAmountResponse = {
        amount: 2
      };
      spyOn(apiService, 'loadAccountAmount').and.returnValue(of(accountAmountResponse) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {accountId: 'accountId'} as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        accountAmountResponse: {} as AccountAmountResponse,
        isLoading: false,
      });

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(accountStore.accountAmountResponse()).toEqual(accountAmountResponse);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadAccountAmount').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {accountId: 'accountId'} as AccountAmountRequest;
      patchState(unprotected(accountStore), {
        accountAmountResponse: {amount: 9}
      })

      // when
      accountStore.loadAccountAmount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.accountAmountResponse()).toEqual({});
    }));
  })

  describe('loadBankAccountList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadBankAccountList').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId', userAccountId: 'userAccountId'} as UserBankAccountRequest;
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
      const apiService = TestBed.inject(ApiService);
      const userBankAccounts: UserBankAccount[] = [
        {
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },
        {
          id: 'id2',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        }

      ];
      spyOn(apiService, 'loadBankAccountList').and.returnValue(of(userBankAccounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId', userAccountId: 'userAccountId'} as UserBankAccountRequest;
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadBankAccountList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {userId: 'userId', userAccountId: 'userAccountId'} as UserBankAccountRequest;
      patchState(unprotected(accountStore), {
        userBankAccounts: [{
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },],
        isLoading: false,
      });

      // when
      accountStore.loadBankAccountList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(accountStore.userBankAccounts()).toEqual([]);
    }));
  })

  describe('validateBankAccount', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'validateBankAccount').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date'
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
      const apiService = TestBed.inject(ApiService);
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const userBankAccounts: UserBankAccount =
        {
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        };
      spyOn(apiService, 'validateBankAccount').and.returnValue(of(userBankAccounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date'
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
        detail: 'ok'
      });
      expect(translateService.instant).toHaveBeenCalledWith('MESSAGES.VALIDATED');
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'validateBankAccount').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        id: 'id',
        countryCode: 'countryCode',
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'date',
        accountNumber: 'number',
        createdDateUtc: 'date'
      } as UserBankAccount;
      patchState(unprotected(accountStore), {
        userBankAccounts: [{
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },],
        isLoading: false,
      });

      // when
      accountStore.validateBankAccount(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userBankAccounts()).toEqual([]);
    }));
  })

  describe('saveAccountDeposit', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveAccountDeposit').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
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
      const apiService = TestBed.inject(ApiService);
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const userBankAccounts: UserBankAccount =
        {
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        };
      spyOn(apiService, 'saveAccountDeposit').and.returnValue(of(userBankAccounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
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
      spyOn(apiService, 'saveAccountDeposit').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [{
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },],
        isLoading: false,
      });

      // when
      accountStore.saveAccountDeposit(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userBankAccounts()).toEqual([]);
    }));
  })

  describe('saveWithdrawRequest', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveWithdrawRequest').and.returnValue(new Subject<any>());
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
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
      const apiService = TestBed.inject(ApiService);
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('ok');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const userBankAccounts: UserBankAccount =
        {
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        };
      spyOn(apiService, 'saveWithdrawRequest').and.returnValue(of(userBankAccounts) as any);
      const accountStore = TestBed.inject(AccountsStore);
      const request = {
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
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
        userId: 'userId',
        accountNumber: 'number',
        amount: 3,
        currency: "EUR",
        userAccountId: 'userAccountId',
      } as UserAccountOperation;
      patchState(unprotected(accountStore), {
        userBankAccounts: [{
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },],
        isLoading: false,
      });

      // when
      accountStore.saveWithdrawRequest(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(accountStore.userBankAccounts()).toEqual([]);
    }));
  })

  describe('clearBankAccounts', () => {
    it('should set isLoading true', () => {
      // given
      const accountStore = TestBed.inject(AccountsStore);
      patchState(unprotected(accountStore), {
        userBankAccounts: [{
          id: 'id',
          countryCode: 'countryCode',
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'date',
          accountNumber: 'number',
          createdDateUtc: 'date'
        },],
      });

      // when
      accountStore.clearBankAccounts();

      // then
      expect(accountStore.userBankAccounts()).toEqual([]);
    });
  });
})
