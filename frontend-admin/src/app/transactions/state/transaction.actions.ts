import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Transaction } from '../../api/model/transaction';
import { SelectTransactionRequest } from '../../api/model/selectTransactionRequest';

export const loadTransactionListAction = createAction(
  '[Transaction] Select Transactions',
  props<{ selectTransactionRequest: SelectTransactionRequest }>(),
);
export const loadTransactionListSuccess = createAction(
  '[Transaction] Load Transaction List Success',
  props<{ transactions: Transaction[] }>(),
);
export const loadTransactionListFailure = createAction(
  '[Transaction] Load Transaction List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadExchangeAccountTransactionListAction = createAction(
  '[Transaction] Load Exchange Account List',
  props<{ selectTransactionRequest: SelectTransactionRequest }>(),
);

export const loadExchangeAccountTransactionListSuccess = createAction(
  '[Transaction] Load Exchange Account List Success',
  props<{ exchangeTransactions: Transaction[] }>(),
);
export const loadExchangeAccountTransactionListFailure = createAction(
  '[Transaction] Load Exchange Account List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadSystemAccountTransactionListAction = createAction(
  '[Transaction] Load System Account List',
  props<{ selectTransactionRequest: SelectTransactionRequest }>(),
);

export const loadSystemAccountTransactionListSuccess = createAction(
  '[Transaction] Load System Account List Success',
  props<{ systemTransactions: Transaction[] }>(),
);
export const loadSystemAccountTransactionListFailure = createAction(
  '[Transaction] Load System Account List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
