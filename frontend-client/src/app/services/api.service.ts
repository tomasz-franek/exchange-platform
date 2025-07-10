import { AccountsService } from '../api/api/accounts.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTicket } from '../api/model/userTicket';
import { TicketsService } from '../api/api/tickets.service';

import { UserAccount } from '../api/model/userAccount';
import { UserOperation } from '../api/model/userOperation';
import { UserAccountOperation } from '../api/model/userAccountOperation';
import { AccountBalance } from '../api/model/accountBalance';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';
import { UserProperty } from '../api/model/userProperty';
import { UsersService } from '../api/api/users.service';
import { DictionariesService } from '../api/api/dictionaries.service';
import { CurrencyRate, RatesService } from '../api';
import { SystemService } from '../api/api/system.service';
import { BuildInfo } from '../api/model/buildInfo';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly ticketsService = inject(TicketsService);
  private readonly accountService = inject(AccountsService);
  private readonly usersService = inject(UsersService);
  private readonly dictionariesService = inject(DictionariesService);
  private readonly ratesService = inject(RatesService);
  private readonly systemService = inject(SystemService);

  saveTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketsService.saveUserTicket(userTicket);
  }

  loadUserTicketList(): Observable<UserTicket[]> {
    return this.ticketsService.loadUserTicketList();
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

  loadAccountBalanceList(): Observable<AccountBalance[]> {
    return this.accountService.loadAccountBalanceList();
  }

  createUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.accountService.createUserAccount(userAccount);
  }

  loadUserOperationList(
    accountOperationsRequest: AccountOperationsRequest,
  ): Observable<UserOperation[]> {
    return this.accountService.loadUserOperationList(accountOperationsRequest);
  }

  updateUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.accountService.updateUserAccount(userAccount);
  }

  getUserProperty(): Observable<UserProperty> {
    return this.usersService.getUserProperty();
  }

  saveUserProperty(userProperty: UserProperty): Observable<any> {
    return this.usersService.saveUserProperty(userProperty);
  }

  cancelExchangeTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketsService.cancelExchangeTicket(userTicket);
  }

  loadTimezoneList(): Observable<string[]> {
    return this.dictionariesService.loadTimezoneList();
  }

  loadUnicodeLocalesList(): Observable<string[]> {
    return this.dictionariesService.loadUnicodeLocalesList();
  }

  loadCurrencyRates(): Observable<Array<CurrencyRate>> {
    return this.ratesService.loadCurrencyRates();
  }

  public loadBuildInfo(): Observable<BuildInfo> {
    return this.systemService.loadBuildInfo();
  }
}
