import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {BuildInfo} from '../../api/model/buildInfo';

export const loadBuildInfoAction = createAction(
  '[Util] Load Build Info Action',
);
export const loadBuildInfoSuccess = createAction(
  '[Util] Load Build Info Success',
  props<{ buildInfo: BuildInfo }>(),
);
export const loadBuildInfoFailure = createAction(
  '[Util] Load Build Info Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
