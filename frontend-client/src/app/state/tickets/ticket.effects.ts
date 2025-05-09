import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {sendExchangeTicket, sendExchangeTicketActionError, sendExchangeTicketActionSuccess,} from './ticket.action';

export class TicketEffects {
  private store$ = inject(Store);
  private _apiService$: ApiService = inject(ApiService);
  private router: Router = inject(Router);

  save$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendExchangeTicket),
      mergeMap((action) => {
        return this._apiService$
          .saveTicket(action.idUser, action.userTicket)
          .pipe(
            map(() => {
              return sendExchangeTicketActionSuccess();
            }),
            catchError((error: any) => {
              return [sendExchangeTicketActionError({error})];
            }),
          );
      }),
    ),
  );
}
