import {TicketsService, UserTicket} from '../api';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private ticketService = inject(TicketsService);

  constructor() {
  }

  saveTicket(idUser: number, userTicket: UserTicket): Observable<any> {
    return this.ticketService.saveTicket(idUser, userTicket);
  }
}
