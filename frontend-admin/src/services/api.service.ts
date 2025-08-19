import { inject, Injectable } from '@angular/core';
import { AdminAccountsService } from '../app/api/api/adminAccounts.service';
import { UserAccountRequest } from '../app/api/model/userAccountRequest';
import { Observable } from 'rxjs/internal/Observable';
import { UserAccount } from '../app/api/model/userAccount';
import { AdminReportsService } from '../app/api/api/adminReports.service';
import { AccountsReportRequest } from '../app/api/model/accountsReportRequest';
import { AccountsReportResponse } from '../app/api/model/accountsReportResponse';
import { AdminStatisticsService } from '../app/api/api/adminStatistics.service';
import { UsersStatisticResponse } from '../app/api/model/usersStatisticResponse';
import { UsersStatisticRequest } from '../app/api/model/usersStatisticRequest';
import { AdminTransactionsService } from '../app/api/api/adminTransactions.service';
import { SelectTransactionRequest } from '../app/api/model/selectTransactionRequest';
import { SystemService } from '../app/api/api/system.service';
import { BuildInfo } from '../app/api/model/buildInfo';
import { SystemMessage } from '../app/api/model/systemMessage';
import { Transaction } from '../app/api/model/transaction';
import { UserAccountOperation } from '../app/api/model/userAccountOperation';
import { AdminUsersService } from '../app/api/api/adminUsers.service';
import { LoadUserRequest } from '../app/api/model/loadUserRequest';
import { UserData } from '../app/api/model/userData';
import { UserProperty } from '../app/api/model/userProperty';
import { DictionariesService } from '../app/api/api/dictionaries.service';
import { UsersService } from '../app/api/api/users.service';
import { AdminMessagesService } from '../app/api/api/adminMessages.service';
import { environment } from '../environments/environment';
import { Address } from '../app/api/model/address';
import { SystemAccountOperation } from '../app/api/model/systemAccountOperation';
import { SystemAccountOperationsRequest } from '../app/api/model/systemAccountOperationsRequest';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adminAccountsService: AdminAccountsService =
    inject(AdminAccountsService);
  private readonly adminReportsService: AdminReportsService =
    inject(AdminReportsService);
  private readonly adminStatisticsService: AdminStatisticsService = inject(
    AdminStatisticsService,
  );
  private readonly adminTransactionsService: AdminTransactionsService = inject(
    AdminTransactionsService,
  );
  private readonly adminSystemService: SystemService = inject(SystemService);
  private readonly adminMessagesService: AdminMessagesService =
    inject(AdminMessagesService);
  private readonly adminUsersService: AdminUsersService =
    inject(AdminUsersService);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly dictionariesService: DictionariesService =
    inject(DictionariesService);

  constructor() {
    this.adminAccountsService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminReportsService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminStatisticsService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminTransactionsService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminSystemService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminMessagesService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
    this.adminUsersService.configuration.basePath = environment.ADMIN_BASE_PATH;
    this.usersService.configuration.basePath = environment.ADMIN_BASE_PATH;
    this.dictionariesService.configuration.basePath =
      environment.ADMIN_BASE_PATH;
  }

  public loadAccounts(
    userAccountRequest: UserAccountRequest,
  ): Observable<UserAccount[]> {
    return this.adminAccountsService.loadAccounts(userAccountRequest);
  }

  public generateAccountsReport(
    accountsReportRequest: AccountsReportRequest,
  ): Observable<AccountsReportResponse> {
    return this.adminReportsService.generateAccountsReport(
      accountsReportRequest,
    );
  }

  public loadUsersStatistic(
    usersStatisticRequest: UsersStatisticRequest,
  ): Observable<UsersStatisticResponse> {
    return this.adminStatisticsService.loadUsersStatistic(
      usersStatisticRequest,
    );
  }

  public loadTransactionList(
    selectTransactionRequest: SelectTransactionRequest,
  ): Observable<Transaction[]> {
    return this.adminTransactionsService.loadTransactionList(
      selectTransactionRequest,
    );
  }

  public loadBuildInfo(): Observable<BuildInfo> {
    return this.adminSystemService.loadBuildInfo();
  }

  public saveSystemMessage(
    systemMessage: SystemMessage,
  ): Observable<SystemMessage> {
    return this.adminMessagesService.saveSystemMessage(systemMessage);
  }

  public updateSystemMessage(
    systemMessage: SystemMessage,
  ): Observable<SystemMessage> {
    return this.adminMessagesService.updateSystemMessage(systemMessage);
  }

  public loadSystemMessageList(): Observable<SystemMessage[]> {
    return this.adminMessagesService.loadSystemMessageList();
  }

  public saveAccountDeposit(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.adminAccountsService.saveAccountDeposit(
      userAccountOperationRequest,
    );
  }

  public saveWithdrawRequest(
    userAccountOperationRequest: UserAccountOperation,
  ): Observable<any> {
    return this.adminAccountsService.saveWithdrawRequest(
      userAccountOperationRequest,
    );
  }

  public loadUserList(
    loadUserRequest: LoadUserRequest,
  ): Observable<UserData[]> {
    return this.adminUsersService.loadUserList(loadUserRequest);
  }

  public getUserProperty(): Observable<UserProperty> {
    return this.usersService.getUserProperty();
  }

  public saveUserProperty(
    userProperty: UserProperty,
  ): Observable<UserProperty> {
    return this.usersService.saveUserProperty(userProperty);
  }

  public loadTimezoneList(): Observable<string[]> {
    return this.dictionariesService.loadTimezoneList();
  }

  public loadUnicodeLocalesList(): Observable<string[]> {
    return this.dictionariesService.loadUnicodeLocalesList();
  }

  public getUserAddress(): Observable<Address> {
    return this.usersService.getUserAddress();
  }

  public saveUserAddress(address: Address): Observable<Address> {
    return this.usersService.saveUserAddress(address);
  }

  loadSystemAccountList(): Observable<UserAccount[]> {
    return this.adminAccountsService.loadSystemAccountList();
  }
  loadSystemAccountOperationList(
    systemAccountOperationsRequest: SystemAccountOperationsRequest,
  ): Observable<SystemAccountOperation[]> {
    return this.adminAccountsService.loadSystemAccountOperationList(
      systemAccountOperationsRequest,
    );
  }
  public loadSystemOperationPdfDocument(
    loadAccountOperationsRequest: SystemAccountOperationsRequest,
  ): Observable<Blob> {
    return this.adminReportsService.loadSystemOperationPdfDocument(
      loadAccountOperationsRequest,
    );
  }
}
