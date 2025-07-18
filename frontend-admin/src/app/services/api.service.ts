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

  public loadAccounts(userAccountRequest: UserAccountRequest): Observable<UserAccount[]> {
    return this.adminAccountsService.loadAccounts(userAccountRequest)
  }

  public generateAccountsReport(accountsReportRequest: AccountsReportRequest): Observable<AccountsReportResponse> {
    return this.adminReportsService.generateAccountsReport(accountsReportRequest);
  }

  public loadUsersStatistic(usersStatisticRequest: UsersStatisticRequest): Observable<UsersStatisticResponse> {
    return this.adminStatisticsService.loadUsersStatistic(usersStatisticRequest);
  }

  public selectTransactions(selectTransactionRequest: SelectTransactionRequest): Observable<Transaction[]> {
    return this.adminTransactionsService.selectTransactions(selectTransactionRequest);
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
}
