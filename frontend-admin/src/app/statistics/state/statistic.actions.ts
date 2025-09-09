import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { UsersStatisticRequest } from '../../api/model/usersStatisticRequest';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { Pair } from '../../api/model/pair';
import { PairStatisticResponse } from '../../api/model/pairStatisticResponse';

export const loadUserStatisticAction = createAction(
  '[Statistic] Load User Statistic Action',
  props<{ usersStatisticRequest: UsersStatisticRequest }>(),
);
export const loadUserStatisticSuccess = createAction(
  '[Statistic] Load User Statistic Action Success',
  props<{ usersStatisticResponse: UsersStatisticResponse }>(),
);
export const loadUserStatisticFailure = createAction(
  '[Statistic] Load User Statistic Action Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadCurrencyStatisticAction = createAction(
  '[Statistic] Load Currency Statistic Action',
  props<{ currency: string }>(),
);

export const loadCurrencyStatisticSuccess = createAction(
  '[Statistic] Load Currency Statistic Action Success',
  props<{ currencyStatisticResponse: CurrencyStatisticResponse }>(),
);
export const loadCurrencyStatisticFailure = createAction(
  '[Statistic] Load Currency Statistic Action Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadPairStatisticAction = createAction(
  '[Statistic] Load Pair Statistic Action',
  props<{ pair: Pair }>(),
);

export const loadPairStatisticSuccess = createAction(
  '[Statistic] Load Pair Statistic Action Success',
  props<{ pairStatisticResponse: PairStatisticResponse }>(),
);
export const loadPairStatisticFailure = createAction(
  '[Statistic] Load Pair Statistic Action Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
