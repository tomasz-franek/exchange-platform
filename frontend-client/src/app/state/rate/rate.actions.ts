import { createAction, props } from '@ngrx/store';
import { CurrencyRate } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';

export const loadCurrencyRateListAction = createAction(
  '[RATE] Load currency rate list',
);
export const loadCurrencyRateListActionSuccess = createAction(
  '[RATE] Load currency rate list success',
  props<{ currencyRates: CurrencyRate[] }>(),
);

export const loadCurrencyRateListActionError = createAction(
  '[RATE] Load currency rate list error',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
