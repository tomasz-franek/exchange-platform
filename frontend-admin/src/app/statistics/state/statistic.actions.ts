import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UsersStatisticResponse} from "../../api/model/usersStatisticResponse";
import {UsersStatisticRequest} from "../../api/model/usersStatisticRequest";

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
      error: HttpErrorResponse;
    }>(),
);
