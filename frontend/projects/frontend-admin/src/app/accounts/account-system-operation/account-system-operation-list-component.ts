import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {CheckedMenu} from 'shared-modules';
import {AccountsStore} from '../accounts.signal-store';
import {AdminAccountOperationsRequest} from '../../api/model/adminAccountOperationsRequest';

@Component({
  selector: 'app-account-system-operation',
  templateUrl: './account-system-operation-list-component.html',
  styleUrl: './account-system-operation-list-component.scss',
  imports: [MenuComponent, TranslatePipe, TableModule, Button],
})
export class AccountSystemOperationListComponent
  extends CheckedMenu
  implements OnInit
{
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store = inject(AccountsStore);

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.routerId != null) {
      const accountOperationsRequest: AdminAccountOperationsRequest = {
        systemAccountId: this.routerId,
        dateFromUtc: '2025-01-01',
        page: { page: 1, rows: 2 },
      };
      this.store.loadAdminAccountOperationList(accountOperationsRequest);
    }
  }

  backToSystemAccountList() {
    this.router.navigate(['accounts/account-system']);
  }

  downloadPdfOperationReport() {
    if (this.routerId != null) {
      this.store.loadOperationPdfDocument({
        systemAccountId: this.routerId,
        dateFromUtc: '2025-01-01',
        page: { page: 0, rows: 100 },
      });
    }
  }
}
