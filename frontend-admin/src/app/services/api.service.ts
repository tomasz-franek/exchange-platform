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
import {Transaction} from '../api/model/models';
import {SystemService} from '../api/api/system.service';
import {BuildInfo} from '../api/model/buildInfo';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adminAccountsService = inject(AdminAccountsService);
  private readonly adminReportsService = inject(AdminReportsService)
  private readonly adminStatisticsService = inject(AdminStatisticsService);
  private readonly adminTransactionsService = inject(AdminTransactionsService);
  private readonly adminSystemService = inject(SystemService)

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
}
