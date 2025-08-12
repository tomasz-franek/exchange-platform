import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyRate } from '../../api/model/currencyRate';

export const loadCurrencyRateListAction = createAction(
  '[RATE] Load currency rate list'
);
export const loadCurrencyRateListActionSuccess = createAction(
  '[RATE] Load currency rate list success',
  props<{ currencyRates: CurrencyRate[] }>()
);

export const loadCurrencyRateListActionFailure = createAction(
  '[RATE] Load currency rate list Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);
