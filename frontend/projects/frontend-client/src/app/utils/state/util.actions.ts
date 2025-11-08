import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {BuildInfo} from '../../api/model/buildInfo';

export const loadBuildInfoAction = createAction(
  '[Util] Load BuildInfo Action',
);
export const loadBuildInfoSuccess = createAction(
  '[Util] Load BuildInfo Success',
  props<{ buildInfo: BuildInfo }>(),
);
export const loadBuildInfoFailure = createAction(
  '[Util] Load BuildInfo Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
