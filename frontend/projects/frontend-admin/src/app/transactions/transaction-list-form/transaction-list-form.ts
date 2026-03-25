import { Component, inject } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TransactionMenu } from '../transaction-menu/transaction-menu';
import { TransactionList } from '../transaction-list/transaction-list';
import { TransactionsStore } from '../transactions.signal-store';
import { SelectUserTransactionRequest } from '../../api/model/selectUserTransactionRequest';
import { UserAccountComponent } from '../../utils/user-account/user-account.component';
import { UserAccount } from '../../api/model/userAccount';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserData } from '../../api/model/userData';
import { Paginator, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-transaction-list-form',
  templateUrl: './transaction-list-form.html',
  styleUrl: './transaction-list-form.scss',
  imports: [
    MenuComponent,
    TransactionMenu,
    TransactionList,
    UserAccountComponent,
    Paginator,
  ],
})
export class TransactionListForm {
  protected readonly store = inject(TransactionsStore);
  protected readonly formBuilder = inject(FormBuilder);
  protected formGroup: FormGroup;
  protected rows: number = 10;
  protected page: number = 0;

  constructor() {
    this.formGroup = this.formBuilder.group({
      userId: [null, Validators.required],
      userAccountId: [null, Validators.required],
    });
  }

  getTransactions() {
    if (
      this.formGroup.get('userId')?.value != null &&
      this.formGroup.get('userAccountId')?.value != null
    ) {
      const selectTransactionRequest = {
        userId: this.formGroup.get('userId')?.value,
        userAccountId: this.formGroup.get('userAccountId')?.value,
        page: { page: 0, rows: 10 },
      } as SelectUserTransactionRequest;
      this.store.loadUserTransactionList(selectTransactionRequest);
    } else {
      this.store.clearUserTransactionList();
    }
  }

  setUser(user: UserData) {
    this.formGroup.patchValue({ userId: user.userId, userAccountId: null });
    this.store.clearUserTransactionList();
  }

  setUserAccount(userAccount: UserAccount) {
    this.formGroup.patchValue({ userAccountId: userAccount.id });
    this.getTransactions();
  }

  onPageChange(event: PaginatorState) {
    const userId = this.formGroup.get('userId')?.value;
    const userAccountId = this.formGroup.get('userAccountId')?.value;
    if (userAccountId != undefined && userId != undefined) {
      const selectTransactionRequest = {
        userId,
        userAccountId,
        page: { rows: event?.rows || 10, page: event?.page || 0 },
      } as SelectUserTransactionRequest;
      this.store.loadUserTransactionList(selectTransactionRequest);
    }
  }
}
