import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AccountEffects } from './account.effects';
import { ApiService } from '../../../services/api.service';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  loadAccountOperationListAction,
  loadAccountOperationListFailure,
  loadAccountOperationListSuccess,
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
} from './account.actions';
import { UserAccount } from '../../api/model/userAccount';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccountRequest } from '../../api/model/userAccountRequest';
import { ToastrService } from 'ngx-toastr';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import { UserData } from '../../api/model/userData';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { AccountOperation } from '../../api/model/accountOperation';

describe('AccountEffects', () => {
  let actions$: Actions;
  let effects: AccountEffects;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadAccounts',
      'saveAccountDeposit',
      'saveWithdrawRequest',
      'loadSystemAccountList',
      'loadExchangeAccountList',
      'loadAccountOperationList',
      'loadOperationPdfDocument',
      'loadUserList',
    ]);

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
      ToastrService,
    ) as jasmine.SpyObj<ToastrService>;
  });
  describe('loadUserAccount$', () => {
    it('should return loadAccountListSuccess on successful load', () => {
      const userAccountRequest: UserAccountRequest = { userId: '1' };
      const action = loadAccountListAction({ userAccountRequest });
      const userAccounts = [
        { id: '1', currency: 'EUR', version: 2 },
      ] as UserAccount[];
      const completion = loadAccountListSuccess({ userAccounts });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: userAccounts });
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });

    it('should return loadAccountListFailure on error', () => {
      const userAccountRequest: UserAccountRequest = { userId: '1' };
      const action = loadAccountListAction({ userAccountRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadAccountListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });
  });

  describe('saveDeposit$', () => {
    it('should return saveDepositSuccess on successful account-deposit', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({ depositRequest });
      const completion = saveDepositSuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {});
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
        'Deposit successfully sent',
      );
    });

    it('should return saveDepositFailure on error', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({ depositRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveDepositFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving account-deposit request',
      );
    });
  });

  describe('saveWithdraw$', () => {
    it('should return saveWithdrawSuccess on successful withdrawal', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({ withdrawRequest });
      const completion = saveWithdrawSuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {});
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
        'Withdraw request successfully sent',
      );
    });
    it('should return saveWithdrawFailure on error', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({ withdrawRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveWithdrawFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while sending withdraw request',
      );
    });
  });

  describe('loadUsers$', () => {
    it('should return loadUserListActionSuccess on successful load', () => {
      const loadUserRequest: LoadUserRequest = { email: '1' };
      const action = loadUserListAction({ loadUserRequest });
      const users = [
        { email: 'email1', userId: 'userId1', name: 'name1' },
        { email: 'email2', userId: 'userId2', name: 'name2' },
      ] as UserData[];
      const completion = loadUserListActionSuccess({ users });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: users });
      apiService.loadUserList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    });

    it('should return loadUserListActionFailure on error', () => {
      const loadUserRequest: LoadUserRequest = { email: '1' };
      const action = loadUserListAction({ loadUserRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadUserListActionFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadUserList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });

  describe('loadSystemAccount$', () => {
    [{ accountType: 'system' }, { accountType: 'exchange' }].forEach(
      ({ accountType }) => {
        it(`should return loadAccountListSuccess on successful load for ${accountType}`, () => {
          const action = loadSystemAccountListAction({ accountType });
          const systemAccounts = [
            { id: '5', currency: 'EUR', version: 2 },
          ] as UserAccount[];
          const completion = loadSystemAccountListSuccess({ systemAccounts });

          actions$ = hot('-a-', { a: action });
          const response = cold('-b|', { b: systemAccounts });
          if (accountType == 'system') {
            apiService.loadSystemAccountList.and.returnValue(response);
          } else {
            apiService.loadExchangeAccountList.and.returnValue(response);
          }

          const expected = cold('--c', { c: completion });
          expect(effects.loadSystemAccount$).toBeObservable(expected);
          if (accountType == 'system') {
            expect(apiService.loadSystemAccountList).toHaveBeenCalled();
          } else {
            expect(apiService.loadExchangeAccountList).toHaveBeenCalled();
          }
        });

        it(`should return loadSystemAccountListFailure on error for ${accountType}`, () => {
          const action = loadSystemAccountListAction({ accountType });
          const errorResponse = new HttpErrorResponse({ error: 'Error' });
          const completion = loadSystemAccountListFailure({
            errorResponse,
          });

          actions$ = hot('-a-', { a: action });
          const response = cold('-#', {}, errorResponse);
          if (accountType == 'system') {
            apiService.loadSystemAccountList.and.returnValue(response);
          } else {
            apiService.loadExchangeAccountList.and.returnValue(response);
          }

          const expected = cold('--c', { c: completion });
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

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: accountOperations });
      apiService.loadAccountOperationList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
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
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadAccountOperationListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccountOperationList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
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

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: pdfContent });
      apiService.loadOperationPdfDocument.and.returnValue(response);

      const expected = cold('--c', { c: completion });
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
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadOperationPdfDocumentFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadOperationPdfDocument.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadOperationPdfDocument$).toBeObservable(expected);
    });
  });
});
