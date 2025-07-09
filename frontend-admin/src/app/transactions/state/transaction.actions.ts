import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {Transaction} from '../../api/model/models';

class SelectTransactionRequest {
}

export const selectTransactionsAction = createAction(
    '[Transaction] Select Transactions',
    props<{ selectTransactionRequest: SelectTransactionRequest }>(),
);
export const selectTransactionsSuccess = createAction(
    '[Transaction] Load User Statistic Action Success',
    props<{ transactions: Transaction[] }>(),
);
export const selectTransactionsFailure = createAction(
    '[Transaction] Load User Statistic Action Failure',
    props<{
      error: HttpErrorResponse;
    }>(),
);
