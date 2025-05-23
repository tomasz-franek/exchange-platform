import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap } from 'rxjs';
import {
  incrementTicketId,
  sendExchangeTicket,
  sendExchangeTicketActionError,
  sendExchangeTicketActionSuccess,
} from './ticket.actions';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TicketEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  save$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendExchangeTicket),
      mergeMap((action) => {
        return this._apiService$.saveTicket(action.userTicket).pipe(
          mergeMap(() => {
            this.toasterService.info(
              'Ticket order sent with id=' + action.userTicket.id,
            );
            return [sendExchangeTicketActionSuccess()];
          }),
          catchError((error: any) => {
            this.toasterService.error('Error occurred while saving ticket');
            return [sendExchangeTicketActionError({ error })];
          }),
        );
      }),
    ),
  );
  incrementTicketId$ = createEffect(
    () => inject(Actions).pipe(ofType(incrementTicketId)),
    { dispatch: false },
  );
}
