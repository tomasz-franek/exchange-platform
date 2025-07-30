import {inject, Injectable} from '@angular/core';
import {AdminAccountsService} from '../api/api/adminAccounts.service';
import {UserAccountRequest} from '../api/model/userAccountRequest';
import {Observable} from 'rxjs/internal/Observable';
import {UserAccount} from '../api/model/userAccount';
import {AdminReportsService} from "../api/api/adminReports.service";
import {AccountsReportRequest} from "../api/model/accountsReportRequest";
import {AccountsReportResponse} from "../api/model/accountsReportResponse";
import {AdminStatisticsService} from '../api/api/adminStatistics.service';
import {UsersStatisticResponse} from "../api/model/usersStatisticResponse";
import {UsersStatisticRequest} from '../api/model/usersStatisticRequest';
import {AdminTransactionsService} from '../api/api/adminTransactions.service';
import {SelectTransactionRequest} from '../api/model/selectTransactionRequest';
import {SystemService} from '../api/api/system.service';
import {BuildInfo} from '../api/model/buildInfo';
import {SystemMessage} from "../api/model/systemMessage";
import {Transaction} from "../api/model/transaction";
import {AdminMessagesService} from "../api";
import {UserAccountOperation} from '../api/model/userAccountOperation';
import {AdminUsersService} from '../api/api/adminUsers.service';
import {LoadUserRequest} from '../api/model/loadUserRequest';
import {UserData} from '../api/model/userData';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adminAccountsService: AdminAccountsService = inject(AdminAccountsService);
  private readonly adminReportsService: AdminReportsService = inject(AdminReportsService)
  private readonly adminStatisticsService: AdminStatisticsService = inject(AdminStatisticsService);
  private readonly adminTransactionsService: AdminTransactionsService = inject(AdminTransactionsService);
  private readonly adminSystemService: SystemService = inject(SystemService);
  private readonly adminMessagesService: AdminMessagesService = inject(AdminMessagesService);
  private readonly adminUsersService: AdminUsersService = inject(AdminUsersService);

  public loadAccounts(userAccountRequest: UserAccountRequest): Observable<UserAccount[]> {
    return this.adminAccountsService.loadAccounts(userAccountRequest)
  }

  public generateAccountsReport(accountsReportRequest: AccountsReportRequest): Observable<AccountsReportResponse> {
    return this.adminReportsService.generateAccountsReport(accountsReportRequest);
  }

  public loadUsersStatistic(usersStatisticRequest: UsersStatisticRequest): Observable<UsersStatisticResponse> {
    return this.adminStatisticsService.loadUsersStatistic(usersStatisticRequest);
  }

  public loadTransactionList(selectTransactionRequest: SelectTransactionRequest): Observable<Transaction[]> {
    return this.adminTransactionsService.loadTransactionList(selectTransactionRequest);
  }

  public loadBuildInfo(): Observable<BuildInfo> {
    return this.adminSystemService.loadBuildInfo();
  }

  public saveSystemMessage(systemMessage: SystemMessage): Observable<SystemMessage> {
    return this.adminMessagesService.saveSystemMessage(systemMessage);
  }

  public updateSystemMessage(systemMessage: SystemMessage): Observable<SystemMessage> {
    return this.adminMessagesService.updateSystemMessage(systemMessage);
  }

  public saveAccountDeposit(userAccountOperationRequest: UserAccountOperation): Observable<any> {
    return this.adminAccountsService.saveAccountDeposit(userAccountOperationRequest);
  }

  public saveWithdrawRequest(userAccountOperationRequest: UserAccountOperation): Observable<any> {
    return this.adminAccountsService.saveWithdrawRequest(userAccountOperationRequest);
  }

  public loadUserList(loadUserRequest: LoadUserRequest): Observable<UserData[]> {
    return this.adminUsersService.loadUserList(loadUserRequest);
  }

}
