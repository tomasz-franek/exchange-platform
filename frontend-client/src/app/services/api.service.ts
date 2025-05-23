import { AccountsService } from '../api/api/accounts.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTicket } from '../api/model/userTicket';
import { TicketsService } from '../api/api/tickets.service';
import { AccountBalance, UserAccountOperation } from '../api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private ticketsService = inject(TicketsService);
  private accountService = inject(AccountsService);

  constructor() {}

  saveTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketsService.saveTicket(userTicket);
  }

  addAccountDeposit(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.accountService.addAccountDeposit(userAccountOperationRequest);
  }

  addWithdrawRequest(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.accountService.addWithdrawRequest(userAccountOperationRequest);
  }

  getUserAccountList(userId: string): Observable<AccountBalance[]> {
    return this.accountService.getUserAccountList(userId);
  }
}
