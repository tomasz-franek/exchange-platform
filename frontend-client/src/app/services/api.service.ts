import { AccountsService } from '../api/api/accounts.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTicket } from '../api/model/userTicket';
import { TicketsService } from '../api/api/tickets.service';
import { AccountBalance, UserAccountOperation } from '../api';
import { UserAccount } from '../api/model/userAccount';

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

  saveAccountDeposit(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.accountService.saveAccountDeposit(userAccountOperationRequest);
  }

  saveWithdrawRequest(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.accountService.saveWithdrawRequest(userAccountOperationRequest);
  }

  loadAccountBalanceList(userId: string): Observable<AccountBalance[]> {
    return this.accountService.loadAccountBalanceList(userId);
  }

  createUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.accountService.createUserAccount(userAccount);
  }

  updateUserAccount(
    id: string,
    userAccount: UserAccount,
  ): Observable<UserAccount> {
    return this.accountService.updateUserAccount(id, userAccount);
  }
}
