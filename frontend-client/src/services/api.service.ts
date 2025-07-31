import { AccountsService } from '../app/api/api/accounts.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTicket } from '../app/api/model/userTicket';
import { TicketsService } from '../app/api/api/tickets.service';

import { UserAccount } from '../app/api/model/userAccount';
import { UserOperation } from '../app/api/model/userOperation';
import { AccountBalance } from '../app/api/model/accountBalance';
import { AccountOperationsRequest } from '../app/api/model/accountOperationsRequest';
import { UserProperty } from '../app/api/model/userProperty';
import { UsersService } from '../app/api/api/users.service';
import { DictionariesService } from '../app/api/api/dictionaries.service';
import { CurrencyRate, RatesService } from '../app/api';
import { SystemService } from '../app/api/api/system.service';
import { BuildInfo } from '../app/api/model/buildInfo';
import { SystemMessage } from '../app/api/model/systemMessage';

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

  public loadSystemMessageList(): Observable<SystemMessage[]> {
    return this.systemService.loadSystemMessageList();
  }
}
