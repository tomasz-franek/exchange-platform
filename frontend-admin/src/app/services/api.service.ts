import {inject, Injectable} from '@angular/core';
import {AdminAccountsService} from '../api/api/adminAccounts.service';
import {UserAccountRequest} from '../api/model/userAccountRequest';
import {Observable} from 'rxjs/internal/Observable';
import {UserAccount} from '../api/model/userAccount';
import {AdminReportsService} from "../api/api/adminReports.service";
import {AccountsReportRequest} from "../api/model/accountsReportRequest";
import {AccountsReportResponse} from "../api/model/accountsReportResponse";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly adminAccountsService = inject(AdminAccountsService);
  private readonly adminReportsService = inject(AdminReportsService)

  public loadAccounts(userAccountRequest: UserAccountRequest): Observable<UserAccount[]> {
    return this.adminAccountsService.loadAccounts(userAccountRequest)
  }

  public generateAccountsReport(accountsReportRequest: AccountsReportRequest): Observable<AccountsReportResponse> {
    return this.adminReportsService.generateAccountsReport(accountsReportRequest);
  }
}
