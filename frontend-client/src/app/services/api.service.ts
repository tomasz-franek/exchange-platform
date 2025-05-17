import { TicketsService } from '../api';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTicket } from '../api/model/userTicket';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private ticketService = inject(TicketsService);

  constructor() {}

  saveTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketService.saveTicket(userTicket);
  }
}
