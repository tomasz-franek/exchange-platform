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

@Injectable()
export class TicketEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  save$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveExchangeTicketAction),
      mergeMap((action) => {
        return this._apiService$.saveTicket(action.userTicket).pipe(
          mergeMap(() => {
            this.toasterService.info(
              'Ticket order sent with id=' + action.userTicket.id,
            );
            return [saveExchangeTicketActionSuccess()];
          }),
          catchError((error: any) => {
            this.toasterService.error('Error occurred while saving ticket');
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
        return this._apiService$.cancelExchangeTicket(action.id).pipe(
          map(() => {
            return cancelExchangeTicketSuccess();
          }),
          catchError((error: any) => {
            return [cancelExchangeTicketError({ error })];
          }),
        );
      }),
    );
  });
}
