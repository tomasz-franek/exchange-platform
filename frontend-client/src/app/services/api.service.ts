import { TicketsService, UserTicket } from '../api';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export class ApiService {
  private ticketService = inject(TicketsService);

  constructor() {}

  saveTicket(idUser: number, userTicket: UserTicket): Observable<any> {
    return this.ticketService.saveTicket(idUser, userTicket);
  }
}
