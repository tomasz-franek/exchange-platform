import {inject, Injectable} from '@angular/core';
import {AdminAccountsService} from '../api/api/adminAccounts.service';
import {UserAccountRequest} from '../api/model/userAccountRequest';
import {Observable} from 'rxjs/internal/Observable';
import {UserAccount} from '../api/model/userAccount';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private adminAccountsService = inject(AdminAccountsService);


  public loadAccounts(userAccountRequest: UserAccountRequest): Observable<UserAccount[]> {
    return this.adminAccountsService.loadAccounts(userAccountRequest)
  }
}
