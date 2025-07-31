import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {Transaction} from '../../api/model/transaction';
import {SelectTransactionRequest} from '../../api/model/selectTransactionRequest';

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
