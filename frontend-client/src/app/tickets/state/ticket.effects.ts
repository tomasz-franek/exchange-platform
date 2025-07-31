import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketError,
  cancelExchangeTicketSuccess,
  incrementTicketId,
  loadUserTicketListAction,
  loadUserTicketListActionError,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
  saveExchangeTicketActionError,
  saveExchangeTicketActionSuccess,
} from './ticket.actions';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TicketEffects {
  private readonly _apiService$: ApiService = inject(ApiService);
  private readonly _toasterService$: ToastrService = inject(ToastrService);
  private readonly _translateService$: TranslateService =
    inject(TranslateService);

  save$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveExchangeTicketAction),
      mergeMap((action) => {
        return this._apiService$.saveTicket(action.userTicket).pipe(
          mergeMap(() => {
            this._toasterService$.info(
              'Ticket order sent with id=' + action.userTicket.id,
            );
            return [saveExchangeTicketActionSuccess()];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            if (
              errorResponse.status === 400 &&
              errorResponse.error.errorCode === 'INSUFFICIENT_FUNDS'
            ) {
              let message: string = this._translateService$.instant(
                'ERRORS.INSUFFICIENT_FUNDS',
              );
              this._toasterService$.error(message);
            } else {
              this._toasterService$.error('Error occurred while saving ticket');
            }
            return [saveExchangeTicketActionError({ errorResponse })];
          }),
        );
      }),
    );
  });
  incrementTicketId$ = createEffect(
    () => inject(Actions).pipe(ofType(incrementTicketId)),
    { dispatch: false },
  );

  loadUserTicketList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserTicketListAction),
      mergeMap(() => {
        return this._apiService$.loadUserTicketList().pipe(
          map((data) => {
            return loadUserTicketListActionSuccess({ userTicketList: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadUserTicketListActionError({ errorResponse })];
          }),
        );
      }),
    );
  });

  cancelUserTicket$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(cancelExchangeTicketAction),
      mergeMap((action) => {
        return this._apiService$.cancelExchangeTicket(action.userTicket).pipe(
          mergeMap(() => {
            this._toasterService$.info('Ticket cancelled');
            return [cancelExchangeTicketSuccess(), loadUserTicketListAction()];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [cancelExchangeTicketError({ errorResponse })];
          }),
        );
      }),
    );
  });
}
