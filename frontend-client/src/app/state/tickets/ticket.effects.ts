import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap } from 'rxjs';
import {
  sendExchangeTicket,
  sendExchangeTicketActionError,
  sendExchangeTicketActionSuccess,
} from './ticket.action';
import { ToastrService } from 'ngx-toastr';

export class TicketEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  save$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendExchangeTicket),
      mergeMap((action) => {
        return this._apiService$
          .saveTicket(action.userTicket)
          .pipe(
            mergeMap(() => {
              this.toasterService.info('Ticket order sent');
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
}
