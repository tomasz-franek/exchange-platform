import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {Transaction} from '../../api/model/transaction';

class SelectTransactionRequest {
}

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
    error: HttpErrorResponse;
  }>(),
);
