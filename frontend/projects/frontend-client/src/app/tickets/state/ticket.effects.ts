import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  cancelExchangeTicketAction,
  cancelExchangeTicketFailure,
  cancelExchangeTicketSuccess,
  incrementTicketId,
  loadExchangePdfDocumentAction,
  loadExchangePdfDocumentFailure,
  loadExchangePdfDocumentSuccess,
  loadRealizedTicketListAction,
  loadRealizedTicketListFailure,
  loadRealizedTicketListSuccess,
  loadUserTicketListAction,
  loadUserTicketListActionFailure,
  loadUserTicketListActionSuccess,
  saveExchangeTicketAction,
  saveExchangeTicketActionFailure,
  saveExchangeTicketActionSuccess
} from './ticket.actions';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class TicketEffects {
  incrementTicketId$ = createEffect(
    () => inject(Actions).pipe(ofType(incrementTicketId)),
    {dispatch: false}
  );
  private readonly _apiService$: ApiService = inject(ApiService);
  loadUserTicketList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserTicketListAction),
      mergeMap(() => {
        return this._apiService$.loadUserTicketList().pipe(
          map((data) => {
            return loadUserTicketListActionSuccess({userTicketList: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadUserTicketListActionFailure({errorResponse})];
          })
        );
      })
    );
  });
  loadRealizedTicketList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadRealizedTicketListAction),
      mergeMap(() => {
        return this._apiService$.loadRealizedTicketList().pipe(
          map((data) => {
            return loadRealizedTicketListSuccess({realizedTicketList: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadRealizedTicketListFailure({errorResponse})];
          })
        );
      })
    );
  });
  loadExchangePdfDocument$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadExchangePdfDocumentAction),
      mergeMap((action) => {
        return this._apiService$.loadExchangePdfDocument(action.id).pipe(
          map((data) => {
            const file = new Blob([data], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            return loadExchangePdfDocumentSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadExchangePdfDocumentFailure({errorResponse})];
          })
        );
      })
    );
  });
  cancelUserTicket$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(cancelExchangeTicketAction),
      mergeMap((action) => {
        return this._apiService$.cancelExchangeTicket(action.userTicket).pipe(
          mergeMap(() => {
            return [cancelExchangeTicketSuccess(), loadUserTicketListAction()];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [cancelExchangeTicketFailure({errorResponse})];
          })
        );
      })
    );
  });
  private readonly _translateService$: TranslateService =
    inject(TranslateService);
  save$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveExchangeTicketAction),
      mergeMap((action) => {
        return this._apiService$.saveTicket(action.userTicket).pipe(
          mergeMap(() => {
            return [saveExchangeTicketActionSuccess()];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            if (
              errorResponse.status === 400 &&
              errorResponse.error.errorCode === 'INSUFFICIENT_FUNDS'
            ) {
              const message: string = this._translateService$.instant(
                'ERRORS.INSUFFICIENT_FUNDS'
              );
            }
            return [saveExchangeTicketActionFailure({errorResponse})];
          })
        );
      })
    );
  });
}
