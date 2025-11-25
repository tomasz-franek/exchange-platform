import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AccountOperationsRequest} from '../../api/model/accountOperationsRequest';
import {TableModule} from 'primeng/table';
import {AccountsStore} from '../accounts.signal-store';

@Component({
  selector: 'app-user-operation-list',
  imports: [TranslatePipe, TableModule],
  templateUrl: './user-operation-list.component.html',
  styleUrl: './user-operation-list.component.scss',
  standalone: true,
})
export class UserOperationListComponent implements OnInit {
  protected readonly store = inject(AccountsStore);

  ngOnInit(): void {
    let accountOperationsRequest: AccountOperationsRequest = {
      dateFrom: '2025-05-03T16:57:52.584Z',
      page: 0,
      size: 10,
    };
    this.store.loadUserOperationList(accountOperationsRequest);
  }
}
