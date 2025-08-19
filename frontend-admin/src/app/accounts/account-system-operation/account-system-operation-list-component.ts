import { Component, inject, OnInit } from '@angular/core';
import { CheckedMenu } from '../../utils/checked-menu/checked-menu';
import { MenuComponent } from '../../menu/menu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectSystemAccountOperationList,
} from '../state/account.selectors';
import { SystemAccountOperation } from '../../api/model/systemAccountOperation';
import {
  loadSystemAccountOperationListAction,
  loadSystemOperationPdfDocumentAction,
} from '../state/account.actions';

@Component({
  selector: 'app-account-system-operation',
  templateUrl: './account-system-operation-list-component.html',
  styleUrl: './account-system-operation-list-component.css',
  imports: [MenuComponent, TranslatePipe],
})
export class AccountSystemOperationListComponent
  extends CheckedMenu
  implements OnInit
{
  protected accountOperations$: SystemAccountOperation[] = [];
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  private _storeAccount$: Store<AccountState> = inject(Store);

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.routerId != null) {
      this._storeAccount$
        .select(selectSystemAccountOperationList)
        .subscribe((accountOperations) => {
          this.accountOperations$ = accountOperations;
        });
      this._storeAccount$.dispatch(
        loadSystemAccountOperationListAction({
          loadAccountOperationsRequest: {
            systemAccountId: this.routerId,
            dateFromUtc: '2025-01-01',
          },
        }),
      );
    }
  }

  backToSystemAccountList() {
    this.router.navigate(['/accounts/account-system']);
  }
  downloadPdfOperationReport() {
    if (this.routerId != null) {
      this._storeAccount$.dispatch(
        loadSystemOperationPdfDocumentAction({
          loadAccountOperationsRequest: {
            systemAccountId: this.routerId,
            dateFromUtc: '2025-01-01',
          },
        }),
      );
    }
  }
}
