import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {AccountEffects} from './account.effects';
import {ApiService} from '../../../services/api.service';
import {
  loadAccountAmountAction,
  loadAccountAmountFailure,
  loadAccountAmountSuccess,
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  loadAccountOperationListAction,
  loadAccountOperationListFailure,
  loadAccountOperationListSuccess,
  loadBankAccountListAction,
  loadBankAccountListFailure,
  loadBankAccountListSuccess,
  loadOperationPdfDocumentAction,
  loadOperationPdfDocumentFailure,
  loadOperationPdfDocumentSuccess,
  loadSystemAccountListAction,
  loadSystemAccountListFailure,
  loadSystemAccountListSuccess,
  loadUserListAction,
  loadUserListActionFailure,
  loadUserListActionSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
  validateUserBankAccountAction,
  validateUserBankAccountFailure,
  validateUserBankAccountSuccess,
} from './account.actions';
import {UserAccount} from '../../api/model/userAccount';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {LoadUserRequest} from '../../api/model/loadUserRequest';
import {UserData} from '../../api/model/userData';
import {AccountOperationsRequest} from '../../api/model/accountOperationsRequest';
import {AccountOperation} from '../../api/model/accountOperation';
import {AccountAmountRequest} from '../../api/model/accountAmountRequest';
import {AccountAmountResponse} from '../../api/model/accountAmountResponse';
import {UserBankAccount} from '../../api/model/userBankAccount';
import {UserBankAccountRequest} from '../../api/model/userBankAccountRequest';

