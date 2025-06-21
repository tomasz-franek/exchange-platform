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
import { DictionaryTimezone } from '../api/model/dictionaryTimezone';
import { DictionaryLocale } from '../api/model/dictionaryLocale';
import { CurrencyRate, RatesService } from '../api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private ticketsService = inject(TicketsService);
  private accountService = inject(AccountsService);
  private usersService = inject(UsersService);
  private dictionariesService = inject(DictionariesService);
  private ratesService = inject(RatesService);

  constructor() {}

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

  updateUserAccount(
    accountId: string,
    userAccount: UserAccount,
  ): Observable<UserAccount> {
    return this.accountService.updateUserAccount(accountId, userAccount);
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

  loadTimezoneList(): Observable<DictionaryTimezone[]> {
    return this.dictionariesService.loadTimezoneList();
  }

  loadUnicodeLocalesList(): Observable<DictionaryLocale[]> {
    return this.dictionariesService.loadUnicodeLocalesList();
  }

  loadCurrencyRates(): Observable<Array<CurrencyRate>> {
    return this.ratesService.loadCurrencyRates();
  }
}
