import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {UserTicket} from '../api/model/userTicket';
import {Pair} from '../api/model/pair';
import {TranslateService} from '@ngx-translate/core';
import {loadExchangePdfDocumentSuccess} from './state/ticket.actions';

type TicketState = {
  userTicket: UserTicket;
  userTicketList: UserTicket[];
  realizedTicketList: UserTicket[];
  ticketId: number;
  isLoading: boolean;
}
export const initialTicketState: TicketState = {
  userTicket: {
    id: 0,
    userId: '',
    amount: 0,
    ratio: 0,
    pair: Pair.EurPln,
    epochUtc: 0,
    direction: 'BUY',
    ticketStatus: 'NEW',
    version: 0
  },
  userTicketList: [],
  realizedTicketList: [],
  ticketId: 1,
  isLoading: false
};

export const ticketStore = signalStore(
  {providedIn: 'root'},
  withState(initialTicketState),
  // withComputed((ticketId) => {
  //     incrementTicketId: computed(() => {
  //       ticketId()++
  //     });
  //   }
  // ),
  withMethods((store,
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
  ) => ({
    saveTicket: rxMethod<UserTicket>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userTicket) => {
          return apiService.saveTicket(userTicket).pipe(
            tapResponse({
              next: () => {
                console.info(
                  'Ticket order sent with id=' + userTicket.id
                );
              },
              error: (errorResponse: HttpErrorResponse) => {
                if (
                  errorResponse.status === 400 &&
                  errorResponse.error.errorCode === 'INSUFFICIENT_FUNDS'
                ) {
                  const message: string = translateService.instant(
                    'ERRORS.INSUFFICIENT_FUNDS'
                  );
                  console.error(message);
                } else {
                  console.error('Error occurred while saving ticket');
                }
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadUserTicketList: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadUserTicketList().pipe(
            tapResponse({
              next: (userTicketList) => {
                patchState(store, {userTicketList})
              },
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    cancelExchangeTicket: rxMethod<UserTicket>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userTicket) => {
          return apiService.cancelExchangeTicket(userTicket).pipe(
            tapResponse({
              next: () => {
                console.info('Ticket cancelled');
              },
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadRealizedTicketList: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadRealizedTicketList().pipe(
            tapResponse({
              next: (realizedTicketList) => {
                patchState(store, {realizedTicketList})
              },
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadExchangePdfDocument: rxMethod<number>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((id) => {
          return apiService.loadExchangePdfDocument(id).pipe(
            tapResponse({
              next: (data) => {
                {
                  const file = new Blob([data], {type: 'application/pdf'});
                  const fileURL = URL.createObjectURL(file);
                  window.open(fileURL);
                  return loadExchangePdfDocumentSuccess();
                }
              },
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
