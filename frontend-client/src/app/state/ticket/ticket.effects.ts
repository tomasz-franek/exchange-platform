import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
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
          catchError((error: any) => {
            if (
              error.status === 400 &&
              error.error.errorCode === 'INSUFFICIENT_FUNDS'
            ) {
              let message: string = this._translateService$.instant(
                'ERRORS.INSUFFICIENT_FUNDS',
              );
              this._toasterService$.error(message);
            } else {
              this._toasterService$.error('Error occurred while saving ticket');
            }
            return [saveExchangeTicketActionError({ error })];
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
          catchError((error: any) => {
            return [loadUserTicketListActionError({ error })];
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
          catchError((error: any) => {
            return [cancelExchangeTicketError({ error })];
          }),
        );
      }),
    );
  });
}