describe('AccountEffects', () => {
  let actions$: Actions;
  let effects: AccountEffects;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadAccounts',
      'saveAccountDeposit',
      'saveWithdrawRequest',
      'loadSystemAccountList',
      'loadExchangeAccountList',
      'loadAccountOperationList',
      'loadOperationPdfDocument',
      'loadAccountAmount',
      'loadUserList',
      'validateBankAccount',
      'loadBankAccountList',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadUserAccount$', () => {
    it('should return loadAccountListSuccess on successful load', () => {
      const userAccountRequest: UserAccountRequest = {userId: '1'};
      const action = loadAccountListAction({userAccountRequest});
      const userAccounts = [
        {id: '1', currency: 'EUR', version: 2},
      ] as UserAccount[];
      const completion = loadAccountListSuccess({userAccounts});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: userAccounts});
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });

    it('should return loadAccountListFailure on error', () => {
      const userAccountRequest: UserAccountRequest = {userId: '1'};
      const action = loadAccountListAction({userAccountRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadAccountListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });
  });

  describe('saveDeposit$', () => {
    it('should return saveDepositSuccess on successful account-deposit', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({depositRequest});
      const completion = saveDepositSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {});
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveDeposit$).toBeObservable(expected);
    });

    it('should return saveDepositFailure on error', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({depositRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveDepositFailure({errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveDeposit$).toBeObservable(expected);
    });
  });

  describe('saveWithdraw$', () => {
    it('should return saveWithdrawSuccess on successful withdrawal', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({withdrawRequest});
      const completion = saveWithdrawSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {});
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveWithdraw$).toBeObservable(expected);
    });
    it('should return saveWithdrawFailure on error', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({withdrawRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveWithdrawFailure({errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveWithdraw$).toBeObservable(expected);
    });
  });

  describe('loadUsers$', () => {
    it('should return loadUserListActionSuccess on successful load', () => {
      const loadUserRequest: LoadUserRequest = {email: '1'};
      const action = loadUserListAction({loadUserRequest});
      const users = [
        {email: 'email1', userId: 'userId1', name: 'name1'},
        {email: 'email2', userId: 'userId2', name: 'name2'},
      ] as UserData[];
      const completion = loadUserListActionSuccess({users});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: users});
      apiService.loadUserList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUsers$).toBeObservable(expected);
    });

    it('should return loadUserListActionFailure on error', () => {
      const loadUserRequest: LoadUserRequest = {email: '1'};
      const action = loadUserListAction({loadUserRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadUserListActionFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadUserList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });

  describe('loadSystemAccount$', () => {
    [{accountType: 'system'}, {accountType: 'exchange'}].forEach(
      ({accountType}) => {
        it(`should return loadAccountListSuccess on successful load for ${accountType}`, () => {
          const action = loadSystemAccountListAction({accountType});
          const systemAccounts = [
            {id: '5', currency: 'EUR', version: 2},
          ] as UserAccount[];
          const completion = loadSystemAccountListSuccess({systemAccounts});

          actions$ = hot('-a-', {a: action});
          const response = cold('-b|', {b: systemAccounts});
          if (accountType == 'system') {
            apiService.loadSystemAccountList.and.returnValue(response);
          } else {
            apiService.loadExchangeAccountList.and.returnValue(response);
          }

          const expected = cold('--c', {c: completion});
          expect(effects.loadSystemAccount$).toBeObservable(expected);
          if (accountType == 'system') {
            expect(apiService.loadSystemAccountList).toHaveBeenCalled();
          } else {
            expect(apiService.loadExchangeAccountList).toHaveBeenCalled();
          }
        });

        it(`should return loadSystemAccountListFailure on error for ${accountType}`, () => {
          const action = loadSystemAccountListAction({accountType});
          const errorResponse = new HttpErrorResponse({error: 'Error'});
          const completion = loadSystemAccountListFailure({
            errorResponse,
          });

          actions$ = hot('-a-', {a: action});
          const response = cold('-#', {}, errorResponse);
          if (accountType == 'system') {
            apiService.loadSystemAccountList.and.returnValue(response);
          } else {
            apiService.loadExchangeAccountList.and.returnValue(response);
          }

          const expected = cold('--c', {c: completion});
          expect(effects.loadSystemAccount$).toBeObservable(expected);
          if (accountType == 'system') {
            expect(apiService.loadSystemAccountList).toHaveBeenCalled();
          } else {
            expect(apiService.loadExchangeAccountList).toHaveBeenCalled();
          }
        });
      },
    );
  });

  describe('loadAccountOperations$', () => {
    it('should return loadAccountOperationListSuccess on successful load', () => {
      const loadAccountOperationsRequest: AccountOperationsRequest = {
        dateFromUtc: '2025-01-01',
        dateToUtc: '2025-12-31',
        systemAccountId: 'x',
      };
      const action = loadAccountOperationListAction({
        loadAccountOperationsRequest,
      });
      const accountOperations: AccountOperation[] = [
        {
          amount: 300,
          dateUtc: '2025-01-01',
          currency: 'EUR',
        },
        {
          amount: 2500,
          dateUtc: '2025-02-01',
          currency: 'EUR',
        },
      ];
      const completion = loadAccountOperationListSuccess({
        accountOperations,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: accountOperations});
      apiService.loadAccountOperationList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountOperations$).toBeObservable(expected);
    });

    it('should return loadAccountOperationListFailure on error', () => {
      const loadAccountOperationsRequest: AccountOperationsRequest = {
        dateFromUtc: '2025-01-01',
        dateToUtc: '2025-12-31',
        systemAccountId: 'x',
      };
      const action = loadAccountOperationListAction({
        loadAccountOperationsRequest,
      });
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadAccountOperationListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccountOperationList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountOperations$).toBeObservable(expected);
    });
  });

  describe('loadOperationPdfDocument$', () => {
    it('should return loadOperationPdfDocumentSuccess on successful load', () => {
      const loadAccountOperationsRequest = {
        systemAccountId: '1',
        dateToUtc: '2025-01-01',
        dateFromUtc: '2025-01-01',
      } as AccountOperationsRequest;
      const action = loadOperationPdfDocumentAction({
        loadAccountOperationsRequest,
      });
      const pdfContent: any[] = [1];
      const completion = loadOperationPdfDocumentSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: pdfContent});
      apiService.loadOperationPdfDocument.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadOperationPdfDocument$).toBeObservable(expected);
    });

    it('should return loadOperationPdfDocumentFailure on error', () => {
      const loadAccountOperationsRequest: AccountOperationsRequest = {
        dateFromUtc: '2025-01-01',
        dateToUtc: '2025-12-31',
        systemAccountId: 'x',
      };
      const action = loadOperationPdfDocumentAction({
        loadAccountOperationsRequest,
      });
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadOperationPdfDocumentFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadOperationPdfDocument.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadOperationPdfDocument$).toBeObservable(expected);
    });
  });

  describe('loadOperationPdfDocument$', () => {
    it('should return loadOperationPdfDocumentSuccess on successful load', () => {
      const request = {accountId: 'a'} as AccountAmountRequest;
      const action = loadAccountAmountAction({
        request,
      });
      const accountAmountResponse: AccountAmountResponse = {amount: 29};
      const completion = loadAccountAmountSuccess({accountAmountResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: accountAmountResponse});
      apiService.loadAccountAmount.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountAmount$).toBeObservable(expected);
    });

    it('should return loadAccountAmountFailure on error', () => {
      const request = {accountId: 'a'} as AccountAmountRequest;
      const action = loadAccountAmountAction({
        request,
      });
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadAccountAmountFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccountAmount.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountAmount$).toBeObservable(expected);
    });
  });
  describe('validateUserBankAccount$', () => {
    it('should return validateUserBankAccountSuccess on successful load', () => {
      const userBankAccount: UserBankAccount = {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc',
      };
      const action = validateUserBankAccountAction({
        userBankAccount,
      });
      const userBankAccountResponse = [
        {
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'verifiedDateUtc',
          accountNumber: 'accountNumber',
          id: 'id',
          countryCode: 'CC',
          createdDateUtc: 'createdDateUtc',
        },
      ] as UserBankAccount[];
      const completion = validateUserBankAccountSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: userBankAccountResponse});
      apiService.validateBankAccount.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.validateUserBankAccount$).toBeObservable(expected);
    });

    it('should return validateUserBankAccountFailure on error', () => {
      const userBankAccount: UserBankAccount = {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc',
      };
      const action = validateUserBankAccountAction({
        userBankAccount,
      });
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = validateUserBankAccountFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.validateBankAccount.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.validateUserBankAccount$).toBeObservable(expected);
    });
  });

  describe('loadUserBankAccountList$', () => {
    it('should return loadBankAccountListSuccess on successful load', () => {
      const userBankAccountRequest: UserBankAccountRequest = {
        userId: 'userId',
        userAccountId: 'userAccountId',
      };
      const action = loadBankAccountListAction({
        userBankAccountRequest,
      });
      const userBankAccounts = [
        {
          userAccountId: 'userAccountId',
          version: 1,
          verifiedDateUtc: 'verifiedDateUtc',
          accountNumber: 'accountNumber',
          id: 'id',
          countryCode: 'CC',
          createdDateUtc: 'createdDateUtc',
        },
      ] as UserBankAccount[];
      const completion = loadBankAccountListSuccess({
        userBankAccounts,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: userBankAccounts});
      apiService.loadBankAccountList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserBankAccountList$).toBeObservable(expected);
    });

    it('should return loadBankAccountListFailure on error', () => {
      const userBankAccountRequest: UserBankAccountRequest = {
        userId: 'userId',
        userAccountId: 'userAccountId',
      };
      const action = loadBankAccountListAction({
        userBankAccountRequest,
      });
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadBankAccountListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadBankAccountList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserBankAccountList$).toBeObservable(expected);
    });
  });
});
