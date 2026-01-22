import {AccountsService} from '../../app/api/api/accounts.service';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserTicket} from '../../app/api/model/userTicket';
import {TicketsService} from '../../app/api/api/tickets.service';

import {UserAccount} from '../../app/api/model/userAccount';
import {UserOperation} from '../../app/api/model/userOperation';
import {AccountBalance} from '../../app/api/model/accountBalance';
import {AccountOperationsRequest} from '../../app/api/model/accountOperationsRequest';
import {UserProperty} from '../../app/api/model/userProperty';
import {UsersService} from '../../app/api/api/users.service';
import {DictionariesService} from '../../app/api/api/dictionaries.service';
import {SystemService} from '../../app/api/api/system.service';
import {BuildInfo} from '../../app/api/model/buildInfo';
import {SystemMessage} from '../../app/api/model/systemMessage';
import {Address} from '../../app/api/model/address';
import {RatesService} from '../../app/api/api/rates.service';
import {FinancialReportRequest, ReportsService} from '../../app/api';
import {CurrencyRate} from '../../app/api/model/currencyRate';
import {UserAccountOperation} from '../../app/api/model/userAccountOperation';
import {SystemCurrency} from '../../app/api/model/systemCurrency';
import {UserBankAccount} from '../../app/api/model/userBankAccount';
import {TimezoneData} from '../../app/api/model/timezoneData';

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
  private readonly reportService = inject(ReportsService);

  public saveTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketsService.saveUserTicket(userTicket);
  }

  public loadUserTicketList(): Observable<UserTicket[]> {
    return this.ticketsService.loadUserTicketList();
  }

  public loadRealizedTicketList(): Observable<UserTicket[]> {
    return this.ticketsService.loadRealizedTicketList();
  }

  public loadAccountBalanceList(): Observable<AccountBalance[]> {
    return this.accountService.loadAccountBalanceList();
  }

  public createUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.accountService.createUserAccount(userAccount);
  }

  public loadUserOperationList(
    accountOperationsRequest: AccountOperationsRequest,
  ): Observable<UserOperation[]> {
    return this.accountService.loadUserOperationList(accountOperationsRequest);
  }

  public updateUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.accountService.updateUserAccount(userAccount);
  }

  public getUserProperty(): Observable<UserProperty> {
    return this.usersService.getUserProperty();
  }

  public saveUserProperty(
    userProperty: UserProperty,
  ): Observable<UserProperty> {
    return this.usersService.saveUserProperty(userProperty);
  }

  public cancelExchangeTicket(userTicket: UserTicket): Observable<any> {
    return this.ticketsService.cancelExchangeTicket(userTicket);
  }

  public loadTimezoneList(): Observable<TimezoneData[]> {
    return this.dictionariesService.loadTimezoneList();
  }

  public loadUnicodeLocalesList(): Observable<string[]> {
    return this.dictionariesService.loadUnicodeLocalesList();
  }

  public loadCurrencyRates(): Observable<CurrencyRate[]> {
    return this.ratesService.loadCurrencyRates();
  }

  public loadBuildInfo(): Observable<BuildInfo> {
    return this.systemService.loadBuildInfo();
  }

  public loadSystemMessageList(): Observable<SystemMessage[]> {
    return this.systemService.loadSystemMessageList();
  }

  public getUserAddress(): Observable<Address> {
    return this.usersService.getUserAddress();
  }

  public saveUserAddress(address: Address): Observable<Address> {
    return this.usersService.saveUserAddress(address);
  }

  public loadExchangePdfDocument(id: number): Observable<Blob> {
    return this.reportService.loadExchangePdfDocument(id);
  }

  public loadFinancialReportPdfDocument(
    financialReportRequest: FinancialReportRequest,
  ): Observable<Blob> {
    return this.reportService.loadFinancialReportPdfDocument(
      financialReportRequest,
    );
  }

  public saveWithdrawRequest(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.accountService.saveWithdrawRequest(userAccountOperationRequest);
  }

  public loadSystemCurrencyList(): Observable<SystemCurrency[]> {
    return this.systemService.loadSystemCurrencyList();
  }

  public saveBankAccount(
    userBankAccount: UserBankAccount,
  ): Observable<UserBankAccount> {
    return this.accountService.saveBankAccount(userBankAccount);
  }

  loadBankAccountList(currency: string): Observable<UserBankAccount[]> {
    return this.accountService.loadBankAccountList(currency);
  }
}
